import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from "../store";

const initialState = {
    sidebar: {
        open: false,
        type: 'CONTACT',
    },
    selected: 0, // Previously existing state for selected index
    selectedClass: null, // New state property for selected class data
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
        setSelected(state, action) {
            state.selected = action.payload;
        },
        setSelectedClass(state, action) { // New reducer to update selected class data
            state.selectedClass = action.payload;
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
        dispatch(appSlice.actions.updateSidebarType(type));
    };
}

export function SetSelected(value) {
    return async () => {
        dispatch(appSlice.actions.setSelected(value));
    };
}

export function SetSelectedClass(classData) { // New thunk function for updating selected class
    return async () => {
        dispatch(appSlice.actions.setSelectedClass(classData));
    };
}
export const { setSelectedClass } = appSlice.actions; 
export default appSlice.reducer;
