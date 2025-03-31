import { List, ListItem, ListItemText, Typography } from '@mui/material';
import { TasksList as tasksData } from '../../data/index';

const TasksList = ({ project, subProject, viewAllTasks }) => {
  let tasks;

  if (viewAllTasks) {
    // Fetch all tasks under the project, including those in subprojects
    tasks = tasksData.filter(task => task.projectId === project?.id);
  } else if (subProject) {
    // Fetch only tasks under this subproject
    tasks = tasksData.filter(task => task.subProjectId === subProject.id);
  } else {
    // Fetch only main project tasks (not assigned to any subproject)
    tasks = tasksData.filter(task => task.projectId === project?.id && !task.subProjectId);
  }

  return (
    <List>
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <ListItem key={task.id} sx={{ borderBottom: "1px solid #ddd" }}>
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
  );
};

export default TasksList;
