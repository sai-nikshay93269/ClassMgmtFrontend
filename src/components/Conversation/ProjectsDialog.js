import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Typography } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import ProjectsList from './ProjectsList';
import SubProjectsList from './SubProjectsList';
import TasksList from './TasksList';

const ProjectsDialog = ({ open, handleClose }) => {
  const theme = useTheme();
  const [view, setView] = useState("projects"); // "projects" | "subprojects" | "tasks"
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedSubProject, setSelectedSubProject] = useState(null);
  const [previousView, setPreviousView] = useState(null); // Track navigation history
  const [viewAllTasks, setViewAllTasks] = useState(false); // Add this missing state
  

  const handleViewChange = (newView, project = null, subProject = null, viewAllTasks = false) => {
    setPreviousView(view); 
    setSelectedProject(project);
    setSelectedSubProject(subProject);
    setView(newView);
    setViewAllTasks(viewAllTasks); // Store the flag
};


  // Handle back navigation
  const handleBack = () => {
    if (view === "tasks") {
      setView(previousView === "subprojects" ? "subprojects" : "projects");
    } else {
      setView("projects"); // Otherwise, return to projects
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          gap: 1, // Space between arrow and title,
          color: theme.palette.primary.main,
        }}
      >
        {view !== "projects" && (
          <IconButton onClick={handleBack} sx={{ color: theme.palette.text.primary }}>
            <ArrowBack />
          </IconButton>
        )}
        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center" }}>
          {view === "projects" ? "Sample Class - Projects" : selectedProject?.title || ""}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ height: "80vh", overflowY: "auto" }}>
        {view === "projects" && <ProjectsList onViewChange={handleViewChange} />}
        {view === "subprojects" && <SubProjectsList project={selectedProject} onViewChange={handleViewChange} />}
        {view === "tasks" && <TasksList project={selectedProject} subProject={selectedSubProject} viewAllTasks={viewAllTasks} />}

      </DialogContent>
    </Dialog>
  );
};

export default ProjectsDialog;
