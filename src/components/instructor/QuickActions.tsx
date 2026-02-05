import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import {
  AddCircle as QuizIcon,
  CloudUpload as UploadIcon,
  Videocam as VideoIcon,
  BarChart as ReportsIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  path: string;
}

const actionsData: QuickAction[] = [
  { icon: <QuizIcon />, label: 'New Quiz', path: '/instructor/course/1/quiz/builder' },
  { icon: <UploadIcon />, label: 'Upload Content', path: '/instructor/course/1/upload' },
  { icon: <VideoIcon />, label: 'Live Session', path: '/instructor/sessions/schedule' },
  { icon: <ReportsIcon />, label: 'Reports', path: '/instructor' },
];

const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Paper
      elevation={0}
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 1,
        overflow: 'hidden',
      }}
    >
      {/* Widget Header */}
      <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight={600} color="text.primary">
          Quick Actions
        </Typography>
      </Box>

      {/* Actions Grid */}
      <Box sx={{ p: 2 }}>
        <Grid container spacing={1.5}>
          {actionsData.map((action) => (
            <Grid size={6} key={action.label}>
              <Box
                onClick={() => navigate(action.path)}
                sx={{
                  p: 1.5,
                  border: 1,
                  borderColor: 'divider',
                  borderRadius: 1,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'rgba(255, 164, 36, 0.05)',
                  },
                }}
              >
                <Box sx={{ color: 'primary.dark', fontSize: 24, mb: 0.5 }}>
                  {action.icon}
                </Box>
                <Typography variant="body2" fontWeight={500} color="text.secondary">
                  {action.label}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Paper>
  );
};

export default QuickActions;

