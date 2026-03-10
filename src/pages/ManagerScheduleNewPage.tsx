import React, { useState } from 'react';
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Paper,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  CalendarMonth as CalendarMonthIcon,
  Videocam as ZoomIcon,
  VideoCall as MeetIcon,
  Groups as TeamsIcon,
} from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../components/manager/Sidebar';
import TopBar from '../components/manager/TopBar';

// ── Shared styles ──
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

// ── Mock data for dropdowns ──
const mockCourses = [
  { id: 1, name: 'Advanced React Patterns' },
  { id: 2, name: 'Python for Data Science' },
  { id: 3, name: 'AWS Solutions Architect' },
  { id: 4, name: 'TypeScript Mastery' },
  { id: 5, name: 'Docker & Kubernetes' },
  { id: 6, name: 'Cybersecurity Fundamentals' },
  { id: 7, name: 'Mobile App Development' },
  { id: 8, name: 'Data Visualization' },
];

const mockInstructors = [
  { id: 1, name: 'Dr. Sarah Chen' },
  { id: 2, name: 'James Wilson' },
  { id: 3, name: 'Maria Garcia' },
  { id: 4, name: 'Alex Kim' },
  { id: 5, name: 'Priya Patel' },
  { id: 6, name: 'David Okonkwo' },
];

const durationOptions = [
  { value: '30', label: '30 minutes' },
  { value: '60', label: '1 hour' },
  { value: '90', label: '1.5 hours' },
  { value: '120', label: '2 hours' },
];

const frequencyOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Bi-weekly' },
  { value: 'monthly', label: 'Monthly' },
];

const ManagerScheduleNewPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  // ── Form state ──
  const [sessionTitle, setSessionTitle] = useState('');
  const [course, setCourse] = useState('');
  const [instructor, setInstructor] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [duration, setDuration] = useState('60');
  const [platform, setPlatform] = useState('zoom');
  const [meetingLink, setMeetingLink] = useState('');
  const [description, setDescription] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);
  const [frequency, setFrequency] = useState('weekly');

  const handlePlatformChange = (_event: React.MouseEvent<HTMLElement>, newPlatform: string | null) => {
    if (newPlatform !== null) {
      setPlatform(newPlatform);
    }
  };

  const handleCancel = () => {
    setSessionTitle('');
    setCourse('');
    setInstructor('');
    setDateTime('');
    setDuration('60');
    setPlatform('zoom');
    setMeetingLink('');
    setDescription('');
    setIsRecurring(false);
    setFrequency('weekly');
  };

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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
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
              <CalendarMonthIcon />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                Schedule New Session
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create a new live session
              </Typography>
            </Box>
          </Box>

          {/* Form Card */}
          <Paper elevation={0} sx={cardSx}>
            <Box sx={headerSx}>
              <Typography fontWeight={700}>Session Details</Typography>
            </Box>
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                {/* Session Title */}
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Session Title"
                    placeholder="Enter session title"
                    value={sessionTitle}
                    onChange={(e) => setSessionTitle(e.target.value)}
                    variant="outlined"
                  />
                </Grid>

                {/* Course */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Course</InputLabel>
                    <Select value={course} onChange={(e) => setCourse(e.target.value)} label="Course">
                      {mockCourses.map((c) => (
                        <MenuItem key={c.id} value={c.id.toString()}>
                          {c.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Instructor */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Instructor</InputLabel>
                    <Select value={instructor} onChange={(e) => setInstructor(e.target.value)} label="Instructor">
                      {mockInstructors.map((inst) => (
                        <MenuItem key={inst.id} value={inst.id.toString()}>
                          {inst.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Date & Time */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField
                    fullWidth
                    label="Date & Time"
                    type="datetime-local"
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                {/* Duration */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel>Duration</InputLabel>
                    <Select value={duration} onChange={(e) => setDuration(e.target.value)} label="Duration">
                      {durationOptions.map((opt) => (
                        <MenuItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Platform */}
                <Grid size={{ xs: 12 }}>
                  <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ mb: 1 }}>
                    Platform
                  </Typography>
                  <ToggleButtonGroup
                    value={platform}
                    exclusive
                    onChange={handlePlatformChange}
                    sx={{
                      gap: 1,
                      flexWrap: 'wrap',
                      '& .MuiToggleButton-root': {
                        border: '1px solid',
                        borderColor: 'divider',
                        borderRadius: '12px !important',
                        px: 3,
                        py: 1.5,
                        textTransform: 'none',
                        fontWeight: 600,
                        gap: 1,
                        '&.Mui-selected': {
                          bgcolor: 'rgba(255,164,36,0.08)',
                          borderColor: '#ffa424',
                          color: '#f97316',
                          '&:hover': {
                            bgcolor: 'rgba(255,164,36,0.12)',
                          },
                        },
                      },
                    }}
                  >
                    <ToggleButton value="zoom">
                      <ZoomIcon sx={{ fontSize: 20 }} />
                      Zoom
                    </ToggleButton>
                    <ToggleButton value="google-meet">
                      <MeetIcon sx={{ fontSize: 20 }} />
                      Google Meet
                    </ToggleButton>
                    <ToggleButton value="ms-teams">
                      <TeamsIcon sx={{ fontSize: 20 }} />
                      Microsoft Teams
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Grid>

                {/* Meeting Link */}
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Meeting Link"
                    placeholder="https://zoom.us/j/1234567890"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    variant="outlined"
                  />
                </Grid>

                {/* Description */}
                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="Description"
                    placeholder="Add session description, agenda, or notes..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    variant="outlined"
                    multiline
                    rows={4}
                  />
                </Grid>

                {/* Recurring */}
                <Grid size={{ xs: 12 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={isRecurring}
                          onChange={(e) => setIsRecurring(e.target.checked)}
                          sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                              color: '#ffa424',
                              '&:hover': { backgroundColor: 'rgba(255,164,36,0.08)' },
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                              backgroundColor: '#ffa424',
                            },
                          }}
                        />
                      }
                      label={
                        <Typography variant="body2" fontWeight={600}>
                          Recurring Session
                        </Typography>
                      }
                    />
                    {isRecurring && (
                      <FormControl size="small" sx={{ minWidth: 160 }}>
                        <InputLabel>Frequency</InputLabel>
                        <Select value={frequency} onChange={(e) => setFrequency(e.target.value)} label="Frequency">
                          {frequencyOptions.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  </Box>
                </Grid>
              </Grid>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  sx={{
                    borderColor: 'divider',
                    color: 'text.secondary',
                    borderRadius: '10px',
                    px: 4,
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: 'text.secondary',
                      bgcolor: 'rgba(0,0,0,0.02)',
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(135deg, #ffa424, #f97316)',
                    borderRadius: '10px',
                    px: 4,
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: '0 4px 12px rgba(255,164,36,0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #f97316, #ea580c)',
                      boxShadow: '0 6px 16px rgba(255,164,36,0.4)',
                    },
                  }}
                >
                  Schedule Session
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default ManagerScheduleNewPage;
