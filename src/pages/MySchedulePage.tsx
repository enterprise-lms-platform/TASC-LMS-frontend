import React, { useState } from 'react';
import {
  Box, Toolbar, CssBaseline, Paper, Typography, Grid, Chip,
  IconButton, Tabs, Tab, Button,
} from '@mui/material';
import {
  DateRange as CalendarIcon, AccessTime as TimeIcon, Person as PersonIcon,
  VideoCall as VideoIcon, Place as LocationIcon, ChevronLeft, ChevronRight,
  Today as TodayIcon, EventAvailable as CompletedIcon,
  Event as UpcomingIcon,
} from '@mui/icons-material';
import '../styles/LearnerDashboard.css';

import Sidebar, { DRAWER_WIDTH } from '../components/learner/Sidebar';
import TopBar from '../components/learner/TopBar';

/* ── Static data ── */

const kpis = [
  { 
    label: 'This Week', 
    value: '5', 
    icon: <CalendarIcon />, 
    // Light Blue Theme
    bgcolor: '#dbeafe',
    iconBg: '#93c5fd',
    color: '#1e3a8a',
    subColor: '#1e40af',
  },
  { 
    label: 'Upcoming', 
    value: '12', 
    icon: <UpcomingIcon />, 
    // Warm Peach Theme
    bgcolor: '#ffedd5',
    iconBg: '#fdba74',
    color: '#7c2d12',
    subColor: '#9a3412',
  },
  { 
    label: 'Completed', 
    value: '28', 
    icon: <CompletedIcon />, 
    // Mint Green Theme
    bgcolor: '#dcfce7',
    iconBg: '#86efac',
    color: '#14532d',
    subColor: '#166534',
  },
  { 
    label: 'Hours Scheduled', 
    value: '18', 
    icon: <TimeIcon />, 
    // Dusty Lavender Theme
    bgcolor: '#f3e8ff',
    iconBg: '#d8b4fe',
    color: '#581c87',
    subColor: '#6b21a8',
  },
];

type SessionType = 'live' | 'quiz' | 'assignment' | 'workshop';
const typeConfig: Record<SessionType, { color: string; bg: string; label: string }> = {
  live:       { color: '#3b82f6', bg: 'rgba(59,130,246,0.08)', label: 'Live Session' },
  quiz:       { color: '#f59e0b', bg: 'rgba(245,158,11,0.08)', label: 'Quiz' },
  assignment: { color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)', label: 'Assignment Due' },
  workshop:   { color: '#10b981', bg: 'rgba(16,185,129,0.08)', label: 'Workshop' },
};

interface ScheduleItem {
  id: string;
  title: string;
  course: string;
  instructor: string;
  date: string;
  day: string;
  time: string;
  duration: string;
  type: SessionType;
  location: string;
}

const scheduleItems: ScheduleItem[] = [
  { id: '1', title: 'React Advanced Patterns Q&A', course: 'Advanced React Patterns', instructor: 'Michael Rodriguez', date: 'Feb 16', day: 'Today', time: '2:00 PM', duration: '60 min', type: 'live', location: 'Zoom Meeting' },
  { id: '2', title: 'Module 9 Quiz: Hooks Deep Dive', course: 'Advanced React Patterns', instructor: 'Michael Rodriguez', date: 'Feb 17', day: 'Tomorrow', time: '10:00 AM', duration: '30 min', type: 'quiz', location: 'Online' },
  { id: '3', title: 'JavaScript Workshop: Async Patterns', course: 'JavaScript Fundamentals', instructor: 'Sarah Johnson', date: 'Feb 17', day: 'Tomorrow', time: '2:30 PM', duration: '90 min', type: 'workshop', location: 'Zoom Meeting' },
  { id: '4', title: 'Data Visualization Assignment', course: 'Data Science Fundamentals', instructor: 'Emily Chen', date: 'Feb 18', day: 'Tuesday', time: '11:59 PM', duration: 'Due', type: 'assignment', location: 'Submit Online' },
  { id: '5', title: 'Data Science Office Hours', course: 'Data Science Fundamentals', instructor: 'Emily Chen', date: 'Feb 19', day: 'Wednesday', time: '3:30 PM', duration: '45 min', type: 'live', location: 'Google Meet' },
  { id: '6', title: 'Cybersecurity Lab: Pen Testing', course: 'Cybersecurity Essentials', instructor: 'David Wilson', date: 'Feb 20', day: 'Thursday', time: '1:00 PM', duration: '120 min', type: 'workshop', location: 'Virtual Lab' },
  { id: '7', title: 'Weekly Progress Check-in', course: 'Advanced React Patterns', instructor: 'Michael Rodriguez', date: 'Feb 21', day: 'Friday', time: '4:00 PM', duration: '30 min', type: 'live', location: 'Zoom Meeting' },
  { id: '8', title: 'React Patterns Final Quiz', course: 'Advanced React Patterns', instructor: 'Michael Rodriguez', date: 'Feb 22', day: 'Saturday', time: '9:00 AM', duration: '45 min', type: 'quiz', location: 'Online' },
];

/* ── Component ── */

