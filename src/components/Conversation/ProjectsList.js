import { useState } from 'react';
import {
  Grid, Card, CardContent, Typography, Button, CardActions, Box, Tooltip,
  Dialog, DialogTitle, DialogContent, IconButton, TextField, DialogActions
} from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";
import {  Edit, Save, Cancel } from '@mui/icons-material';
import { format } from 'date-fns';
import { useTheme } from '@mui/material/styles';
import { ProjectsList as projects } from '../../data/index';

const ProjectsList = ({ onViewChange }) => {
  const theme = useTheme();
  const cardMinHeight = "300px";

  const [selectedProject, setSelectedProject] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProject, setEditedProject] = useState(null);

  // Enable edit mode and copy project details
  const handleEdit = () => {
    setEditedProject({ ...selectedProject });
    setIsEditing(true);
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

      {/* Dialog */}
      <Dialog
        open={Boolean(selectedProject)}
        onClose={() => setSelectedProject(null)}
        fullWidth
        maxWidth="sm"
      >
        {selectedProject && (
          <>
            <DialogTitle
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {isEditing ? (
                <TextField
                  fullWidth
                  variant="outlined"
                  name="title"
                  value={editedProject?.title || ""}
                  onChange={handleInputChange}
                />
              ) : (
                selectedProject.title
              )}
              <IconButton onClick={() => setSelectedProject(null)}>
                <CloseIcon />
              </IconButton>
            </DialogTitle>

            <DialogContent sx={{ padding: "20px" }}>
              <Typography variant="body1" fontWeight="bold" mb={1}>
                Description:
              </Typography>
              {isEditing ? (
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  name="description"
                  value={editedProject?.description || ""}
                  onChange={handleInputChange}
                />
              ) : (
                <Typography variant="body2">
                  {selectedProject.description}
                </Typography>
              )}

              <Typography variant="body2" mt={2}>
                📅 Due Date:
              </Typography>
              {isEditing ? (
                <TextField
                fullWidth
                type="date"
                variant="outlined"
                name="dueDate"
                value={editedProject?.dueDate ? format(new Date(editedProject.dueDate), "yyyy-MM-dd") : ""}
                onChange={handleInputChange}
              />
              
              ) : (
                <Typography variant="body2">
                  {format(new Date(selectedProject.dueDate), "PPP")}
                </Typography>
              )}
            </DialogContent>

            {/* Edit/Save Buttons */}
            {/* <Box sx={{ display: "flex", justifyContent: "space-between", p: 2 }}>
              {isEditing ? (
                <>
                  <Button variant="contained" color="primary" onClick={handleSave}>
                    Save
                  </Button>
                  <Button variant="outlined" onClick={handleCancel}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button variant="contained" onClick={handleEdit}>
                  Edit
                </Button>
              )}
            </Box> */}
            <DialogActions>
            {isEditing ? (
                <>
                    <Button variant="contained" color="primary" onClick={handleSave} startIcon={<Save />}>
                        Save
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={handleCancel} startIcon={<Cancel />}>
                        Cancel
                    </Button>
                </>
            ) : (
                <Button variant="contained" color="primary" onClick={handleEdit} startIcon={<Edit />}>
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

export default ProjectsList;
