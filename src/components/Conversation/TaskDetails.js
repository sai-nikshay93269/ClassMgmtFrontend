import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Grid,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { PencilSimple, FloppyDisk, X } from "phosphor-react";

const TaskDetails = ({ task: initialTask }) => {
  const theme = useTheme();

  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState({ ...initialTask });

  const handleInputChange = (e) => {
    setEditedTask((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = () => {
    console.log("Saving task:", editedTask);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedTask({ ...initialTask });
  };

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.background.default,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 3,
        px: 4,
        py: 3,
        maxWidth: "900px",
        mx: "auto",
        mt: 4,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5" fontWeight={600} color="text.primary">
          {isEditing ? (
            <TextField
              fullWidth
              name="title"
              value={editedTask.title}
              onChange={handleInputChange}
              variant="standard"
            />
          ) : (
            editedTask.title
          )}
        </Typography>
        <Box>
          {isEditing ? (
            <>
              <IconButton color="primary" onClick={handleSave}>
                <FloppyDisk size={22} weight="bold" />
              </IconButton>
              <IconButton color="error" onClick={handleCancel}>
                <X size={22} weight="bold" />
              </IconButton>
            </>
          ) : (
            <IconButton color="default" onClick={() => setIsEditing(true)}>
              <PencilSimple size={22} />
            </IconButton>
          )}
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Fields */}
      <Grid container spacing={3}>
        {[
          { label: "Task ID", value: editedTask.id, name: "id", editable: false },
          { label: "Project ID", value: editedTask.projectId, name: "projectId", editable: false },
          { label: "Subproject ID", value: editedTask.subProjectId || "N/A", name: "subProjectId", editable: false },
          { label: "Assigned To", value: editedTask.assignedTo, name: "assignedTo" },
          { label: "Description", value: editedTask.description, name: "description", multiline: true },
          { label: "Status", value: editedTask.status, name: "status" },
          {
            label: "Due Date",
            value: new Date(editedTask.dueDate).toISOString().split("T")[0],
            name: "dueDate",
            type: "date",
          },
        ].map(({ label, value, name, editable = true, multiline, type }, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mb: 0.5 }}
            >
              {label}
            </Typography>
            {isEditing && editable ? (
              <TextField
                fullWidth
                name={name}
                value={value}
                onChange={handleInputChange}
                variant="outlined"
                type={type || "text"}
                multiline={multiline}
                rows={multiline ? 10 : 1}
              />
            ) : (
              <Typography variant="body1" color="text.primary">
                {value}
              </Typography>
            )}
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TaskDetails;
