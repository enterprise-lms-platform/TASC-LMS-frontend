import React from 'react';
import {
  Box, Paper, Typography, Grid, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Skeleton,
} from '@mui/material';
import {
  Quiz as QuizIcon, CheckCircle as PassIcon,
  Assignment as AssignmentIcon, Timer as TimerIcon,
} from '@mui/icons-material';
import SuperadminLayout from '../../components/superadmin/SuperadminLayout';
import { useAssessmentStats } from '../../services/learning.services';
import { useQuery } from '@tanstack/react-query';
import { submissionApi } from '../../services/learning.services';
import type { Submission } from '../../types/types';

const thSx = { fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: '#71717a', py: 1.5 };

const statusStyle: Record<string, { bg: string; color: string }> = {
  graded:         { bg: '#dcfce7', color: '#10b981' },
  submitted:      { bg: 'rgba(59,130,246,0.08)', color: '#3b82f6' },
  pending_review: { bg: '#fff3e0', color: '#f59e0b' },
  draft:          { bg: 'rgba(156,163,175,0.1)', color: '#71717a' },
};

const AssessmentsPage: React.FC = () => {
  const { data: stats } = useAssessmentStats();

  const { data: subsRaw, isLoading } = useQuery({
    queryKey: ['superadmin', 'submissions', 'recent'],
    queryFn: () => submissionApi.getAll({ page_size: 10 }).then(r => r.data),
  });

  const submissions: Submission[] = Array.isArray(subsRaw)
    ? subsRaw
    : (subsRaw as any)?.results ?? [];

  const kpis = [
    { label: 'Total Quizzes', value: String(stats?.total_quizzes ?? '—'), icon: <QuizIcon />, gradient: 'linear-gradient(135deg, #71717a, #a1a1aa)', trend: `${stats?.total_assignments ?? 0} assignments` },
    { label: 'Quiz Pass Rate', value: stats ? `${stats.quiz_pass_rate}%` : '—', icon: <PassIcon />, gradient: 'linear-gradient(135deg, #10b981, #34d399)', trend: `Avg score: ${stats?.average_quiz_score ?? 0}` },
    { label: 'Pending Grading', value: String(stats?.pending ?? '—'), icon: <TimerIcon />, gradient: 'linear-gradient(135deg, #3f3f46, #71717a)', trend: `${stats?.graded ?? 0} graded` },
    { label: 'Total Assignments', value: String(stats?.total_assignments ?? '—'), icon: <AssignmentIcon />, gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)', trend: `Avg grade: ${stats?.average_grade ?? 0}` },
  ];

  return (
  <SuperadminLayout title="Assessments" subtitle="Assessment management and performance analytics">
    <Grid container spacing={3} sx={{ mb: 4 }}>
      {kpis.map((k) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={k.label}>
          <Paper elevation={0} sx={{ p: 3, borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)', transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)', '&:hover': { boxShadow: '0 8px 25px rgba(0,0,0,0.08)', transform: 'translateY(-3px) scale(1.01)' } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>{k.label}</Typography>
              <Box sx={{ width: 44, height: 44, borderRadius: '50%', background: k.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>{k.icon}</Box>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>{k.value}</Typography>
            <Typography variant="body2" color="text.secondary">{k.trend}</Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>

    <Paper elevation={0} sx={{ p: 3, borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>Recent Submissions</Typography>

      {isLoading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {[0,1,2,3,4].map(i => <Skeleton key={i} height={52} sx={{ borderRadius: 1 }} />)}
        </Box>
      ) : submissions.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
          <QuizIcon sx={{ fontSize: 48, color: 'grey.300', mb: 1 }} />
          <Typography variant="body2">No submissions yet</Typography>
        </Box>
      ) : (
        <TableContainer sx={{ overflowX: 'auto' }}>
          <Table sx={{ minWidth: 500 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: 'grey.50' }}>
                <TableCell sx={thSx}>Learner</TableCell>
                <TableCell sx={thSx}>Assignment</TableCell>
                <TableCell sx={{ ...thSx, display: { xs: 'none', md: 'table-cell' } }}>Submitted</TableCell>
                <TableCell sx={{ ...thSx, display: { xs: 'none', sm: 'table-cell' } }}>Grade</TableCell>
                <TableCell sx={thSx}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {submissions.map(sub => {
                const ss = statusStyle[sub.status] ?? statusStyle.draft;
                return (
                  <TableRow key={sub.id} sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.01)' } }}>
                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>{sub.user_name || sub.user_email}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {sub.assignment_title || `Assignment #${sub.assignment}`}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(sub.submitted_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                      <Typography variant="body2">{sub.grade != null ? `${sub.grade}%` : '—'}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={sub.status.replace('_', ' ').replace(/^\w/, c => c.toUpperCase())}
                        size="small"
                        sx={{ height: 22, fontSize: '0.7rem', fontWeight: 600, bgcolor: ss.bg, color: ss.color }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  </SuperadminLayout>
  );
};

export default AssessmentsPage;
