import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import {
  PersonAdd as AddUserIcon,
  Business as OrgIcon,
  FileDownload as ExportIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

interface QuickAction {
  label: string;
  icon: React.ReactNode;
}

const actions: QuickAction[] = [
  { label: 'Add User', icon: <AddUserIcon /> },
  { label: 'New Org', icon: <OrgIcon /> },
  { label: 'Export Data', icon: <ExportIcon /> },
  { label: 'Settings', icon: <SettingsIcon /> },
];

const QuickActions: React.FC = () => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary', mb: 3 }}>
        Quick Actions
      </Typography>

      <Grid container spacing={1.5}>
        {actions.map((action) => (
          <Grid key={action.label} size={6}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'all 0.2s',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'rgba(255, 164, 36, 0.05)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  background: 'linear-gradient(135deg, #ffb74d, #ffa424)',
                  color: 'white',
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 1.5,
                }}
              >
                {action.icon}
              </Box>
              <Typography variant="caption" sx={{ fontWeight: 500, color: 'text.primary' }}>
                {action.label}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default QuickActions;
