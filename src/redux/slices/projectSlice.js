import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../store';

const projectSlice = createSlice({
    name: 'project',
    initialState: { projects: [] },
    reducers: {
        setProjects(state, action) { state.projects = action.payload; }
    }
});

export default projectSlice.reducer;
export function fetchProjects(projects) { return async () => dispatch(projectSlice.actions.setProjects(projects)); }