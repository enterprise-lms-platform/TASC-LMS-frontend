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
  Avatar,
  TextField,
  Divider,
  Switch,
  FormControlLabel,
  Chip,
  Alert,
} from '@mui/material';
import {
  Person as ProfileIcon,
  Menu as MenuIcon,
  ArrowBack as BackIcon,
  PhotoCamera as CameraIcon,
  Save as SaveIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Language as WebsiteIcon,
  LinkedIn as LinkedInIcon,
  School as SchoolIcon,
  Shield as SecurityIcon,
  Notifications as NotifIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getUserInitials } from '../utils/userHelpers';
import Sidebar, { DRAWER_WIDTH } from '../components/instructor/Sidebar';

const InstructorProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [saved, setSaved] = useState(false);

  // Profile fields — initialized from logged-in user, synced when user loads
  const [firstName, setFirstName] = useState(user?.first_name ?? '');
  const [lastName, setLastName] = useState(user?.last_name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState(user?.phone_number ?? '');
  const [location, setLocation] = useState(user?.country ?? '');
  const [bio, setBio] = useState('');
  const [title, setTitle] = useState('Senior Instructor');
  const [website, setWebsite] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [expertise, setExpertise] = useState('');

  // Sync form from auth user when user loads or changes (e.g. after login)
  React.useEffect(() => {
    if (user) {
      setFirstName(user.first_name ?? '');
      setLastName(user.last_name ?? '');
      setEmail(user.email ?? '');
      setPhone(user.phone_number ?? '');
      setLocation(user.country ?? '');
    }
  }, [user]);

  // Preferences
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [submissionAlerts, setSubmissionAlerts] = useState(true);
  const [enrollmentAlerts, setEnrollmentAlerts] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  const displayName = [firstName, lastName].filter(Boolean).join(' ') || user?.email || 'User';
  const displayInitials = getUserInitials(firstName || user?.first_name, lastName || user?.last_name);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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
              <ProfileIcon sx={{ color: 'primary.main' }} />
              Profile Settings
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            sx={{ textTransform: 'none', fontWeight: 600, bgcolor: 'primary.main' }}
          >
            Save Changes
          </Button>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, minHeight: '100vh' }}>
        <Toolbar sx={{ minHeight: '72px !important' }} />

        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 900, mx: 'auto' }}>
          {saved && (
            <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
              Profile updated successfully!
            </Alert>
          )}

          {/* Avatar Section */}
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
            <Box sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 3, bgcolor: 'grey.50' }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src={(user?.google_picture ?? undefined) as string | undefined}
                  sx={{
                    width: 96,
                    height: 96,
                    fontSize: '2rem',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #ffb74d, #f97316)',
                  }}
                >
                  {displayInitials}
                </Avatar>
                <IconButton
                  size="small"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    bgcolor: 'white',
                    border: 1,
                    borderColor: 'divider',
                    '&:hover': { bgcolor: 'grey.100' },
                  }}
                >
                  <CameraIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={700}>{displayName}</Typography>
                <Typography variant="body2" color="text.secondary">{title}</Typography>
                <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                  {expertise ? expertise.split(', ').map((skill) => (
                    <Chip key={skill} label={skill} size="small" sx={{ height: 22, fontSize: '0.7rem', fontWeight: 500, bgcolor: 'rgba(255,164,36,0.1)', color: 'primary.main' }} />
                  )) : null}
                </Box>
              </Box>
            </Box>
          </Paper>

          {/* Personal Info */}
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
            <Box sx={{ p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}>
              <Typography fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ProfileIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                Personal Information
              </Typography>
            </Box>
            <Box sx={{ p: 3 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="Email" value={email} onChange={(e) => setEmail(e.target.value)} InputProps={{ startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.disabled', fontSize: 20 }} /> }} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} InputProps={{ startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.disabled', fontSize: 20 }} /> }} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="Location" value={location} onChange={(e) => setLocation(e.target.value)} InputProps={{ startAdornment: <LocationIcon sx={{ mr: 1, color: 'text.disabled', fontSize: 20 }} /> }} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="Title / Role" value={title} onChange={(e) => setTitle(e.target.value)} InputProps={{ startAdornment: <SchoolIcon sx={{ mr: 1, color: 'text.disabled', fontSize: 20 }} /> }} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField fullWidth label="Bio" value={bio} onChange={(e) => setBio(e.target.value)} multiline minRows={3} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField fullWidth label="Areas of Expertise" value={expertise} onChange={(e) => setExpertise(e.target.value)} helperText="Comma-separated list of skills" />
                </Grid>
              </Grid>
            </Box>
          </Paper>

          {/* Social Links */}
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
            <Box sx={{ p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}>
              <Typography fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <WebsiteIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                Social & Links
              </Typography>
            </Box>
            <Box sx={{ p: 3 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="Website" value={website} onChange={(e) => setWebsite(e.target.value)} InputProps={{ startAdornment: <WebsiteIcon sx={{ mr: 1, color: 'text.disabled', fontSize: 20 }} /> }} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="LinkedIn" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} InputProps={{ startAdornment: <LinkedInIcon sx={{ mr: 1, color: 'text.disabled', fontSize: 20 }} /> }} />
                </Grid>
              </Grid>
            </Box>
          </Paper>

          {/* Notifications */}
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
            <Box sx={{ p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}>
              <Typography fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <NotifIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                Notification Preferences
              </Typography>
            </Box>
            <Box sx={{ p: 3 }}>
              <FormControlLabel control={<Switch checked={emailNotifs} onChange={(e) => setEmailNotifs(e.target.checked)} color="primary" />} label="Email notifications" />
              <FormControlLabel control={<Switch checked={pushNotifs} onChange={(e) => setPushNotifs(e.target.checked)} color="primary" />} label="Push notifications" />
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>Alert Types</Typography>
              <FormControlLabel control={<Switch checked={submissionAlerts} onChange={(e) => setSubmissionAlerts(e.target.checked)} color="primary" />} label="New assignment submissions" />
              <FormControlLabel control={<Switch checked={enrollmentAlerts} onChange={(e) => setEnrollmentAlerts(e.target.checked)} color="primary" />} label="New enrollments" />
            </Box>
          </Paper>

          {/* Security */}
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
            <Box sx={{ p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}>
              <Typography fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SecurityIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                Security
              </Typography>
            </Box>
            <Box sx={{ p: 3 }}>
              <FormControlLabel control={<Switch checked={twoFactor} onChange={(e) => setTwoFactor(e.target.checked)} color="primary" />} label="Enable two-factor authentication" />
              <Box sx={{ mt: 2 }}>
                <Button variant="outlined" sx={{ textTransform: 'none', fontWeight: 500, borderColor: 'divider', color: 'text.secondary' }}>
                  Change Password
                </Button>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default InstructorProfilePage;
