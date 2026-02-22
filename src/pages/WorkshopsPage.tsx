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
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  Groups as WorkshopsIcon,
  Menu as MenuIcon,
  ArrowBack as BackIcon,
  Search as SearchIcon,
  Add as AddIcon,
  MoreVert as MoreIcon,
  LocationOn as LocationIcon,
  CalendarToday as DateIcon,
  People as PeopleIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  CheckCircle as AttendanceIcon,
  Star as GradeIcon,
  CardMembership as CertIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Sidebar, { DRAWER_WIDTH } from '../components/instructor/Sidebar';

export interface Workshop {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  participants: number;
  maxParticipants: number;
  status: 'upcoming' | 'ongoing' | 'completed';
  gradingType: 'attendance' | 'pass_fail' | 'score';
  category: string;
}

const sampleWorkshops: Workshop[] = [
  { id: 'w1', title: 'Leadership Essentials Bootcamp', description: 'Intensive 3-day workshop on leadership fundamentals', location: 'TASC Training Center, Nairobi', startDate: '2026-03-05', endDate: '2026-03-07', participants: 28, maxParticipants: 35, status: 'upcoming', gradingType: 'pass_fail', category: 'Leadership' },
  { id: 'w2', title: 'Sales Mastery Workshop', description: 'Advanced selling techniques and negotiation skills', location: 'Hilton Hotel, Conference Room B', startDate: '2026-02-20', endDate: '2026-02-22', participants: 22, maxParticipants: 30, status: 'ongoing', gradingType: 'score', category: 'Sales' },
  { id: 'w3', title: 'Digital Marketing Fundamentals', description: 'Hands-on workshop covering SEO, SEM, and social media marketing', location: 'TASC Training Center, Nairobi', startDate: '2026-03-15', endDate: '2026-03-16', participants: 15, maxParticipants: 25, status: 'upcoming', gradingType: 'score', category: 'Marketing' },
  { id: 'w4', title: 'First Aid & Safety Training', description: 'Mandatory safety training for all staff members', location: 'Company HQ, Boardroom', startDate: '2026-02-10', endDate: '2026-02-10', participants: 40, maxParticipants: 40, status: 'completed', gradingType: 'attendance', category: 'Safety' },
  { id: 'w5', title: 'Team Building & Communication', description: 'Interactive team building exercises and communication skills', location: 'Outdoor Venue, Naivasha', startDate: '2026-02-15', endDate: '2026-02-16', participants: 35, maxParticipants: 40, status: 'completed', gradingType: 'pass_fail', category: 'HR' },
  { id: 'w6', title: 'Project Management with Agile', description: 'Learn Scrum, Kanban, and agile project management', location: 'TASC Training Center, Nairobi', startDate: '2026-04-01', endDate: '2026-04-03', participants: 8, maxParticipants: 30, status: 'upcoming', gradingType: 'score', category: 'Management' },
];

const statusStyles: Record<string, { bg: string; color: string }> = {
  upcoming: { bg: '#dbeafe', color: '#2563eb' },
  ongoing: { bg: '#fef3c7', color: '#d97706' },
  completed: { bg: '#d1fae5', color: '#059669' },
};

const gradingLabels: Record<string, string> = {
  attendance: 'Attendance Only',
  pass_fail: 'Pass / Fail',
  score: 'Score (0-100)',
};

const WorkshopsPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState(0);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [menuWorkshopId, setMenuWorkshopId] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [workshops, setWorkshops] = useState(sampleWorkshops);

  // Create form state
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newStartDate, setNewStartDate] = useState('');
  const [newEndDate, setNewEndDate] = useState('');
  const [newGradingType, setNewGradingType] = useState<'attendance' | 'pass_fail' | 'score'>('attendance');

  const statusFilter = tab === 0 ? null : tab === 1 ? 'upcoming' : tab === 2 ? 'ongoing' : 'completed';
  const filtered = workshops.filter((w) => {
    const matchSearch = w.title.toLowerCase().includes(search.toLowerCase()) || w.location.toLowerCase().includes(search.toLowerCase()) || w.category.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || w.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleMenuOpen = (e: React.MouseEvent<HTMLElement>, workshopId: string) => {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
    setMenuWorkshopId(workshopId);
  };

  const handleCreate = () => {
    if (!newTitle.trim() || !newLocation.trim() || !newStartDate || !newEndDate) return;
    const newWorkshop: Workshop = {
      id: `w-${Date.now()}`,
      title: newTitle,
      description: newDescription,
      location: newLocation,
      startDate: newStartDate,
      endDate: newEndDate,
      participants: 0,
      maxParticipants: 30,
      status: 'upcoming',
      gradingType: newGradingType,
      category: 'General',
    };
    setWorkshops([newWorkshop, ...workshops]);
    setCreateOpen(false);
    setNewTitle('');
    setNewDescription('');
    setNewLocation('');
    setNewStartDate('');
    setNewEndDate('');
    setNewGradingType('attendance');
  };

  const formatDateRange = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    if (start === end) return s.toLocaleDateString('en-US', { ...opts, year: 'numeric' });
    return `${s.toLocaleDateString('en-US', opts)} - ${e.toLocaleDateString('en-US', { ...opts, year: 'numeric' })}`;
  };

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
              <WorkshopsIcon sx={{ color: 'primary.main' }} />
              Workshops
            </Typography>
            <Typography variant="body2" color="text.secondary">Manage in-person training workshops</Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setCreateOpen(true)}
            sx={{ textTransform: 'none', fontWeight: 600, bgcolor: 'primary.main' }}
          >
            Create Workshop
          </Button>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, minHeight: '100vh' }}>
        <Toolbar sx={{ minHeight: '72px !important' }} />

        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: 'auto' }}>
          {/* KPIs */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[
              { label: 'Total Workshops', value: workshops.length, icon: <WorkshopsIcon />, bgcolor: '#dcfce7', iconBg: '#4ade80', color: '#14532d', subColor: '#166534' },
              { label: 'Upcoming', value: workshops.filter((w) => w.status === 'upcoming').length, icon: <DateIcon />, bgcolor: '#f4f4f5', iconBg: '#a1a1aa', color: '#27272a', subColor: '#3f3f46' },
              { label: 'Ongoing', value: workshops.filter((w) => w.status === 'ongoing').length, icon: <EditIcon />, bgcolor: '#fff3e0', iconBg: '#ffa424', color: '#7c2d12', subColor: '#9a3412' },
              { label: 'Total Participants', value: workshops.reduce((s, w) => s + w.participants, 0), icon: <PeopleIcon />, bgcolor: '#f0fdf4', iconBg: '#86efac', color: '#14532d', subColor: '#166534' },
            ].map((kpi) => (
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

          {/* Filters */}
          <Paper
            elevation={0}
            sx={{
              borderRadius: '1rem',
              overflow: 'hidden',
              mb: 3,
              boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
              transition: 'box-shadow 0.3s',
              '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
            }}
          >
            <Box sx={{ p: 2, px: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
              <TextField
                size="small"
                placeholder="Search workshops..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 20, color: 'text.disabled' }} /></InputAdornment> }}
                sx={{ minWidth: 280 }}
              />
              <Box sx={{ flex: 1 }} />
              <Typography variant="body2" color="text.secondary">{filtered.length} workshops</Typography>
            </Box>
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 2, borderTop: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
              <Tab label={`All (${workshops.length})`} sx={{ textTransform: 'none', fontWeight: 600 }} />
              <Tab label={`Upcoming (${workshops.filter((w) => w.status === 'upcoming').length})`} sx={{ textTransform: 'none', fontWeight: 600 }} />
              <Tab label={`Ongoing (${workshops.filter((w) => w.status === 'ongoing').length})`} sx={{ textTransform: 'none', fontWeight: 600 }} />
              <Tab label={`Completed (${workshops.filter((w) => w.status === 'completed').length})`} sx={{ textTransform: 'none', fontWeight: 600 }} />
            </Tabs>
          </Paper>

          {/* Workshop Cards */}
          <Grid container spacing={2}>
            {filtered.map((workshop) => (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={workshop.id}>
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: '1rem',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
                    transition: 'box-shadow 0.3s, transform 0.2s',
                    '&:hover': {
                      boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)',
                      transform: 'translateY(-2px)',
                    },
                  }}
                  onClick={() => navigate(`/instructor/workshops/${workshop.id}`)}
                >
                  {/* Top: workshop name in status-colored header (no border) */}
                  <Box
                    sx={{
                      px: 2.5,
                      pt: 2.5,
                      pb: 2,
                      bgcolor: statusStyles[workshop.status].bg,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: 1,
                    }}
                  >
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="body1"
                        fontWeight={700}
                        sx={{
                          lineHeight: 1.3,
                          mb: 0.5,
                          color: statusStyles[workshop.status].color,
                        }}
                      >
                        {workshop.title}
                      </Typography>
                      <Chip
                        label={workshop.category}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: '0.65rem',
                          fontWeight: 600,
                          bgcolor: 'rgba(255,255,255,0.7)',
                          color: 'text.secondary',
                          borderRadius: '6px',
                        }}
                      />
                    </Box>
                    <IconButton size="small" onClick={(e) => handleMenuOpen(e, workshop.id)} sx={{ color: statusStyles[workshop.status].color, flexShrink: 0 }}>
                      <MoreIcon fontSize="small" />
                    </IconButton>
                  </Box>

                  <Box sx={{ p: 2.5, pt: 2 }}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.45 }}
                    >
                      {workshop.description}
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, bgcolor: 'grey.50', borderRadius: '0.75rem', p: 1.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.8rem', color: 'text.secondary' }}>
                        <LocationIcon sx={{ fontSize: 16, color: 'primary.main', opacity: 0.8 }} />
                        <Typography variant="caption" noWrap sx={{ flex: 1 }}>{workshop.location}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.8rem', color: 'text.secondary' }}>
                        <DateIcon sx={{ fontSize: 16, color: 'primary.main', opacity: 0.8 }} />
                        <Typography variant="caption">{formatDateRange(workshop.startDate, workshop.endDate)}</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, fontSize: '0.8rem', color: 'text.secondary' }}>
                        <PeopleIcon sx={{ fontSize: 16, color: 'primary.main', opacity: 0.8 }} />
                        <Typography variant="caption">{workshop.participants} / {workshop.maxParticipants} participants</Typography>
                      </Box>
                    </Box>

                    <Box sx={{ mt: 2, pt: 1.5, borderTop: 1, borderColor: 'divider', display: 'flex', flexWrap: 'wrap', gap: 1.5, alignItems: 'center' }}>
                      <Chip
                        label={gradingLabels[workshop.gradingType]}
                        size="small"
                        variant="outlined"
                        sx={{ height: 22, fontSize: '0.65rem', fontWeight: 500, borderRadius: '6px', borderColor: 'grey.300' }}
                      />
                      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', minWidth: 0 }}>
                        <Chip
                          label={workshop.status}
                          size="small"
                          sx={{
                            height: 22,
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            textTransform: 'capitalize',
                            bgcolor: statusStyles[workshop.status].bg,
                            color: statusStyles[workshop.status].color,
                            borderRadius: '6px',
                          }}
                        />
                      </Box>
                      <Button
                        size="small"
                        sx={{
                          textTransform: 'none',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          color: 'primary.main',
                          borderRadius: '50px',
                          px: 1.5,
                          '&:hover': { bgcolor: 'rgba(255,164,36,0.08)' },
                        }}
                      >
                        View Details
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Context Menu */}
          <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
            <MenuItem onClick={() => { setMenuAnchor(null); if (menuWorkshopId) navigate(`/instructor/workshops/${menuWorkshopId}`); }}>
              <ViewIcon sx={{ fontSize: 18, mr: 1.5, color: 'text.secondary' }} /> View Details
            </MenuItem>
            <MenuItem onClick={() => setMenuAnchor(null)}>
              <PeopleIcon sx={{ fontSize: 18, mr: 1.5, color: 'text.secondary' }} /> Manage Participants
            </MenuItem>
            <MenuItem onClick={() => setMenuAnchor(null)}>
              <AttendanceIcon sx={{ fontSize: 18, mr: 1.5, color: 'text.secondary' }} /> Attendance
            </MenuItem>
            <MenuItem onClick={() => setMenuAnchor(null)}>
              <GradeIcon sx={{ fontSize: 18, mr: 1.5, color: 'text.secondary' }} /> Grades
            </MenuItem>
            <MenuItem onClick={() => setMenuAnchor(null)}>
              <CertIcon sx={{ fontSize: 18, mr: 1.5, color: 'text.secondary' }} /> Certificates
            </MenuItem>
            <MenuItem onClick={() => setMenuAnchor(null)} sx={{ color: 'error.main' }}>
              <DeleteIcon sx={{ fontSize: 18, mr: 1.5 }} /> Delete
            </MenuItem>
          </Menu>
        </Box>
      </Box>

      {/* Create Workshop Dialog */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
          <WorkshopsIcon sx={{ color: 'primary.main' }} />
          Create Workshop
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
            <TextField
              fullWidth
              label="Workshop Title"
              placeholder="e.g., Leadership Essentials Bootcamp"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Description"
              placeholder="Describe the workshop objectives and content..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              multiline
              minRows={3}
            />
            <TextField
              fullWidth
              label="Location"
              placeholder="e.g., TASC Training Center, Nairobi"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              required
            />
            <Grid container spacing={2}>
              <Grid size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  value={newStartDate}
                  onChange={(e) => setNewStartDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                <TextField
                  fullWidth
                  label="End Date"
                  type="date"
                  value={newEndDate}
                  onChange={(e) => setNewEndDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid>
            </Grid>
            <FormControl fullWidth>
              <InputLabel>Grading Type</InputLabel>
              <Select
                value={newGradingType}
                onChange={(e) => setNewGradingType(e.target.value as 'attendance' | 'pass_fail' | 'score')}
                label="Grading Type"
              >
                <MenuItem value="attendance">Attendance Only</MenuItem>
                <MenuItem value="pass_fail">Pass / Fail</MenuItem>
                <MenuItem value="score">Score (0-100)</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, px: 3 }}>
          <Button onClick={() => setCreateOpen(false)} sx={{ textTransform: 'none', color: 'text.secondary' }}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={!newTitle.trim() || !newLocation.trim() || !newStartDate || !newEndDate}
            sx={{ textTransform: 'none', fontWeight: 600, bgcolor: 'primary.main' }}
          >
            Create Workshop
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkshopsPage;
