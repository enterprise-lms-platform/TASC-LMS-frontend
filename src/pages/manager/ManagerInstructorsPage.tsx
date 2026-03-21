import React, { useState, useMemo } from 'react';
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
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  Person as PersonIcon,
  Search as SearchIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  MenuBook as CoursesIcon,
  People as StudentsIcon,
  Email as EmailIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import Sidebar, { DRAWER_WIDTH } from '../../components/manager/Sidebar';
import TopBar from '../../components/manager/TopBar';
import { usersApi } from '../../services/users.services';

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

const getInitials = (name: string): string => {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
};

const renderStars = (rating: number) => {
  const stars: React.ReactNode[] = [];
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
  const [profileId, setProfileId] = useState<number | null>(null);

  const { data: instructorsData, isLoading } = useQuery({
    queryKey: ['instructors', search, statusFilter],
    queryFn: () => usersApi.getInstructors({ 
      search: search || undefined,
      is_active: statusFilter === 'Active' ? true : statusFilter === 'Inactive' ? false : undefined,
      page_size: 100,
    }).then(r => r.data),
  });

  const instructors = instructorsData?.results ?? (Array.isArray(instructorsData) ? instructorsData : []);

  const { data: profileDataRaw, isLoading: profileLoading } = useQuery({
    queryKey: ['user', profileId],
    queryFn: () => usersApi.getById(profileId!).then(r => r.data),
    enabled: !!profileId,
  });
  const profileData = profileDataRaw as any;

  const filteredInstructors = useMemo(() => {
    return instructors.filter((inst: any) => {
      const matchSearch = (inst.name || inst.email || '').toLowerCase().includes(search.toLowerCase()) || 
        inst.email.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === 'All' || 
        (statusFilter === 'Active' ? inst.is_active : !inst.is_active);
      return matchSearch && matchStatus;
    });
  }, [instructors, search, statusFilter]);

  const kpis = useMemo(() => {
    const total = instructors.length;
    const active = instructors.filter((i: any) => i.is_active).length;
    return [
      { label: 'Total Instructors', value: total.toString(), bgcolor: '#fff3e0', color: '#7c2d12' },
      { label: 'Active', value: active.toString(), bgcolor: '#dcfce7', color: '#14532d' },
      { label: 'Avg Rating', value: '4.5', bgcolor: '#fef9c3', color: '#713f12' },
      { label: 'Total Courses', value: instructors.reduce((sum: number, i: any) => sum + (i.courses_count || 0), 0).toString(), bgcolor: '#eff6ff', color: '#1e3a5f' },
    ];
  }, [instructors]);

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.50', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          minWidth: 0,
          maxWidth: '100vw',
        }}
      >
        <Toolbar />

        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400 }}>
          {isLoading && <LinearProgress sx={{ mb: 2 }} />}
          
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
            {filteredInstructors.map((instructor: any) => (
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
                    src={instructor.avatar || instructor.google_picture}
                  >
                    {getInitials(instructor.name || instructor.email)}
                  </Avatar>

                  <Typography variant="h6" fontWeight={700} sx={{ mb: 0.25 }}>{instructor.name || instructor.email.split('@')[0]}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>{instructor.email}</Typography>
                  <Chip
                    label={instructor.specialization || instructor.bio?.slice(0, 30) || 'Instructor'}
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
                        <Typography variant="h6" fontWeight={700}>{instructor.courses_count || 0}</Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">Courses</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mb: 0.25 }}>
                        <StudentsIcon sx={{ fontSize: 16, color: '#3b82f6' }} />
                        <Typography variant="h6" fontWeight={700}>{(instructor.students_count || 0).toLocaleString()}</Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">Students</Typography>
                    </Box>
                  </Box>

                  {/* Rating */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
                    {renderStars(instructor.rating || 4.5)}
                    <Typography variant="body2" fontWeight={600} sx={{ ml: 0.5 }}>{instructor.rating || 4.5}</Typography>
                  </Box>

                  {/* Status + Button */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', justifyContent: 'center' }}>
                    <Chip
                      label={instructor.is_active ? 'Active' : 'Inactive'}
                      size="small"
                      color={instructor.is_active ? 'success' : 'default'}
                      sx={{ fontWeight: 600 }}
                    />
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => setProfileId(instructor.id)}
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

      {/* ─── Instructor Profile Dialog ──────────────────────────── */}
      <Dialog
        open={!!profileId}
        onClose={() => setProfileId(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: '16px' } }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 700 }}>
          Instructor Profile
          <Button onClick={() => setProfileId(null)} sx={{ minWidth: 'auto', color: 'text.secondary' }}>
            <CloseIcon />
          </Button>
        </DialogTitle>
        <DialogContent>
          {profileLoading ? (
            <Box sx={{ py: 6, textAlign: 'center' }}>
              <CircularProgress size={36} sx={{ color: '#ffa424' }} />
            </Box>
          ) : profileData ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, pt: 1 }}>
              <Avatar
                sx={{
                  width: 88,
                  height: 88,
                  fontSize: '2rem',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #ffa424, #f97316)',
                }}
                src={profileData.avatar || profileData.google_picture}
              >
                {getInitials(profileData.name || profileData.email)}
              </Avatar>

              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" fontWeight={700}>
                  {profileData.name || profileData.email.split('@')[0]}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, mt: 0.5 }}>
                  <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">{profileData.email}</Typography>
                </Box>
              </Box>

              <Chip
                label={profileData.is_active ? 'Active' : 'Inactive'}
                size="small"
                color={profileData.is_active ? 'success' : 'default'}
                sx={{ fontWeight: 600 }}
              />

              <Divider sx={{ width: '100%', my: 1 }} />

              <Grid container spacing={2} sx={{ width: '100%' }}>
                <Grid size={{ xs: 6 }}>
                  <Paper elevation={0} sx={{ p: 2, borderRadius: '12px', bgcolor: '#eff6ff', textAlign: 'center' }}>
                    <Typography variant="h5" fontWeight={700} color="#1e3a5f">{profileData.courses_count || 0}</Typography>
                    <Typography variant="caption" color="text.secondary">Courses</Typography>
                  </Paper>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <Paper elevation={0} sx={{ p: 2, borderRadius: '12px', bgcolor: '#dcfce7', textAlign: 'center' }}>
                    <Typography variant="h5" fontWeight={700} color="#14532d">{profileData.students_count || 0}</Typography>
                    <Typography variant="caption" color="text.secondary">Students</Typography>
                  </Paper>
                </Grid>
              </Grid>

              {profileData.bio && (
                <Box sx={{ width: '100%', mt: 1 }}>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.5 }}>Bio</Typography>
                  <Typography variant="body2" color="text.secondary">{profileData.bio}</Typography>
                </Box>
              )}

              {profileData.phone_number && (
                <Box sx={{ width: '100%' }}>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.5 }}>Phone</Typography>
                  <Typography variant="body2" color="text.secondary">{profileData.phone_number}</Typography>
                </Box>
              )}

              {profileData.date_joined && (
                <Box sx={{ width: '100%' }}>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.5 }}>Joined</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {new Date(profileData.date_joined).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </Typography>
                </Box>
              )}
            </Box>
          ) : (
            <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
              Could not load instructor profile.
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button
            onClick={() => setProfileId(null)}
            sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ManagerInstructorsPage;
