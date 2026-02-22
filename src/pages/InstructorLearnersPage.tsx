import React, { useState } from 'react';
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Paper,
  Grid,
  IconButton,
  AppBar,
  Button,
  Chip,
  Avatar,
  TextField,
  InputAdornment,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
} from '@mui/material';
import {
  People as PeopleIcon,
  Menu as MenuIcon,
  ArrowBack as BackIcon,
  Search as SearchIcon,
  FileDownload as ExportIcon,
  Email as EmailIcon,
  TrendingUp as TrendingUpIcon,
  School as CourseIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Sidebar, { DRAWER_WIDTH } from '../components/instructor/Sidebar';

interface Learner {
  id: string;
  name: string;
  initials: string;
  email: string;
  courses: number;
  avgProgress: number;
  avgScore: number;
  lastActive: string;
  status: 'active' | 'inactive' | 'at-risk';
  enrolledDate: string;
}

const sampleLearners: Learner[] = [
  { id: '1', name: 'Sarah Chen', initials: 'SC', email: 'sarah.chen@email.com', courses: 4, avgProgress: 92, avgScore: 96, lastActive: '2 hours ago', status: 'active', enrolledDate: 'Jan 5, 2026' },
  { id: '2', name: 'James Wilson', initials: 'JW', email: 'james.w@email.com', courses: 3, avgProgress: 85, avgScore: 94, lastActive: '1 day ago', status: 'active', enrolledDate: 'Jan 12, 2026' },
  { id: '3', name: 'Maria Garcia', initials: 'MG', email: 'maria.g@email.com', courses: 5, avgProgress: 78, avgScore: 92, lastActive: '3 hours ago', status: 'active', enrolledDate: 'Dec 20, 2025' },
  { id: '4', name: 'Alex Kim', initials: 'AK', email: 'alex.kim@email.com', courses: 3, avgProgress: 65, avgScore: 88, lastActive: '5 days ago', status: 'at-risk', enrolledDate: 'Jan 18, 2026' },
  { id: '5', name: 'Priya Patel', initials: 'PP', email: 'priya.p@email.com', courses: 4, avgProgress: 88, avgScore: 89, lastActive: '1 hour ago', status: 'active', enrolledDate: 'Jan 8, 2026' },
  { id: '6', name: 'Tom Brown', initials: 'TB', email: 'tom.b@email.com', courses: 2, avgProgress: 45, avgScore: 72, lastActive: '2 weeks ago', status: 'inactive', enrolledDate: 'Feb 1, 2026' },
  { id: '7', name: 'Lisa Wang', initials: 'LW', email: 'lisa.w@email.com', courses: 3, avgProgress: 95, avgScore: 95, lastActive: '30 min ago', status: 'active', enrolledDate: 'Jan 3, 2026' },
  { id: '8', name: 'Daniel Lee', initials: 'DL', email: 'daniel.l@email.com', courses: 2, avgProgress: 32, avgScore: 68, lastActive: '3 weeks ago', status: 'inactive', enrolledDate: 'Feb 5, 2026' },
  { id: '9', name: 'Emma Davis', initials: 'ED', email: 'emma.d@email.com', courses: 4, avgProgress: 72, avgScore: 85, lastActive: '2 days ago', status: 'at-risk', enrolledDate: 'Jan 15, 2026' },
  { id: '10', name: 'Ryan Johnson', initials: 'RJ', email: 'ryan.j@email.com', courses: 3, avgProgress: 81, avgScore: 90, lastActive: '4 hours ago', status: 'active', enrolledDate: 'Jan 22, 2026' },
];

const statusStyles: Record<string, { bg: string; color: string; label: string }> = {
  active: { bg: '#d1fae5', color: '#059669', label: 'Active' },
  'at-risk': { bg: '#fef3c7', color: '#d97706', label: 'At Risk' },
  inactive: { bg: '#fee2e2', color: '#dc2626', label: 'Inactive' },
};

const InstructorLearnersPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState(0);

  const statusFilter = tab === 0 ? null : tab === 1 ? 'active' : tab === 2 ? 'at-risk' : 'inactive';
  const filtered = sampleLearners.filter((l) => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const kpis = [
    { label: 'Total Learners', value: sampleLearners.length, icon: <PeopleIcon />, bgcolor: '#dcfce7', iconBg: '#4ade80', color: '#14532d', subColor: '#166534' },
    { label: 'Active', value: sampleLearners.filter((l) => l.status === 'active').length, icon: <TrendingUpIcon />, bgcolor: '#f4f4f5', iconBg: '#a1a1aa', color: '#27272a', subColor: '#3f3f46' },
    { label: 'At Risk', value: sampleLearners.filter((l) => l.status === 'at-risk').length, icon: <TrendingUpIcon />, bgcolor: '#fff3e0', iconBg: '#ffa424', color: '#7c2d12', subColor: '#9a3412' },
    { label: 'Avg. Score', value: `${Math.round(sampleLearners.reduce((s, l) => s + l.avgScore, 0) / sampleLearners.length)}%`, icon: <CourseIcon />, bgcolor: '#f0fdf4', iconBg: '#86efac', color: '#14532d', subColor: '#166534' },
  ];

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.100', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <AppBar
        position="fixed"
        elevation={0}
        sx={{ width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, ml: { md: `${DRAWER_WIDTH}px` }, bgcolor: 'white', borderBottom: 1, borderColor: 'divider' }}
      >
        <Toolbar sx={{ minHeight: '72px !important', gap: 2 }}>
          <IconButton onClick={() => setMobileOpen(!mobileOpen)} sx={{ display: { md: 'none' }, color: 'text.secondary' }}>
            <MenuIcon />
          </IconButton>
          <Button startIcon={<BackIcon />} onClick={() => navigate('/instructor')} sx={{ color: 'text.secondary', textTransform: 'none', fontWeight: 500 }}>
            Back
          </Button>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={700} color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PeopleIcon sx={{ color: 'primary.main' }} />
              My Learners
            </Typography>
          </Box>
          <Button startIcon={<ExportIcon />} variant="outlined" sx={{ textTransform: 'none', fontWeight: 500, borderColor: 'divider', color: 'text.secondary' }}>
            Export
          </Button>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, minHeight: '100vh' }}>
        <Toolbar sx={{ minHeight: '72px !important' }} />

        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: 'auto' }}>
          {/* KPIs */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {kpis.map((kpi) => (
              <Grid size={{ xs: 6, md: 3 }} key={kpi.label}>
                <Paper
                  elevation={0}
                  sx={{
                    bgcolor: kpi.bgcolor,
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
                    '&:hover': { transform: 'translateY(-4px)' },
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: kpi.iconBg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      '& svg': { fontSize: 20 },
                    }}
                  >
                    {kpi.icon}
                  </Box>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: kpi.color, fontSize: { xs: '2rem', md: '2.5rem' }, lineHeight: 1, mb: 1 }}>
                    {kpi.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: kpi.subColor, fontWeight: 500, fontSize: '0.875rem', opacity: 0.8 }}>
                    {kpi.label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Table */}
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
            <Box sx={{ p: 2, px: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <TextField
                size="small"
                placeholder="Search learners..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 20, color: 'text.disabled' }} /></InputAdornment> }}
                sx={{ minWidth: 250 }}
              />
              <Box sx={{ flex: 1 }} />
              <Typography variant="body2" color="text.secondary">{filtered.length} learners</Typography>
            </Box>

            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 2, borderTop: 1, borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
              <Tab label={`All (${sampleLearners.length})`} sx={{ textTransform: 'none', fontWeight: 600 }} />
              <Tab label={`Active (${sampleLearners.filter((l) => l.status === 'active').length})`} sx={{ textTransform: 'none', fontWeight: 600 }} />
              <Tab label={`At Risk (${sampleLearners.filter((l) => l.status === 'at-risk').length})`} sx={{ textTransform: 'none', fontWeight: 600 }} />
              <Tab label={`Inactive (${sampleLearners.filter((l) => l.status === 'inactive').length})`} sx={{ textTransform: 'none', fontWeight: 600 }} />
            </Tabs>

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell><Typography variant="caption" fontWeight={600} color="text.secondary">Learner</Typography></TableCell>
                    <TableCell align="center"><Typography variant="caption" fontWeight={600} color="text.secondary">Courses</Typography></TableCell>
                    <TableCell><Typography variant="caption" fontWeight={600} color="text.secondary">Progress</Typography></TableCell>
                    <TableCell align="center"><Typography variant="caption" fontWeight={600} color="text.secondary">Avg Score</Typography></TableCell>
                    <TableCell><Typography variant="caption" fontWeight={600} color="text.secondary">Last Active</Typography></TableCell>
                    <TableCell align="center"><Typography variant="caption" fontWeight={600} color="text.secondary">Status</Typography></TableCell>
                    <TableCell align="right"><Typography variant="caption" fontWeight={600} color="text.secondary">Actions</Typography></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((learner) => (
                    <TableRow key={learner.id} hover sx={{ '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' } }}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ width: 32, height: 32, fontSize: '0.75rem', bgcolor: 'primary.main' }}>{learner.initials}</Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>{learner.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{learner.email}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" fontWeight={600}>{learner.courses}</Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, minWidth: 120 }}>
                          <LinearProgress variant="determinate" value={learner.avgProgress} sx={{ flex: 1, height: 6, borderRadius: 1, bgcolor: 'grey.100', '& .MuiLinearProgress-bar': { bgcolor: learner.avgProgress > 75 ? '#10b981' : learner.avgProgress > 50 ? '#f59e0b' : '#ef4444' } }} />
                          <Typography variant="caption" fontWeight={600} sx={{ minWidth: 30 }}>{learner.avgProgress}%</Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="center">
                        <Typography variant="body2" fontWeight={600} sx={{ color: learner.avgScore >= 90 ? '#059669' : learner.avgScore >= 75 ? '#d97706' : '#dc2626' }}>
                          {learner.avgScore}%
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="caption" color="text.secondary">{learner.lastActive}</Typography>
                      </TableCell>
                      <TableCell align="center">
                        <Chip
                          label={statusStyles[learner.status].label}
                          size="small"
                          sx={{ height: 22, fontSize: '0.7rem', fontWeight: 600, bgcolor: statusStyles[learner.status].bg, color: statusStyles[learner.status].color }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" title="Send email"><EmailIcon sx={{ fontSize: 18 }} /></IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default InstructorLearnersPage;
