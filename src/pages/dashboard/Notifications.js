import React, { useState, useEffect } from 'react';
import { Box, Stack, Typography, Link, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';

import { Search, SearchIconWrapper, StyledInputBase } from '../../components/Search';
import { MagnifyingGlass } from 'phosphor-react';
import { SimpleBarStyle } from '../../components/Scrollbar';
import NotificationElement from '../../components/NotificationElement';

import { fetchNotificationsByUserId } from '../../redux/slices/notificationSlice';
import { fetchClasses } from '../../redux/slices/classSlice'; // ✅ import fetchClasses
import '../../css/global.css';

const Notifications = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');

  const { notifications, loading } = useSelector((state) => state.notification);
  const { classes } = useSelector((state) => state.class); // ✅ Get class list from Redux

  const user = useSelector((state) => state.auth.user);

  
  useEffect(() => {
    dispatch(fetchNotificationsByUserId(user.id));
    dispatch(fetchClasses()); // ✅ Fetch class details
  }, [dispatch]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredNotifications = notifications
    .filter((n) =>
      n.title?.toLowerCase().includes(searchTerm) ||
      n.message?.toLowerCase().includes(searchTerm)
    )
    .map((n) => {
      const classInfo = classes.find((cls) => cls.id === n.classId);
      return { ...n, classInfo };
    });

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
            <StyledInputBase
              placeholder='Search...'
              inputProps={{ "aria-label": "search" }}
              value={searchTerm}
              onChange={handleSearchChange}
            />
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
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map((el) => (
                  <NotificationElement key={el.id} {...el} />
                ))
              ) : (
                <Typography variant="body2" sx={{ textAlign: "center", mt: 2, color: "gray" }}>
                  No notifications match your search.
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
