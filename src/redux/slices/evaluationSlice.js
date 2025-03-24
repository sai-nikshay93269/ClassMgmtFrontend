import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../store';

const evaluationSlice = createSlice({
    name: 'evaluation',
    initialState: { evaluations: [] },
    reducers: {
        setEvaluations(state, action) { state.evaluations = action.payload; }
    }
});

export default evaluationSlice.reducer;
export function fetchEvaluations(evaluations) { return async () => dispatch(evaluationSlice.actions.setEvaluations(evaluations)); }