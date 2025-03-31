import { useState } from 'react';
import { 
    Grid, Card, CardContent, Typography, Button, CardActions, Box, Tooltip, 
    Dialog, DialogTitle, DialogContent, DialogActions, IconButton
} from '@mui/material';
import CloseIcon from "@mui/icons-material/Close";
import { format } from 'date-fns';
import { useTheme } from '@mui/material/styles';
import { ProjectsList as projects } from '../../data/index';

const ProjectsList = ({ onViewChange }) => {
    const theme = useTheme();
    const cardMinHeight = "300px"; // Fixed height for consistent card sizes

    const [selectedProject, setSelectedProject] = useState(null); // State for popup

    return (
        <>
            {/* Project Cards */}
            <Grid container spacing={3} alignItems="stretch">
                {projects.length > 0 ? (
                    projects.map((project) => (
                        <Grid item xs={12} sm={6} md={4} key={project.id}>
                            <Card 
                                sx={{ 
                                    borderRadius: "12px", 
                                    boxShadow: 3, 
                                    backgroundColor: theme.palette.primary.main, 
                                    color: "white", 
                                    minHeight: cardMinHeight,
                                    display: "flex", 
                                    flexDirection: "column",
                                    padding: 2,
                                    cursor: "pointer"
                                }}
                                onClick={() => setSelectedProject(project)} // Open popup on click
                            >
                                <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                                    
                                    {/* Title with Tooltip */}
                                    <Tooltip title={project.title} arrow>
                                        <Typography 
                                            variant="h6" 
                                            fontWeight="bold" 
                                            color="white" 
                                            sx={{ 
                                                borderBottom: `2px solid ${theme.palette.primary.light}`, 
                                                paddingBottom: "4px",
                                                marginBottom: "8px",
                                                textTransform: "uppercase",
                                                letterSpacing: "0.8px",
                                                whiteSpace: "nowrap", 
                                                overflow: "hidden",
                                                textOverflow: "ellipsis"
                                            }}
                                        >
                                            {project.title}
                                        </Typography>
                                    </Tooltip>

                                    {/* Description (Truncated to 3 lines) */}
                                    <Typography 
                                        variant="body2" 
                                        sx={{ 
                                            color: theme.palette.grey[200], 
                                            marginBottom: "12px",
                                            fontSize: "0.95rem",
                                            lineHeight: 1.4,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            display: "-webkit-box",
                                            WebkitBoxOrient: "vertical",
                                            WebkitLineClamp: 3 
                                        }}
                                    >
                                        {project.description}
                                    </Typography>

                                    {/* Due Date with Tooltip */}
                                    <Tooltip title={`Due: ${format(new Date(project.dueDate), "PPP")}`} arrow>
                                        <Box 
                                            sx={{ 
                                                backgroundColor: "rgba(255, 255, 255, 0.2)", 
                                                padding: "6px 12px", 
                                                borderRadius: "8px", 
                                                display: "inline-block",
                                                fontWeight: "bold",
                                                fontSize: "0.85rem",
                                                marginTop: "auto",
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis"
                                            }}
                                        >
                                            Due: {format(new Date(project.dueDate), "PPP")}
                                        </Box>
                                    </Tooltip>
                                </CardContent>

                                {/* Buttons */}
                                <CardActions sx={{ justifyContent: "center" }}>
                                    <Button 
                                        size="small" 
                                        variant="contained" 
                                        sx={{ 
                                            backgroundColor: "white", 
                                            color: theme.palette.primary.main, 
                                            fontWeight: "bold", 
                                            "&:hover": { backgroundColor: theme.palette.primary.dark, color: "white" } 
                                        }} 
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent opening popup
                                            onViewChange("subprojects", project);
                                        }}
                                    >
                                        View Subprojects
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        sx={{
                                            backgroundColor: "white",
                                            color: theme.palette.primary.main,
                                            fontWeight: "bold",
                                            "&:hover": { backgroundColor: theme.palette.primary.dark, color: "white" }
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent opening popup
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
                    <Typography sx={{ textAlign: "center", width: "100%", mt: 2, color: theme.palette.text.primary }}>
                        No projects available for this class.
                    </Typography>
                )}
            </Grid>

            
            (
                <Dialog 
            open={Boolean(selectedProject)} 
            onClose={() => setSelectedProject(null)} 
            fullWidth 
            maxWidth="sm"
            sx={{
                "& .MuiDialog-paper": {
                    backgroundColor: "#fff", 
                    color: "#333", 
                    borderRadius: "12px",
                    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
                    maxHeight: "80vh",  // Fixed height for the dialog
                    display: "flex", 
                    flexDirection: "column"
                }
            }}
        >
            {selectedProject && (
                <>
                    {/* Title with Close Button */}
                    <DialogTitle 
                        sx={{ 
                            backgroundColor: "#f4f4f4", 
                            color: "#333", 
                            fontWeight: "600", 
                            padding: "12px 20px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            borderBottom: "1px solid #ddd"
                        }}
                    >
                        {selectedProject.title}
                        <IconButton onClick={() => setSelectedProject(null)} sx={{ color: "#666" }}>
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>

                    {/* Scrollable Content */}
                    <DialogContent 
                        sx={{ 
                            padding: "20px", 
                            flex: 1, 
                            overflowY: "auto", 
                            maxHeight: "60vh"
                        }}
                        className="scrollbar"
                    >
                        {/* Description Label */}
                        <Typography variant="body1" sx={{ fontWeight: "bold", color: "#444", marginBottom: "4px" }}>
                            Description:
                        </Typography>
                        
                        {/* Description Text */}
                        <Typography variant="body2" sx={{ color: "#555", lineHeight: 1.6, marginBottom: "12px" }}>
                            {selectedProject.description}
                        </Typography>

                        {/* Due Date */}
                        <Typography variant="body2" sx={{ color: "#777" }}>
                            📅 Due Date: {format(new Date(selectedProject.dueDate), "PPP")}
                        </Typography>
                    </DialogContent>
                </>
            )}
        </Dialog>
        </>
    );
};

export default ProjectsList;
