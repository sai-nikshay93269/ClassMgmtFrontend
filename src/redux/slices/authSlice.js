import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../store';
import axios from 'axios';
import { persistor } from '../store';

const initialState = {
    user: null,
    isAuthenticated: false,
    students: [],
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
        },
        setUser(state, action) {
            state.user = action.payload;
        },
        setStudentList(state, action) {
            state.students = action.payload;
        },
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
        await persistor.purge();
        dispatch({ type: 'RESET_STORE' })
    };
}

export const fetchAllStudents = () => async (dispatch, getState) => {
    const token = sessionStorage.getItem('token');

    if (!token) return;

    try {
        const response = await axios.get("http://localhost:8080/v1/user/getAllStudents", {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status === 200) {
            dispatch(authSlice.actions.setStudentList(response.data));
        }
    } catch (error) {
        console.error("Error fetching students:", error);
    }
};

