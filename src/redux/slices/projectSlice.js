import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { dispatch } from '../store';

// ✅ Fetch projects by selected class
export const fetchProjectsByClass = createAsyncThunk(
    'project/fetchProjectsByClass',
    async (_, { getState, rejectWithValue }) => {
      try {
        const { auth, app } = getState();
        const token = auth.token;
        const selectedClass = app.selectedClass;
  
        if (!token) return rejectWithValue('Authorization token missing');
        if (!selectedClass?.id) return rejectWithValue('No class selected');
  
        const response = await fetch(
          `http://localhost:8080/v1/project-service/projects/class/${selectedClass.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        const data = await response.json();
        if (!response.ok) {
          return rejectWithValue(data.error || 'Failed to fetch projects by class');
        }
  
        return data;
      } catch (err) {
        return rejectWithValue(err.message);
      }
    }
  );
  
// ✅ Fetch all projects
export const fetchProjects = createAsyncThunk(
    'project/fetchProjects',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const token = auth.token;

            if (!token) return rejectWithValue('Authorization token missing');

            const response = await fetch('http://localhost:8080/v1/project-service/projects', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await response.json();
            if (!response.ok) return rejectWithValue(data.error || 'Failed to fetch projects');

            return data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// ✅ Fetch sub projects by selected class
export const fetchSubProjectsByProjectId = createAsyncThunk(
    'project/fetchSubProjectsByProjectId',
    async (selectedProject, { getState, rejectWithValue }) => {
      try {
        const { auth, app } = getState();
        const token = auth.token;
        const selectedProjectId = selectedProject.id;
  
        if (!token) return rejectWithValue('Authorization token missing');
        if (!selectedProjectId) return rejectWithValue('No project selected');
  
        const response = await fetch(
          `http://localhost:8080/v1/project-service/projects/${selectedProjectId}/subprojects`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
  
        const data = await response.json();
        if (!response.ok) {
          return rejectWithValue(data.error || 'Failed to fetch sub-projects');
        }
  
        return data;
      } catch (err) {
        return rejectWithValue(err.message);
      }
    }
  );
  
  
// ✅ Fetch all subprojects (could also be per-project optionally)
export const fetchSubProjects = createAsyncThunk(
    'project/fetchSubProjects',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const token = auth.token;

            if (!token) return rejectWithValue('Authorization token missing');

            const response = await fetch('http://localhost:8080/v1/project-service/subprojects', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const data = await response.json();
            if (!response.ok) return rejectWithValue(data.error || 'Failed to fetch subprojects');

            return data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

// ✅ Create a project
export const createProject = createAsyncThunk(
    'project/createProject',
    async (projectData, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const token = auth.token;
            

            const response = await fetch('http://localhost:8080/v1/project-service/projects/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(projectData)
            });

            const data = await response.json();
            if (!response.ok) return rejectWithValue(data.error || 'Failed to create project');

            return data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

export const updateProject = createAsyncThunk(
    'project/updateProject',
    async (updatedProject, { getState, rejectWithValue }) => {
      try {
        const { auth } = getState();
        const token = auth.token;
        if (!token) return rejectWithValue('Authorization token missing');
  
        const response = await fetch(`http://localhost:8080/v1/project-service/projects/update`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(updatedProject),
        });
  
        const data = await response.json();
        if (!response.ok) return rejectWithValue(data.error || 'Failed to update project');
  
        return data;
      } catch (err) {
        return rejectWithValue(err.message);
      }
    }
  );
  

// ✅ Create a subproject
export const createSubProject = createAsyncThunk(
    'project/createSubProject',
    async ({ projectId, subProjectData }, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const token = auth.token;
            const payloadWithId = {
                ...subProjectData,
                projectId, // Add this line
              };
            const response = await fetch(`http://localhost:8080/v1/project-service/projects/${projectId}/subprojects`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payloadWithId)
            });

            const data = await response.json();
            if (!response.ok) return rejectWithValue(data.error || 'Failed to create subproject');

            return data;
        } catch (err) {
            return rejectWithValue(err.message);
        }
    }
);

export const updateSubProject = createAsyncThunk(
    'project/updateSubProject',
    async (updatedSubProject, { getState, rejectWithValue }) => {
      try {
        const { auth } = getState();
        const token = auth.token;
        if (!token) return rejectWithValue('Authorization token missing');
  
        const response = await fetch(`http://localhost:8080/v1/project-service/subprojects/update`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(updatedSubProject),
        });
  
        const data = await response.json();
        if (!response.ok) return rejectWithValue(data.error || 'Failed to update subproject');
  
        return data;
      } catch (err) {
        return rejectWithValue(err.message);
      }
    }
  );
  

