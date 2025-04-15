import { Box, Fab, IconButton, InputAdornment, Stack, TextField, Tooltip } from '@mui/material';
import React, { useState } from 'react';
import { styled, useTheme } from "@mui/material/styles";
import { LinkSimple, PaperPlaneTilt, Smiley, File, Image } from 'phosphor-react';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { useDispatch, useSelector } from 'react-redux';
import { sendMessage } from "../../redux/slices/chatSlice"

const StyledInput = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-input": {
    paddingTop: '12px',
    paddingBottom: '12px',
  }
}));

const Actions = [
  {
    color: '#4da5fe',
    icon: <Image size={24} />,
    y: 102,
    title: 'Photo/Video'
  },
  {
    color: '#0159b2',
    icon: <File size={24} />,
    y: 172,
    title: 'Document'
  }
];

const ChatInput = ({ openAction, setOpenAction, openPicker, setOpenPicker, inputValue, setInputValue }) => {
  return (
    <StyledInput
      fullWidth
      placeholder='Write a message...'
      variant='filled'
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      InputProps={{
        disableUnderline: true,
        startAdornment:
          <Stack sx={{ width: 'max-content' }}>
            <Stack sx={{ position: 'relative', display: openAction ? 'inline-block' : 'none' }}>
              {Actions.map((el) => (
                <Tooltip placement='right' title={el.title} key={el.title}>
                  <Fab sx={{ position: 'absolute', top: -el.y, backgroundColor: el.color }}>
                    {el.icon}
                  </Fab>
                </Tooltip>
              ))}
            </Stack>
            <InputAdornment>
              <IconButton onClick={() => setOpenAction((prev) => !prev)}>
                <LinkSimple />
              </IconButton>
            </InputAdornment>
          </Stack>,
        endAdornment:
          <InputAdornment>
            <IconButton onClick={() => setOpenPicker((prev) => !prev)}>
              <Smiley />
            </IconButton>
          </InputAdornment>
      }}
    />
  )
};

const Footer = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [openPicker, setOpenPicker] = useState(false);
  const [openAction, setOpenAction] = useState(false);
  const [inputValue, setInputValue] = useState('');

  // Example usage of state from Redux (assumes selectedClass and user info exists in app/auth slices)
  const selectedClass = useSelector(state => state.app.selectedClass);
  const selectedGroup = useSelector(state => state.app.selectedGroup);
  const currentUser = useSelector(state => state.auth.user); // Ensure your auth slice provides user details

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    dispatch(sendMessage({
      classId: selectedGroup ? null : selectedClass?.id || null,
      groupId: selectedGroup?.id || null,
      senderId: currentUser?.id,
      message: inputValue.trim()
    }));

    setInputValue(''); // Clear input after sending
  };

  return (
    <Box p={2} sx={{
      width: '100%',
      backgroundColor: theme.palette.mode === 'light' ? '#F8FAFF' : theme.palette.background.paper,
      boxShadow: '0px 0px 2px rgba(0,0,0,0.25)'
    }}>
      <Stack direction='row' alignItems={'center'} spacing={3}>
        <Stack sx={{ width: '100%' }}>
          {/* Emoji Picker */}
          <Box sx={{ display: openPicker ? 'inline' : 'none', zIndex: 10, position: 'fixed', bottom: 81, right: 100 }}>
            <Picker theme={theme.palette.mode} data={data} onEmojiSelect={e => setInputValue(prev => prev + e.native)} />
          </Box>

          {/* Chat Input */}
          <ChatInput
            openAction={openAction}
            setOpenAction={setOpenAction}
            openPicker={openPicker}
            setOpenPicker={setOpenPicker}
            inputValue={inputValue}
            setInputValue={setInputValue}
          />
        </Stack>

        {/* Send Button */}
        <Box
          onClick={handleSendMessage}
          sx={{
            height: 48,
            width: 48,
            backgroundColor: theme.palette.primary.main,
            borderRadius: 1.5,
            cursor: 'pointer'
          }}
        >
          <Stack sx={{ height: '100%', width: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <IconButton>
              <PaperPlaneTilt color='#fff' />
            </IconButton>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default Footer;
