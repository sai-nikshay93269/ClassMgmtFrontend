import {
  Box,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Divider, 
  Button
} from "@mui/material";
import { Add, Mic, Tag, VolumeUp, Person, Logout } from "@mui/icons-material";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchGroups,
} from "../../redux/slices/classSlice";
import {
  fetchChatHistory,
  fetchVoiceParticipants,
  joinVoiceChannel,
  leaveVoiceChannel
} from "../../redux/slices/chatSlice";
import { SetSelectedGroup } from "../../redux/slices/appSlice";
import CreateGroupDialog from "./CreateGroupDialog";
import { LiveKitRoom, RoomAudioRenderer, TrackToggle, useTracks } from "@livekit/components-react";
import { Track } from "livekit-client";
import "@livekit/components-styles"; // LiveKit styling
import React, { useEffect } from "react";


const Sidebar = () => {
  const dispatch = useDispatch();
  const selecedClassId = useSelector((state) => state.app.selectedClass?.id);
  const selectedGroup = useSelector((state) => state.app.selectedGroup);
  const messages = useSelector((store) => store.chat.messages);
  const groups = useSelector((state) => state.class.groups[selecedClassId] || []);
  const voiceParticipants = useSelector((state) => state.chat.voiceParticipants);
  const voice = useSelector((state) => state.chat.voice);

  const user = useSelector((state) => state.auth.user);
  const userRole = useSelector((state) => state.auth.user.role);

  const [open, setOpen] = useState(false);

  const selectedRoomName = selectedGroup
  ? `group-${selectedGroup.id}`
  : `class-${selecedClassId}`;

useEffect(() => {
  if (!selectedRoomName) return;

  let interval = null;

  const startPolling = () => {
    if (!interval) {
      interval = setInterval(() => {
        if (!document.hidden) {
          dispatch(fetchVoiceParticipants());
        }
      }, 5000);
    }
  };

  const stopPolling = () => {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  };

  // Start immediately
  startPolling();

  // Pause/resume polling on tab visibility change
  const handleVisibilityChange = () => {
    if (document.hidden) {
      console.log("🛑 Tab hidden — paused polling");
    } else {
      console.log("▶️ Tab visible — resumed polling");
      dispatch(fetchVoiceParticipants()); // Fetch immediately on return
    }
  };

  document.addEventListener("visibilitychange", handleVisibilityChange);

  return () => {
    stopPolling();
    document.removeEventListener("visibilitychange", handleVisibilityChange);
  };
}, [selectedRoomName, dispatch]);


  const MicDebug = () => {
    const tracks = useTracks([Track.Source.Microphone]);

    return (
      <div style={{ marginTop: 10 }}>
        <Typography variant="caption">
          Mic Status: {tracks.length > 0 ? "🎤 Capturing Audio" : "🚫 No Mic Input"}
        </Typography>
      </div>
    );
  };


  const handleGroupSelect = (group) => {
    const groupRoomId = `group-${group.id}`;
    dispatch(SetSelectedGroup(group));
    dispatch(fetchVoiceParticipants());

    if (messages[groupRoomId] && messages[groupRoomId].length > 0) return;
    dispatch(fetchChatHistory({ roomId: groupRoomId }));
  };

  const handleJoinGeneralVoice = () => {
    const roomName = selectedGroup ? `group-${selectedGroup.id}` : `class-${selecedClassId}`;
    dispatch(
      joinVoiceChannel({
        roomName,
        participantName: user.id, // use user ID
      })
    );
  };

  const generalRoomName = selectedGroup ? `group-${selectedGroup}` : `class-${selecedClassId}`;
  const generalParticipants = voiceParticipants[generalRoomName] || [];

  return (
    <Box
      width="260px"
      bgcolor="#ffffff"
      color="#2e3338"
      p={2}
      sx={{ display: "flex", flexDirection: "column", height: "95vh" }}
    >
      {/* Groups Section */}
      <Box
        sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}
      >
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 1, color: "#747f8d" }}
        >
          <Typography variant="subtitle2" sx={{ fontSize: "12px", fontWeight: 600 }}>
            Groups
          </Typography>
          {userRole === 'TEACHER' && <IconButton
            size="small"
            onClick={() => setOpen(true)}
            sx={{ color: "#747f8d", "&:hover": { color: "#2e3338" } }}
          >
            <Add fontSize="small" />
          </IconButton>}
        </Box>

        <Box sx={{ flex: 1, overflowY: "auto" }} className="scrollbar">
          {groups.length > 0 ? (
            <List dense sx={{ color: "#2e3338" }}>
              {groups.map((group) => (
                <ListItem
                  key={group.id}
                  onClick={() => handleGroupSelect(group)}
                  selected={selectedGroup?.id === group.id}
                  sx={{
                    pl: 1,
                    py: 0.5,
                    cursor: "pointer",
                    borderRadius: "4px",
                    bgcolor: selectedGroup?.id === group.id ? "#e3e6ea" : "transparent",
                    "&:hover": { bgcolor: "#ebedef" },
                  }}
                >
                  <Tag fontSize="small" sx={{ mr: 1, color: "#747f8d" }} />
                  <ListItemText
                    primary={group.name}
                    primaryTypographyProps={{ fontSize: "14px" }}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography
              variant="body2"
              sx={{ color: "#747f8d", textAlign: "center", mt: 2 }}
            >
              No groups available
            </Typography>
          )}
        </Box>
      </Box>

      {/* Voice Channels Section */}
      <Box
  sx={{
    flex: 1,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    bgcolor: "#f9fafb",
    borderRadius: 2,
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
    p: 2,
  }}
>
  <Typography
    variant="subtitle2"
    sx={{
      mb: 1,
      fontSize: "14px",
      fontWeight: 700,
      color: "#4b5563",
      letterSpacing: 0.5,
    }}
  >
    VOICE CHANNELS
  </Typography>

  <Box sx={{ flex: 1, overflowY: "auto" }} className="scrollbar">
    <List dense>
      {/* General Voice Channel */}
      <ListItem
        onClick={handleJoinGeneralVoice}
        sx={{
          pl: 1.5,
          py: 1,
          mb: 1,
          borderRadius: "8px",
          cursor: "pointer",
          bgcolor: "#e5e7eb",
          "&:hover": { bgcolor: "#d1d5db" },
        }}
      >
        <VolumeUp sx={{ mr: 1, color: "#6b7280" }} />
        <ListItemText
          primary="General"
          primaryTypographyProps={{ fontSize: "14px", fontWeight: 600 }}
        />
      </ListItem>

      {/* Participants List */}
      {generalParticipants.length > 0 &&
        generalParticipants.map((p) => (
          <ListItem
            key={p.identity}
            sx={{
              pl: 4,
              py: 0.75,
              borderRadius: "6px",
              "&:hover": { bgcolor: "#f3f4f6" },
            }}
          >
            <Person fontSize="small" sx={{ mr: 1, color: "#6b7280" }} />
            <ListItemText
              primary={p.identity}
              primaryTypographyProps={{
                fontSize: "13px",
                color: "#4b5563",
              }}
            />
          </ListItem>
        ))}

      {/* Divider */}
      <Divider sx={{ my: 2, bgcolor: "#e5e7eb" }} />

      {/* LiveKit Voice UI */}
      {voice.connected && voice.token && (
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            bgcolor: "#ffffff",
            boxShadow: 1,
            border: "1px solid #e5e7eb",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            variant="subtitle2"
            gutterBottom
            sx={{ fontWeight: 600, color: "#374151" }}
          >
            🔊 Connected to Voice
          </Typography>

          <LiveKitRoom token={voice.token} serverUrl="ws://localhost:7880" connect>
            <RoomAudioRenderer />
            <TrackToggle source="microphone" isEnabled />
            <MicDebug />
          </LiveKitRoom>

          <Button
            onClick={() => dispatch(leaveVoiceChannel())}
            variant="contained"
            color="error"
            startIcon={<Logout />}
            sx={{
              marginTop: 2,
              fontSize: "14px",
              fontWeight: 600,
              padding: "6px 16px",
              textTransform: "none",
              borderRadius: "8px",
            }}
          >
            Leave Voice
          </Button>
        </Box>
      )}
    </List>
  </Box>
</Box>


      {/* Create Group Dialog */}
      <CreateGroupDialog
        open={open}
        handleClose={() => setOpen(false)}
        classId={selecedClassId}
      />
    </Box>
  );
};

export default Sidebar;
