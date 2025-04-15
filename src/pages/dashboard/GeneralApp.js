import React, { useEffect } from "react";
import { useDispatch } from '../../redux/store';
import Chats from "./Chats";
import { Box, Stack } from "@mui/material";
import Conversation from "../../components/Conversation";
import { useTheme } from "@mui/material/styles";
import Contact from "../../components/Contact";
import { useSelector } from "react-redux";
import SharedMessages from "../../components/SharedMessages";
import StarredMessages from "../../components/StarredMessages";
import { fetchClasses } from '../../redux/slices/classSlice';
import unifiedSocket from "../../components/Conversation/UnifiedSocket";
import { receiveMessage } from '../../redux/slices/chatSlice';
import { subscribeRooms, unsubscribeAllRooms } from '../../utils/unifiedSocketManager';

const GeneralApp = () => {
  const theme = useTheme();
  const {sidebar} = useSelector((store)=> store.app);// access our store inside component
  const dispatch = useDispatch()

  useEffect(() => {
    const dispatchFetch = async () => {
      const res = await dispatch(fetchClasses());
  
      // Since your thunk returns the array of classes directly
      const classes = res.payload || [];
  
      const roomIds = classes.map((cls) => `class-${cls.id}`);
  
      subscribeRooms(roomIds);
  
      unifiedSocket.onMessage((msg) => {
        dispatch(receiveMessage(msg));
      });
    };
  
    dispatchFetch();
  
    return () => {
      unsubscribeAllRooms();
    };
  }, []);
  
  return (
    <Stack direction='row' sx={{ width: '100%' }}>
      {/* Chats */}
      <Chats />

      <Box sx={{ height: '100%', width: sidebar.open ? 'calc(100vw - 740px)': 'calc(100vw - 420px)',
       backgroundColor: theme.palette.mode === 'light' ? '#F0F4FA' : theme.palette.background.default }}>
      {/* Conversation */}
      <Conversation/>
      </Box>
      {/* Contact */}
      {sidebar.open && (()=>{
        switch (sidebar.type) {
          case 'CONTACT':
            return <Contact/>

          case 'STARRED':
            return <StarredMessages/>

          case 'SHARED':
            return <SharedMessages/>
        
          default:
            break;
        }
      })()  }
     
    </Stack>
  );
};

export default GeneralApp;
