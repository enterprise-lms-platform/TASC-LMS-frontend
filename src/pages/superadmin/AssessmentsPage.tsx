import React, { useState } from 'react';
import {
  Box, Paper, Typography, Grid, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Skeleton, Tabs, Tab,
} from '@mui/material';
import {
  Quiz as QuizIcon, CheckCircle as PassIcon,
  Assignment as AssignmentIcon, Timer as TimerIcon,
} from '@mui/icons-material';
import SuperadminLayout from '../../components/superadmin/SuperadminLayout';
import { useSuperadminAssessments, useSuperadminAssessmentStats } from '../../hooks/useSuperadmin';

const thSx = {
  fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase' as const,
  letterSpacing: '0.06em', color: '#71717a', py: 1.5,
};

type TabType = 'all' | 'quiz' | 'assignment';

const AssessmentsPage: React.FC = () => {
  const [tab, setTab] = useState<TabType>('all');

  const { data: statsData } = useSuperadminAssessmentStats();
  const { data: assessmentsData, isLoading } = useSuperadminAssessments(
    tab === 'all' ? { page_size: 50 } : { type: tab as 'quiz' | 'assignment', page_size: 50 },
  );

  const items = assessmentsData?.results ?? [];

  const kpis = [
    {
      label: 'Total Quizzes', value: String(statsData?.quizzes ?? '—'), icon: <QuizIcon />,
      gradient: 'linear-gradient(135deg, #71717a, #a1a1aa)',
      trend: `${statsData?.assignments ?? 0} assignments`,
    },
    {
      label: 'Pass Rate', value: statsData ? `${statsData.pass_rate}%` : '—', icon: <PassIcon />,
      gradient: 'linear-gradient(135deg, #10b981, #34d399)',
      trend: `${statsData?.total_attempts ?? 0} total attempts`,
    },
    {
      label: 'Total Assessments', value: String(statsData?.total ?? '—'), icon: <TimerIcon />,
      gradient: 'linear-gradient(135deg, #3f3f46, #71717a)',
      trend: 'across all courses',
    },
    {
      label: 'Total Assignments', value: String(statsData?.assignments ?? '—'), icon: <AssignmentIcon />,
      gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
      trend: `${statsData?.quizzes ?? 0} quizzes`,
    },
  ];

  return (
    <SuperadminLayout title="Assessments" subtitle="Assessment management and performance analytics">
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {kpis.map((k) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={k.label}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', transition: 'all 0.25s', '&:hover': { boxShadow: '0 8px 25px rgba(0,0,0,0.08)', transform: 'translateY(-3px)' } }}>
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

      <Paper elevation={0} sx={{ borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Tab value="all" label="All" sx={{ textTransform: 'none', fontWeight: 600 }} />
          <Tab value="quiz" label="Quizzes" sx={{ textTransform: 'none', fontWeight: 600 }} />
          <Tab value="assignment" label="Assignments" sx={{ textTransform: 'none', fontWeight: 600 }} />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[0, 1, 2, 3, 4].map((i) => <Skeleton key={i} height={52} sx={{ borderRadius: 1 }} />)}
            </Box>
          ) : items.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
              <QuizIcon sx={{ fontSize: 48, color: 'grey.300', mb: 1 }} />
              <Typography variant="body2">No assessments found</Typography>
            </Box>
          ) : (
            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: 500 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell sx={thSx}>Title</TableCell>
                    <TableCell sx={{ ...thSx, display: { xs: 'none', md: 'table-cell' } }}>Course</TableCell>
                    <TableCell sx={thSx}>Type</TableCell>
                    <TableCell sx={{ ...thSx, display: { xs: 'none', sm: 'table-cell' } }}>Questions</TableCell>
                    <TableCell sx={thSx}>Submissions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={`${item.type}-${item.id}`} sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.01)' } }}>
                      <TableCell>
                        <Typography variant="body2" fontWeight={600}>{item.title}</Typography>
                      </TableCell>
                      <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.course_title}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={item.type === 'quiz' ? 'Quiz' : 'Assignment'}
                          size="small"
                          sx={{
                            height: 22, fontSize: '0.7rem', fontWeight: 600,
                            bgcolor: item.type === 'quiz' ? 'rgba(59,130,246,0.08)' : '#fff3e0',
                            color: item.type === 'quiz' ? '#3b82f6' : '#f59e0b',
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                        <Typography variant="body2">{item.question_count ?? item.max_points ?? '—'}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{item.submission_count}</Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Paper>
    </SuperadminLayout>
  );
};

export default AssessmentsPage;
