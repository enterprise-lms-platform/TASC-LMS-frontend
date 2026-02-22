import React, { useState } from 'react';
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Paper,
  IconButton,
  AppBar,
  Button,
  Chip,
  Avatar,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Switch,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import {
  Groups as WorkshopsIcon,
  Menu as MenuIcon,
  ArrowBack as BackIcon,
  Search as SearchIcon,
  PersonAdd as AddParticipantIcon,
  Upload as BulkAddIcon,
  LocationOn as LocationIcon,
  CalendarToday as DateIcon,
  People as PeopleIcon,
  Save as SaveIcon,
  CheckCircle as PresentIcon,
  Cancel as AbsentIcon,
  CardMembership as CertIcon,
  Download as DownloadIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar, { DRAWER_WIDTH } from '../components/instructor/Sidebar';

interface Participant {
  id: string;
  name: string;
  initials: string;
  email: string;
  attendance: boolean;
  grade: number | null;
  passFail: 'pass' | 'fail' | null;
  certificateGenerated: boolean;
  eligible: boolean;
}

const sampleParticipants: Participant[] = [
  { id: 'p1', name: 'Alice Wanjiku', initials: 'AW', email: 'alice.w@company.com', attendance: true, grade: 85, passFail: 'pass', certificateGenerated: true, eligible: true },
  { id: 'p2', name: 'Brian Ochieng', initials: 'BO', email: 'brian.o@company.com', attendance: true, grade: 92, passFail: 'pass', certificateGenerated: true, eligible: true },
  { id: 'p3', name: 'Catherine Mwangi', initials: 'CM', email: 'catherine.m@company.com', attendance: true, grade: 78, passFail: 'pass', certificateGenerated: false, eligible: true },
  { id: 'p4', name: 'David Kamau', initials: 'DK', email: 'david.k@company.com', attendance: false, grade: null, passFail: null, certificateGenerated: false, eligible: false },
  { id: 'p5', name: 'Esther Njeri', initials: 'EN', email: 'esther.n@company.com', attendance: true, grade: 88, passFail: 'pass', certificateGenerated: false, eligible: true },
  { id: 'p6', name: 'Francis Otieno', initials: 'FO', email: 'francis.o@company.com', attendance: true, grade: 45, passFail: 'fail', certificateGenerated: false, eligible: false },
  { id: 'p7', name: 'Grace Akinyi', initials: 'GA', email: 'grace.a@company.com', attendance: true, grade: 91, passFail: 'pass', certificateGenerated: true, eligible: true },
  { id: 'p8', name: 'Henry Kipchoge', initials: 'HK', email: 'henry.k@company.com', attendance: true, grade: 72, passFail: 'pass', certificateGenerated: false, eligible: true },
  { id: 'p9', name: 'Irene Wambui', initials: 'IW', email: 'irene.w@company.com', attendance: false, grade: null, passFail: null, certificateGenerated: false, eligible: false },
  { id: 'p10', name: 'James Mutua', initials: 'JM', email: 'james.m@company.com', attendance: true, grade: 95, passFail: 'pass', certificateGenerated: true, eligible: true },
];

// Workshop detail (would come from route params + API in production)
const workshopDetail = {
  id: 'w1',
  title: 'Leadership Essentials Bootcamp',
  description: 'Intensive 3-day workshop on leadership fundamentals covering communication, decision-making, and team management.',
  location: 'TASC Training Center, Nairobi',
  startDate: '2026-03-05',
  endDate: '2026-03-07',
  status: 'upcoming' as const,
  gradingType: 'score' as 'attendance' | 'pass_fail' | 'score',
  category: 'Leadership',
};

const statusStyles: Record<string, { bg: string; color: string }> = {
  upcoming: { bg: '#dbeafe', color: '#2563eb' },
  ongoing: { bg: '#fef3c7', color: '#d97706' },
  completed: { bg: '#d1fae5', color: '#059669' },
};

const WorkshopDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { workshopId: _workshopId } = useParams();
  void _workshopId;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const [participants, setParticipants] = useState(sampleParticipants);
  const [search, setSearch] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  // Add participant form
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');

  const filtered = participants.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleAttendance = (id: string) => {
    setParticipants(participants.map((p) => (p.id === id ? { ...p, attendance: !p.attendance, eligible: !p.attendance ? p.eligible : false } : p)));
  };

  const handleGradeChange = (id: string, grade: number) => {
    setParticipants(participants.map((p) => {
      if (p.id !== id) return p;
      const eligible = p.attendance && grade >= 50;
      return { ...p, grade, eligible };
    }));
  };

  const handlePassFailChange = (id: string, value: 'pass' | 'fail') => {
    setParticipants(participants.map((p) => {
      if (p.id !== id) return p;
      const eligible = p.attendance && value === 'pass';
      return { ...p, passFail: value, eligible };
    }));
  };

  const handleGenerateCert = (id: string) => {
    setParticipants(participants.map((p) => (p.id === id ? { ...p, certificateGenerated: true } : p)));
  };

  const handleGenerateAll = () => {
    setParticipants(participants.map((p) => (p.eligible ? { ...p, certificateGenerated: true } : p)));
  };

  const handleAddParticipant = () => {
    if (!newName.trim() || !newEmail.trim()) return;
    const initials = newName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
    const newParticipant: Participant = {
      id: `p-${Date.now()}`,
      name: newName,
      initials,
      email: newEmail,
      attendance: false,
      grade: null,
      passFail: null,
      certificateGenerated: false,
      eligible: false,
    };
    setParticipants([...participants, newParticipant]);
    setAddDialogOpen(false);
    setNewName('');
    setNewEmail('');
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const formatDateRange = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    if (start === end) return s.toLocaleDateString('en-US', opts);
    return `${s.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${e.toLocaleDateString('en-US', opts)}`;
  };

  const presentCount = participants.filter((p) => p.attendance).length;
  const eligibleCount = participants.filter((p) => p.eligible).length;
  const certCount = participants.filter((p) => p.certificateGenerated).length;

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
          <Button startIcon={<BackIcon />} onClick={() => navigate('/instructor/workshops')} sx={{ color: 'text.secondary', textTransform: 'none', fontWeight: 500 }}>
            Back to Workshops
          </Button>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="h6" fontWeight={700} color="text.primary" noWrap sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <WorkshopsIcon sx={{ color: 'primary.main' }} />
              {workshopDetail.title}
            </Typography>
          </Box>
          <Chip
            label={workshopDetail.status}
            size="small"
            sx={{ height: 24, fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize', bgcolor: statusStyles[workshopDetail.status].bg, color: statusStyles[workshopDetail.status].color }}
          />
          <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave} sx={{ textTransform: 'none', fontWeight: 600, bgcolor: 'primary.main' }}>
            Save
          </Button>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, minHeight: '100vh' }}>
        <Toolbar sx={{ minHeight: '72px !important' }} />

        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1200, mx: 'auto' }}>
          {saved && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>Changes saved successfully!</Alert>}

          {/* Workshop Info Card */}
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
            <Box sx={{ p: 2.5, px: 3, display: 'flex', gap: 3, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{workshopDetail.description}</Typography>
                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', fontSize: '0.85rem', color: 'text.secondary' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><LocationIcon sx={{ fontSize: 16 }} /> {workshopDetail.location}</Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><DateIcon sx={{ fontSize: 16 }} /> {formatDateRange(workshopDetail.startDate, workshopDetail.endDate)}</Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><PeopleIcon sx={{ fontSize: 16 }} /> {participants.length} participants</Box>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip label={workshopDetail.category} size="small" sx={{ fontWeight: 600 }} />
                <Chip label={workshopDetail.gradingType === 'attendance' ? 'Attendance Only' : workshopDetail.gradingType === 'pass_fail' ? 'Pass/Fail' : 'Score (0-100)'} size="small" variant="outlined" sx={{ fontWeight: 500 }} />
              </Box>
            </Box>

            {/* Summary stats */}
            <Box sx={{ display: 'flex', borderTop: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
              {[
                { label: 'Participants', value: participants.length, color: '#3b82f6' },
                { label: 'Present', value: presentCount, color: '#10b981' },
                { label: 'Eligible', value: eligibleCount, color: '#f59e0b' },
                { label: 'Certificates', value: certCount, color: '#8b5cf6' },
              ].map((stat) => (
                <Box key={stat.label} sx={{ flex: 1, p: 2, textAlign: 'center', borderRight: 1, borderColor: 'divider', '&:last-child': { borderRight: 0 } }}>
                  <Typography variant="h5" fontWeight={700} sx={{ color: stat.color }}>{stat.value}</Typography>
                  <Typography variant="caption" color="text.secondary">{stat.label}</Typography>
                </Box>
              ))}
            </Box>
          </Paper>

          {/* Tabs */}
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
            <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'grey.50' }}>
              <Tab label="Participants" sx={{ textTransform: 'none', fontWeight: 600 }} />
              <Tab label="Attendance" sx={{ textTransform: 'none', fontWeight: 600 }} />
              <Tab label="Grades" sx={{ textTransform: 'none', fontWeight: 600 }} />
              <Tab label="Certificates" sx={{ textTransform: 'none', fontWeight: 600 }} />
            </Tabs>

            {/* Toolbar */}
            <Box sx={{ p: 2, px: 3, display: 'flex', gap: 2, alignItems: 'center', borderBottom: 1, borderColor: 'divider' }}>
              <TextField
                size="small"
                placeholder="Search participants..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: 'text.disabled' }} /></InputAdornment> }}
                sx={{ minWidth: 250 }}
              />
              <Box sx={{ flex: 1 }} />
              {tab === 0 && (
                <>
                  <Button size="small" startIcon={<BulkAddIcon />} sx={{ textTransform: 'none', color: 'text.secondary' }}>Bulk Add (CSV)</Button>
                  <Button size="small" variant="contained" startIcon={<AddParticipantIcon />} onClick={() => setAddDialogOpen(true)} sx={{ textTransform: 'none', fontWeight: 600, bgcolor: 'primary.main' }}>
                    Add Participant
                  </Button>
                </>
              )}
              {tab === 3 && (
                <Button size="small" variant="contained" startIcon={<CertIcon />} onClick={handleGenerateAll} sx={{ textTransform: 'none', fontWeight: 600, bgcolor: '#8b5cf6', '&:hover': { bgcolor: '#7c3aed' } }}>
                  Generate All Certificates
                </Button>
              )}
            </Box>

            {/* Tab Content */}
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    <TableCell><Typography variant="caption" fontWeight={600} color="text.secondary">Participant</Typography></TableCell>
                    {tab === 0 && (
                      <>
                        <TableCell><Typography variant="caption" fontWeight={600} color="text.secondary">Email</Typography></TableCell>
                        <TableCell align="center"><Typography variant="caption" fontWeight={600} color="text.secondary">Attendance</Typography></TableCell>
                        <TableCell align="center"><Typography variant="caption" fontWeight={600} color="text.secondary">Grade</Typography></TableCell>
                        <TableCell align="center"><Typography variant="caption" fontWeight={600} color="text.secondary">Certificate</Typography></TableCell>
                      </>
                    )}
                    {tab === 1 && (
                      <TableCell align="center"><Typography variant="caption" fontWeight={600} color="text.secondary">Present</Typography></TableCell>
                    )}
                    {tab === 2 && (
                      <TableCell align="center"><Typography variant="caption" fontWeight={600} color="text.secondary">
                        {workshopDetail.gradingType === 'score' ? 'Score (0-100)' : workshopDetail.gradingType === 'pass_fail' ? 'Result' : 'Attended'}
                      </Typography></TableCell>
                    )}
                    {tab === 3 && (
                      <>
                        <TableCell align="center"><Typography variant="caption" fontWeight={600} color="text.secondary">Eligible</Typography></TableCell>
                        <TableCell align="center"><Typography variant="caption" fontWeight={600} color="text.secondary">Certificate</Typography></TableCell>
                        <TableCell align="center"><Typography variant="caption" fontWeight={600} color="text.secondary">Actions</Typography></TableCell>
                      </>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((p) => (
                    <TableRow key={p.id} hover sx={{ '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' } }}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ width: 32, height: 32, fontSize: '0.75rem', bgcolor: 'primary.main' }}>{p.initials}</Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={600}>{p.name}</Typography>
                            {tab !== 0 && <Typography variant="caption" color="text.secondary">{p.email}</Typography>}
                          </Box>
                        </Box>
                      </TableCell>

                      {/* Participants tab */}
                      {tab === 0 && (
                        <>
                          <TableCell><Typography variant="body2" color="text.secondary">{p.email}</Typography></TableCell>
                          <TableCell align="center">
                            <Chip
                              icon={p.attendance ? <PresentIcon sx={{ fontSize: 14 }} /> : <AbsentIcon sx={{ fontSize: 14 }} />}
                              label={p.attendance ? 'Present' : 'Absent'}
                              size="small"
                              sx={{ height: 22, fontSize: '0.7rem', fontWeight: 600, bgcolor: p.attendance ? '#d1fae5' : '#fee2e2', color: p.attendance ? '#059669' : '#dc2626', '& .MuiChip-icon': { color: 'inherit' } }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            {p.grade !== null ? (
                              <Typography variant="body2" fontWeight={600} sx={{ color: p.grade >= 50 ? '#059669' : '#dc2626' }}>{p.grade}</Typography>
                            ) : (
                              <Typography variant="caption" color="text.disabled">—</Typography>
                            )}
                          </TableCell>
                          <TableCell align="center">
                            {p.certificateGenerated ? (
                              <Chip label="Generated" size="small" sx={{ height: 22, fontSize: '0.7rem', fontWeight: 600, bgcolor: '#ede9fe', color: '#7c3aed' }} />
                            ) : (
                              <Typography variant="caption" color="text.disabled">—</Typography>
                            )}
                          </TableCell>
                        </>
                      )}

                      {/* Attendance tab */}
                      {tab === 1 && (
                        <TableCell align="center">
                          <Switch checked={p.attendance} onChange={() => handleToggleAttendance(p.id)} color="success" />
                        </TableCell>
                      )}

                      {/* Grades tab */}
                      {tab === 2 && (
                        <TableCell align="center">
                          {workshopDetail.gradingType === 'score' && (
                            <TextField
                              type="number"
                              size="small"
                              value={p.grade ?? ''}
                              onChange={(e) => handleGradeChange(p.id, Math.min(100, Math.max(0, Number(e.target.value))))}
                              inputProps={{ min: 0, max: 100 }}
                              sx={{ width: 80 }}
                              disabled={!p.attendance}
                            />
                          )}
                          {workshopDetail.gradingType === 'pass_fail' && (
                            <Select
                              size="small"
                              value={p.passFail ?? ''}
                              onChange={(e) => handlePassFailChange(p.id, e.target.value as 'pass' | 'fail')}
                              sx={{ width: 100 }}
                              disabled={!p.attendance}
                              displayEmpty
                            >
                              <MenuItem value="" disabled>Select</MenuItem>
                              <MenuItem value="pass">Pass</MenuItem>
                              <MenuItem value="fail">Fail</MenuItem>
                            </Select>
                          )}
                          {workshopDetail.gradingType === 'attendance' && (
                            <Chip
                              label={p.attendance ? 'Present' : 'Absent'}
                              size="small"
                              sx={{ height: 22, fontSize: '0.7rem', fontWeight: 600, bgcolor: p.attendance ? '#d1fae5' : '#fee2e2', color: p.attendance ? '#059669' : '#dc2626' }}
                            />
                          )}
                        </TableCell>
                      )}

                      {/* Certificates tab */}
                      {tab === 3 && (
                        <>
                          <TableCell align="center">
                            <Chip
                              label={p.eligible ? 'Eligible' : 'Not Eligible'}
                              size="small"
                              sx={{ height: 22, fontSize: '0.7rem', fontWeight: 600, bgcolor: p.eligible ? '#d1fae5' : '#e5e7eb', color: p.eligible ? '#059669' : '#6b7280' }}
                            />
                          </TableCell>
                          <TableCell align="center">
                            {p.certificateGenerated ? (
                              <Chip label="Generated" size="small" sx={{ height: 22, fontSize: '0.7rem', fontWeight: 600, bgcolor: '#ede9fe', color: '#7c3aed' }} />
                            ) : (
                              <Typography variant="caption" color="text.disabled">Not generated</Typography>
                            )}
                          </TableCell>
                          <TableCell align="center">
                            {p.eligible && !p.certificateGenerated && (
                              <Button size="small" variant="outlined" startIcon={<CertIcon sx={{ fontSize: 14 }} />} onClick={() => handleGenerateCert(p.id)} sx={{ textTransform: 'none', fontSize: '0.75rem', fontWeight: 600 }}>
                                Generate
                              </Button>
                            )}
                            {p.certificateGenerated && (
                              <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                                <IconButton size="small" title="Download"><DownloadIcon sx={{ fontSize: 18 }} /></IconButton>
                                <IconButton size="small" title="Email"><EmailIcon sx={{ fontSize: 18 }} /></IconButton>
                              </Box>
                            )}
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Box>
      </Box>

      {/* Add Participant Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Add Participant</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField fullWidth label="Full Name" value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="e.g., John Doe" required />
            <TextField fullWidth label="Email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="e.g., john@company.com" required />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, px: 3 }}>
          <Button onClick={() => setAddDialogOpen(false)} sx={{ textTransform: 'none', color: 'text.secondary' }}>Cancel</Button>
          <Button variant="contained" onClick={handleAddParticipant} disabled={!newName.trim() || !newEmail.trim()} sx={{ textTransform: 'none', fontWeight: 600, bgcolor: 'primary.main' }}>
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default WorkshopDetailsPage;
