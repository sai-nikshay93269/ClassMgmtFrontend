import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../store';

const classSlice = createSlice({
    name: 'class',
    initialState: { classes: [] },
    reducers: {
        setClasses(state, action) { state.classes = action.payload; }
    }
});

export default classSlice.reducer;
export function fetchClasses(classes) { return async () => dispatch(classSlice.actions.setClasses(classes)); }