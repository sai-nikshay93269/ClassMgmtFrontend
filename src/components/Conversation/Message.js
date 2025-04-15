import { Box, Stack, Button } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatHistory } from '../../redux/slices/chatSlice';
import { DocMsg, LinkMsg, MediaMsg, ReplyMsg, TextMsg, TimeLine } from './MsgTypes';
import { useChatHistory } from '../../data';

const Message = ({ menu }) => {
  const dispatch = useDispatch();
  const chatHistory = useChatHistory();

  const selectedClass = useSelector((state) => state.app.selectedClass);
  const selectedGroup = useSelector((state) => state.app.selectedGroup);
  const roomId = selectedGroup
    ? `group-${selectedGroup.id}`
    : selectedClass
      ? `class-${selectedClass.id}`
      : null;

  const offsets = useSelector((state) => state.chat.offsets);
  const offset = roomId ? offsets[roomId] || 0 : 0;

  const hasMore = useSelector((state) =>
    roomId ? state.chat.hasMore[roomId] !== false : true
  );


  const [loadingOlder, setLoadingOlder] = useState(false);

  const handleLoadOlder = async () => {
    if (!roomId || loadingOlder) return;
    setLoadingOlder(true);
    await dispatch(fetchChatHistory({ offset }));
    setLoadingOlder(false);
  };
  

  return (
    <Box p={3}>
      <Stack spacing={3}>
        {roomId && hasMore && (
          <Button
            variant="outlined"
            size="small"
            onClick={handleLoadOlder}
            disabled={loadingOlder}
          >
            {loadingOlder ? 'Loading...' : 'Load Older Messages'}
          </Button>
        )}

        {chatHistory.map((el) => {
          if (el.type === 'divider') {
            return <TimeLine key={el._id || Math.random()} el={el} />;
          }

          if (el.type === 'msg') {
            switch (el.subtype) {
              case 'img':
                return <MediaMsg key={el._id || Math.random()} el={el} menu={menu} />;
              case 'doc':
                return <DocMsg key={el._id || Math.random()} el={el} menu={menu} />;
              case 'link':
                return <LinkMsg key={el._id || Math.random()} el={el} menu={menu} />;
              case 'reply':
                return <ReplyMsg key={el._id || Math.random()} el={el} menu={menu} />;
              default:
                return <TextMsg key={el._id || Math.random()} el={el} menu={menu} />;
            }
          }

          return null;
        })}
      </Stack>
    </Box>
  );
};

export default Message;
