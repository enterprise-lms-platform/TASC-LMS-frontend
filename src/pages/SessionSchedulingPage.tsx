import React, { useState } from 'react';
import { Box, CssBaseline, Toolbar, Paper, Typography, TextField } from '@mui/material';
import { useNavigate, useSearchParams } from 'react-router-dom';

// Layout
import Sidebar, { DRAWER_WIDTH } from '../components/instructor/Sidebar';

// Session components
import SessionTopBar from '../components/instructor/sessions/SessionTopBar';
import PlatformSelector from '../components/instructor/sessions/PlatformSelector';
import type { Platform } from '../components/instructor/sessions/PlatformSelector';
import SessionInfoForm from '../components/instructor/sessions/SessionInfoForm';
import DateTimeSection from '../components/instructor/sessions/DateTimeSection';
import RecurringSettings from '../components/instructor/sessions/RecurringSettings';
import AttendeeSelector from '../components/instructor/sessions/AttendeeSelector';
import type { AttendeeType } from '../components/instructor/sessions/AttendeeSelector';
import NotificationSettings from '../components/instructor/sessions/NotificationSettings';
import type { NotificationSetting } from '../components/instructor/sessions/NotificationSettings';
import SessionPreview from '../components/instructor/sessions/SessionPreview';
import CalendarPreview from '../components/instructor/sessions/CalendarPreview';
import UpcomingSessionsList from '../components/instructor/sessions/UpcomingSessionsList';
import type { UpcomingSession } from '../components/instructor/sessions/UpcomingSessionsList';

// Icons
import {
  Info as InfoIcon,
  Videocam as PlatformIcon,
  CalendarToday as DateIcon,
  Repeat as RecurringIcon,
  People as AttendeesIcon,
  Notifications as NotificationsIcon,
} from '@mui/icons-material';

// Sample upcoming sessions
const sampleUpcomingSessions: UpcomingSession[] = [
  { id: '1', title: 'React Hooks Deep Dive', date: new Date(2026, 1, 10), time: '2:00 PM', platform: 'zoom' },
  { id: '2', title: 'State Management Q&A', date: new Date(2026, 1, 12), time: '10:00 AM', platform: 'teams' },
  { id: '3', title: 'TypeScript Workshop', date: new Date(2026, 1, 15), time: '3:00 PM', platform: 'meet' },
];

// Default notification settings
const defaultNotificationSettings: NotificationSetting[] = [
  { key: 'calendarInvite', label: 'Send Calendar Invites', description: 'Email calendar invite to all attendees', enabled: true },
  { key: 'reminder24h', label: '24 Hour Reminder', description: 'Send email reminder 24 hours before', enabled: true },
  { key: 'reminder1h', label: '1 Hour Reminder', description: 'Send email reminder 1 hour before', enabled: true },
  { key: 'pushNotifications', label: 'Push Notifications', description: 'Send in-app notifications', enabled: true },
  { key: 'recordingNotification', label: 'Recording Available Notification', description: 'Notify when recording is ready', enabled: true },
];

const SessionSchedulingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const lessonTitle = searchParams.get('lesson') || '';
  const courseName = searchParams.get('course') || 'Advanced React Development';
  const [mobileOpen, setMobileOpen] = useState(false);

  // Session Details state
  const [title, setTitle] = useState(lessonTitle || 'Live Coding: Building Custom Hooks');
  const [description, setDescription] = useState(lessonTitle ? '' : 'In this live coding session, we\'ll build a complete custom hooks library from scratch.');
  const [course, setCourse] = useState('react-advanced');
  const [module, setModule] = useState('module-4');

  // Platform state
  const [platform, setPlatform] = useState<Platform>('zoom');
  const [meetingLink, setMeetingLink] = useState('');

  // Date & Time state
  const [date, setDate] = useState('2026-02-10');
  const [time, setTime] = useState('14:00');
  const [timezone, setTimezone] = useState('Africa/Nairobi');
  const [duration, setDuration] = useState(60);

  // Recurring state
  const [recurringEnabled, setRecurringEnabled] = useState(false);
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [selectedDays, setSelectedDays] = useState<number[]>([1, 3, 5]);
  const [endType, setEndType] = useState<'date' | 'occurrences'>('date');
  const [endDate, setEndDate] = useState('2026-04-30');
  const [occurrences, setOccurrences] = useState(10);

  // Attendees state
  const [attendeeType, setAttendeeType] = useState<AttendeeType>('all');

  // Notifications state
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>(defaultNotificationSettings);

  const handleNotificationChange = (key: string, enabled: boolean) => {
    setNotificationSettings((prev) =>
      prev.map((s) => (s.key === key ? { ...s, enabled } : s))
    );
  };

  const handleSchedule = () => {
    console.log('Scheduling session:', {
      title,
      description,
      course,
      module,
      platform,
      meetingLink,
      date,
      time,
      timezone,
      duration,
      recurring: recurringEnabled ? { frequency, selectedDays, endType, endDate, occurrences } : null,
      attendeeType,
      notificationSettings,
    });
  };

  // Section Card component
  const SectionCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    children: React.ReactNode;
  }> = ({ icon, title, subtitle, children }) => (
    <Paper
      elevation={0}
      sx={{ border: 1, borderColor: 'divider', borderRadius: 2, overflow: 'hidden', mb: 3 }}
    >
      <Box
        sx={{
          p: 2,
          px: 3,
          bgcolor: 'grey.50',
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Box sx={{ color: 'primary.main' }}>{icon}</Box>
        <Box>
          <Typography variant="subtitle1" fontWeight={700} color="text.primary">
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>
      <Box sx={{ p: 3 }}>{children}</Box>
    </Paper>
  );

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.100', minHeight: '100vh' }}>
      <CssBaseline />

      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <SessionTopBar
        courseName={courseName}
        onCancel={() => navigate(-1)}
        onMobileMenuToggle={() => setMobileOpen(!mobileOpen)}
        onSchedule={handleSchedule}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Toolbar sx={{ minHeight: '72px !important' }} />

        {/* Content */}
        <Box sx={{ flex: 1, p: { xs: 2, md: 3 }, overflow: 'auto' }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '1fr 400px' },
              gap: 3,
              maxWidth: 1400,
              mx: 'auto',
            }}
          >
            {/* Main Column */}
            <Box>
              {/* 1. Session Details */}
              <SectionCard
                icon={<InfoIcon />}
                title="Session Details"
                subtitle="Basic information about your livestream session"
              >
                <SessionInfoForm
                  title={title}
                  description={description}
                  date={date}
                  time={time}
                  course={course}
                  module={module}
                  onTitleChange={setTitle}
                  onDescriptionChange={setDescription}
                  onDateChange={setDate}
                  onTimeChange={setTime}
                  onCourseChange={setCourse}
                  onModuleChange={setModule}
                />
              </SectionCard>

              {/* 2. Video Platform */}
              <SectionCard
                icon={<PlatformIcon />}
                title="Video Platform"
                subtitle="Choose your preferred video conferencing platform"
              >
                <PlatformSelector selected={platform} onSelect={setPlatform} />
                
                {/* Meeting Link Input */}
                <Box
                  sx={{
                    mt: 3,
                    p: 2,
                    bgcolor: 'grey.50',
                    borderRadius: 1,
                    border: 1,
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                    Please paste meeting link here
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Paste the link here (required field)"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    sx={{ bgcolor: 'white', borderRadius: 1 }}
                  />
                </Box>
              </SectionCard>

              {/* 3. Date & Time */}
              <SectionCard
                icon={<DateIcon />}
                title="Date & Time"
                subtitle="Set when your livestream will take place"
              >
                <DateTimeSection
                  date={date}
                  time={time}
                  timezone={timezone}
                  duration={duration}
                  onDateChange={setDate}
                  onTimeChange={setTime}
                  onTimezoneChange={setTimezone}
                  onDurationChange={setDuration}
                />
              </SectionCard>

              {/* 4. Recurring Sessions */}
              <SectionCard
                icon={<RecurringIcon />}
                title="Recurring Sessions"
                subtitle="Set up repeating sessions automatically"
              >
                <RecurringSettings
                  enabled={recurringEnabled}
                  frequency={frequency}
                  selectedDays={selectedDays}
                  endType={endType}
                  endDate={endDate}
                  occurrences={occurrences}
                  onEnabledChange={setRecurringEnabled}
                  onFrequencyChange={setFrequency}
                  onDaysChange={setSelectedDays}
                  onEndTypeChange={setEndType}
                  onEndDateChange={setEndDate}
                  onOccurrencesChange={setOccurrences}
                />
              </SectionCard>

              {/* 5. Attendees */}
              <SectionCard
                icon={<AttendeesIcon />}
                title="Attendees"
                subtitle="Choose who can attend this session"
              >
                <AttendeeSelector selected={attendeeType} onSelect={setAttendeeType} />
              </SectionCard>

              {/* 6. Notifications & Reminders */}
              <SectionCard
                icon={<NotificationsIcon />}
                title="Notifications & Reminders"
                subtitle="Configure how learners are notified"
              >
                <NotificationSettings settings={notificationSettings} onSettingChange={handleNotificationChange} />
              </SectionCard>
            </Box>

            {/* Sidebar Column */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Session Preview */}
              <SessionPreview
                title={title || 'New Session'}
                date={date}
                time={time}
                duration={duration}
                platform={platform}
              />

              {/* Calendar Preview */}
              <CalendarPreview
                selectedDate={date}
                sessionDates={sampleUpcomingSessions.map((s) => s.date.toISOString().split('T')[0])}
                onDateChange={setDate}
              />

              {/* Upcoming Sessions */}
              <UpcomingSessionsList sessions={sampleUpcomingSessions} />

              {/* Tips Card */}
              <Paper
                elevation={0}
                sx={{
                  p: 2.5,
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  borderRadius: 2,
                  color: 'white',
                }}
              >
                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                  💡 Tips for a Great Session
                </Typography>
                <Box component="ul" sx={{ m: 0, pl: 2, fontSize: '0.875rem', opacity: 0.95 }}>
                  <li style={{ marginBottom: '8px' }}>Test your audio and video before the session</li>
                  <li style={{ marginBottom: '8px' }}>Send reminders to students 1 hour before</li>
                  <li style={{ marginBottom: '8px' }}>Prepare an agenda to keep the session focused</li>
                  <li>Enable recording to share with absent students</li>
                </Box>
              </Paper>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SessionSchedulingPage;
