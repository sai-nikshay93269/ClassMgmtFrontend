import { Grid, Card, CardContent, Typography, IconButton, Tooltip, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ArrowForward } from '@mui/icons-material';
import { format } from 'date-fns'; 
import { SubProjectsList as subProjectsData } from '../../data/index';

const SubProjectsList = ({ project, onViewChange }) => {
    const theme = useTheme();
    const subprojects = subProjectsData.filter(sp => sp.projectId === project?.id);
    const cardMinHeight = "220px"; // Ensuring uniform card size

    return (
        <Grid container spacing={3} alignItems="stretch">
            {subprojects.length > 0 ? (
                subprojects.map((subproject) => (
                    <Grid item xs={12} sm={6} md={4} key={subproject.id}>
                        <Card 
                            sx={{ 
                                borderRadius: "12px", 
                                boxShadow: 3, 
                                backgroundColor: theme.palette.primary.main, 
                                color: "white", 
                                minHeight: cardMinHeight, 
                                display: "flex", 
                                flexDirection: "column",
                                padding: 2
                            }}
                        >
                            <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                                
                                {/* Title & Arrow Button */}
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                                    <Tooltip title={subproject.title} arrow>
                                        <Typography 
                                            variant="h6" 
                                            fontWeight="bold" 
                                            color="white" 
                                            sx={{ 
                                                whiteSpace: "nowrap", 
                                                overflow: "hidden", 
                                                textOverflow: "ellipsis", 
                                                flexGrow: 1 
                                            }}
                                        >
                                            {subproject.title}
                                        </Typography>
                                    </Tooltip>

                                    {/* Arrow Button to View Tasks */}
                                    <IconButton 
                                        sx={{ color: "white", ml: 1 }} 
                                        onClick={() => onViewChange("tasks", project, subproject)}
                                    >
                                        <ArrowForward />
                                    </IconButton>
                                </Box>

                                {/* Due Date with Tooltip */}
                                <Tooltip title={`Due: ${format(new Date(subproject.dueDate), "PPP")}`} arrow>
                                    <Box 
                                        sx={{ 
                                            backgroundColor: "rgba(255, 255, 255, 0.2)", 
                                            padding: "6px 12px", 
                                            borderRadius: "8px", 
                                            display: "inline-block",
                                            fontWeight: "bold",
                                            fontSize: "0.85rem",
                                            whiteSpace: "nowrap", 
                                            overflow: "hidden", 
                                            textOverflow: "ellipsis",
                                            marginBottom: "8px"
                                        }}
                                    >
                                        Due: {format(new Date(subproject.dueDate), "PPP")}
                                    </Box>
                                </Tooltip>

                                {/* Description */}
                                <Typography 
                                    variant="body2" 
                                    color={theme.palette.grey[200]} 
                                    sx={{ 
                                        overflow: "hidden", 
                                        textOverflow: "ellipsis", 
                                        display: "-webkit-box", 
                                        WebkitBoxOrient: "vertical", 
                                        WebkitLineClamp: 3, // Restrict to 3 lines
                                        fontSize: "0.95rem",
                                        lineHeight: 1.4
                                    }}
                                >
                                    {subproject.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))
            ) : (
                <Typography sx={{ textAlign: "center", width: "100%", mt: 2, color: theme.palette.text.primary }}>
                    No subprojects found.
                </Typography>
            )}
        </Grid>
    );
};

export default SubProjectsList;
