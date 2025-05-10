import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  Slide,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Bell,
  CaretRight,
  Star,
  Trash,
  X,
} from "phosphor-react";
import { useDispatch, useSelector } from "react-redux";
import { ToggleSidebar, UpdateSidebarType } from "../redux/slices/appSlice";
import AntSwitch from "./AntSwitch";
import "../css/global.css";
import UserListDialog from "./UserListDialog";
import { fetchAllStudents } from "../redux/slices/authSlice";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


const BlockDialog = ({ open, handleClose }) => {
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>Block this contact</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          Are you sure you want to block this contact?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleClose}>Yes</Button>
      </DialogActions>
    </Dialog>
  );
};

const DeleteDialog = ({ open, handleClose, contextName }) => {
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>Delete this {contextName}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          Are you sure you want to delete this {contextName} and all its contents?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleClose}>Yes</Button>
      </DialogActions>
    </Dialog>
  );
};

const Contact = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { selectedClass, selectedGroup } = useSelector((state) => state.app);
  const classState = useSelector((state) => state.class); 

  const context = selectedGroup || selectedClass;
  const contextName = selectedGroup ? "group" : "class";

  const [openBlock, setOpenBlock] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [openAddMembers, setOpenAddMembers] = useState(false);

  const userRole = useSelector((state) => state.auth.user.role);

  const handleCloseBlock = () => setOpenBlock(false);
  const handleCloseDelete = () => setOpenDelete(false);
  const handleClickAddMembers = () => {
    setOpenAddMembers(true);
    dispatch(fetchAllStudents()); // ✅ Fetch students when dialog is opened
  };
  const handleCloseAddMembers = () => setOpenAddMembers(false);

  const students = useSelector((state) => state.auth.students);

  const existingStudentIds = new Set( selectedGroup ? classState.groups[selectedClass.id] ?.find((g) => g.id === selectedGroup.id) ?.members?.map((m) => m.studentId) || [] : selectedClass?.members?.map((m) => m.studentId) || [] );
  const availableStudents = students.filter( (student) => !existingStudentIds.has(student.id) );

  return (
    <Box sx={{ width: 320, height: "100vh" }}>
      <Stack sx={{ height: "100%" }}>
        {/* Header */}
        <Box
          sx={{
            boxShadow: "0px 0px 2px rgba(0.25)",
            width: "100%",
            backgroundColor:
              theme.palette.mode === "light"
                ? "#F8FAFF"
                : theme.palette.background,
          }}
        >
          <Stack
            sx={{ height: "100%", p: 2 }}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={3}
          >
            <Typography variant="subtitle2">Contact Info</Typography>
            <IconButton onClick={() => dispatch(ToggleSidebar())}>
              <X />
            </IconButton>
          </Stack>
        </Box>

        {/* Body */}
        <Stack
          className="scrollbar"
          sx={{
            height: "100%",
            position: "relative",
            flexGrow: 1,
            overflowY: "scroll",
          }}
          p={3}
          spacing={3}
        >
          <Stack alignItems="center" direction="row" spacing={2}>
            <Avatar
              src={context?.img || ""}
              alt={context?.name || ""}
              sx={{ height: 64, width: 64 }}
            />
            <Stack spacing={0.5}>
              <Typography variant="article" fontWeight={600}>
                {context?.name || "Unnamed"}
              </Typography>
              {selectedGroup && (
                <Typography variant="article" fontWeight={500}>
                  Group under {selectedClass?.name}
                </Typography>
              )}
            </Stack>
          </Stack>

          <Divider />

          <Stack spacing={0.5}>
            <Typography variant="article">About</Typography>
            <Typography variant="body2">
              {context?.description || "No description"}
            </Typography>
          </Stack>

          <Divider />

          {userRole === 'TEACHER' && <Stack direction="row" spacing={0.5}>
            <Typography
              variant="body2"
              sx={{
                textDecoration: "none",
                color: "primary.main",
                cursor: "pointer",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
              onClick={handleClickAddMembers}
            >
              Add new {contextName} members?
            </Typography>
          </Stack>}

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="subtitle2">Media, Links & Docs</Typography>
            <Button
              onClick={() => dispatch(UpdateSidebarType("SHARED"))}
              endIcon={<CaretRight />}
            >
              View
            </Button>
          </Stack>

          <Stack direction="row" spacing={2} alignItems="center">
            {[1, 2, 3].map((el) => (
              <Box key={el}>
                <img
                  src={`https://source.unsplash.com/random/100x100?sig=${el}`}
                  alt="media"
                  style={{ width: 100, height: 100, borderRadius: 8 }}
                />
              </Box>
            ))}
          </Stack>

          <Divider />

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Star size={21} />
              <Typography variant="subtitle2">Starred Messages</Typography>
            </Stack>
            <IconButton
              onClick={() => dispatch(UpdateSidebarType("STARRED"))}
            >
              <CaretRight />
            </IconButton>
          </Stack>

          <Divider />

          {/* <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Bell size={21} />
              <Typography variant="subtitle2">Mute Notifications</Typography>
            </Stack>
            <AntSwitch />
          </Stack> */}

          {/* <Divider /> */}


{/* 
          <Stack direction="row" alignItems="center" spacing={2}>
            <Button
              onClick={() => setOpenDelete(true)}
              startIcon={<Trash />}
              fullWidth
              variant="outlined"
            >
              Delete {contextName}
            </Button>
          </Stack> */}
        </Stack>
      </Stack>

      {openBlock && <BlockDialog open={openBlock} handleClose={handleCloseBlock} />}
      {openDelete && (
        <DeleteDialog
          open={openDelete}
          handleClose={handleCloseDelete}
          contextName={contextName}
        />
      )}
      {openAddMembers && (
        <UserListDialog
          open={openAddMembers}
          handleClose={handleCloseAddMembers}
          contextType={contextName}
          contextId={context?.id}
          students={availableStudents}
        />
      )}
    </Box>
  );
};

export default Contact;
