import React from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
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
        p: 2.5,
        borderRadius: '1rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
        transition: 'box-shadow 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2.5 }}>
        <Typography sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.95rem' }}>
          System Health
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<RefreshIcon sx={{ fontSize: 14 }} />}
          sx={{
            textTransform: 'none',
            fontSize: '0.72rem',
            fontWeight: 500,
            borderColor: 'rgba(0,0,0,0.08)',
            color: 'text.secondary',
            borderRadius: 2,
            py: 0.25,
            '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
          }}
        >
          Refresh
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.75 }}>
        {healthItems.map((item) => {
          const color = getStatusColor(item.status);
          return (
            <Box
              key={item.label}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1, minWidth: 0 }}>
                <Box
                  className={item.status === 'good' ? 'sa-pulse' : undefined}
                  sx={{
                    width: 7,
                    height: 7,
                    borderRadius: '50%',
                    bgcolor: color,
                    flexShrink: 0,
                  }}
                />
                <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem', fontWeight: 400 }}>
                  {item.label}
                </Typography>
              </Box>
              {/* Inline progress bar */}
              {item.percent !== undefined && (
                <Box
                  className="sa-progress-track"
                  sx={{ mx: 1.5 }}
                >
                  <Box
                    className="sa-progress-fill"
                    sx={{
                      width: `${item.percent}%`,
                      bgcolor: color,
                    }}
                  />
                </Box>
              )}
              <Typography sx={{ fontWeight: 600, fontSize: '0.8rem', flexShrink: 0 }}>
                {item.value}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
};

export default SystemHealth;
