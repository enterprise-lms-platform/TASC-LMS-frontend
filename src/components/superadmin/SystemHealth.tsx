import React from 'react';
import { Box, Paper, Typography, Button, LinearProgress } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';

interface HealthItem {
  label: string;
  value: string;
  status: 'good' | 'warning' | 'critical';
  percent?: number;
}

const healthItems: HealthItem[] = [
  { label: 'Server Status', value: 'Healthy', status: 'good', percent: 100 },
  { label: 'Database', value: 'Online', status: 'good', percent: 100 },
  { label: 'Storage Usage', value: '78%', status: 'warning', percent: 78 },
  { label: 'API Response Time', value: '142ms', status: 'good', percent: 85 },
  { label: 'Uptime', value: '99.97%', status: 'good', percent: 100 },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'good': return '#10b981';
    case 'warning': return '#f59e0b';
    case 'critical': return '#ef4444';
    default: return '#71717a';
  }
};

const cardSx = {
  borderRadius: '1rem',
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
  transition: 'box-shadow 0.3s',
  '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
};

const SystemHealth: React.FC = () => {
  return (
    <Paper elevation={0} sx={cardSx}>
      <Box sx={{
        p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <Typography fontWeight={700}>System Health</Typography>
        <Button size="small" variant="outlined" startIcon={<RefreshIcon sx={{ fontSize: 14 }} />}
          sx={{ textTransform: 'none', fontSize: '0.72rem', fontWeight: 500, borderColor: 'rgba(0,0,0,0.08)', color: 'text.secondary', borderRadius: 2, py: 0.25, '&:hover': { borderColor: 'primary.main', color: 'primary.main' } }}>
          Refresh
        </Button>
      </Box>

      <Box sx={{ p: 0 }}>
        {healthItems.map((item, i) => {
          const color = getStatusColor(item.status);
          return (
            <Box
              key={item.label}
              sx={{
                display: 'flex', alignItems: 'center', gap: 1.5,
                p: 1.5, px: 3,
                borderBottom: i < healthItems.length - 1 ? 1 : 0, borderColor: 'divider',
                '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
              }}
            >
              <Box className={item.status === 'good' ? 'sa-pulse' : undefined}
                sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color, flexShrink: 0 }} />
              <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem', flex: 1 }}>{item.label}</Typography>
              {item.percent !== undefined && (
                <LinearProgress variant="determinate" value={item.percent} sx={{
                  width: 60, height: 5, borderRadius: 3, bgcolor: 'grey.100',
                  '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: color },
                }} />
              )}
              <Typography sx={{ fontWeight: 600, fontSize: '0.8rem', minWidth: 50, textAlign: 'right' }}>{item.value}</Typography>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
};

export default SystemHealth;
