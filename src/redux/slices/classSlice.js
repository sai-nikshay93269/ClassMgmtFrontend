import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setSelectedClass,UpdateSelectedClassMembers } from "./appSlice";
import { dispatch } from '../store';

// ✅ Async thunk to fetch classes
export const fetchClasses = createAsyncThunk(
    'class/fetchClasses',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const token = auth.token;

            if (!token) {
                console.error("Authorization token missing");
                return rejectWithValue("Authorization token missing");
            }

            const response = await fetch('http://localhost:8080/v1/classes-service/classes/my-classes', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const responseData = await response.json();

            if (!response.ok) {
                return rejectWithValue(responseData.error || "Failed to fetch classes");
            }

            console.log("Fetched classes:", responseData);
            return responseData;
        } catch (error) {
            console.error("Error fetching classes:", error);
            return rejectWithValue(error.message);
        }
    }
);

// ✅ Async thunk to create a new class
export const createClass = createAsyncThunk(
    'class/createClass',
    async (classData, { getState, rejectWithValue }) => {
        try {
            const { auth } = getState();
            const token = auth.token;

            if (!token) {
                console.error("Authorization token missing");
                return rejectWithValue("Authorization token missing");
            }

            const response = await fetch('http://localhost:8080/v1/classes-service/classes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(classData)
            });

            const responseData = await response.json();

            if (!response.ok) {
                return rejectWithValue(responseData.error || "Failed to create class");
            }

            console.log("Created class:", responseData);
            return responseData;
        } catch (error) {
            console.error("Error creating class:", error);
            return rejectWithValue(error.message);
        }
    }
);

// ✅ Async thunk to create a group within a selected class
export const createGroup = createAsyncThunk(
    'class/createGroup',
    async (groupName, { getState, rejectWithValue }) => {
        try {
            const { auth, app } = getState();
            const token = auth.token;
            const selectedClass = app.selectedClass;

            if (!token) {
                console.error("Authorization token missing");
                return rejectWithValue("Authorization token missing");
            }

            if (!selectedClass || !selectedClass.id) {
                console.error("No class selected");
                return rejectWithValue("No class selected");
            }

            const groupData = {
                name: groupName.name,
                classId: selectedClass.id
            };

            const response = await fetch('http://localhost:8080/v1/classes-service/groups/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(groupData)
            });

            const responseData = await response.json();
            console.log(responseData)
            if (!response.ok) {
                return rejectWithValue(responseData.error || "Failed to create group");
            }

            console.log("Created group:", responseData);
            return responseData;
        } catch (error) {
            console.error("Error creating group:", error);
            return rejectWithValue(error.message);
        }
    }
);

// ✅ Async thunk to fetch groups for the selected class
export const fetchGroups = createAsyncThunk(
    'class/fetchGroups',
    async (_, { getState, rejectWithValue }) => {
        try {
            const { auth, app } = getState();
            const token = auth.token;
            const selectedClass = app.selectedClass;

            if (!token) {
                console.error("Authorization token missing");
                return rejectWithValue("Authorization token missing");
            }

            if (!selectedClass || !selectedClass.id) {
                console.error("No class selected");
                return rejectWithValue("No class selected");
            }

            const response = await fetch(`http://localhost:8080/v1/classes-service/classes/${selectedClass.id}/my-groups`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const responseData = await response.json();

            if (!response.ok) {
                return rejectWithValue(responseData.error || "Failed to fetch groups");
            }

            console.log("Fetched groups:", responseData);
            return { classId: selectedClass.id, groups: responseData };
        } catch (error) {
            console.error("Error fetching groups:", error);
            return rejectWithValue(error.message);
        }
    }
);

// Add Class Members Thunk
export const addClassMembers = createAsyncThunk(
    'class/addClassMembers',
    async ({ classId, studentIds }, { getState, rejectWithValue }) => {
      try {
        const { auth } = getState();
        const token = auth.token;
  
        const response = await fetch(`http://localhost:8080/v1/classes-service/classes/${classId}/members`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ studentIds })
        });
  
        const responseData = await response.json();
  
        if (!response.ok) {
          return rejectWithValue(responseData.error || 'Failed to add members');
        }
        dispatch(UpdateSelectedClassMembers(responseData));
  
        return { classId, members: responseData }; // assuming responseData is the list of added members
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
             

// ✅ Create slice with `extraReducers` for async handling
const classSlice = createSlice({
    name: 'class',
    initialState: {
        classes: [],
        groups: {}, // ✅ Store groups in an object indexed by classId
        loading: false,
        error: null,
    },
    reducers: {}, 
    extraReducers: (builder) => {
        builder
            // ✅ Handle fetchClasses
            .addCase(fetchClasses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchClasses.fulfilled, (state, action) => {
                state.loading = false;

                // ✅ Preserve existing groups and update classes only
                //const existingGroups = { ...state.groups };
                state.classes = action.payload;
                //state.groups = existingGroups;
            })
            .addCase(fetchClasses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ✅ Handle createClass
            .addCase(createClass.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createClass.fulfilled, (state, action) => {
                state.loading = false;
                state.classes.push(action.payload);
            })
            .addCase(createClass.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ✅ Handle createGroup
            .addCase(createGroup.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createGroup.fulfilled, (state, action) => {
                state.loading = false;
            
            
                const { id, name, classId } = action.payload;
            
                if (!classId) {
                    console.error("Class ID is missing in Redux");
                    return;
                }
            
                if (!state.groups[classId]) {
                    state.groups[classId] = [];
                }
            
                state.groups[classId].push({ id, name, classId }); // ✅ Ensure correct structure
            })
            
            .addCase(createGroup.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // ✅ Handle fetchGroups
            .addCase(fetchGroups.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGroups.fulfilled, (state, action) => {
                state.loading = false;
            
                if (!action.payload.groups.length) return; // Prevent errors if empty
            
                // Extract classId from the first group (assuming all groups belong to the same class)
                const classId = action.payload.groups[0]?.classId;
            
                if (!classId) {
                    console.error("Missing classId in fetched groups");
                    return;
                }
            
                // ✅ Ensure state.groups[classId] exists before assigning
                state.groups[classId] = action.payload.groups;
            })          
            .addCase(fetchGroups.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addClassMembers.pending, (state) => {
                state.loading = true;
                state.error = null;
              })
              .addCase(addClassMembers.fulfilled, (state, action) => {
                state.loading = false;
                const { classId, members } = action.payload;
              
                const classIndex = state.classes.findIndex(c => c.id === classId);
                if (classIndex !== -1) {
                  if (!state.classes[classIndex].members) {
                    state.classes[classIndex].members = [];
                  }
                  state.classes[classIndex].members.push(...members);
                }
                dispatch(UpdateSelectedClassMembers(members))
              })
              .addCase(addClassMembers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
              });
    }
});

export default classSlice.reducer;
