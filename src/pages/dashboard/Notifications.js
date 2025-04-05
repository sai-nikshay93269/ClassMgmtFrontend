import { Box, Stack, Typography, Link, Divider } from '@mui/material';
import React, { useState } from 'react';
import { Search, SearchIconWrapper, StyledInputBase } from '../../components/Search';
import { MagnifyingGlass } from 'phosphor-react';
import { useTheme } from "@mui/material/styles";
import { SimpleBarStyle } from '../../components/Scrollbar';
import '../../css/global.css';
import { NotificationsList } from '../../data';
import NotificationElement from '../../components/NotificationElement';

const Notifications = () => {
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState(false);

  // Call the function to get the generated notifications
  const notificationList = NotificationsList();

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Box 
      sx={{ 
        width: '100vw', 
        minHeight: '90vh', 
        height: '100vh',
        backgroundColor: theme.palette.mode === 'light' ? '#F8FAFF' : theme.palette.background, 
        display: 'flex', 
        justifyContent: 'center',
        alignItems: 'center',
        padding: 3
      }}
    >
      <Stack
        sx={{ 
          width: '85vw', 
          maxWidth: '100%', 
          backgroundColor: theme.palette.background.paper, 
          borderRadius: 2, 
          boxShadow: 3, 
          padding: 3, 
          minHeight: '80vh',
          height: '95vh',
          overflow: 'hidden'
        }}
      >
        <Typography variant='h5' mb={2}>Notifications</Typography>

        {/* Search Bar */}
        <Stack sx={{ width: '100%', mb: 2 }}>
          <Search>
            <SearchIconWrapper>
              <MagnifyingGlass color="#709CE6" />
            </SearchIconWrapper>
            <StyledInputBase placeholder='Search...' inputProps={{ "aria-label": "search" }} />
          </Search>
        </Stack>

        {/* Mark All as Read */}
        <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
          <Typography variant='subtitle2' component={Link} sx={{ cursor: 'pointer' }}>
            Mark all as read
          </Typography>
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* Notifications List */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', maxHeight: '65vh', paddingRight: 1 }}>
          <SimpleBarStyle timeout={500} clickOnTrack={false}>
            <Stack spacing={2.5}>
              {notificationList.length > 0 ? (
                notificationList.map((el) => <NotificationElement key={el.id} {...el} />)
              ) : (
                <Typography variant="body2" sx={{ textAlign: "center", mt: 2, color: "gray" }}>
                  No notifications available.
                </Typography>
              )}
            </Stack>
          </SimpleBarStyle>
        </Box>
      </Stack>
    </Box>
  );
};

export default Notifications;
