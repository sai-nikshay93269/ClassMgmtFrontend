import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../store';

const chatSlice = createSlice({
    name: 'chat',
    initialState: { messages: [] },
    reducers: {
        setMessages(state, action) { state.messages = action.payload; }
    }
});

export default chatSlice.reducer;
export function fetchMessages(messages) { return async () => dispatch(chatSlice.actions.setMessages(messages)); }