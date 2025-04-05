import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from "../store";

const initialState = {
    sidebar: {
        open: false,
        type: 'CONTACT',
    },
    selected: 0,
    selectedClass: null,
    selectedGroup: null, // ✅ New: track selected group
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
        setSelectedClass(state, action) {
            state.selectedClass = action.payload;
            state.selectedGroup = null; // ✅ Reset group when class changes
        },
        setSelectedGroup(state, action) {
            state.selectedGroup = action.payload;
        },
        clearSelectedGroup(state) {
            state.selectedGroup = null;
        },
        UpdateSelectedClassMembers(state, action) {
            const newMembers = action.payload;
            if (!state.selectedClass) return;
            state.selectedClass = {
                ...state.selectedClass,
                members: [...(state.selectedClass.members || []), ...newMembers],
            };
        }
    }
});

// Thunk functions
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

export function SetSelectedClass(classData) {
    return async () => {
        dispatch(appSlice.actions.setSelectedClass(classData));
        dispatch(appSlice.actions.clearSelectedGroup());
    };
}

export function SetSelectedGroup(groupData) {
    return async () => {
        dispatch(appSlice.actions.setSelectedGroup(groupData));
    };
}

export function ClearSelectedGroup() {
    return async () => {
        dispatch(appSlice.actions.clearSelectedGroup());
    };
}
export function UpdateSelectedClassMembers(membersData) {
    return async () => {
        dispatch(appSlice.actions.UpdateSelectedClassMembers(membersData));
        console.log(membersData);
    };
}




export const {
    setSelectedClass,
    setSelectedGroup,
    clearSelectedGroup,
} = appSlice.actions;

export default appSlice.reducer;
