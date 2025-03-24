import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from "../store";

const initialState = {
    sidebar: {
        open: false,
        type: 'CONTACT',
    },
    selected: 0, // Added selected state
};

const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        toggleSidebar(state) {
            state.sidebar.open = !state.sidebar.open;
        },
        updateSidebarType(state, action) {
            state.sidebar.type = action.payload;
        },
        setSelected(state, action) {  // Added setSelected reducer
            state.selected = action.payload;
        }
    }
});

// Thunk functions - perform async operations
export function ToggleSidebar() {
    return async () => {
        dispatch(appSlice.actions.toggleSidebar());
    };
}

export function UpdateSidebarType(type) {
    return async () => {
        dispatch(appSlice.actions.updateSidebarType(type)); // Fixed payload structure
    };
}

export function SetSelected(value) {  // Added SetSelected thunk function
    return async () => {
        dispatch(appSlice.actions.setSelected(value));
    };
}

export default appSlice.reducer;
