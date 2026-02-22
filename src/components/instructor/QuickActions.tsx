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
        borderRadius: '1rem',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
        transition: 'box-shadow 0.3s',
        '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
      }}
    >
      {/* Widget Header */}
      <Box sx={{ p: 2.5, pb: 1.5 }}>
        <Typography variant="h6" fontWeight={600} color="text.primary">
          Quick Actions
        </Typography>
      </Box>

      {/* Actions Grid */}
      <Box sx={{ px: 2.5, pb: 2.5 }}>
        <Grid container spacing={1.5}>
          {actionsData.map((action) => (
            <Grid size={6} key={action.label}>
              <Box
                onClick={() => navigate(action.path)}
                sx={{
                  p: 1.5,
                  borderRadius: '0.75rem',
                  bgcolor: 'grey.50',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: 'rgba(255, 164, 36, 0.06)',
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
