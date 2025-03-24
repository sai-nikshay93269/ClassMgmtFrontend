import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../store';

const initialState = {
    user: null,
    isAuthenticated: false,
    token: null,
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
