import React, { useState } from 'react';
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Paper,
  Grid,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Chip,
  Avatar,
} from '@mui/material';
import {
  Person as PersonIcon,
  Search as SearchIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  MenuBook as CoursesIcon,
  People as StudentsIcon,
} from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../../components/manager/Sidebar';
import TopBar from '../../components/manager/TopBar';

// ─── Styles ────────────────────────────────────────────────

const cardSx = {
  borderRadius: '1rem',
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
};

const headerSx = {
  p: 2,
  px: 3,
  bgcolor: 'grey.50',
  borderBottom: 1,
  borderColor: 'divider',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap' as const,
  gap: 2,
};

// ─── Mock Data ─────────────────────────────────────────────

const kpis = [
  { label: 'Total Instructors', value: '24', bgcolor: '#fff3e0', color: '#7c2d12' },
  { label: 'Active', value: '21', bgcolor: '#dcfce7', color: '#14532d' },
  { label: 'Avg Rating', value: '4.7', bgcolor: '#fef9c3', color: '#713f12' },
  { label: 'Total Courses', value: '156', bgcolor: '#eff6ff', color: '#1e3a5f' },
];

interface Instructor {
  id: number;
  name: string;
  initials: string;
  email: string;
  specialization: string;
  courses: number;
  rating: number;
  totalStudents: number;
  status: 'Active' | 'Inactive';
}

const mockInstructors: Instructor[] = [
  { id: 1, name: 'Dr. Sarah Chen', initials: 'SC', email: 'sarah.chen@acmecorp.com', specialization: 'Machine Learning & AI', courses: 8, rating: 4.9, totalStudents: 1247, status: 'Active' },
  { id: 2, name: 'James Wilson', initials: 'JW', email: 'james.wilson@acmecorp.com', specialization: 'Full-Stack Development', courses: 6, rating: 4.7, totalStudents: 892, status: 'Active' },
  { id: 3, name: 'Maria Garcia', initials: 'MG', email: 'maria.garcia@acmecorp.com', specialization: 'Cloud Architecture', courses: 5, rating: 4.8, totalStudents: 654, status: 'Active' },
  { id: 4, name: 'Alex Kim', initials: 'AK', email: 'alex.kim@acmecorp.com', specialization: 'TypeScript & Node.js', courses: 7, rating: 4.5, totalStudents: 1089, status: 'Active' },
  { id: 5, name: 'Priya Patel', initials: 'PP', email: 'priya.patel@acmecorp.com', specialization: 'DevOps & CI/CD', courses: 4, rating: 4.6, totalStudents: 478, status: 'Active' },
  { id: 6, name: 'Robert Njoroge', initials: 'RN', email: 'robert.njoroge@acmecorp.com', specialization: 'Cybersecurity', courses: 3, rating: 4.2, totalStudents: 312, status: 'Inactive' },
];

const renderStars = (rating: number) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(<StarIcon key={i} sx={{ fontSize: 16, color: '#fbbf24' }} />);
    } else {
      stars.push(<StarBorderIcon key={i} sx={{ fontSize: 16, color: '#d1d5db' }} />);
    }
  }
  return stars;
};

// ─── Component ─────────────────────────────────────────────

const ManagerInstructorsPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredInstructors = mockInstructors.filter((inst) => {
    const matchSearch = inst.name.toLowerCase().includes(search.toLowerCase()) || inst.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || inst.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.50', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          minWidth: 0,
          maxWidth: '100vw',
        }}
      >
        <Toolbar />

        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: 'auto' }}>
          {/* Page Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #ffa424, #f97316)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <PersonIcon />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700}>Instructors</Typography>
              <Typography variant="body2" color="text.secondary">View and manage organization instructors</Typography>
            </Box>
          </Box>

          {/* KPI Row */}
          <Grid container spacing={2} sx={{ my: 3 }}>
            {kpis.map((kpi) => (
              <Grid size={{ xs: 6, sm: 3 }} key={kpi.label}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: '16px',
                    bgcolor: kpi.bgcolor,
                    textAlign: 'center',
                    transition: 'transform 0.2s',
                    '&:hover': { transform: 'translateY(-2px)' },
                  }}
                >
                  <Typography variant="h4" fontWeight={700} sx={{ color: kpi.color }}>{kpi.value}</Typography>
                  <Typography variant="body2" sx={{ color: kpi.color, opacity: 0.8, fontWeight: 500 }}>{kpi.label}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Toolbar */}
          <Paper elevation={0} sx={{ ...cardSx, mb: 3 }}>
            <Box sx={headerSx}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', flex: 1 }}>
                <TextField
                  size="small"
                  placeholder="Search instructors..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  sx={{ minWidth: 240 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'text.disabled' }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <FormControl size="small" sx={{ minWidth: 140 }}>
                  <InputLabel>Status</InputLabel>
                  <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
                    <MenuItem value="All">All</MenuItem>
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </Paper>

          {/* Instructor Cards Grid */}
          <Grid container spacing={3}>
            {filteredInstructors.map((instructor) => (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={instructor.id}>
                <Paper
                  elevation={0}
                  sx={{
                    ...cardSx,
                    p: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    transition: 'transform 0.2s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1), 0 12px 28px rgba(0,0,0,0.08)',
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 72,
                      height: 72,
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      background: 'linear-gradient(135deg, #ffa424, #f97316)',
                      mb: 2,
                    }}
                  >
                    {instructor.initials}
                  </Avatar>

                  <Typography variant="h6" fontWeight={700} sx={{ mb: 0.25 }}>{instructor.name}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>{instructor.email}</Typography>
                  <Chip
                    label={instructor.specialization}
                    size="small"
                    sx={{
                      bgcolor: '#fff3e0',
                      color: '#9a3412',
                      fontWeight: 500,
                      fontSize: '0.7rem',
                      mb: 2,
                    }}
                  />

                  {/* Stats Row */}
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 2, width: '100%' }}>
                    <Box sx={{ textAlign: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 0.25 }}>
                        <CoursesIcon sx={{ fontSize: 16, color: '#6366f1' }} />
                        <Typography variant="h6" fontWeight={700}>{instructor.courses}</Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">Courses</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 0.25 }}>
                        <StudentsIcon sx={{ fontSize: 16, color: '#3b82f6' }} />
                        <Typography variant="h6" fontWeight={700}>{instructor.totalStudents.toLocaleString()}</Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">Students</Typography>
                    </Box>
                  </Box>

                  {/* Rating */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
                    {renderStars(instructor.rating)}
                    <Typography variant="body2" fontWeight={600} sx={{ ml: 0.5 }}>{instructor.rating}</Typography>
                  </Box>

                  {/* Status + Button */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', justifyContent: 'center' }}>
                    <Chip
                      label={instructor.status}
                      size="small"
                      color={instructor.status === 'Active' ? 'success' : 'default'}
                      sx={{ fontWeight: 600 }}
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{
                        textTransform: 'none',
                        borderColor: '#ffa424',
                        color: '#f97316',
                        fontWeight: 600,
                        borderRadius: '8px',
                        '&:hover': { bgcolor: '#fff7ed', borderColor: '#f97316' },
                      }}
                    >
                      View Profile
                    </Button>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default ManagerInstructorsPage;
