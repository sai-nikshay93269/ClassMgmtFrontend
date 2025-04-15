import { useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Box,
  Stack
} from '@mui/material';
import { X, FloppyDisk, ArrowCounterClockwise, Plus } from "phosphor-react";
import { useTheme } from '@mui/material/styles';
import { useTasksList as tasksData } from '../../data/index';
import { RHFTextField } from '../hook-form';
import FormProvider from '../hook-form/FormProvider';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { createTask } from '../../redux/slices/projectSlice';

const TasksList = ({ project, subProject, viewAllTasks, onTaskSelect }) => {
  const theme = useTheme();

const tasks = tasksData();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const dispatch = useDispatch();
  const [alert, setAlert] = useState({ open: false, message: '', severity: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const taskSchema = Yup.object().shape({
    title: Yup.string().required('Task title is required'),
    description: Yup.string().required('Description is required'),
    assignedTo: Yup.string().required('Assigned user ID is required'),
    dueDate: Yup.string().required('Due date is required'),
  });

  const methods = useForm({
    resolver: yupResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      assignedTo: '',
      dueDate: '',
    },
  });

  const { handleSubmit, reset, formState: { errors } } = methods;

  const onCreateTask = async (data) => {
    setIsSubmitting(true);

    const payload = {
      projectId: project.id,
      subProjectId: subProject?.id || null,
      ...data,
    };

    dispatch(createTask(payload))
      .then(() => {
        setAlert({ open: true, message: 'Task created successfully!', severity: 'success' });
        setTimeout(() => {
          setIsCreateDialogOpen(false);
          setAlert({ open: false, message: '', severity: '' });
          setIsSubmitting(false);
          reset();
        }, 2000);
      })
      .catch((error) => {
        setAlert({ open: true, message: error.message || "Failed to create task.", severity: 'error' });
        setIsSubmitting(false);
      });
  };

  return (
    <>
      {/* New Task Button */}
      <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 4, mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsCreateDialogOpen(true)}
          startIcon={<Plus size={18} weight="bold" />}
          sx={{
            textTransform: "none",
            borderRadius: "12px",
            boxShadow: 3,
            fontWeight: 600,
            px: 3,
            py: 1,
            backgroundColor: theme.palette.primary.main,
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
              transform: "scale(1.03)",
            },
            transition: "all 0.2s ease-in-out",
          }}
        >
          New Task
        </Button>
      </Box>

      {/* Task List */}
      <List>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <ListItem
              key={task.id}
              sx={{ borderBottom: "1px solid #ddd", cursor: "pointer" }}
              onClick={() => onTaskSelect(task)}
            >
              <ListItemText
                primary={task.title}
                secondary={`Status: ${task.status}`}
              />
            </ListItem>
          ))
        ) : (
          <Typography sx={{ textAlign: "center", width: "100%", mt: 2 }}>
            No tasks available.
          </Typography>
        )}
      </List>

      {/* Create Task Dialog */}
      <Dialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 3,
            backgroundColor: theme.palette.background.default,
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
            px: 1,
          }}
        >
          <Typography variant="h5" fontWeight={600} color="text.primary">
            Create New Task
          </Typography>
          <IconButton onClick={() => setIsCreateDialogOpen(false)}>
            <X size={20} />
          </IconButton>
        </Box>

        <FormProvider methods={methods} onSubmit={handleSubmit(onCreateTask)}>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 2 }}>
              {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}
              <RHFTextField name="title" label="Task Title" />
              <RHFTextField name="description" label="Description" multiline rows={4} />
              <RHFTextField name="assignedTo" label="Assigned To (User ID)" />
              <RHFTextField
                name="dueDate"
                label="Due Date & Time"
                type="datetime-local"
                InputLabelProps={{ shrink: true }}
              />
            </Stack>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Stack spacing={2} direction='row' alignItems='center' justifyContent='end'>
              <Button onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
              <Button type="submit" variant="contained" disabled={isSubmitting}>
                Create Task
              </Button>
            </Stack>
          </DialogActions>
        </FormProvider>
      </Dialog>

      <Snackbar
        open={alert.open}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={4000}
        onClose={() => setAlert({ ...alert, open: false })}
      >
        <Alert severity={alert.severity} onClose={() => setAlert({ ...alert, open: false })}>
          {alert.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default TasksList;
