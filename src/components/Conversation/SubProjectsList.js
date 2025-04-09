import { useState } from 'react';
import {
    Grid, Card, CardContent, Typography, Button, CardActions, Box, Tooltip,
    Dialog, DialogTitle, DialogContent, DialogActions, IconButton, TextField
} from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";
import { ArrowForward, Edit, Save, Cancel } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { format } from 'date-fns';
import { SubProjectsList as subProjectsData } from '../../data/index';
import { PencilSimple, FloppyDisk, ArrowCounterClockwise, X } from "phosphor-react";

const SubProjectsList = ({ project, onViewChange }) => {
    const theme = useTheme();
    const subprojects = subProjectsData.filter(sp => sp.projectId === project?.id);
    const cardMinHeight = "240px";

    const [selectedSubProject, setSelectedSubProject] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedSubProject, setEditedSubProject] = useState(null);

    const handleEditClick = () => {
        setIsEditing(true);
        setEditedSubProject({ ...selectedSubProject });
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

            <Dialog
                open={Boolean(selectedSubProject)}
                onClose={() => setSelectedSubProject(null)}
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
                {selectedSubProject && (
                    <>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                mb: 2,
                                px: 1,
                            }}
                        >
                            {isEditing ? (
                                <TextField
                                    fullWidth
                                    variant="standard"
                                    name="title"
                                    value={editedSubProject.title}
                                    onChange={handleInputChange}
                                />
                            ) : (
                                <Typography variant="h5" fontWeight={600} color="text.primary">
                                    {selectedSubProject.title}
                                </Typography>
                            )}
                            <IconButton onClick={() => setSelectedSubProject(null)}>
                                <X size={20} />
                            </IconButton>
                        </Box>

                        <DialogContent sx={{ px: 1 }}>
                            {/* Description */}
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
                                    Description
                                </Typography>
                                {isEditing ? (
                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={3}
                                        variant="outlined"
                                        name="description"
                                        value={editedSubProject.description}
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <Typography variant="body1" color="text.primary">
                                        {selectedSubProject.description}
                                    </Typography>
                                )}
                            </Box>

                            {/* Due Date */}
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" mb={0.5}>
                                    Due Date
                                </Typography>
                                {isEditing ? (
                                    <TextField
                                        fullWidth
                                        type="date"
                                        variant="outlined"
                                        name="dueDate"
                                        value={
                                            editedSubProject.dueDate
                                                ? format(new Date(editedSubProject.dueDate), "yyyy-MM-dd")
                                                : ""
                                        }
                                        onChange={handleInputChange}
                                    />
                                ) : (
                                    <Typography variant="body1" color="text.primary">
                                        {format(new Date(selectedSubProject.dueDate), "PPP")}
                                    </Typography>
                                )}
                            </Box>
                        </DialogContent>

                        <DialogActions sx={{ px: 2, pt: 2 }}>
                            {isEditing ? (
                                <>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleSaveClick}
                                        startIcon={<FloppyDisk size={18} />}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={handleCancelClick}
                                        startIcon={<ArrowCounterClockwise size={18} />}
                                    >
                                        Cancel
                                    </Button>
                                </>
                            ) : (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleEditClick}
                                    startIcon={<PencilSimple size={18} />}
                                >
                                    Edit
                                </Button>
                            )}
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Grid>
    );
};

export default SubProjectsList;
