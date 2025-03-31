import { Box, IconButton, Stack, Typography, InputBase, Button, Divider, Avatar, Badge, Link } from
  '@mui/material'
import { ArchiveBox, CircleDashed, MagnifyingGlass, Plus } from 'phosphor-react';
import { useDispatch } from '../../redux/store';
import { useTheme } from '@mui/material/styles';
import React, { useState } from 'react'
import { faker } from '@faker-js/faker';
import { useChatList } from "../../data";
import { Search, SearchIconWrapper, StyledInputBase } from '../../components/Search';
import ChatElement from '../../components/ChatElement';
import CreateClassDialog from './CreateClassDialog';
import { SetSelectedClass } from '../../redux/slices/appSlice';

const Chats = () => {
  const dispatch = useDispatch();
  const ChatList = useChatList(); 
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  }
  const handleSelectClass = (classData) => {
    dispatch(SetSelectedClass(classData)); // Dispatch selected class data
};

  return (
    <Box sx={{
      position: "relative", width: 320,
      backgroundColor: theme.palette.mode === 'light' ? "#F8FAFF" : theme.palette.background.paper,
      boxShadow: '0px 0px 2px rgba(0,0,0,0.25)'
    }}>
      <Stack p={3} spacing={2} sx={{ height: "100vh" }}>
        <Stack direction="row" alignItems='center' justifyContent='space-between'>
          <Typography variant='h5'>
            Chats
          </Typography>
        </Stack>

        <Stack sx={{ width: "100%" }}>
          <Search>
            <SearchIconWrapper>
              <MagnifyingGlass color="#709CE6" />
            </SearchIconWrapper>
            <StyledInputBase placeholder='Search...' inputProps={{ "aria-label": "search" }} />
          </Search>
        </Stack>
        <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
          <Typography variant='subtitle2' component={Link}>Create New Class</Typography>
          <IconButton onClick={() => { setOpenDialog(true) }}>
            <Plus style={{ color: theme.palette.primary.main }} />
          </IconButton>
        </Stack>

        <Stack className='scrollbar' spacing={2} direction='column' sx={{ flexGrow: 1, overflow: 'scroll', height: '100%' }}>

          <Stack spacing={2.4}>
            <Typography variant='subtitle2' sx={{ color: "#676767" }}>
              Pinned
            </Typography>
            {ChatList.filter((el) => el.pinned).map((el) => {
              return <ChatElement key={el.id} {...el} onClick={() => handleSelectClass(el)} />
            })}
          </Stack>

          <Stack spacing={2.4}>
            <Typography variant='subtitle2' sx={{ color: "#676767" }}>
              All Classes
            </Typography>
            {ChatList.filter((el) => !el.pinned).map((el) => {
              return <ChatElement key={el.id} {...el} onClick={() => handleSelectClass(el)} />
            })}
          </Stack>

        </Stack>
      </Stack>

      {/* Create Class Dialog */}
      <CreateClassDialog open={openDialog} handleClose={handleCloseDialog} />

    </Box>
  )
}

export default Chats;
