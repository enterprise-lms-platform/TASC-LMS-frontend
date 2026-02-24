import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import {
  Add as AddIcon,
  Receipt as InvoiceIcon,
  FileDownload as ExportIcon,
  PieChart as ReportIcon,
} from '@mui/icons-material';

interface QuickAction {
  label: string;
  icon: React.ReactNode;
  color: string;
}

const actions: QuickAction[] = [
  { label: 'New Payment', icon: <AddIcon />, color: '#10b981' },
  { label: 'Create Invoice', icon: <InvoiceIcon />, color: '#6366f1' },
  { label: 'Export Data', icon: <ExportIcon />, color: '#f59e0b' },
  { label: 'Generate Report', icon: <ReportIcon />, color: '#ef4444' },
];

const QuickActions: React.FC = () => {
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
      <Box sx={{ p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}>
        <Typography fontWeight={700}>Quick Actions</Typography>
      </Box>

      <Box sx={{ p: 2.5 }}>
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
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  bgcolor: 'rgba(0,0,0,0.02)',
                  '&:hover': {
                    bgcolor: 'rgba(255,164,36,0.06)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  },
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: `${action.color}15`,
                    color: action.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 1.5,
                    '& svg': { fontSize: 20 },
                  }}
                >
                  {action.icon}
                </Box>
                <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.75rem' }}>
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
