import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { dispatch } from '../store';

// ✅ Fetch chat history from backend (group/class based)
export const fetchChatHistory = createAsyncThunk(
    'chat/fetchChatHistory',
    async ({ offset = 0 }, { getState, rejectWithValue }) => {
      try {
        const { auth, app, chat } = getState();
        const token = auth.token;
        const selectedGroup = app.selectedGroup;
        const selectedClass = app.selectedClass;
  
        const roomId = selectedGroup
          ? `group-${selectedGroup.id}`
          : `class-${selectedClass.id}`;
        if (!selectedGroup?.id && !selectedClass?.id) {
          return rejectWithValue("No group or class selected");
        }
  
        const requestBody = {
          classId: selectedGroup ? null : selectedClass?.id || null,
          groupId: selectedGroup?.id || null,
          limit: 20,
          offset,
        };
  
        const response = await fetch(`http://localhost:8080/v1/chat-service/chat/history`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(requestBody),
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          return rejectWithValue(data.error || 'Failed to fetch chat history');
        }
  
        const existingMessages = chat.messages[roomId] || [];
  
        // Remove duplicates
        const uniqueHistory = data.filter(
          (msg) => !existingMessages.find((m) => m.id === msg.id)
        );
  
        return { roomId, newMessages: uniqueHistory };
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
  

// ✅ Send a new message to backend
export const sendMessage = createAsyncThunk(
    'chat/sendMessage',
    async ({ classId, groupId, senderId, message }, { getState, rejectWithValue }) => {
      try {
        const { auth } = getState();
        const token = auth.token;
  
        const payload = {
          classId,
          groupId,
          senderId,
          message,
          type: "msg", // Defaulting to message type
        };
  
        const response = await fetch('http://localhost:8080/v1/chat-service/chat/message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          return rejectWithValue(data.error || 'Failed to send message');
        }
  
        return data; // You can extend this later to return more data if needed
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
  
  export const joinVoiceChannel = createAsyncThunk(
    'chat/joinVoiceChannel',
    async ({ participantName }, { getState, rejectWithValue }) => {
      try {
        const { app, auth } = getState();
        const selectedGroup = app.selectedGroup;
        const selectedClass = app.selectedClass;
        const token = auth.token;
  
        const roomId = selectedGroup
          ? `group-${selectedGroup.id}`
          : `class-${selectedClass.id}`;
  
        if (!roomId) {
          return rejectWithValue("No room available to join.");
        }
  
        const res = await fetch('http://localhost:5000/join-room', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            roomName: roomId,
            participantName
          })
        });
  
        const data = await res.json();
  
        if (!res.ok) {
          return rejectWithValue(data.error || 'Failed to join voice channel');
        }
  
        return {
          token: data.token,
          roomName: data.roomName,
          participantName: data.participantName
        };
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
  
  export const fetchVoiceParticipants = createAsyncThunk(
    'chat/fetchVoiceParticipants',
    async (_, { getState, rejectWithValue }) => {
      try {
        const { app } = getState();
        const selectedGroup = app.selectedGroup;
        const selectedClass = app.selectedClass;
  
        const roomId = selectedGroup
          ? `group-${selectedGroup.id}`
          : `class-${selectedClass.id}`;
  
        if (!roomId) {
          return rejectWithValue("No class or group selected");
        }
  
        const res = await fetch(`http://localhost:5000/room-users/${roomId}`);
        const data = await res.json();
  
        if (!res.ok) {
          return rejectWithValue(data.error || "Failed to fetch participants");
        }
  
        return {
          roomId,
          participants: data.participants || []
        };
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
  

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    messages: {},      // { [roomId]: [msg, msg] }
    offsets: {},       // { [roomId]: offset }
    hasMore: {},       
    voiceParticipants: {}, // { [roomId]: [participant] }
    voice: {
      token: null,
      roomName: null,
      participantName: null,
      connected: false,
      error: null
    },// ✅ NEW: { [roomId]: true/false }
    loading: false,
    error: null
  },
  
  reducers: {
    leaveVoiceChannel(state) {
      const { roomName, participantName } = state.voice;
    
      // Clean up voice state
      state.voice.token = null;
      state.voice.roomName = null;
      state.voice.participantName = null;
      state.voice.connected = false;
    
      // ❌ Remove user from voiceParticipants list
      if (roomName && state.voiceParticipants[roomName]) {
        state.voiceParticipants[roomName] = state.voiceParticipants[roomName].filter(
          (p) => p.identity !== participantName
        );
      }
      
      if (state.voiceParticipants[roomName]?.length === 0) {
        delete state.voiceParticipants[roomName];
      }
      
    }
    ,
    
    clearChatState(state) {
      state.messages = {};
      state.loading = false;
      state.error = null;
    },

    // ✅ Handles real-time WebSocket messages
    receiveMessage(state, action) {
        const { room, ...message } = action.payload;
      
        if (!state.messages[room]) {
          state.messages[room] = [];
        }
      
        const exists = state.messages[room].some(m => m.id === message.id);
        if (!exists) {
          state.messages[room].push(message);
        }
      }
      
  },
  extraReducers: (builder) => {
    builder
      // 🕒 Fetch history
      .addCase(fetchChatHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        const { roomId, newMessages } = action.payload;
        state.loading = false;
      
        if (!state.messages[roomId]) {
          state.messages[roomId] = [];
        }
      
        // Prepend the new messages to keep order (older first)
        state.messages[roomId] = [...newMessages, ...state.messages[roomId]];
        state.offsets[roomId] = (state.offsets[roomId] || 0) + 1;

        if (newMessages.length === 0) {
            state.hasMore[roomId] = false;
          } else {
            state.hasMore[roomId] = true;
          }
      
      })
      .addCase(fetchChatHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✉️ Send message
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        const payload  = action.payload;
        const roomId = payload.groupId
        ? `group-${payload.groupId}`
        : `class-${payload.classId}`;
  
        if (!state.messages[roomId]) {
          state.messages[roomId] = [];
        }
      
        const exists = state.messages[roomId].some(m => m.id === payload.id);
        if (!exists) {
          state.messages[roomId].push(payload);
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(joinVoiceChannel.pending, (state) => {
        state.voice.error = null;
        state.voice.connected = false;
      })
      .addCase(joinVoiceChannel.fulfilled, (state, action) => {
        const { token, roomName, participantName } = action.payload;
      
        state.voice.token = token;
        state.voice.roomName = roomName;
        state.voice.participantName = participantName;
        state.voice.connected = true;
        state.voice.error = null;
      
        // ✅ Add user to voiceParticipants list for the room
        if (!state.voiceParticipants[roomName]) {
          state.voiceParticipants[roomName] = [];
        }
      
        const alreadyInRoom = state.voiceParticipants[roomName].some(
          (p) => p.identity === participantName
        );
      
        if (!alreadyInRoom) {
          state.voiceParticipants[roomName].push({
            identity: participantName
          });
        }
      })
      .addCase(joinVoiceChannel.rejected, (state, action) => {
        state.voice.error = action.payload;
        state.voice.connected = false;
      })
      .addCase(fetchVoiceParticipants.pending, (state) => {
        // Optional: could add loading indicator if needed
      })
      .addCase(fetchVoiceParticipants.fulfilled, (state, action) => {
        const { roomId, participants } = action.payload;
        state.voiceParticipants[roomId] = participants;
      })
      .addCase(fetchVoiceParticipants.rejected, (state, action) => {
        // Optional: handle errors if you want
        console.error("Failed to fetch participants:", action.payload);
      });
      
      ;
  }
});

export const { clearChatState, receiveMessage, leaveVoiceChannel } = chatSlice.actions;

export default chatSlice.reducer;
