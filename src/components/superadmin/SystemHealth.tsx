import React from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

interface HealthItem {
  label: string;
  value: string;
  status: 'good' | 'warning' | 'critical';
}

const healthItems: HealthItem[] = [
  { label: 'Server Status', value: 'Healthy', status: 'good' },
  { label: 'Database', value: 'Online', status: 'good' },
  { label: 'Storage Usage', value: '78%', status: 'warning' },
  { label: 'API Response Time', value: '142ms', status: 'good' },
  { label: 'Uptime', value: '99.97%', status: 'good' },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'good':
      return '#10b981';
    case 'warning':
      return '#f59e0b';
    case 'critical':
      return '#ef4444';
    default:
      return '#71717a';
  }
};

const SystemHealth: React.FC = () => {
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
          System Health
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<RefreshIcon />}
          sx={{ textTransform: 'none' }}
        >
          Refresh
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {healthItems.map((item, index) => (
          <Box
            key={item.label}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              pb: index < healthItems.length - 1 ? 2 : 0,
              borderBottom: index < healthItems.length - 1 ? '1px solid' : 'none',
              borderColor: 'divider',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  bgcolor: getStatusColor(item.status),
                }}
              />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {item.label}
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {item.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default SystemHealth;
