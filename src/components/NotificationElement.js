import { Box, Stack, Typography } from '@mui/material';
import { CheckCircle } from 'phosphor-react';
import { useTheme } from "@mui/material/styles";
import { formatDistanceToNow } from "date-fns";

const NotificationElement = ({ id, userId, classId, message, readStatus, creationTimestamp }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: theme.palette.mode === 'light' ? '#F8FAFF' : theme.palette.background,
        padding: 2,
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: 1,
      }}
    >
      <Stack spacing={1}>
        <Typography variant='subtitle2'>{message}</Typography>
        <Stack direction={'row'} alignItems={'center'} spacing={1}>
          <Typography variant='caption' color='textSecondary'>
            {formatDistanceToNow(new Date(creationTimestamp), { addSuffix: true })}
          </Typography>
          {readStatus === 'READ' && <CheckCircle color='green' size={16} />}
        </Stack>
      </Stack>
    </Box>
  );
};

export default NotificationElement;
