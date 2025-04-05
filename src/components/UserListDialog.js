import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import AntSwitch from "./AntSwitch";
import { faker } from "@faker-js/faker";
import { useDispatch } from "react-redux";
import { ToggleSidebar, UpdateSidebarType } from "../redux/slices/appSlice";
import { useTheme } from "@mui/material/styles";
import { Bell, CaretRight, Phone, Prohibit, Star, Trash, VideoCamera, X } from "phosphor-react";

const UserListDialog = ({ open, handleClose }) => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const users = [
    {
      id: "1",
      username: "user1",
      email: "user1@example.com",
      userDetails: {
        firstName: "Jane",
        lastName: "Doe",
        phoneNumber: "555-555-5556",
        profilePicture: faker.image.avatar(),
      },
    },
    {
      id: "2",
      username: "user2",
      email: "user2@example.com",
      userDetails: {
        firstName: "Jane",
        lastName: "Doe",
        phoneNumber: "555-555-5556",
        profilePicture: faker.image.avatar(),
      },
    },
    {
      id: "3",
      username: "user3",
      email: "user3@example.com",
      userDetails: {
        firstName: "Bob",
        lastName: "Smith",
        phoneNumber: "555-555-5557",
        profilePicture: faker.image.avatar(),
      },
    },
  ];

  const handleSelectAllChange = (event) => {
    setSelectAll(event.target.checked);
    if (event.target.checked) {
      setSelectedUsers(users.map((user) => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleUserSelectChange = (event, userId) => {
    if (event.target.checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
      
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="lg"
      PaperProps={{ sx: { p: 2 } }}
    >
      <DialogTitle>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Students</Typography>
          <IconButton onClick={handleClose}>
            <X size={24} weight="bold" />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <Divider />
        <Box sx={{ mt: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectAll}
                      indeterminate={selectedUsers.length > 0 && selectedUsers.length < users.length}
                      onChange={handleSelectAllChange}
                    />
                  </TableCell>
                  <TableCell>Profile Picture</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone Number</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onChange={(event) => handleUserSelectChange(event, user.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Avatar
                        alt={user.userDetails.firstName}
                        src={user.userDetails.profilePicture}
                        sx={{ width: 56, height: 56 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">
                        {user.userDetails.firstName} {user.userDetails.lastName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user.userDetails.phoneNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">{user.username}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.userDetails.phoneNumber}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="primary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleClose}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserListDialog;