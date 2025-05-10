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
    Stack,
    MenuItem,
    Chip,
  } from '@mui/material';
  import { X, Plus } from "phosphor-react";
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
  import UserListDialog from './UserListDialog'; // update path
  import { fetchAllStudents } from "../../redux/slices/authSlice";


  const TASK_STATUS_OPTIONS = [
    { value: "OPEN", label: "Open" },
    { value: "PENDING", label: "Pending" },
    { value: "INPROGRESS", label: "In-Progress" },
    { value: "COMPLETED", label: "Completed" }
  ];

  const TasksList = ({ project, subProject, viewAllTasks, onTaskSelect }) => {
    const theme = useTheme();
    const dispatch = useDispatch();

    const tasks = tasksData();
    const currentUserId = useSelector((state) => state.auth.user.id);
    const usersList = useSelector((state) => state.auth.users);

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [alert, setAlert] = useState({ open: false, message: '', severity: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [assignDialogOpen, setAssignDialogOpen] = useState(false);
const [students, setStudents] = useState([]);
const selectedClassMembers = useSelector((state) => state.app.selectedClass.members);
const allStudents = useSelector((state) => state.auth.students);

const handleOpenAssignDialog = async () => {
  await dispatch(fetchAllStudents());

  const memberIds = selectedClassMembers.map(m => m.studentId);
  const filteredStudents = allStudents.filter(s => memberIds.includes(s.id));

  setStudents(filteredStudents);
  setAssignDialogOpen(true);
};

    const taskSchema = Yup.object().shape({
      title: Yup.string().required('Task title is required'),
      description: Yup.string().required('Description is required'),
      assignedTo: Yup.string().required('Assigned user ID is required'),
      dueDate: Yup.string().required('Due date is required'),
      status: Yup.string().required('Status is required'),
    });

    const methods = useForm({
      resolver: yupResolver(taskSchema),
      defaultValues: {
        title: '',
        description: '',
        assignedTo: '',
        dueDate: '',
        status: 'OPEN',
      },
    });

    const { handleSubmit, reset, formState: { errors } } = methods;
    const { setValue, watch } = methods;

    const handleAssignUsers = (userIds) => {
      if (userIds.length > 0) {
        setValue("assignedTo", userIds[0]); // set first selected user's ID
      }
    };
    

    const onCreateTask = async (data) => {
      setIsSubmitting(true);
      const payload = {
        projectId: project.id,
        subProjectId: subProject?.id || null,
        ...data,
      };

      try {
        await dispatch(createTask(payload)).unwrap();
        setAlert({ open: true, message: 'Task created successfully!', severity: 'success' });
        setTimeout(() => {
          setIsCreateDialogOpen(false);
          setAlert({ open: false, message: '', severity: '' });
          setIsSubmitting(false);
          reset();
        }, 2000);
      } catch (error) {
        setAlert({ open: true, message: error.message || "Failed to create task.", severity: 'error' });
        setIsSubmitting(false);
      }
    };

    const getUserNameById = (id) => {
      return usersList.find((u) => u.id === id)?.username || id;
    };

    return (
      <>
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

        <List>
          {tasks.length > 0 ? (
            tasks.map((task) => (
              <ListItem
                key={task.id}
                sx={{ borderBottom: "1px solid #ddd", cursor: "pointer" }}
                onClick={() => onTaskSelect(task)}
              >
                <ListItemText
                  primary={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="subtitle1">{task.title}</Typography>
                      {task.assignedTo === currentUserId && (
                        <Chip label="Assigned to Me" color="primary" size="small" />
                      )}
                    </Stack>
                  }
                  secondary={
                    <>
                      <Typography variant="body2">Status: {TASK_STATUS_OPTIONS.find(s => s.value === task.status)?.label}</Typography>
                      <Typography variant="body2">Assigned To: {getUserNameById(task.assignedTo)}</Typography>
                    </>
                  }
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
        <Dialog open={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)} fullWidth maxWidth="sm">
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", p: 2 }}>
            <Typography variant="h6">Create New Task</Typography>
            <IconButton onClick={() => setIsCreateDialogOpen(false)}><X /></IconButton>
          </Box>

          <FormProvider methods={methods} onSubmit={handleSubmit(onCreateTask)}>
            <DialogContent>
              <Stack spacing={3}>
                <RHFTextField name="title" label="Task Title" />
                <RHFTextField name="description" label="Description" multiline rows={4} />
                <Box sx={{ display: 'flex', gap: 2 }}>
  <RHFTextField name="assignedTo" label="Assigned To" fullWidth disabled />
  <Button variant="outlined" onClick={handleOpenAssignDialog}>Select</Button>
</Box>

                <RHFTextField name="dueDate" label="Due Date & Time" type="datetime-local" InputLabelProps={{ shrink: true }} />
                <RHFTextField name="status" label="Status" select fullWidth>
                  {TASK_STATUS_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                  ))}
                </RHFTextField>
              </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
              <Button type="submit" variant="contained" disabled={isSubmitting}>Create Task</Button>
            </DialogActions>
          </FormProvider>
        </Dialog>

        <Snackbar open={alert.open} autoHideDuration={4000} onClose={() => setAlert({ ...alert, open: false })}>
          <Alert severity={alert.severity} onClose={() => setAlert({ ...alert, open: false })}>
            {alert.message}
          </Alert>
        </Snackbar>
        <UserListDialog
  open={assignDialogOpen}
  handleClose={() => setAssignDialogOpen(false)}
  students={students}
  onConfirm={handleAssignUsers}
/>

      </>
    );
  };

  export default TasksList;