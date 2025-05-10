import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { dispatch } from '../store';

// ✅ Async thunk to fetch notifications by user ID with Authorization header
export const fetchNotificationsByUserId = createAsyncThunk(
  'notification/fetchNotificationsByUserId',
  async (userId, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState();
      const token = auth.token;

      if (!token) {
        console.error("Authorization token missing");
        return rejectWithValue("Authorization token missing");
      }

      const response = await fetch(`http://localhost:8080/v1/notification/getAllByUserId/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to fetch notifications');
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    notifications: [],
    loading: false,
    error: null,
  },
  reducers: {
    setNotifications(state, action) {
      state.notifications = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotificationsByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotificationsByUserId.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
      })
      .addCase(fetchNotificationsByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default notificationSlice.reducer;

// Optional manual dispatch action
export function fetchNotifications(notifications) {
  return async () => dispatch(notificationSlice.actions.setNotifications(notifications));
}
