import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { createGroup } from "../../redux/slices/classSlice";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
  Stack,
} from "@mui/material";
import { RHFTextField } from "../../components/hook-form";
import { Close } from "@mui/icons-material";
import FormProvider from "../../components/hook-form/FormProvider";

const CreateGroupDialog = ({ open, handleClose, classId }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.class);
  const [alert, setAlert] = useState({ open: false, message: "", severity: "" });

  // ✅ Validation Schema
  const groupSchema = Yup.object().shape({
    name: Yup.string().required("Group Name is required"),
  });

  const methods = useForm({
    resolver: yupResolver(groupSchema),
    defaultValues: { name: "" },
  });

  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = methods;

  // ✅ Handle Form Submit
  const onSubmit = async (data) => {
    try {
      await dispatch(createGroup({ name: data.name, classId })).unwrap();
      setAlert({ open: true, message: "Group created successfully!", severity: "success" });
      setTimeout(() => {
        setAlert({ open: false });
        handleClose();
        reset();
      }, 2000);
    } catch (error) {
      setAlert({ open: true, message: error, severity: "error" });
    }
  };

  return (
    <>
      {/* ✅ Snackbar Alert */}
      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert severity={alert.severity} onClose={() => setAlert({ ...alert, open: false })}>
          {alert.message}
        </Alert>
      </Snackbar>

      {/* ✅ Dialog UI */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Create New Group</DialogTitle>
        <IconButton onClick={handleClose} sx={{ position: "absolute", right: 8, top: 8 }}>
          <Close />
        </IconButton>

        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Stack spacing={2}>
              <RHFTextField name="name" label="Group Name" error={!!errors.name} />
            </Stack>
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </DialogActions>
        </FormProvider>
      </Dialog>
    </>
  );
};

export default CreateGroupDialog;
