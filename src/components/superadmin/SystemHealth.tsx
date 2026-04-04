import React from 'react';
import { Box, Paper, Typography, Button, LinearProgress, Chip, Tooltip, Skeleton } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { useSystemHealth } from '../../hooks/useSuperadmin';

interface HealthItem {
  label: string;
  value: string;
  status: 'good' | 'warning' | 'critical';
  percent?: number;
}

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
  const { data, isLoading, refetch, isFetching } = useSystemHealth();

  const dbStatus = data?.database === 'healthy' ? 'good' : 'warning';
  const latencyMs = data?.db_latency_ms ?? 0;
  const latencyStatus: 'good' | 'warning' | 'critical' =
    latencyMs < 100 ? 'good' : latencyMs < 500 ? 'warning' : 'critical';
  const storageStatus = data?.storage === 'online' ? 'good' : 'warning';

  const healthItems: HealthItem[] = data
    ? [
        { label: 'Database', value: data.database === 'healthy' ? 'Healthy' : data.database, status: dbStatus, percent: dbStatus === 'good' ? 100 : 50 },
        { label: 'DB Latency', value: `${latencyMs}ms`, status: latencyStatus, percent: Math.max(0, 100 - latencyMs / 10) },
        { label: 'Storage', value: data.storage === 'online' ? 'Online' : data.storage, status: storageStatus, percent: storageStatus === 'good' ? 100 : 50 },
      ]
    : [];

  return (
    <Paper elevation={0} sx={cardSx}>
      <Box sx={{
        p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1,
      }}>
        <Typography fontWeight={700}>System Health</Typography>
        <Button size="small" variant="outlined"
          startIcon={<RefreshIcon sx={{ fontSize: 14, ...(isFetching && { animation: 'spin 1s linear infinite' }) }} />}
          onClick={() => refetch()}
          disabled={isFetching}
          sx={{ textTransform: 'none', fontSize: '0.72rem', fontWeight: 500, borderColor: 'rgba(0,0,0,0.08)', color: 'text.secondary', borderRadius: 2, py: 0.25, '&:hover': { borderColor: 'primary.main', color: 'primary.main' } }}>
          Refresh
        </Button>
      </Box>

      <Box sx={{ p: 0 }}>
        {isLoading ? (
          [0, 1, 2].map((i) => (
            <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, px: 3, borderBottom: i < 2 ? 1 : 0, borderColor: 'divider' }}>
              <Skeleton variant="circular" width={8} height={8} />
              <Skeleton width="40%" height={20} />
              <Box sx={{ flex: 1 }} />
              <Skeleton width={60} height={8} />
              <Skeleton width={50} height={20} />
            </Box>
          ))
        ) : (
          healthItems.map((item, i) => {
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
          })
        )}
      </Box>
    </Paper>
  );
};

export default SystemHealth;