const MySchedulePage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const tabLabels = ['All', 'Live Sessions', 'Quizzes', 'Assignments', 'Workshops'];
  const typeFilterMap: Record<number, SessionType | null> = { 0: null, 1: 'live', 2: 'quiz', 3: 'assignment', 4: 'workshop' };

  const filtered = scheduleItems.filter((item) => {
    const typeFilter = typeFilterMap[activeTab];
    return typeFilter ? item.type === typeFilter : true;
  });

  // Group by day
  const grouped = filtered.reduce((acc, item) => {
    const key = `${item.day} · ${item.date}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, ScheduleItem[]>);

  return (
    <Box className="learner-page" sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          overflowX: 'hidden',
          minWidth: 0,
          maxWidth: '100vw',
        }}
      >
        <Toolbar />

        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5, fontSize: { xs: '1.1rem', md: '1.3rem' } }}>
              My Schedule
            </Typography>
            <Typography color="text.disabled" sx={{ fontSize: '0.85rem' }}>
              Manage your upcoming sessions, quizzes, and assignments
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton size="small" sx={{ border: '1px solid rgba(0,0,0,0.06)', borderRadius: '10px' }}><ChevronLeft /></IconButton>
            <Button
              size="small"
              startIcon={<TodayIcon />}
              sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.82rem', borderRadius: '50px', bgcolor: 'rgba(255,164,36,0.08)', color: 'primary.dark', px: 2 }}
            >
              This Week: Feb 16 – 22
            </Button>
            <IconButton size="small" sx={{ border: '1px solid rgba(0,0,0,0.06)', borderRadius: '10px' }}><ChevronRight /></IconButton>
          </Box>
        </Box>

        {/* KPIs */}
        <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 4 }}>
          {kpis.map((k, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={k.label}>
              <Paper
                elevation={0}
                className={`stat-card ld-fade-in ld-fade-in-${index}`}
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

        {/* Schedule Panel */}
        <Paper elevation={0} sx={{ borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)', overflow: 'hidden' }}>
          <Box sx={{ px: 3, pt: 2 }}>
            <Tabs
              value={activeTab}
              onChange={(_, v) => setActiveTab(v)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                minHeight: 40,
                '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.82rem', minHeight: 40, px: 1.5 },
                '& .MuiTabs-indicator': { height: 2.5, borderRadius: 2 },
              }}
            >
              {tabLabels.map((label) => <Tab key={label} label={label} />)}
            </Tabs>
          </Box>

          <Box sx={{ p: 3 }}>
            {Object.keys(grouped).length === 0 ? (
              <Box sx={{ py: 6, textAlign: 'center' }}>
                <CalendarIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                <Typography color="text.disabled">No scheduled items</Typography>
              </Box>
            ) : (
              Object.entries(grouped).map(([dayLabel, items]) => (
                <Box key={dayLabel} sx={{ mb: 3 }}>
                  {/* Day header */}
                  <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', mb: 1.5, color: dayLabel.startsWith('Today') ? 'primary.dark' : 'text.secondary' }}>
                    {dayLabel}
                  </Typography>

                  {/* Session cards */}
                  {items.map((item) => {
                    const cfg = typeConfig[item.type];
                    return (
                      <Box
                        key={item.id}
                        sx={{
                          display: 'flex',
                          alignItems: { xs: 'flex-start', sm: 'center' },
                          flexDirection: { xs: 'column', sm: 'row' },
                          gap: 2,
                          p: 2,
                          mb: 1,
                          borderRadius: '12px',
                          border: '1px solid rgba(0,0,0,0.04)',
                          cursor: 'pointer',
                          transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
                          '&:hover': { bgcolor: 'rgba(0,0,0,0.01)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transform: 'translateY(-1px)' },
                        }}
                      >
                        {/* Time block */}
                        <Box sx={{ minWidth: 70, textAlign: 'center', flexShrink: 0 }}>
                          <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.time}</Typography>
                          <Typography color="text.disabled" sx={{ fontSize: '0.7rem' }}>{item.duration}</Typography>
                        </Box>

                        {/* Type indicator */}
                        <Box sx={{ width: 3, height: 40, borderRadius: 2, bgcolor: cfg.color, flexShrink: 0, display: { xs: 'none', sm: 'block' } }} />

                        {/* Content */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                            <Typography sx={{ fontWeight: 600, fontSize: '0.88rem' }} noWrap>{item.title}</Typography>
                            <Chip label={cfg.label} size="small" sx={{ height: 20, fontSize: '0.62rem', fontWeight: 600, borderRadius: '50px', bgcolor: cfg.bg, color: cfg.color }} />
                          </Box>
                          <Typography color="text.disabled" sx={{ fontSize: '0.78rem' }}>
                            {item.course}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.disabled', fontSize: '0.72rem' }}>
                              <PersonIcon sx={{ fontSize: 14 }} /> {item.instructor}
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.disabled', fontSize: '0.72rem' }}>
                              {item.location.includes('Zoom') || item.location.includes('Meet') ? <VideoIcon sx={{ fontSize: 14 }} /> : <LocationIcon sx={{ fontSize: 14 }} />}
                              {item.location}
                            </Box>
                          </Box>
                        </Box>

                        {/* Action */}
                        {item.type === 'live' && (
                          <Button
                            size="small"
                            variant="contained"
                            startIcon={<VideoIcon />}
                            sx={{
                              textTransform: 'none',
                              fontWeight: 600,
                              fontSize: '0.75rem',
                              borderRadius: '50px',
                              boxShadow: 'none',
                              px: 2,
                              color: 'white',
                              flexShrink: 0,
                              '&:hover': { boxShadow: '0 4px 12px rgba(249,115,22,0.3)' },
                            }}
                          >
                            Join
                          </Button>
                        )}
                      </Box>
                    );
                  })}
                </Box>
              ))
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default MySchedulePage;
