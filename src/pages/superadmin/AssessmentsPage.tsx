import React from 'react';
import {
  Box, Paper, Typography, Grid, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, IconButton, LinearProgress, Button,
} from '@mui/material';
import {
  Quiz as QuizIcon, CheckCircle as PassIcon,
  Visibility as ViewIcon, BarChart as StatsIcon,
  Assignment as AssignmentIcon, Timer as TimerIcon,
} from '@mui/icons-material';
import SuperadminLayout from '../../components/superadmin/SuperadminLayout';

const kpis = [
  { label: 'Total Assessments', value: '892', icon: <QuizIcon />, gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)', trend: '+45 this month' },
  { label: 'Avg Pass Rate', value: '78.5%', icon: <PassIcon />, gradient: 'linear-gradient(135deg, #10b981, #34d399)', trend: '+2.3% vs last month' },
  { label: 'Active Exams', value: '34', icon: <TimerIcon />, gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)', trend: '12 scheduled today' },
  { label: 'Total Attempts', value: '24,567', icon: <AssignmentIcon />, gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)', trend: '+1,234 this week' },
];

const statusColors: Record<string, { bg: string; color: string }> = {
  Active: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
  Draft: { bg: 'rgba(113, 113, 122, 0.1)', color: '#71717a' },
  Archived: { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' },
};

const assessments = [
  { id: 'ASM-892', title: 'React Advanced Patterns Final', course: 'Advanced React Patterns', type: 'Final Exam', questions: 50, passRate: 82, attempts: 234, avgScore: 76.5, status: 'Active' },
  { id: 'ASM-891', title: 'Data Science Midterm', course: 'Data Science Fundamentals', type: 'Midterm', questions: 40, passRate: 71, attempts: 189, avgScore: 68.3, status: 'Active' },
  { id: 'ASM-890', title: 'Cybersecurity Certification Exam', course: 'Cybersecurity Essentials', type: 'Certification', questions: 60, passRate: 65, attempts: 156, avgScore: 62.8, status: 'Active' },
  { id: 'ASM-885', title: 'Cloud Architecture Quiz 3', course: 'Cloud Architecture', type: 'Quiz', questions: 20, passRate: 88, attempts: 312, avgScore: 84.2, status: 'Active' },
  { id: 'ASM-880', title: 'Python Basics Assessment', course: 'Python for Beginners', type: 'Final Exam', questions: 35, passRate: 91, attempts: 567, avgScore: 85.1, status: 'Active' },
  { id: 'ASM-875', title: 'Business Analytics Capstone', course: 'Business Analytics', type: 'Capstone', questions: 25, passRate: 74, attempts: 98, avgScore: 71.6, status: 'Archived' },
  { id: 'ASM-870', title: 'Digital Marketing Quiz', course: 'Digital Marketing', type: 'Quiz', questions: 15, passRate: 93, attempts: 445, avgScore: 88.9, status: 'Active' },
  { id: 'ASM-865', title: 'UX/UI Design Portfolio Review', course: 'UX/UI Design', type: 'Project', questions: 5, passRate: 86, attempts: 123, avgScore: 79.4, status: 'Active' },
  { id: 'ASM-860', title: 'Machine Learning Draft Exam', course: 'Machine Learning Intro', type: 'Final Exam', questions: 45, passRate: 0, attempts: 0, avgScore: 0, status: 'Draft' },
  { id: 'ASM-855', title: 'Web Development Basics', course: 'Full Stack Development', type: 'Quiz', questions: 30, passRate: 85, attempts: 389, avgScore: 80.7, status: 'Active' },
];

const typeColors: Record<string, string> = {
  'Final Exam': '#3b82f6',
  Midterm: '#8b5cf6',
  Certification: '#ef4444',
  Quiz: '#10b981',
  Capstone: '#f59e0b',
  Project: '#ec4899',
};

const AssessmentsPage: React.FC = () => (
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>All Assessments</Typography>
        <Button variant="contained" size="small" sx={{ textTransform: 'none' }}>Create Assessment</Button>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {['ID', 'Assessment', 'Course', 'Type', 'Questions', 'Pass Rate', 'Attempts', 'Avg Score', 'Status', 'Actions'].map((h) => (
                <TableCell key={h} sx={{ fontWeight: 600, color: 'text.disabled', fontSize: '0.7rem', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {assessments.map((a) => (
              <TableRow key={a.id} sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.015)' } }}>
                <TableCell><Typography variant="body2" sx={{ fontWeight: 600, fontFamily: 'monospace' }}>{a.id}</Typography></TableCell>
                <TableCell><Typography variant="body2" sx={{ fontWeight: 500 }}>{a.title}</Typography></TableCell>
                <TableCell><Typography variant="body2">{a.course}</Typography></TableCell>
                <TableCell>
                  <Chip label={a.type} size="small" sx={{ bgcolor: `${typeColors[a.type] || '#71717a'}15`, color: typeColors[a.type] || '#71717a', fontWeight: 500, fontSize: '0.75rem' }} />
                </TableCell>
                <TableCell><Typography variant="body2">{a.questions}</Typography></TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LinearProgress variant="determinate" value={a.passRate} sx={{ flex: 1, height: 6, borderRadius: 3, bgcolor: 'grey.200', '& .MuiLinearProgress-bar': { borderRadius: 3, bgcolor: a.passRate >= 80 ? '#10b981' : a.passRate >= 60 ? '#f59e0b' : '#ef4444' } }} />
                    <Typography variant="body2" sx={{ fontWeight: 500, minWidth: 36 }}>{a.passRate}%</Typography>
                  </Box>
                </TableCell>
                <TableCell><Typography variant="body2">{a.attempts.toLocaleString()}</Typography></TableCell>
                <TableCell><Typography variant="body2" sx={{ fontWeight: 500 }}>{a.avgScore > 0 ? `${a.avgScore}%` : '—'}</Typography></TableCell>
                <TableCell><Chip label={a.status} size="small" sx={{ bgcolor: statusColors[a.status]?.bg, color: statusColors[a.status]?.color, fontWeight: 500, fontSize: '0.75rem' }} /></TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    <IconButton size="small" sx={{ color: 'text.disabled', '&:hover': { color: 'primary.main', bgcolor: 'rgba(0,0,0,0.04)' } }}><ViewIcon fontSize="small" /></IconButton>
                    <IconButton size="small" sx={{ color: 'text.disabled', '&:hover': { color: 'primary.main', bgcolor: 'rgba(0,0,0,0.04)' } }}><StatsIcon fontSize="small" /></IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  </SuperadminLayout>
);

export default AssessmentsPage;
