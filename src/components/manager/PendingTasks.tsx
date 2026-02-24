import React from 'react';
import { Box, Paper, Typography, Chip } from '@mui/material';
import {
  Task as TasksIcon,
  Edit as GradingIcon,
  CheckCircle as ApprovalIcon,
  Person as UserIcon,
  Comment as ReviewIcon,
} from '@mui/icons-material';

const tasksData = [
  { icon: <GradingIcon />, iconBg: '#fff3e0', iconColor: '#f59e0b', title: 'Grade Assignments', meta: '12 submissions awaiting review', priority: 'Urgent', priBg: 'rgba(239,68,68,0.08)', priColor: '#ef4444' },
  { icon: <ApprovalIcon />, iconBg: 'rgba(99,102,241,0.08)', iconColor: '#6366f1', title: 'Approve Courses', meta: '5 courses pending approval', priority: 'High', priBg: 'rgba(245,158,11,0.08)', priColor: '#f59e0b' },
  { icon: <UserIcon />, iconBg: 'rgba(239,68,68,0.08)', iconColor: '#ef4444', title: 'User Access Requests', meta: '3 new requests', priority: 'Normal', priBg: 'rgba(161,161,170,0.08)', priColor: '#71717a' },
  { icon: <ReviewIcon />, iconBg: '#dcfce7', iconColor: '#10b981', title: 'Review Feedback', meta: '24 new course reviews', priority: 'Normal', priBg: 'rgba(161,161,170,0.08)', priColor: '#71717a' },
];

const cardSx = {
  borderRadius: '1rem', overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
  transition: 'box-shadow 0.3s',
  '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
};
const headerSx = { p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' };

const PendingTasks: React.FC = () => {
  return (
    <Paper elevation={0} sx={cardSx}>
      <Box sx={{ ...headerSx, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TasksIcon sx={{ color: '#ffa424', fontSize: 20 }} />
          <Typography fontWeight={700}>Pending Tasks</Typography>
        </Box>
        <Chip label="17" size="small"
          sx={{ height: 22, fontSize: '0.7rem', fontWeight: 700, bgcolor: 'rgba(239,68,68,0.1)', color: '#ef4444' }} />
      </Box>

      {tasksData.map((task, i) => (
        <Box key={i} sx={{
          display: 'flex', alignItems: 'center', gap: 1.5, p: 2, px: 3,
          borderBottom: i < tasksData.length - 1 ? 1 : 0, borderColor: 'divider',
          cursor: 'pointer', transition: 'all 0.15s',
          '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
        }}>
          <Box sx={{
            width: 40, height: 40, borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            bgcolor: task.iconBg, color: task.iconColor, flexShrink: 0,
            '& svg': { fontSize: 20 },
          }}>{task.icon}</Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" fontWeight={600}>{task.title}</Typography>
            <Typography variant="caption" color="text.secondary">{task.meta}</Typography>
          </Box>
          <Chip label={task.priority} size="small"
            sx={{ height: 22, fontSize: '0.65rem', fontWeight: 600, bgcolor: task.priBg, color: task.priColor }} />
        </Box>
      ))}
    </Paper>
  );
};

export default PendingTasks;