export const fetchTasks = createAsyncThunk(
    'project/fetchTasks',
    async ({ projectId, subProjectId }, { getState, rejectWithValue }) => {
      try {
        const { auth } = getState();
        const token = auth.token;
        if (!token) return rejectWithValue('Authorization token missing');
  
        let url = '';
        if (subProjectId) {
          url = `http://localhost:8080/v1/project-service/subprojects/${subProjectId}/tasks`;
        } else if (projectId) {
          url = `http://localhost:8080/v1/project-service/projects/${projectId}/tasks`;
        } else {
          return rejectWithValue('No project or subproject specified');
        }
  
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const data = await response.json();
        if (!response.ok) return rejectWithValue(data.error || 'Failed to fetch tasks');
  
        return data;
      } catch (err) {
        return rejectWithValue(err.message);
      }
    }
  );

  export const createTask = createAsyncThunk(
    'project/createTask',
    async (taskData, { getState, rejectWithValue }) => {
      try {
        const { auth } = getState();
        const token = auth.token;
        if (!token) return rejectWithValue('Authorization token missing');
  
        const response = await fetch('http://localhost:8080/v1/project-service/tasks/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(taskData)
        });
  
        const data = await response.json();
        if (!response.ok) return rejectWithValue(data.error || 'Failed to create task');
  
        return data;
      } catch (err) {
        return rejectWithValue(err.message);
      }
    }
  );
  
  export const updateTask = createAsyncThunk(
    'project/updateTask',
    async (updateTask, { getState, rejectWithValue }) => {
      try {
        const { auth } = getState();
        const token = auth.token;
        if (!token) return rejectWithValue('Authorization token missing');
  
        const response = await fetch(`http://localhost:8080/v1/project-service/tasks/update`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(updateTask),
        });
  
        const data = await response.json();
        if (!response.ok) return rejectWithValue(data.error || 'Failed to update task');
  
        return data;
      } catch (err) {
        return rejectWithValue(err.message);
      }
    }
  );
  
  export const uploadTaskFile = createAsyncThunk(
    'project/uploadTaskFile',
    async ({ taskId, file }, { getState, rejectWithValue, dispatch }) => {
      try {
        const { auth } = getState();
        const token = auth.token;
  
        const formData = new FormData();
        formData.append("file", file);
  
        const uploadResponse = await fetch("http://localhost:8080/v1/file-storage/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
  
        const uploadData = await uploadResponse.json();
        if (!uploadResponse.ok) throw new Error(uploadData.error || "File upload failed");
  
        const fileId = uploadData.id;
  
        // Link the uploaded file to the task
        const linkResponse = await fetch(`http://localhost:8080/v1/project-service/tasks/${taskId}/files`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ taskId, fileId }),
        });
  
        const linkData = await linkResponse.json();
        if (!linkResponse.ok) throw new Error(linkData.error || "Failed to link file to task");
  
        return linkData; // Should contain TaskFileDto
      } catch (err) {
        return rejectWithValue(err.message);
      }
    }
  );

  export const fetchTaskFiles = createAsyncThunk(
    'project/fetchTaskFiles',
    async (taskId, { getState, rejectWithValue }) => {
      try {
        const { auth } = getState();
        const token = auth.token;
  
        const response = await fetch(`http://localhost:8080/v1/project-service/tasks/${taskId}/files`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const data = await response.json();
        if (!response.ok) return rejectWithValue(data.error || 'Failed to fetch files');
        return { taskId, files: data };
      } catch (err) {
        return rejectWithValue(err.message);
      }
    }
  );
  
  export const downloadTaskFile = createAsyncThunk(
    'project/downloadTaskFile',
    async (fileId, { getState, rejectWithValue }) => {
      try {
        const { auth } = getState();
        const token = auth.token;
  
        const response = await fetch(`http://localhost:8080/v1/file-storage/download/${fileId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to download file");
        }
  
        const blob = await response.blob();
        const contentDisposition = response.headers.get("Content-Disposition");
        const fileName = contentDisposition
          ? contentDisposition.split("filename=")[1].replace(/"/g, "")
          : `${fileId}`;
  
        return { blob, fileName };
      } catch (err) {
        return rejectWithValue(err.message);
      }
    }
  );
  
  export const createEvaluation = createAsyncThunk(
    'project/createEvaluation',
    async ({ taskId, evaluationData }, { getState, rejectWithValue }) => {
      try {
        const { auth } = getState();
        const token = auth.token;
  
        const res = await fetch(`http://localhost:8080/v1/project-service/tasks/${taskId}/evaluations`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...evaluationData, taskId }),
        });
  
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to submit evaluation");
        return { taskId, evaluation: data };
      } catch (err) {
        return rejectWithValue(err.message);
      }
    }
  );
  

  export const fetchEvaluations = createAsyncThunk(
    'project/fetchEvaluations',
    async (taskId, { getState, rejectWithValue }) => {
      try {
        const { auth } = getState();
        const token = auth.token;
  
        const res = await fetch(`http://localhost:8080/v1/project-service/tasks/${taskId}/evaluations`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch evaluations");
        return { taskId, evaluations: data };
      } catch (err) {
        return rejectWithValue(err.message);
      }
    }
  );
  

// ✅ Redux Slice
const projectSlice = createSlice({
    name: 'project',
    initialState: {
        projects: [],
        subProjects: [],
        tasks: [], 
        taskFiles: {},
        evaluations: {},
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Projects
            .addCase(fetchProjects.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProjects.fulfilled, (state, action) => {
                state.loading = false;
                state.projects = action.payload;
            })
            .addCase(fetchProjects.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Inside projects by class
            .addCase(fetchProjectsByClass.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProjectsByClass.fulfilled, (state, action) => {
                state.loading = false;
                state.projects = action.payload;
            })
            .addCase(fetchProjectsByClass.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            

            // Fetch SubProjects
            .addCase(fetchSubProjects.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSubProjects.fulfilled, (state, action) => {
                state.loading = false;
                state.subProjects = action.payload;
            })
            .addCase(fetchSubProjects.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Inside sub projects by class
            .addCase(fetchSubProjectsByProjectId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSubProjectsByProjectId.fulfilled, (state, action) => {
                state.loading = false;
                state.subProjects = action.payload;
            })
            .addCase(fetchSubProjectsByProjectId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Create Project
            .addCase(createProject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createProject.fulfilled, (state, action) => {
                state.loading = false;
                state.projects.push(action.payload);
            })
            .addCase(createProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(updateProject.pending, (state) => {
                state.loading = true;
                state.error = null;
              })
              .addCase(updateProject.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.projects.findIndex(p => p.id === action.payload.id);
                if (index !== -1) {
                  state.projects[index] = action.payload;
                }
              })
              .addCase(updateProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
              })

              

            // Create SubProject
            .addCase(createSubProject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createSubProject.fulfilled, (state, action) => {
                state.loading = false;
                state.subProjects.push(action.payload);
            })
            .addCase(createSubProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(updateSubProject.pending, (state) => {
                state.loading = true;
                state.error = null;
              })
              .addCase(updateSubProject.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.subProjects.findIndex(sp => sp.id === action.payload.id);
                if (index !== -1) {
                  state.subProjects[index] = action.payload;
                }
              })
              .addCase(updateSubProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
              })
              
            // Fetch Tasks
            .addCase(fetchTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks = action.payload;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Create Task
            .addCase(createTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks.push(action.payload); // ✅ Append to existing list
            })
            .addCase(createTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateTask.pending, (state) => {
                state.loading = true;
                state.error = null;
              })
              .addCase(updateTask.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.tasks.findIndex(sp => sp.id === action.payload.id);
                if (index !== -1) {
                  state.tasks[index] = action.payload;
                }
              })
              .addCase(updateTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
              })
              .addCase(fetchTaskFiles.fulfilled, (state, action) => {
                const { taskId, files } = action.payload;
                state.taskFiles[taskId] = files;
              })
              .addCase(uploadTaskFile.fulfilled, (state, action) => {
                const file = action.payload;
                const taskId = file.taskId;
                if (!state.taskFiles[taskId]) state.taskFiles[taskId] = [];
                state.taskFiles[taskId].push(file);
              })
              .addCase(fetchEvaluations.fulfilled, (state, action) => {
                const { taskId, evaluations } = action.payload;
                state.evaluations[taskId] = evaluations;
              })
              .addCase(createEvaluation.fulfilled, (state, action) => {
                const { taskId, evaluation } = action.payload;
                if (!state.evaluations[taskId]) state.evaluations[taskId] = [];
                state.evaluations[taskId].push(evaluation);
              })
              
              
              ;
            
    }
});

export default projectSlice.reducer;
