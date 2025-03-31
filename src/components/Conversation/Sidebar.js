import { Box, Typography, IconButton, List, ListItem, ListItemText } from "@mui/material";
import { Add, Mic, Tag } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchGroups } from "../../redux/slices/classSlice";
import CreateGroupDialog from "./CreateGroupDialog";

const Sidebar = ({ }) => {
  const dispatch = useDispatch();
  const selecedClassId = useSelector((state) => state.app.selectedClass?.id);

  const groups = useSelector((state) => state.class.groups[selecedClassId] || []); // 🔹 Fetch only relevant class groups
  const [open, setOpen] = useState(false);
  

  // 🔹 Fetch groups when `classId` changes
  useEffect(() => {
    console.log("Selected Class ID:", selecedClassId);
    console.log("Redux Groups:", groups);
    if (selecedClassId) {
      dispatch(fetchGroups(selecedClassId));
    }
  }, [dispatch, selecedClassId]);
  

  return (
    <Box
      width="260px"
      bgcolor="#ffffff"
      color="#2e3338"
      p={2}
      sx={{ display: "flex", flexDirection: "column", height: "90vh" }}
    >
      {/* Groups Section */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 1, color: "#747f8d" }}>
          <Typography variant="subtitle2" sx={{ fontSize: "12px", fontWeight: 600 }}>
            Groups
          </Typography>
          <IconButton size="small" onClick={() => setOpen(true)} sx={{ color: "#747f8d", "&:hover": { color: "#2e3338" } }}>
            <Add fontSize="small" />
          </IconButton>
        </Box>

        {/* Scrollable Groups List */}
        <Box sx={{ flex: 1, overflowY: "auto" }} className="scrollbar">
          {groups.length > 0 ? ( // 🔹 Show groups if available
            <List dense sx={{ color: "#2e3338" }}>
              {groups.map((group) => (
                <ListItem
                  key={group.id}
                  sx={{
                    pl: 1,
                    py: 0.5,
                    cursor: "pointer",
                    borderRadius: "4px",
                    "&:hover": { bgcolor: "#ebedef" },
                  }}
                >
                  <Tag fontSize="small" sx={{ mr: 1, color: "#747f8d" }} />
                  <ListItemText primary={group.name} primaryTypographyProps={{ fontSize: "14px" }} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body2" sx={{ color: "#747f8d", textAlign: "center", mt: 2 }}>
              No groups available
            </Typography>
          )}
        </Box>
      </Box>

      {/* Voice Channels Section */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontSize: "12px", fontWeight: 600, color: "#747f8d" }}>
          VOICE CHANNELS
        </Typography>

        <Box sx={{ flex: 1, overflowY: "auto" }} className="scrollbar">
          <List dense sx={{ color: "#2e3338" }}>
            <ListItem
              sx={{
                pl: 1,
                py: 0.5,
                borderRadius: "4px",
                cursor: "pointer",
                "&:hover": { bgcolor: "#ebedef" },
              }}
            >
              <Mic fontSize="small" sx={{ mr: 1, color: "#747f8d" }} />
              <ListItemText primary="General" primaryTypographyProps={{ fontSize: "14px" }} />
            </ListItem>
          </List>
        </Box>
      </Box>

      {/* Create Group Dialog */}
      <CreateGroupDialog open={open} handleClose={() => setOpen(false)} classId={selecedClassId} />
    </Box>
  );
};

export default Sidebar;
