import { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Grid,
  Divider,
  Snackbar,
  Alert,
  Button,
  TextField
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { PencilSimple, FloppyDisk, X } from "phosphor-react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "react-redux";
import { RHFTextField } from "../hook-form";
import FormProvider from "../hook-form/FormProvider";
import { updateTask } from "../../redux/slices/projectSlice";
import { fetchTaskFiles, uploadTaskFile, downloadTaskFile } from "../../redux/slices/projectSlice";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { fetchEvaluations, createEvaluation } from "../../redux/slices/projectSlice";
import { fetchAllStudents } from "../../redux/slices/authSlice";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import UserListDialog from "./UserListDialog"; // adjust path accordingly
import { useFormContext } from "react-hook-form";
import { MenuItem } from "@mui/material"; // Ensure this is imported


const TaskDetails = ({ task: initialTask }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [score, setScore] = useState('');
  const [comments, setComments] = useState('');
  const [evalFile, setEvalFile] = useState(null);
  const evaluations = useSelector((state) => state.project.evaluations[initialTask.id] || []);

  const userRole = useSelector((state) => state.auth.user.role);
  const studentsList = useSelector((state) => state.auth.students);
  const usersList = useSelector((state) => state.auth.users);
  const TASK_STATUS_OPTIONS = [
    { value: "OPEN", label: "Open" },
    { value: "PENDING", label: "Pending" },
    { value: "INPROGRESS", label: "In-Progress" },
    { value: "COMPLETED", label: "Completed" }
  ];


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
  


  useEffect(() => {
    dispatch(fetchEvaluations(initialTask.id));
  }, [initialTask.id, dispatch]);
  const user = useSelector((state) => state.auth.user); // adjust if your structure is different
  const evaluatorId = user?.id;
  const handleEvaluationSubmit = async () => {
    const evaluationData = {
      evaluatorId: evaluatorId, // or get from auth
      score: parseInt(score),
      comments,
    };

    try {
      const result = await dispatch(createEvaluation({
        taskId: initialTask.id,
        evaluationData,
      })).unwrap();

      setScore('');
      setComments('');
      setEvalFile(null);
      setSnackbar({ open: true, message: "Evaluation added", severity: "success" });
    } catch (err) {
      setSnackbar({ open: true, message: err.message || "Error", severity: "error" });
    }
  };



  const fileInputRef = useRef(null);
  const taskFiles = useSelector((state) => state.project.taskFiles[initialTask.id] || []);

  useEffect(() => {
    dispatch(fetchTaskFiles(initialTask.id));
  }, [initialTask.id, dispatch]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    dispatch(uploadTaskFile({ taskId: initialTask.id, file }));
  };
  const handleDownload = async (fileId) => {
    try {
      const result = await dispatch(downloadTaskFile(fileId)).unwrap();

      const url = window.URL.createObjectURL(result.blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = result.fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      setSnackbar({ open: true, message: err || "Download failed", severity: "error" });
    }
  };

  const getFileIcon = (filename) => {
    const ext = filename.split(".").pop().toLowerCase();

    switch (ext) {
      case "pdf":
        return "📕";
      case "doc":
      case "docx":
        return "📄";
      case "zip":
      case "rar":
        return "🗜️";
      case "xlsx":
      case "xls":
        return "📊";
      case "ppt":
      case "pptx":
        return "📈";
      default:
        return "📎";
    }
  };


  const [isEditing, setIsEditing] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const TaskSchema = Yup.object().shape({
    title: Yup.string().required("Title is required"),
    description: Yup.string(),
    assignedTo: Yup.string().required("Assigned user is required"),
    status: Yup.string().required("Status is required"),
    dueDate: Yup.string().required("Due date is required"),
  });

  const methods = useForm({
    resolver: yupResolver(TaskSchema),
    defaultValues: {
      ...initialTask,
      dueDate: new Date(initialTask.dueDate).toISOString().slice(0, 16), // YYYY-MM-DDTHH:mm
    },

  });
  const { setValue } = methods;

  const handleAssignUsers = (userIds) => {
    if (userIds.length > 0) {
      setValue("assignedTo", userIds[0]); // assuming single user selection for now
    }
  };
  const {
    handleSubmit,
    reset,
    watch,
    formState: { isDirty },
  } = methods;

  const onSubmit = async (data) => {
    try {
      await dispatch(updateTask({ ...data, id: initialTask.id }));
      setSnackbar({ open: true, message: "Task updated successfully", severity: "success" });
      setIsEditing(false);
    } catch (error) {
      setSnackbar({ open: true, message: "Failed to update task", severity: "error" });
    }
  };

  const handleCancel = () => {
    reset(); // Resets to initial form state
    setIsEditing(false);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 3,
          px: 4,
          py: 4,
          maxWidth: "1000px",
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
              <RHFTextField name="title" fullWidth variant="standard" />
            ) : (
              watch("title")
            )}
          </Typography>
          <Box>
            {isEditing ? (
              <>
                <IconButton color="primary" onClick={handleSubmit(onSubmit)}>
                  <FloppyDisk size={22} weight="bold" />
                </IconButton>
                <IconButton color="error" onClick={handleCancel}>
                  <X size={22} weight="bold" />
                </IconButton>
              </>
            ) : (
              (userRole === 'TEACHER' || user.id == initialTask.assignedTo) && (
                <IconButton color="default" onClick={() => setIsEditing(true)}>
                  <PencilSimple size={22} />
                </IconButton>
              )
            )}
          </Box>
        </Box>


        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
              Task ID
            </Typography>
            <Typography variant="body1" color="text.primary">
              Task - {initialTask.id}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
              Project ID
            </Typography>
            <Typography variant="body1" color="text.primary">
              Project - {initialTask.projectId}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
              Subproject ID
            </Typography>
            <Typography variant="body1" color="text.primary">
              Sub Project - {initialTask.subProjectId || "N/A"}
            </Typography>
          </Grid>

          {/* Assigned To - With Dialog Selection */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
              Assigned To
            </Typography>

            {isEditing ? (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <RHFTextField name="assignedTo" fullWidth disabled />
                {userRole === 'TEACHER' &&
                  <Button variant="outlined" onClick={handleOpenAssignDialog}>
                    Select User
                  </Button>}
              </Box>
            ) : (
              <Box
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 1,
                  p: 1,
                }}
              >
                <Typography variant="body1" color="text.primary">
                  {
                    // Look up user full name using assignedTo ID
                    (() => {
                      const assignedUser = usersList.find(
                        (u) => u.id === watch("assignedTo")
                      );
                      return assignedUser
                        ? assignedUser.username
                        : watch("assignedTo"); // fallback to ID
                    })()
                  }
                </Typography>
              </Box>
            )}
          </Grid>

          {/* Status */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
              Status
            </Typography>
            {isEditing ? (
              <RHFTextField name="status" select fullWidth>
                {TASK_STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </RHFTextField>
            ) : (
              <Box
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 1,
                  p: 1,
                }}
              >
                <Typography variant="body1" color="text.primary">
                  {
                    TASK_STATUS_OPTIONS.find((opt) => opt.value === watch("status"))?.label ||
                    watch("status")
                  }
                </Typography>
              </Box>
            )}
          </Grid>


          {/* Due Date */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
              Due Date
            </Typography>
            {isEditing ? (
              <RHFTextField name="dueDate" type="datetime-local" fullWidth />
            ) : (
              <Box
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 1,
                  p: 1,
                }}
              >
                <Typography variant="body1" color="text.primary">
                  {new Date(watch("dueDate")).toLocaleString()}
                </Typography>
              </Box>
            )}
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
              Description
            </Typography>
            {isEditing ? (
              <RHFTextField name="description" fullWidth multiline rows={7} />
            ) : (
              <Box
                sx={{
                  maxHeight: 170,
                  overflowY: 'auto',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  paddingRight: 1,
                  backgroundColor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 1,
                  p: 1,
                }}
              >
                <Typography variant="body1" color="text.primary" sx={{ lineHeight: 1.5 }}>
                  {watch("description")}
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>

        <Box sx={{ mt: 5 }}>
          <Typography variant="h6" gutterBottom>
            Task Files
          </Typography>

          <Grid container spacing={2}>
            {taskFiles.length > 0 ? (
              taskFiles.map((file) => {
                const isImage = file.fileName?.match(/\.(jpg|jpeg|png|gif)$/i);
                const fileId = file.fileId;
                const fileName = file.fileName || fileId;

                return (
                  <Grid item xs={6} sm={4} md={3} key={fileId}>
                    <Box
                      sx={{
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 2,
                        p: 1,
                        textAlign: "center",
                        backgroundColor: theme.palette.background.paper,
                        transition: "0.3s",
                        "&:hover": {
                          boxShadow: 3,
                          cursor: "pointer",
                        },
                      }}
                      onClick={() => handleDownload(fileId)}
                      title={fileId}
                    >
                      {isImage ? (
                        <img
                          src={`http://localhost:8080/v1/file-storage/download/${fileId}`}
                          alt={fileName}
                          style={{
                            maxWidth: "100%",
                            height: "100px",
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                      ) : (
                        <Box sx={{ fontSize: 40 }}>{getFileIcon(fileName)}</Box>
                      )}
                      <Typography
                        variant="body2"
                        sx={{
                          mt: 1,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {fileName}
                      </Typography>
                    </Box>
                  </Grid>
                );
              })
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                No files uploaded yet.
              </Typography>
            )}
          </Grid>
          {(userRole === 'TEACHER' || user.id == initialTask.assignedTo) &&
            <Button
              variant="outlined"
              color="primary"
              startIcon={<CloudUploadIcon />}
              onClick={() => fileInputRef.current.click()}
              sx={{ mt: 2 }}
            >
              Upload File
            </Button>
          }
          <input
            ref={fileInputRef}
            type="file"
            accept="*"
            hidden
            onChange={handleFileChange}
          />
        </Box>

        {/* EVALUATIONS */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h6" gutterBottom>
            Evaluations
          </Typography>

          {evaluations.length > 0 ? (
            evaluations.map((ev) => (
              <Box
                key={ev.id}
                sx={{
                  mb: 3,
                  p: 2,
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 2,
                  backgroundColor: theme.palette.background.neutral,
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Evaluator:</Typography>
                    <Typography variant="body2" color="text.primary">
                      {ev.evaluatorId}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Score:</Typography>
                    <Typography variant="body2" color="text.primary">
                      {ev.score}/100
                    </Typography>
                  </Grid>

                  <Grid item xs={12}>
                    <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                      Comments:
                    </Typography>
                    <Box
                      sx={{
                        maxHeight: 120,
                        overflowY: 'auto',
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word',
                        padding: 1,
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="body2" color="text.primary">
                        {ev.comments || "None"}
                      </Typography>
                    </Box>
                  </Grid>

                  {ev.fileId && (
                    <Grid item xs={12}>
                      <Button
                        variant="text"
                        onClick={() => handleDownload(ev.fileId)}
                        sx={{ color: theme.palette.primary.main, mt: 1 }}
                      >
                        📎 Download Evaluation File
                      </Button>
                    </Grid>
                  )}
                </Grid>
              </Box>

            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No evaluations yet.
            </Typography>
          )}
        </Box>

        {/* ADD EVALUATION */}
        {userRole === 'TEACHER' && <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle1" gutterBottom>
            Add Evaluation
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Score (0-100)"
                type="number"
                value={score}
                onChange={(e) => setScore(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={9}>
              <TextField
                fullWidth
                label="Comments"
                multiline
                rows={2}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleEvaluationSubmit}
              disabled={!score || isNaN(score)}
            >
              Submit Evaluation
            </Button>
          </Box>
        </Box>}
      </Box>
      <UserListDialog
        open={assignDialogOpen}
        handleClose={() => setAssignDialogOpen(false)}
        students={students}
        onConfirm={handleAssignUsers}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>


    </FormProvider>
  );
};

export default TaskDetails;
