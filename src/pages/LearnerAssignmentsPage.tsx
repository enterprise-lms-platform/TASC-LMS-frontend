import React, { useState } from 'react';
import {
  Box, Toolbar, CssBaseline, Paper, Typography, Grid, Chip,
  Tabs, Tab, Button,
} from '@mui/material';
import {
  Assignment as AssignIcon, CheckCircle as DoneIcon,
  AccessTime as TimeIcon, TrendingUp as ScoreIcon,
  Upload as UploadIcon, Visibility as ViewIcon,
  Schedule as PendingIcon, Lock as LockIcon,
  Description as FileIcon,
} from '@mui/icons-material';
import '../styles/LearnerDashboard.css';

import Sidebar, { DRAWER_WIDTH } from '../components/learner/Sidebar';
import TopBar from '../components/learner/TopBar';

/* ── Static data ── */

const kpis = [
  { 
    label: 'Total Assignments', 
    value: '15', 
    icon: <AssignIcon />, 
    // Light Blue Theme
    bgcolor: '#dbeafe',
    iconBg: '#93c5fd',
    color: '#1e3a8a',
    subColor: '#1e40af',
  },
  { 
    label: 'Submitted', 
    value: '10', 
    icon: <DoneIcon />, 
    // Mint Green Theme
    bgcolor: '#dcfce7',
    iconBg: '#86efac',
    color: '#14532d',
    subColor: '#166534',
  },
  { 
    label: 'Avg. Grade', 
    value: 'A-', 
    icon: <ScoreIcon />, 
    // Warm Peach Theme
    bgcolor: '#ffedd5',
    iconBg: '#fdba74',
    color: '#7c2d12',
    subColor: '#9a3412',
  },
  { 
    label: 'Pending', 
    value: '5', 
    icon: <PendingIcon />, 
    // Dusty Lavender Theme
    bgcolor: '#f3e8ff',
    iconBg: '#d8b4fe',
    color: '#581c87',
    subColor: '#6b21a8',
  },
];

type AssignStatus = 'graded' | 'submitted' | 'pending' | 'overdue' | 'locked';
const statusStyles: Record<AssignStatus, { bg: string; color: string; label: string }> = {
  graded:    { bg: 'rgba(16,185,129,0.08)', color: '#10b981', label: 'Graded' },
  submitted: { bg: 'rgba(59,130,246,0.08)', color: '#3b82f6', label: 'Submitted' },
  pending:   { bg: 'rgba(245,158,11,0.08)', color: '#f59e0b', label: 'Pending' },
  overdue:   { bg: 'rgba(239,68,68,0.08)', color: '#ef4444', label: 'Overdue' },
  locked:    { bg: 'rgba(156,163,175,0.08)', color: '#9ca3af', label: 'Locked' },
};

interface Assignment {
  id: string;
  title: string;
  course: string;
  type: string;
  dueDate: string;
  submittedDate?: string;
  grade?: string;
  score?: number;
  maxScore: number;
  feedback?: string;
  status: AssignStatus;
  attachments?: number;
}

const assignments: Assignment[] = [
  { id: '1', title: 'Build a Custom Hook Library', course: 'Advanced React Patterns', type: 'Project', dueDate: 'Feb 10', submittedDate: 'Feb 9', grade: 'A', score: 92, maxScore: 100, feedback: 'Excellent use of generics and proper TypeScript typing.', status: 'graded', attachments: 3 },
  { id: '2', title: 'Data Visualization Dashboard', course: 'Data Science Fundamentals', type: 'Project', dueDate: 'Feb 14', submittedDate: 'Feb 13', grade: 'A-', score: 88, maxScore: 100, feedback: 'Great work! Consider adding more interactivity.', status: 'graded', attachments: 5 },
  { id: '3', title: 'Network Vulnerability Report', course: 'Cybersecurity Essentials', type: 'Report', dueDate: 'Feb 15', submittedDate: 'Feb 15', status: 'submitted', maxScore: 100, attachments: 2 },
  { id: '4', title: 'State Management Essay', course: 'Advanced React Patterns', type: 'Essay', dueDate: 'Feb 8', submittedDate: 'Feb 7', grade: 'B+', score: 85, maxScore: 100, status: 'graded' },
  { id: '5', title: 'Responsive Landing Page', course: 'HTML & CSS Mastery', type: 'Project', dueDate: 'Dec 20', submittedDate: 'Dec 19', grade: 'A+', score: 98, maxScore: 100, feedback: 'Outstanding work! Perfect responsive implementation.', status: 'graded', attachments: 4 },
  { id: '6', title: 'Machine Learning Model Training', course: 'Data Science Fundamentals', type: 'Lab', dueDate: 'Feb 18', status: 'pending', maxScore: 100 },
  { id: '7', title: 'Component Architecture Diagram', course: 'Advanced React Patterns', type: 'Diagram', dueDate: 'Feb 20', status: 'pending', maxScore: 50 },
  { id: '8', title: 'SQL Injection Analysis', course: 'Cybersecurity Essentials', type: 'Report', dueDate: 'Feb 12', status: 'overdue', maxScore: 100 },
  { id: '9', title: 'User Research Case Study', course: 'UX/UI Design Principles', type: 'Case Study', dueDate: 'Feb 22', status: 'pending', maxScore: 100 },
  { id: '10', title: 'Threat Modeling Exercise', course: 'Cybersecurity Essentials', type: 'Exercise', dueDate: 'Mar 1', status: 'locked', maxScore: 100 },
];

