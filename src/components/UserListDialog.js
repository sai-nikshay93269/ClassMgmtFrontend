import React, { useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
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
import { useTheme } from "@mui/material/styles";
import { X } from "phosphor-react";
import { useDispatch, useSelector } from "react-redux";
import { addClassMembers } from "../redux/slices/classSlice";

const UserListDialog = ({ open, handleClose, students = [] }) => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const selectedClass = useSelector(state => state.app.selectedClass);


  useEffect(() => {
    if (!open) {
      setSelectedUsers([]);
      setSelectAll(false);
    }
  }, [open]);

  const handleSelectAllChange = (event) => {
    setSelectAll(event.target.checked);
    if (event.target.checked) {
      setSelectedUsers(students.map((user) => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleUserSelectChange = (event, userId) => {
    if (event.target.checked) {
      setSelectedUsers((prev) => [...prev, userId]);
    } else {
      setSelectedUsers((prev) => prev.filter((id) => id !== userId));
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
                      indeterminate={
                        selectedUsers.length > 0 && selectedUsers.length < students.length
                      }
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
                {students.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onChange={(event) => handleUserSelectChange(event, user.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Avatar
                        alt={`${user.userDetails?.firstName}`}
                        src={user.userDetails?.profilePicture}
                        sx={{ width: 56, height: 56 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="subtitle2">
                        {user.userDetails?.firstName} {user.userDetails?.lastName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {user.userDetails?.phoneNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.userDetails?.phoneNumber}</TableCell>
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
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            if (selectedUsers.length > 0 && selectedClass?.id) {
              dispatch(addClassMembers({ classId: selectedClass.id, studentIds: selectedUsers }));
            }
            handleClose();
          }}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserListDialog;
