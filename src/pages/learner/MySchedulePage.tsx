import React, { useState, useMemo } from 'react';
import {
  Box, Toolbar, CssBaseline, Paper, Typography, Grid, Chip,
  IconButton, Tabs, Tab, Button, CircularProgress,
} from '@mui/material';
import {
  DateRange as CalendarIcon, AccessTime as TimeIcon, Person as PersonIcon,
  VideoCall as VideoIcon, ChevronLeft, ChevronRight,
  Today as TodayIcon, EventAvailable as CompletedIcon,
  Event as UpcomingIcon,
} from '@mui/icons-material';
import '../../styles/LearnerDashboard.css';

import Sidebar, { DRAWER_WIDTH } from '../../components/learner/Sidebar';
import TopBar from '../../components/learner/TopBar';
import { useLivestreamSessions } from '../../hooks/useLivestream';
import type { LivestreamSession } from '../../services/livestream.services';

/* ── Component ── */

const MySchedulePage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const { data, isLoading } = useLivestreamSessions();
  const sessions: LivestreamSession[] = data?.results ?? [];

  // Compute KPIs from real data
  const now = new Date();
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 7);

  const thisWeekCount = sessions.filter(
    (s) => new Date(s.start_time) >= startOfWeek && new Date(s.start_time) < endOfWeek
  ).length;
  const upcomingCount = sessions.filter((s) => s.status === 'scheduled').length;
  const completedCount = sessions.filter((s) => s.status === 'ended').length;
  const hoursScheduled = Math.round(
    sessions.filter((s) => s.status === 'scheduled')
      .reduce((sum, s) => sum + s.duration_minutes, 0) / 60
  );

  const kpis = [
    {
      label: 'This Week', value: String(thisWeekCount), icon: <CalendarIcon />,
      bgcolor: '#dcfce7', iconBg: '#4ade80', color: '#14532d', subColor: '#166534',
    },
    {
      label: 'Upcoming', value: String(upcomingCount), icon: <UpcomingIcon />,
      bgcolor: '#f4f4f5', iconBg: '#a1a1aa', color: '#27272a', subColor: '#3f3f46',
    },
    {
      label: 'Completed', value: String(completedCount), icon: <CompletedIcon />,
      bgcolor: '#fff3e0', iconBg: '#ffa424', color: '#7c2d12', subColor: '#9a3412',
    },
    {
      label: 'Hours Scheduled', value: String(hoursScheduled), icon: <TimeIcon />,
      bgcolor: '#f0fdf4', iconBg: '#86efac', color: '#14532d', subColor: '#166534',
    },
  ];

  const tabLabels = ['All', 'Upcoming', 'Live', 'Completed'];

  const filtered = useMemo(() => {
    if (activeTab === 0) return sessions;
    if (activeTab === 1) return sessions.filter((s) => s.status === 'scheduled');
    if (activeTab === 2) return sessions.filter((s) => s.status === 'live');
    return sessions.filter((s) => s.status === 'ended');
  }, [sessions, activeTab]);

  // Group by day
  const grouped = useMemo(() => {
    return filtered.reduce((acc, session) => {
      const d = new Date(session.start_time);
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      let dayLabel: string;
      if (d.toDateString() === today.toDateString()) {
        dayLabel = `Today · ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      } else if (d.toDateString() === tomorrow.toDateString()) {
        dayLabel = `Tomorrow · ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      } else {
        dayLabel = `${d.toLocaleDateString('en-US', { weekday: 'long' })} · ${d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      }
      if (!acc[dayLabel]) acc[dayLabel] = [];
      acc[dayLabel].push(session);
      return acc;
    }, {} as Record<string, LivestreamSession[]>);
  }, [filtered]);

  const platformLabel = (p: string) => {
    const map: Record<string, string> = { zoom: 'Zoom', google_meet: 'Google Meet', teams: 'Teams', custom: 'Custom' };
    return map[p] || p;
  };

  const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
    scheduled: { color: '#3b82f6', bg: 'rgba(59,130,246,0.08)', label: 'Upcoming' },
    live:      { color: '#ef4444', bg: 'rgba(239,68,68,0.08)', label: 'Live Now' },
    ended:     { color: '#10b981', bg: 'rgba(16,185,129,0.08)', label: 'Completed' },
    cancelled: { color: '#6b7280', bg: 'rgba(107,114,128,0.08)', label: 'Cancelled' },
  };

  // Current week range label
  const weekStart = new Date(startOfWeek);
  const weekEnd = new Date(endOfWeek);
  weekEnd.setDate(weekEnd.getDate() - 1);
  const weekLabel = `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;

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
              Manage your upcoming sessions and classes
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton size="small" sx={{ border: '1px solid rgba(0,0,0,0.06)', borderRadius: '10px' }}><ChevronLeft /></IconButton>
            <Button
              size="small"
              startIcon={<TodayIcon />}
              sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.82rem', borderRadius: '50px', bgcolor: 'rgba(255,164,36,0.08)', color: 'primary.dark', px: 2 }}
            >
              This Week: {weekLabel}
            </Button>
            <IconButton size="small" sx={{ border: '1px solid rgba(0,0,0,0.06)', borderRadius: '10px' }}><ChevronRight /></IconButton>
          </Box>
        </Box>

        {/* KPIs */}
        <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 4 }}>
          {kpis.map((k, index) => (
            <Grid size={{ xs: 6, sm: 6, md: 3 }} key={k.label}>
              <Paper
                elevation={0}
                className={`stat-card ld-fade-in ld-fade-in-${index}`}
                sx={{
                  bgcolor: k.bgcolor,
                  borderRadius: '20px',
                  p: 3,
                  position: 'relative',
                  height: '100%',
                  minHeight: { xs: 110, md: 160 },
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
                    position: 'absolute', top: 16, right: 16,
                    width: 40, height: 40, borderRadius: '50%', bgcolor: k.iconBg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'white', '& svg': { fontSize: 20 },
                  }}
                >
                  {k.icon}
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 700, color: k.color, fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }, lineHeight: 1, mb: 1 }}>
                  {k.value}
                </Typography>
                <Typography variant="body2" sx={{ color: k.subColor, fontWeight: 500, fontSize: '0.875rem', opacity: 0.8 }}>
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
            {isLoading ? (
              <Box sx={{ py: 6, textAlign: 'center' }}>
                <CircularProgress size={36} />
                <Typography color="text.disabled" sx={{ mt: 2 }}>Loading schedule...</Typography>
              </Box>
            ) : Object.keys(grouped).length === 0 ? (
              <Box sx={{ py: 6, textAlign: 'center' }}>
                <CalendarIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                <Typography color="text.disabled">No scheduled items</Typography>
              </Box>
            ) : (
              Object.entries(grouped).map(([dayLabel, items]) => (
                <Box key={dayLabel} sx={{ mb: 3 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.82rem', mb: 1.5, color: dayLabel.startsWith('Today') ? 'primary.dark' : 'text.secondary' }}>
                    {dayLabel}
                  </Typography>

                  {items.map((session) => {
                    const cfg = statusConfig[session.status] || statusConfig.scheduled;
                    const startTime = new Date(session.start_time);
                    return (
                      <Box
                        key={session.id}
                        sx={{
                          display: 'flex',
                          alignItems: { xs: 'flex-start', sm: 'center' },
                          flexDirection: { xs: 'column', sm: 'row' },
                          gap: 2, p: 2, mb: 1,
                          borderRadius: '12px',
                          border: '1px solid rgba(0,0,0,0.04)',
                          cursor: 'pointer',
                          transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
                          '&:hover': { bgcolor: 'rgba(0,0,0,0.01)', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', transform: 'translateY(-1px)' },
                        }}
                      >
                        {/* Time block */}
                        <Box sx={{ minWidth: 80, textAlign: 'center', flexShrink: 0 }}>
                          <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>
                            {startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                          </Typography>
                          <Typography color="text.disabled" sx={{ fontSize: '0.7rem' }}>{session.duration_minutes} min</Typography>
                          <Typography color="text.disabled" sx={{ fontSize: '0.62rem', mt: 0.25 }}>
                            {Intl.DateTimeFormat().resolvedOptions().timeZone.split('/').pop()?.replace(/_/g, ' ')}
                          </Typography>
                        </Box>

                        {/* Type indicator */}
                        <Box sx={{ width: 3, height: 40, borderRadius: 2, bgcolor: cfg.color, flexShrink: 0, display: { xs: 'none', sm: 'block' } }} />

                        {/* Content */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                            <Typography sx={{ fontWeight: 600, fontSize: '0.88rem' }} noWrap>{session.title}</Typography>
                            <Chip label={cfg.label} size="small" sx={{ height: 20, fontSize: '0.62rem', fontWeight: 600, borderRadius: '50px', bgcolor: cfg.bg, color: cfg.color }} />
                          </Box>
                          <Typography color="text.disabled" sx={{ fontSize: '0.78rem' }}>
                            {session.course_title || `Course #${session.course}`}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.disabled', fontSize: '0.72rem' }}>
                              <PersonIcon sx={{ fontSize: 14 }} /> {session.instructor_name || `Instructor #${session.instructor}`}
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.disabled', fontSize: '0.72rem' }}>
                              <VideoIcon sx={{ fontSize: 14 }} /> {platformLabel(session.platform)}
                            </Box>
                          </Box>
                        </Box>

                        {/* Action */}
                        {(session.status === 'scheduled' || session.status === 'live') && session.join_url && (
                          <Button
                            size="small"
                            variant="contained"
                            startIcon={<VideoIcon />}
                            onClick={() => window.open(session.join_url, '_blank')}
                            sx={{
                              textTransform: 'none', fontWeight: 600, fontSize: '0.75rem',
                              borderRadius: '50px', boxShadow: 'none', px: 2, color: 'white', flexShrink: 0,
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
