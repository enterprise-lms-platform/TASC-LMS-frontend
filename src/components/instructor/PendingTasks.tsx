import React from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';

interface Task {
  title: string;
  meta: string;
  status: 'urgent' | 'high';
}

// Sample tasks data (will come from backend later)
const tasksData: Task[] = [
  {
    title: 'Grade JavaScript Assignments',
    meta: '12 submissions',
    status: 'urgent',
  },
  {
    title: 'Review Course Feedback',
    meta: '24 responses',
    status: 'high',
  },
  {
    title: 'Update React Course Content',
    meta: 'Due tomorrow',
    status: 'high',
  },
];

const PendingTasks: React.FC = () => {
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
          Pending Tasks
        </Typography>
      </Box>

      {/* Tasks List */}
      <Box sx={{ px: 2.5, pb: 2.5 }}>
        {tasksData.map((task, index) => (
          <Box
            key={task.title}
            sx={{
              p: 1.5,
              borderRadius: '0.75rem',
              bgcolor: 'grey.50',
              mb: index < tasksData.length - 1 ? 1.5 : 0,
              cursor: 'pointer',
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: 'rgba(255, 164, 36, 0.06)',
              },
            }}
          >
            <Typography variant="body2" fontWeight={500} color="text.primary" gutterBottom>
              {task.title}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                {task.meta}
              </Typography>
              <Chip
                label={task.status === 'urgent' ? 'Urgent' : 'High'}
                size="small"
                sx={{
                  height: 20,
                  fontSize: '0.7rem',
                  fontWeight: 500,
                  bgcolor: task.status === 'urgent' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                  color: task.status === 'urgent' ? 'error.main' : 'warning.dark',
                }}
              />
            </Box>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default PendingTasks;
