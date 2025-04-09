import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import ProjectsList from './ProjectsList';
import SubProjectsList from './SubProjectsList';
import TasksList from './TasksList';
import TaskDetails from './TaskDetails';

const ProjectsDialog = ({ open, handleClose }) => {
  const theme = useTheme();
  const [view, setView] = useState("projects");
  const [viewStack, setViewStack] = useState([]);

  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedSubProject, setSelectedSubProject] = useState(null);
  const [viewAllTasks, setViewAllTasks] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleViewChange = (newView, project = null, subProject = null, viewAll = false, task = null) => {
    setViewStack((prev) => [...prev, view]); // push current view
    setSelectedProject(project);
    setSelectedSubProject(subProject);
    setViewAllTasks(viewAll);
    setSelectedTask(task);
    setView(newView);
  };

  const handleBack = () => {
    setViewStack((prev) => {
      const updatedStack = [...prev];
      const previous = updatedStack.pop();
      setView(previous || "projects");
      return updatedStack;
    });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          width: '90vw',
          height: '90vh',
          maxWidth: 'none',
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 'bold',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          color: theme.palette.primary.main,
        }}
      >
        {view !== "projects" && (
          <IconButton onClick={handleBack} sx={{ color: theme.palette.text.primary }}>
            <ArrowBack />
          </IconButton>
        )}
        <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
          {view === "projects"
            ? "Sample Class - Projects"
            : view === "taskdetails"
            ? selectedTask?.title
            : selectedProject?.title || ""}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ height: 'calc(90vh - 64px)', overflowY: 'auto' }}>
        {view === "projects" && <ProjectsList onViewChange={handleViewChange} />}
        {view === "subprojects" && (
          <SubProjectsList
            project={selectedProject}
            onViewChange={handleViewChange}
          />
        )}
        {view === "tasks" && (
          <TasksList
            project={selectedProject}
            subProject={selectedSubProject}
            viewAllTasks={viewAllTasks}
            onTaskSelect={(task) =>
              handleViewChange("taskdetails", selectedProject, selectedSubProject, viewAllTasks, task)
            }
          />
        )}
        {view === "taskdetails" && selectedTask && (
          <TaskDetails task={selectedTask} onClose={() => setSelectedTask(null)} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ProjectsDialog;
