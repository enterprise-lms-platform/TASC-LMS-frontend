import React from 'react';
import { Box, Paper, Typography, Chip, CircularProgress } from '@mui/material';
import {
  Task as TasksIcon,
  CheckCircle as ApprovalIcon,
  PersonAdd as UserIcon,
  Category as CategoryIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useApprovalRequests } from '../../hooks/useCatalogue';

interface TaskItem {
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  title: string;
  meta: string;
  priority: string;
  priBg: string;
  priColor: string;
  path: string;
}

const PendingTasks: React.FC = () => {
  const navigate = useNavigate();
  const { data: approvalData, isLoading } = useApprovalRequests({ status: 'pending' });

  const pendingCount = approvalData?.count ?? 0;

  const tasksData: TaskItem[] = [
    {
      icon: <ApprovalIcon />,
      iconBg: 'rgba(99,102,241,0.08)',
      iconColor: '#6366f1',
      title: 'Approve Courses',
      meta: pendingCount > 0 ? `${pendingCount} course${pendingCount !== 1 ? 's' : ''} pending approval` : 'No pending approvals',
      priority: pendingCount > 0 ? 'High' : 'Normal',
      priBg: pendingCount > 0 ? 'rgba(245,158,11,0.08)' : 'rgba(161,161,170,0.08)',
      priColor: pendingCount > 0 ? '#f59e0b' : '#71717a',
      path: '/manager/approvals',
    },
    {
      icon: <UserIcon />,
      iconBg: 'rgba(239,68,68,0.08)',
      iconColor: '#ef4444',
      title: 'Invite Instructors',
      meta: 'Add instructors to your organisation',
      priority: 'Normal',
      priBg: 'rgba(161,161,170,0.08)',
      priColor: '#71717a',
      path: '/manager/invite-user',
    },
    {
      icon: <CategoryIcon />,
      iconBg: '#dcfce7',
      iconColor: '#10b981',
      title: 'Manage Categories',
      meta: 'Organise your course catalogue',
      priority: 'Normal',
      priBg: 'rgba(161,161,170,0.08)',
      priColor: '#71717a',
      path: '/manager/categories',
    },
  ];

  const totalBadge = pendingCount;

  const cardSx = {
    borderRadius: '1rem', overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
    transition: 'box-shadow 0.3s',
    '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
  };
  const headerSx = { p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' };

  return (
    <Paper elevation={0} sx={cardSx}>
      <Box sx={{ ...headerSx, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TasksIcon sx={{ color: '#ffa424', fontSize: 20 }} />
          <Typography fontWeight={700}>Pending Tasks</Typography>
        </Box>
        {isLoading ? (
          <CircularProgress size={18} />
        ) : totalBadge > 0 ? (
          <Chip label={totalBadge} size="small"
            sx={{ height: 22, fontSize: '0.7rem', fontWeight: 700, bgcolor: 'rgba(239,68,68,0.1)', color: '#ef4444' }} />
        ) : null}
      </Box>

      {tasksData.map((task, i) => (
        <Box key={i} onClick={() => navigate(task.path)} sx={{
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
