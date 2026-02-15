import React from 'react';
import { useNavigate } from 'react-router-dom';
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
  path?: string;
}

const actions: QuickAction[] = [
  { label: 'Add User', icon: <AddUserIcon />, path: '/superadmin/add-user' },
  { label: 'New Org', icon: <OrgIcon /> },
  { label: 'Export Data', icon: <ExportIcon /> },
  { label: 'Settings', icon: <SettingsIcon /> },
];

const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  const handleActionClick = (path?: string) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        borderRadius: '1rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
        transition: 'box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
        },
      }}
    >
      <Typography sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.95rem', mb: 2.5 }}>
        Quick Actions
      </Typography>

      <Grid container spacing={1.5}>
        {actions.map((action) => (
          <Grid key={action.label} size={6}>
            <Box
              onClick={() => handleActionClick(action.path)}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
                borderRadius: 3,
                cursor: action.path ? 'pointer' : 'default',
                bgcolor: 'rgba(0,0,0,0.015)',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': action.path ? {
                  background: 'linear-gradient(135deg, rgba(255,164,36,0.08), rgba(249,115,22,0.04))',
                  transform: 'translateY(-3px) scale(1.02)',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
                } : {},
              }}
            >
              <Box
                sx={{
                  width: 38,
                  height: 38,
                  background: 'linear-gradient(135deg, #ffb74d, #ffa424)',
                  color: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 1.25,
                  '& .MuiSvgIcon-root': { fontSize: 18 },
                }}
              >
                {action.icon}
              </Box>
              <Typography sx={{ fontWeight: 500, color: 'text.primary', fontSize: '0.75rem' }}>
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
