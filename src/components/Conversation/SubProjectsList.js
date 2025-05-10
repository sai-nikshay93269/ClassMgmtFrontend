import { useState } from 'react';
import {
    Grid, Card, CardContent, Typography, Button, CardActions, Box, Tooltip,
    Dialog, DialogTitle, DialogContent, DialogActions, IconButton, TextField, Stack
} from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";
import { ArrowForward, Edit, Save, Cancel } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { format } from 'date-fns';
import { useSubProjectsList as subProjectsData } from '../../data/index';
import { PencilSimple, FloppyDisk, ArrowCounterClockwise, X, Plus } from "phosphor-react";
import { RHFTextField } from '../hook-form';
import FormProvider from '../hook-form/FormProvider';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import { createSubProject, updateSubProject } from "../../redux/slices/projectSlice";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useSelector } from "react-redux";

const SubProjectsList = ({ project, onViewChange }) => {
    const theme = useTheme();
    const subprojects = subProjectsData();
    const cardMinHeight = "240px";

    const userRole = useSelector((state) => state.auth.user.role);

    const [selectedSubProject, setSelectedSubProject] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedSubProject, setEditedSubProject] = useState(null);

    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [newSubproject, setNewSubproject] = useState({
        title: "",
        description: "",
        dueDate: "",
    });

    const dispatch = useDispatch();
    const [alert, setAlert] = useState({ open: false, message: '', severity: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const SubProjectSchema = Yup.object().shape({
        title: Yup.string().required('Subproject title is required'),
        description: Yup.string().required('Description is required'),
        dueDate: Yup.string().required('Due date is required'),
    });

    const methods = useForm({
        resolver: yupResolver(SubProjectSchema),
        defaultValues: {
            title: '',
            description: '',
            dueDate: '',
        },
    });

    const {
        handleSubmit,
        formState: { errors },
        reset,
    } = methods;

    const onCreateSubproject = async (data) => {
        setIsSubmitting(true);
        const payload = {
            projectId: project.id,
            subProjectData: data,
        };
        dispatch(createSubProject(payload))
            .then(() => {
                setAlert({ open: true, message: 'Subproject created successfully!', severity: 'success' });
                setTimeout(() => {
                    setAlert({ open: false, message: '', severity: '' });
                    setIsCreateDialogOpen(false);
                    setIsSubmitting(false);
                    reset(); // reset form
                }, 2000);
            })
            .catch((error) => {
                console.error("Create Subproject Error:", error);
                setAlert({ open: true, message: error.message || "Failed to create subproject.", severity: 'error' });
                setIsSubmitting(false);
            });
    };

    const methodsEdit = useForm({
        resolver: yupResolver(SubProjectSchema),
        defaultValues: {
            title: '',
            description: '',
            dueDate: '',
        },
    });
    const {
        handleSubmit: handleEditSubmit,
        formState: { errors: editErrors },
        reset: resetEdit,
      } = methodsEdit;
      


    const handleEditClick = () => {
        setIsEditing(true);
        methodsEdit.reset({
            title: selectedSubProject.title,
            description: selectedSubProject.description,
            dueDate: format(new Date(selectedSubProject.dueDate), 'yyyy-MM-dd\'T\'HH:mm'),
        });
    };


    const onUpdateSubProject = async (data) => {
        console.log(data)
        setIsSubmitting(true);
        const payload = {
            ...data,
            id: selectedSubProject.id,
            projectId: project.id,
        };

        dispatch(updateSubProject(payload))
            .then(() => {
                setAlert({ open: true, message: 'Subproject updated successfully!', severity: 'success' });
                setTimeout(() => {
                    setIsEditing(false);
                    setSelectedSubProject(null);
                    setIsSubmitting(false);
                }, 2000);
            })
            .catch((err) => {
                setAlert({ open: true, message: err.message || 'Update failed.', severity: 'error' });
                setIsSubmitting(false);
            });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedSubProject((prev) => ({ ...prev, [name]: value }));
    };

    const handleSaveClick = () => {
        setIsEditing(false);
        setSelectedSubProject(editedSubProject); // Just updating local state for now
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setEditedSubProject(selectedSubProject);
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
                        textTransform: "none",
                        borderRadius: "12px",
                        boxShadow: 3,
                        fontWeight: 600,
                        px: 3,
                        py: 1,
                        ml: 2,
                        backgroundColor: theme.palette.primary.main,
                        "&:hover": {
                            backgroundColor: theme.palette.primary.dark,
                            transform: "scale(1.03)",
                        },
                        transition: "all 0.2s ease-in-out",
                    }}
                >
                    New Subproject
                </Button>
            </Box>}
            {subprojects.length > 0 ? (
                subprojects.map((subproject) => (
                    <Grid item xs={12} sm={6} md={4} key={subproject.id}>
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
                                setSelectedSubProject(subproject);
                                setIsEditing(false);
                            }}
                        >
                            <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                                {/* Title & Arrow Button */}
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                                    <Tooltip title={subproject.title} arrow>
                                        <Typography
                                            variant="h6"
                                            fontWeight="bold"
                                            sx={{
                                                borderBottom: `2px solid ${theme.palette.divider}`,
                                                paddingBottom: "4px",
                                                marginBottom: "8px",
                                                textTransform: "uppercase",
                                                letterSpacing: "0.8px",
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                flexGrow: 1
                                            }}
                                        >
                                            {subproject.title}
                                        </Typography>
                                    </Tooltip>

                                    {/* Arrow Button to View Tasks */}
                                    <IconButton
                                        sx={{ color: theme.palette.primary.main, ml: 1 }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onViewChange("tasks", project, subproject);
                                        }}
                                    >
                                        <ArrowForward />
                                    </IconButton>
                                </Box>

                                {/* Due Date */}
                                <Tooltip title={`Due: ${format(new Date(subproject.dueDate), "PPP")}`} arrow>
                                    <Box
                                        sx={{
                                            backgroundColor: "rgba(0, 0, 0, 0.05)",
                                            padding: "6px 12px",
                                            borderRadius: "8px",
                                            display: "inline-block",
                                            fontWeight: "bold",
                                            fontSize: "0.85rem",
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            marginBottom: "8px"
                                        }}
                                    >
                                        Due: {format(new Date(subproject.dueDate), "PPP")}
                                    </Box>
                                </Tooltip>

                                {/* Description */}
                                <Typography
                                    variant="body2"
                                    color={theme.palette.text.secondary}
                                    sx={{
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        display: "-webkit-box",
                                        WebkitBoxOrient: "vertical",
                                        WebkitLineClamp: 3,
                                        fontSize: "0.95rem",
                                        lineHeight: 1.4
                                    }}
                                >
                                    {subproject.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))
            ) : (
                <Typography sx={{ textAlign: "center", width: "100%", mt: 2, color: theme.palette.text.primary }}>
                    No subprojects found.
                </Typography>
            )}

            {selectedSubProject && (
                <Dialog
                    open={Boolean(selectedSubProject)}
                    onClose={() => {
                        setSelectedSubProject(null);
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
                            {isEditing ? "Edit Subproject" : selectedSubProject.title}
                        </Typography>
                        <IconButton onClick={() => setSelectedSubProject(null)}>
                            <X size={20} />
                        </IconButton>
                    </Box>

                    {isEditing ? (
                        <FormProvider methods={methodsEdit} onSubmit={methodsEdit.handleSubmit(onUpdateSubProject)}>

                            <DialogContent sx={{ px: 1 }}>
                                <Stack spacing={3}>
                                    <RHFTextField name="title" label="Subproject Title" />
                                    <RHFTextField name="description" label="Description" multiline rows={4} />
                                    <RHFTextField
                                        name="dueDate"
                                        label="Due Date & Time"
                                        type="datetime-local"
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Stack>
                            </DialogContent>

                            <DialogActions sx={{ px: 2, pt: 2 }}>
                                <Stack spacing={2} direction="row" alignItems="center" justifyContent="end">
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
                                        {selectedSubProject.description}
                                    </Typography>
                                </Box>

                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
                                        Due Date
                                    </Typography>
                                    <Typography variant="body1" color="text.primary">
                                        {format(new Date(selectedSubProject.dueDate), "PPP")}
                                    </Typography>
                                </Box>
                            </DialogContent>

                            {userRole === 'TEACHER' &&  <DialogActions sx={{ px: 2, pt: 2 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleEditClick}
                                    startIcon={<PencilSimple size={18} />}
                                >
                                    Edit
                                </Button>
                            </DialogActions>}
                        </>
                    )}
                </Dialog>
            )}

            {/* Create Subproject Dialog */}
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
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="h5" fontWeight={600}>
                        Create New Subproject
                    </Typography>
                    <IconButton onClick={() => setIsCreateDialogOpen(false)}>
                        <X size={20} />
                    </IconButton>
                </Box>

                <FormProvider methods={methods} onSubmit={handleSubmit(onCreateSubproject)}>
                    <DialogContent>
                        <Stack spacing={3} sx={{ mt: 2 }}>
                            {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}
                            <RHFTextField name="title" label="Subproject Title" />
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
                            <Button type="submit" variant="contained" disabled={isSubmitting}>
                                Create Subproject
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

        </Grid>
    );
};

export default SubProjectsList;
