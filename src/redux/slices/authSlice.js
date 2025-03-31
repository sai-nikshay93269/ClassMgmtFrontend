import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../store';
import axios from 'axios';

const initialState = {
    user: null,
    isAuthenticated: false,
    token: sessionStorage.getItem('token') || null, // Get token from session
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginSuccess(state, action) {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.token = sessionStorage.getItem('token'); // Retrieve token from session
        },
        logout(state) {
            state.user = null;
            state.isAuthenticated = false;
            state.token = null;
            sessionStorage.removeItem('token'); // Remove token on logout
        }
    }
});

export default authSlice.reducer;

// ✅ Service function to verify token
export const verifyToken = () => async (dispatch, getState) => {
    const token = sessionStorage.getItem('token');
    const { user } = getState().auth;

    if (!token) {
        dispatch(authSlice.actions.logout()); // No token? Logout
        return;
    }

    try {
        const response = await axios.get(`http://localhost:8080/v1/user/getUserById/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status === 200) {
            dispatch(authSlice.actions.setUser(response.data)); // ✅ Store user data
        }
    } catch (error) {
        if (error.response && error.response.status === 401) {
            dispatch(authSlice.actions.logout()); // 🚨 Unauthorized? Logout
        } else {
            console.error("Error fetching user:", error);
        }
    }
};

export function loginUser(user) {
    return async () => {
        dispatch(authSlice.actions.loginSuccess(user));
    };
}

export function logoutUser() {
    return async () => {
        dispatch(authSlice.actions.logout());
    };
}
