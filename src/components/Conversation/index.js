import { Box, Stack, Typography, Button } from "@mui/material";
import React from "react";
import { useTheme } from "@mui/material/styles";
import { useSelector } from "react-redux";
import Header from './Header';
import Footer from './Footer';
import Message from './Message';
import Sidebar from './Sidebar';

const Conversation = () => {
  const theme = useTheme();

  // Get selected class from Redux store
  const selectedClass = useSelector((state) => state.app.selectedClass);

  return (
    <Stack height="100vh" width="auto">

      {/* Show Header only if a class is selected */}
      {selectedClass && <Header />}

      {/* If no class is selected, show a message */}
      {!selectedClass ? (
        <Stack
          height="100vh"
          alignItems="center"
          justifyContent="center"
          spacing={2}
          sx={{
            backgroundColor: theme.palette.mode === 'light' ? '#F8FAFF' : theme.palette.background.default,
            textAlign: "center",
          }}
        >
          <Typography variant="h5" fontWeight="bold" color="text.primary">
            No Class Selected
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Please select a class from the sidebar to start a conversation.
          </Typography>
          <Button variant="contained" color="primary">
            Select a Class
          </Button>
        </Stack>
      ) : (
        /* Main Content: Sidebar + Messages + Footer */
        <Stack direction="row" sx={{ flex: 1, overflow: "hidden" }}>

          {/* Sidebar Component */}
          <Sidebar />

          {/* Messages + Footer in a Column */}
          <Stack flex={1} sx={{ overflow: "hidden", display: "flex" }}>

            {/* Messages Section */}
            <Box className="scrollbar" flex={1} sx={{ overflowY: "auto" }}>
              <Message menu={true} />
            </Box>

            {/* Chat Input (Footer) at Bottom */}
            <Footer />
            
          </Stack>

        </Stack>
      )}
    </Stack>
  );
};

export default Conversation;
