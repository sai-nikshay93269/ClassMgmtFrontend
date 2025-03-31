import { combineReducers } from 'redux';
import appReducer from './slices/appSlice';
import authReducer from './slices/authSlice';
import classReducer from './slices/classSlice';
// import projectReducer from './slices/projectSlice';
// import chatReducer from './slices/chatSlice';
// import notificationReducer from './slices/notificationSlice';
// import evaluationReducer from './slices/evaluationSlice';

const rootReducer = combineReducers({
    app: appReducer,
    auth: authReducer,
    class: classReducer
});

export {rootReducer};

/**
     
    class: classReducer,
    project: projectReducer,
    chat: chatReducer,
    notification: notificationReducer,
    evaluation: evaluationReducer
  
 **/