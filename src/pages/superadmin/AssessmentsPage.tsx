import React from 'react';
import {
  Box, Paper, Typography, Grid,
} from '@mui/material';
import {
  Quiz as QuizIcon, CheckCircle as PassIcon,
  Assignment as AssignmentIcon, Timer as TimerIcon,
} from '@mui/icons-material';
import SuperadminLayout from '../../components/superadmin/SuperadminLayout';
import { useAssessmentStats } from '../../services/learning.services';


const AssessmentsPage: React.FC = () => {
  const { data: stats } = useAssessmentStats();

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
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>All Assessments</Typography>
      <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
        <QuizIcon sx={{ fontSize: 48, color: 'grey.300', mb: 1 }} />
        <Typography variant="body2">Assessment list endpoint pending backend implementation</Typography>
        <Typography variant="caption">Stats above are live — detailed list coming soon</Typography>
      </Box>
    </Paper>
  </SuperadminLayout>
  );
};

export default AssessmentsPage;
