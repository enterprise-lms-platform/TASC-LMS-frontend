import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import type { GradingConfig } from '../../../utils/gradingUtils';

interface GradeDistributionChartProps {
  distribution: Record<string, number>;
  gradingConfig: GradingConfig;
}

const gradeColors: Record<string, string> = {
  A: '#10b981',
  B: '#3b82f6',
  C: '#f59e0b',
  D: '#fb923c',
  F: '#ef4444',
  Pass: '#10b981',
  Fail: '#ef4444',
};

const GradeDistributionChart: React.FC<GradeDistributionChartProps> = ({ distribution }) => {
  const entries = Object.entries(distribution);
  const maxCount = Math.max(...entries.map(([, v]) => v), 1);
  const totalCount = entries.reduce((s, [, v]) => s + v, 0);

  return (
    <Paper elevation={0} sx={{ borderRadius: 2, border: 1, borderColor: 'grey.200', overflow: 'hidden' }}>
      <Box sx={{ p: 2, px: 3, borderBottom: 1, borderColor: 'grey.200', bgcolor: 'grey.50' }}>
        <Typography fontWeight={700}>Grade Distribution</Typography>
      </Box>
      <Box sx={{ p: 2.5 }}>
        {entries.map(([label, count]) => {
          const pct = (count / maxCount) * 100;
          const color = gradeColors[label] || '#9ca3af';
          return (
            <Box key={label} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
              <Typography variant="body2" fontWeight={600} sx={{ width: 32, textAlign: 'right', color }}>
                {label}
              </Typography>
              <Box sx={{ flex: 1, height: 20, bgcolor: 'grey.100', borderRadius: 1, overflow: 'hidden' }}>
                <Box
                  sx={{
                    height: '100%',
                    width: `${pct}%`,
                    bgcolor: color,
                    borderRadius: 1,
                    transition: 'width 0.5s ease',
                    minWidth: count > 0 ? 4 : 0,
                  }}
                />
              </Box>
              <Typography variant="caption" color="text.secondary" sx={{ width: 40 }}>
                {count} ({totalCount > 0 ? Math.round((count / totalCount) * 100) : 0}%)
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
};

export default GradeDistributionChart;
