import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../store';

const notificationSlice = createSlice({
    name: 'notification',
    initialState: { notifications: [] },
    reducers: {
        setNotifications(state, action) { state.notifications = action.payload; }
    }
});

export default notificationSlice.reducer;
export function fetchNotifications(notifications) { return async () => dispatch(notificationSlice.actions.setNotifications(notifications)); }