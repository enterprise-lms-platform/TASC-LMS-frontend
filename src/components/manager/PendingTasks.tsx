import React from 'react';
import { Box, Paper, Typography, Chip } from '@mui/material';
import {
  Task as TasksIcon,
  Edit as GradingIcon,
  CheckCircle as ApprovalIcon,
  Person as UserIcon,
  Comment as ReviewIcon,
} from '@mui/icons-material';

// Tasks data (will come from backend later)
const tasksData = [
  {
    icon: <GradingIcon />,
    iconBg: 'warning.lighter',
    iconColor: 'warning.main',
    title: 'Grade Assignments',
    meta: '12 submissions awaiting review',
    priority: 'Urgent',
    priorityColor: 'error',
  },
  {
    icon: <ApprovalIcon />,
    iconBg: 'info.lighter',
    iconColor: 'info.main',
    title: 'Approve Courses',
    meta: '5 courses pending approval',
    priority: 'High',
    priorityColor: 'warning',
  },
  {
    icon: <UserIcon />,
    iconBg: 'error.lighter',
    iconColor: 'error.main',
    title: 'User Access Requests',
    meta: '3 new requests',
    priority: 'Normal',
    priorityColor: 'default',
  },
  {
    icon: <ReviewIcon />,
    iconBg: 'success.lighter',
    iconColor: 'success.main',
    title: 'Review Feedback',
    meta: '24 new course reviews',
    priority: 'Normal',
    priorityColor: 'default',
  },
];

const PendingTasks: React.FC = () => {
  return (
    <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 3, overflow: 'hidden' }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 2.5,
          px: 3,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TasksIcon sx={{ color: 'primary.dark' }} />
          <Typography variant="subtitle1" fontWeight={600}>
            Pending Tasks
          </Typography>
        </Box>
        <Chip
          label="17"
          size="small"
          sx={{ bgcolor: 'error.main', color: 'white', fontWeight: 600, fontSize: '0.75rem' }}
        />
      </Box>

      {/* Task List */}
      <Box>
        {tasksData.map((task, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 2,
              px: 3,
              borderBottom: index < tasksData.length - 1 ? 1 : 0,
              borderColor: 'divider',
              cursor: 'pointer',
              transition: 'background 0.2s',
              '&:hover': { bgcolor: 'grey.50' },
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: task.iconBg,
                color: task.iconColor,
                flexShrink: 0,
              }}
            >
              {task.icon}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" fontWeight={500} color="text.primary">
                {task.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {task.meta}
              </Typography>
            </Box>
            <Chip
              label={task.priority}
              size="small"
              sx={{
                bgcolor: task.priorityColor === 'error' ? 'error.lighter' :
                         task.priorityColor === 'warning' ? 'warning.lighter' : 'grey.100',
                color: task.priorityColor === 'error' ? 'error.main' :
                       task.priorityColor === 'warning' ? 'warning.main' : 'text.secondary',
                fontWeight: 600,
                fontSize: '0.625rem',
              }}
            />
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

export default PendingTasks;
