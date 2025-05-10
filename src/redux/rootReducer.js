import { combineReducers } from 'redux';
import appReducer from './slices/appSlice';
import authReducer from './slices/authSlice';
import classReducer from './slices/classSlice';
import chatReducer from './slices/chatSlice';
 import projectReducer from './slices/projectSlice';
// 
 import notificationReducer from './slices/notificationSlice';
// import evaluationReducer from './slices/evaluationSlice';

const combinedReducer = combineReducers({
    app: appReducer,
    auth: authReducer,
    class: classReducer,
    chat: chatReducer,
    project: projectReducer,
    notification: notificationReducer
});

const rootReducer = (state, action) => {
    if (action.type === 'RESET_STORE') {
        state = undefined;
    }
    return combinedReducer(state, action);
};

export { rootReducer };

/**
     
    class: classReducer,
    project: projectReducer,
    chat: chatReducer,
    notification: notificationReducer,
    evaluation: evaluationReducer
  
 **/