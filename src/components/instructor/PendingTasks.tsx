import React from 'react';
import { Box, Typography, Paper, Chip, Skeleton } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { submissionApi } from '../../services/learning.services';
import { courseApprovalApi } from '../../services/catalogue.services';
import type { PaginatedResponse } from '../../types/types';

interface Task {
  title: string;
  meta: string;
  status: 'urgent' | 'high';
}

const PendingTasks: React.FC = () => {
  const { data: subsData, isLoading: ls } = useQuery({
    queryKey: ['instructor', 'submissions', 'pending-tasks'],
    queryFn: () => submissionApi.getAll({ status: 'pending' }).then(r => r.data),
  });
  const { data: approvalsData, isLoading: la } = useQuery({
    queryKey: ['instructor', 'approvals', 'pending-tasks'],
    queryFn: () => courseApprovalApi.getAll({ status: 'pending' }).then(r => r.data),
  });

  const pendingSubs = (subsData as PaginatedResponse<unknown> | undefined)?.count
    ?? (subsData as PaginatedResponse<unknown> | undefined)?.results?.length ?? 0;
  const pendingApprovals = (approvalsData as PaginatedResponse<unknown> | undefined)?.count
    ?? (approvalsData as PaginatedResponse<unknown> | undefined)?.results?.length ?? 0;

  const isLoading = ls || la;

  const tasksData: Task[] = [];
  if (pendingSubs > 0) tasksData.push({ title: 'Grade Assignments', meta: `${pendingSubs} submissions`, status: 'urgent' });
  if (pendingApprovals > 0) tasksData.push({ title: 'Review Course Approvals', meta: `${pendingApprovals} pending`, status: 'high' });

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
        {isLoading ? (
          [0, 1].map(i => <Skeleton key={i} variant="rounded" height={60} sx={{ borderRadius: '0.75rem', mb: i === 0 ? 1.5 : 0 }} />)
        ) : tasksData.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 3 }}>
            No pending tasks
          </Typography>
        ) : (
          tasksData.map((task, index) => (
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
          ))
        )}
      </Box>
    </Paper>
  );
};

export default PendingTasks;
