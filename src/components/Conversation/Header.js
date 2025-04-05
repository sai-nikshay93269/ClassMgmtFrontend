import {
    Avatar,
    Box,
    Typography,
    IconButton,
    Button,
    Stack,
    Dialog,
  } from "@mui/material";
  import { FolderOpen } from "phosphor-react";
  import React, { useState } from "react";
  import { useTheme } from "@mui/material/styles";
  import { useSelector, useDispatch } from "react-redux";
  import StyledBadge from "../StyledBadge";
  import { ToggleSidebar } from "../../redux/slices/appSlice";
  import ProjectsDialog from "./ProjectsDialog";
  
  const Header = () => {
    const dispatch = useDispatch();
    const theme = useTheme();
    const [openProjects, setOpenProjects] = useState(false);
  
    const selectedClass = useSelector((state) => state.app.selectedClass);
    const selectedGroup = useSelector((state) => state.app.selectedGroup);
  
    return (
      <Box
        p={2}
        sx={{
          width: "100%",
          backgroundColor:
            theme.palette.mode === "light" ? "#F8FAFF" : theme.palette.background.paper,
          boxShadow: "0px 0px 2px rgba(0,0,0,0.25)",
        }}
      >
        <Stack
          alignItems={"center"}
          direction="row"
          justifyContent={"space-between"}
          sx={{ width: "100%", height: "100%" }}
        >
          {/* Left Section */}
          <Stack
            onClick={() => {
              dispatch(ToggleSidebar());
            }}
            direction={"row"}
            spacing={2}
            sx={{ cursor: "pointer" }}
          >
            <Box>
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
              >
                <Avatar
                  alt={selectedClass?.name}
                  src="/static/images/avatar/1.jpg"
                />
              </StyledBadge>
            </Box>
            <Stack spacing={0.2}>
              <Typography variant="subtitle2">
                {selectedClass?.name || "No Class Selected"}
              </Typography>
              {selectedGroup && (
                <Typography variant="body2" color="text.secondary">
                  Group: {selectedGroup.name}
                </Typography>
              )}
            </Stack>
          </Stack>
  
          {/* Right Section */}
          <Stack direction="row" alignItems="center" spacing={3}>
            <Button
              variant="contained"
              startIcon={<FolderOpen />}
              onClick={() => setOpenProjects(true)}
              sx={{ color: "white", fontWeight: "bold" }}
            >
              Projects
            </Button>
          </Stack>
        </Stack>
  
        {/* Projects Dialog */}
        <ProjectsDialog
          open={openProjects}
          handleClose={() => setOpenProjects(false)}
        />
      </Box>
    );
  };
  
  export default Header;
  