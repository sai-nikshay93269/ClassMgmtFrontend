import { useState } from 'react';
import {
  Grid, Card, CardContent, Typography, Button, CardActions, Box, Tooltip,
  Dialog, DialogTitle, DialogContent, IconButton, TextField, DialogActions, Alert, Snackbar, Stack
} from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";
import { Edit, Save, Cancel } from '@mui/icons-material';
import { format } from 'date-fns';
import { useTheme } from '@mui/material/styles';
import { useProjectsList } from '../../data/index';
import { X, PencilSimple, FloppyDisk, ArrowCounterClockwise, Plus } from "phosphor-react";
import { useDispatch, useSelector } from 'react-redux';
import { createProject } from "../../redux/slices/projectSlice";
import { RHFTextField } from '../hook-form';
import FormProvider from '../hook-form/FormProvider';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { updateProject } from "../../redux/slices/projectSlice";


const ProjectsList = ({ onViewChange }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const cardMinHeight = "300px";

  const projects = useProjectsList();

  const selectedClass = useSelector(state => state.app.selectedClass);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState(null);

  const { isLoading } = useSelector((state) => state.project); // Update with your slice

  const [alert, setAlert] = useState({ open: false, message: '', severity: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false); // ✅ Add this line
  
  const userRole = useSelector((state) => state.auth.user.role);

  // 🧪 Yup validation schema
  const projectSchema = Yup.object().shape({
    title: Yup.string().required('Project title is required'),
    description: Yup.string().required('Description is required'),
    dueDate: Yup.string().required('Due date is required'),
  });

  const methods = useForm({
    resolver: yupResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      dueDate: '',
    },
  });

  const { handleSubmit, formState: { errors } } = methods;

  const onCreateProject = async (data) => {

    setIsSubmitting(true);
    const payload = {
      classId: selectedClass.id,
      ...data,  // Include other project data
    };
    dispatch(createProject(payload))
      .then(() => {
        setAlert({ open: true, message: 'Project created successfully!', severity: 'success' });
        setTimeout(() => {
          setAlert({ open: false, message: '', severity: '' });
          setIsCreateDialogOpen(false);
          setIsSubmitting(false);
        }, 2000);
      })
      .catch((error) => {
        console.error("Create Project Error:", error);
        setAlert({ open: true, message: error.message || "Failed to create project.", severity: 'error' });
        setIsSubmitting(false);
      });
  };
  // Enable edit mode and copy project details


// Inside ProjectsList component

const methodsEdit = useForm({
  resolver: yupResolver(projectSchema),
  defaultValues: {
    title: '',
    description: '',
    dueDate: '',
  },
});
const {
  reset
} = methodsEdit;

const onUpdateProject = async (data) => {
  const payload = {
    ...data,
    id: selectedProject.id,
    classId: selectedClass.id, // 👈 very important for backend
  };

  setIsSubmitting(true);
  dispatch(updateProject(payload))
    .then(() => {
      setAlert({ open: true, message: 'Project updated successfully!', severity: 'success' });
      setTimeout(() => {
        setSelectedProject(null);
        setIsEditing(false);
        setIsSubmitting(false);
      }, 2000);
    })
    .catch((err) => {
      setAlert({ open: true, message: err.message || 'Failed to update project.', severity: 'error' });
      setIsSubmitting(false);
    });
};


const handleEdit = () => {
  setIsEditing(true);
  reset({
    title: selectedProject.title,
    description: selectedProject.description,
    dueDate: format(new Date(selectedProject.dueDate), 'yyyy-MM-dd\'T\'HH:mm'),
  });
};


  // Handle input change in form fields
  const handleInputChange = (e) => {
    setEditedProject({ ...editedProject, [e.target.name]: e.target.value });
  };

  // Save changes (for now, just disables editing)
  const handleSave = () => {
    setIsEditing(false);
    setSelectedProject(editedProject); // Update selected project with new details
  };

  // Cancel edit (revert changes)
  const handleCancel = () => {
    setIsEditing(false);
    setEditedProject(null);
  };

  return (

    <Grid container spacing={3} alignItems="stretch">
      {userRole === 'TEACHER' && <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 4, mb: 2, width: "100%" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsCreateDialogOpen(true)}
          startIcon={<Plus size={18} weight="bold" />}
          sx={{
            ml: 2,
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
          New Project
        </Button>
      </Box>}

      <Grid container spacing={3}>
        {projects.length > 0 ? (
          projects.map((project) => (
            <Grid item xs={12} sm={6} md={4} key={project.id}>
              <Card
                sx={{
                  borderRadius: "12px",
                  boxShadow: 3,
                  backgroundColor: theme.palette.grey[100],
                  color: theme.palette.text.primary,
                  minHeight: cardMinHeight,
                  display: "flex",
                  flexDirection: "column",
                  padding: 2,
                  cursor: "pointer",
                  transition: "transform 0.3s ease-in-out",
                  "&:hover": { transform: "scale(1.05)" },
                }}
                onClick={() => {
                  setSelectedProject(project);
                  setIsEditing(false);
                }}
              >
                <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                  <Tooltip title={project.title} arrow>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      color="text.primary"
                      sx={{
                        borderBottom: `2px solid ${theme.palette.divider}`,
                        paddingBottom: "4px",
                        marginBottom: "8px",
                        textTransform: "uppercase",
                        letterSpacing: "0.8px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {project.title}
                    </Typography>
                  </Tooltip>
                  <Typography
                    variant="body2"
                    sx={{
                      color: theme.palette.text.secondary,
                      marginBottom: "12px",
                      fontSize: "0.95rem",
                      lineHeight: 1.4,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 3,
                    }}
                  >
                    {project.description}
                  </Typography>
                  <Tooltip title={`Due: ${format(new Date(project.dueDate), "PPP")}`} arrow>
                    <Box
                      sx={{
                        backgroundColor: "rgba(0, 0, 0, 0.05)",
                        padding: "6px 12px",
                        borderRadius: "8px",
                        display: "inline-block",
                        fontWeight: "bold",
                        fontSize: "0.85rem",
                        marginTop: "auto",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      Due: {format(new Date(project.dueDate), "PPP")}
                    </Box>
                  </Tooltip>
                </CardContent>
                <CardActions sx={{ justifyContent: "center" }}>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewChange("subprojects", project);
                    }}
                  >
                    View Subprojects
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewChange("tasks", project, null, true);
                    }}
                  >
                    View Tasks
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography sx={{ textAlign: "center", width: "100%", mt: 2 }}>
            No projects available.
          </Typography>
        )}
      </Grid>

      {selectedProject && (
  <Dialog
    open={Boolean(selectedProject)}
    onClose={() => {
      setSelectedProject(null);
      setIsEditing(false);
    }}
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
        {isEditing ? "Edit Project" : selectedProject.title}
      </Typography>
      <IconButton
        onClick={() => {
          setSelectedProject(null);
          setIsEditing(false);
        }}
      >
        <X size={20} />
      </IconButton>
    </Box>

    {isEditing ? (
      <FormProvider methods={methodsEdit} onSubmit={methodsEdit.handleSubmit(onUpdateProject)}>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}
            <RHFTextField name="title" label="Project Title" />
            <RHFTextField name="description" label="Description" multiline rows={4} />
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
            <Button onClick={() => setIsEditing(false)} startIcon={<ArrowCounterClockwise size={18} />}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={isSubmitting} startIcon={<FloppyDisk size={18} />}>
              Save Changes
            </Button>
          </Stack>
        </DialogActions>
      </FormProvider>
    ) : (
      <>
        <DialogContent sx={{ px: 1 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
              Description
            </Typography>
            <Typography variant="body1" color="text.primary">
              {selectedProject.description}
            </Typography>
          </Box>

          <Box>
            <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
              Due Date
            </Typography>
            <Typography variant="body1" color="text.primary">
              {format(new Date(selectedProject.dueDate), "PPP")}
            </Typography>
          </Box>
        </DialogContent>

        {userRole === 'TEACHER' && <DialogActions sx={{ px: 2, pt: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleEdit}
            startIcon={<PencilSimple size={18} />}
          >
            Edit
          </Button>
        </DialogActions>}
      </>
    )}
  </Dialog>
)}

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
            Create New Project
          </Typography>
          <IconButton onClick={() => setIsCreateDialogOpen(false)}>
            <X size={20} />
          </IconButton>
        </Box>

        <FormProvider methods={methods} onSubmit={handleSubmit(onCreateProject)}>
          <DialogContent>
            <Stack spacing={3} sx={{ mt: 2 }}>
              {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}
              <RHFTextField name="title" label="Project Title" />
              <RHFTextField name="description" label="Description" multiline rows={4} />
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
              <Button type="submit" variant="contained" disabled={isSubmitting || isLoading}>
                Create Project
              </Button>
            </Stack>
          </DialogActions>
        </FormProvider>
      </Dialog>


    </Grid>
  );
};

export default ProjectsList;
