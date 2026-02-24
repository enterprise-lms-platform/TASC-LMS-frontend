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
  color: string;
  path?: string;
}

const actions: QuickAction[] = [
  { label: 'Add User', icon: <AddUserIcon />, color: '#10b981', path: '/superadmin/add-user' },
  { label: 'New Org', icon: <OrgIcon />, color: '#6366f1' },
  { label: 'Export Data', icon: <ExportIcon />, color: '#f59e0b' },
  { label: 'Settings', icon: <SettingsIcon />, color: '#ef4444' },
];

const cardSx = {
  borderRadius: '1rem',
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
  transition: 'box-shadow 0.3s',
  '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
};

const QuickActions: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Paper elevation={0} sx={cardSx}>
      <Box sx={{ p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}>
        <Typography fontWeight={700}>Quick Actions</Typography>
      </Box>

      <Box sx={{ p: 2.5 }}>
        <Grid container spacing={1.5}>
          {actions.map((action) => (
            <Grid key={action.label} size={6}>
              <Box
                onClick={() => action.path && navigate(action.path)}
                sx={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  p: 2, borderRadius: '12px',
                  cursor: action.path ? 'pointer' : 'default',
                  bgcolor: 'rgba(0,0,0,0.02)',
                  transition: 'all 0.2s',
                  '&:hover': action.path ? {
                    bgcolor: 'rgba(255,164,36,0.06)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  } : {},
                }}
              >
                <Box sx={{
                  width: 40, height: 40, borderRadius: '50%',
                  bgcolor: `${action.color}15`, color: action.color,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  mb: 1.25, '& svg': { fontSize: 20 },
                }}>
                  {action.icon}
                </Box>
                <Typography sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.75rem' }}>
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