/* ── Component ── */

const LearnerAssignmentsPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const tabLabels = ['All', 'Graded', 'Submitted', 'Pending', 'Overdue', 'Locked'];
  const tabFilter: Record<number, AssignStatus | null> = { 0: null, 1: 'graded', 2: 'submitted', 3: 'pending', 4: 'overdue', 5: 'locked' };

  const filtered = assignments.filter((a) => {
    const f = tabFilter[activeTab];
    return f ? a.status === f : true;
  });

  const gradeColor = (grade?: string) => {
    if (!grade) return 'text.primary';
    if (grade.startsWith('A')) return '#10b981';
    if (grade.startsWith('B')) return '#3b82f6';
    if (grade.startsWith('C')) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <Box className="learner-page" sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} />

      <Box component="main" sx={{ flexGrow: 1, p: { xs: 2, md: 3 }, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, overflowX: 'hidden', minWidth: 0, maxWidth: '100vw' }}>
        <Toolbar />

        <Box sx={{ mb: 4 }}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5, fontSize: { xs: '1.1rem', md: '1.3rem' } }}>Assignments</Typography>
          <Typography color="text.disabled" sx={{ fontSize: '0.85rem' }}>Manage your assignments, track grades, and submit work</Typography>
        </Box>

        {/* KPIs */}
        <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 4 }}>
          {kpis.map((k, i) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={k.label}>
              <Paper
                elevation={0}
                className={`stat-card ld-fade-in ld-fade-in-${i}`}
                sx={{
                  bgcolor: k.bgcolor,
                  borderRadius: '20px',
                  p: 3,
                  position: 'relative',
                  height: '100%',
                  minHeight: 160,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  textAlign: 'center',
                  transition: 'transform 0.2s',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                {/* Icon Badge */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    bgcolor: k.iconBg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    '& svg': { fontSize: 20 },
                  }}
                >
                  {k.icon}
                </Box>

                {/* Main Stat */}
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: k.color,
                    fontSize: { xs: '2rem', md: '2.5rem' },
                    lineHeight: 1,
                    mb: 1,
                  }}
                >
                  {k.value}
                </Typography>

                {/* Label */}
                <Typography
                  variant="body2"
                  sx={{
                    color: k.subColor,
                    fontWeight: 500,
                    fontSize: '0.875rem',
                    opacity: 0.8,
                  }}
                >
                  {k.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Assignments List */}
        <Paper elevation={0} sx={{ borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
          <Box sx={{ px: 3, pt: 2 }}>
            <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)} variant="scrollable" scrollButtons="auto" sx={{ minHeight: 40, '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.82rem', minHeight: 40, px: 1.5 }, '& .MuiTabs-indicator': { height: 2.5, borderRadius: 2 } }}>
              {tabLabels.map((l) => <Tab key={l} label={l} />)}
            </Tabs>
          </Box>

          <Box sx={{ p: 3 }}>
            {filtered.length === 0 ? (
              <Box sx={{ py: 6, textAlign: 'center' }}>
                <AssignIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                <Typography color="text.disabled">No assignments found</Typography>
              </Box>
            ) : (
              filtered.map((a) => {
                const st = statusStyles[a.status];
                return (
                  <Box key={a.id} sx={{ display: 'flex', alignItems: { xs: 'flex-start', sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: 2, p: 2, mb: 1, borderRadius: '12px', border: '1px solid rgba(0,0,0,0.04)', transition: 'all 0.2s', cursor: a.status !== 'locked' ? 'pointer' : 'default', opacity: a.status === 'locked' ? 0.6 : 1, '&:hover': a.status !== 'locked' ? { bgcolor: 'rgba(0,0,0,0.01)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' } : {} }}>
                    {/* Icon */}
                    <Box sx={{ width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, bgcolor: st.bg, color: st.color, '& svg': { fontSize: 22 } }}>
                      {a.status === 'graded' ? <DoneIcon /> : a.status === 'submitted' ? <FileIcon /> : a.status === 'locked' ? <LockIcon /> : a.status === 'overdue' ? <TimeIcon /> : <AssignIcon />}
                    </Box>

                    {/* Content */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25, flexWrap: 'wrap' }}>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.88rem' }}>{a.title}</Typography>
                        <Chip label={a.type} size="small" sx={{ height: 18, fontSize: '0.6rem', fontWeight: 600, borderRadius: '50px', bgcolor: 'rgba(0,0,0,0.04)' }} />
                        <Chip label={st.label} size="small" sx={{ height: 20, fontSize: '0.62rem', fontWeight: 600, borderRadius: '50px', bgcolor: st.bg, color: st.color }} />
                      </Box>
                      <Typography color="text.disabled" sx={{ fontSize: '0.78rem', mb: 0.5 }}>{a.course}</Typography>
                      <Box sx={{ display: 'flex', gap: 2, color: 'text.disabled', fontSize: '0.72rem', flexWrap: 'wrap' }}>
                        <span>📅 Due: {a.dueDate}</span>
                        {a.submittedDate && <span>✅ Submitted: {a.submittedDate}</span>}
                        {a.attachments && <span>📎 {a.attachments} files</span>}
                        <span>📊 Max: {a.maxScore} pts</span>
                      </Box>
                      {a.feedback && (
                        <Typography sx={{ mt: 0.75, fontSize: '0.75rem', color: 'text.secondary', fontStyle: 'italic', bgcolor: 'rgba(0,0,0,0.02)', p: 1, borderRadius: '8px' }}>
                          💬 "{a.feedback}"
                        </Typography>
                      )}
                    </Box>

                    {/* Grade + Action */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0 }}>
                      {a.grade && (
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography sx={{ fontWeight: 700, fontSize: '1.3rem', color: gradeColor(a.grade) }}>{a.grade}</Typography>
                          <Typography color="text.disabled" sx={{ fontSize: '0.65rem' }}>{a.score}/{a.maxScore}</Typography>
                        </Box>
                      )}
                      {a.status === 'graded' && (
                        <Button size="small" variant="outlined" startIcon={<ViewIcon />} sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.72rem', borderRadius: '50px', borderColor: 'rgba(0,0,0,0.08)', color: 'text.secondary' }}>View</Button>
                      )}
                      {a.status === 'pending' && (
                        <Button size="small" variant="contained" startIcon={<UploadIcon />} sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.72rem', borderRadius: '50px', boxShadow: 'none', px: 2, color: 'white', '&:hover': { boxShadow: '0 4px 12px rgba(249,115,22,0.3)' } }}>Submit</Button>
                      )}
                      {a.status === 'overdue' && (
                        <Button size="small" variant="contained" color="error" startIcon={<UploadIcon />} sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.72rem', borderRadius: '50px', boxShadow: 'none', px: 2 }}>Late Submit</Button>
                      )}
                    </Box>
                  </Box>
                );
              })
            )}
          </Box>

          {/* Grade Summary */}
          <Box sx={{ px: 3, py: 2, borderTop: '1px solid rgba(0,0,0,0.04)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {['A', 'B', 'C'].map((g) => {
                const count = assignments.filter((a) => a.grade?.startsWith(g)).length;
                return (
                  <Box key={g} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: gradeColor(g) }} />
                    <Typography sx={{ fontSize: '0.72rem', color: 'text.disabled' }}>{g}: {count}</Typography>
                  </Box>
                );
              })}
            </Box>
            <Typography color="text.disabled" sx={{ fontSize: '0.78rem' }}>
              {assignments.filter((a) => a.status === 'graded').length} graded · {assignments.filter((a) => a.status === 'pending').length} pending
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default LearnerAssignmentsPage;
