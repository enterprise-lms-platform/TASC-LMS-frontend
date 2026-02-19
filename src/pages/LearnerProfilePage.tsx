import React, { useState } from 'react';
import {
  Box, Toolbar, CssBaseline, Paper, Typography, Grid,
  Avatar, Button, TextField, Tabs, Tab, Switch, FormControlLabel,
  IconButton, Divider, InputAdornment,
} from '@mui/material';
import {
  Edit as EditIcon, CameraAlt as CameraIcon,
  Security as SecurityIcon, Notifications as BellIcon,
  Person as PersonIcon, Language as WebIcon,
  LocationOn as LocIcon, Email as EmailIcon,
  Phone as PhoneIcon, Visibility, VisibilityOff,
  Devices as DevicesIcon, Delete as DeleteIcon,
} from '@mui/icons-material';
import '../styles/LearnerDashboard.css';

import Sidebar, { DRAWER_WIDTH } from '../components/learner/Sidebar';
import TopBar from '../components/learner/TopBar';
import { useAuth } from '../contexts/AuthContext';

/* ── Component ── */

const LearnerProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    firstName: user?.first_name || 'Emma',
    lastName: user?.last_name || 'Chen',
    headline: user?.role === 'instructor' ? 'Instructor' : 'Learner',
    bio: 'Passionate about building accessible and performant web applications. Currently learning advanced React patterns and data science fundamentals.',
    email: user?.email || 'emma.chen@example.com',
    phone: '',
    location: '',
    website: '',
  });

  const [notifications, setNotifications] = useState({
    emailCourse: true,
    emailPromos: false,
    emailSecurity: true,
    pushNewContent: true,
    pushMentions: true,
  });

  const handleToggle = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <Box className="learner-page" sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} />

      <Box component="main" sx={{ flexGrow: 1, p: 0, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, overflowX: 'hidden', minWidth: 0, maxWidth: '100vw' }}>
        <Toolbar />

        {/* Cover Image */}
        <Box
          sx={{
            height: 200,
            backgroundImage: 'url("/dashboard banner images/learner2.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
          }}
        >
           {/* Edit Cover Button */}
           <Button
            variant="contained"
            startIcon={<CameraIcon />}
            sx={{
              position: 'absolute',
              bottom: 16,
              right: 24,
              bgcolor: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(4px)',
              boxShadow: 'none',
              textTransform: 'none',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
            }}
          >
            Edit Cover
          </Button>
        </Box>

        <Box sx={{ px: { xs: 2, md: 4 }, pb: 4, mt: -6 }}>
          {/* Header Card */}
          <Paper
            elevation={0}
            className="ld-fade-in"
            sx={{
              p: 3,
              borderRadius: '1rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)',
              mb: 3,
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: { xs: 'center', md: 'flex-end' },
              gap: 3,
            }}
          >
            {/* Avatar */}
            <Box sx={{ position: 'relative', mt: { xs: -8, md: -6 } }}>
              <Avatar
                src={(user?.google_picture ?? undefined) as string | undefined}
                sx={{
                  width: 120,
                  height: 120,
                  border: '4px solid #fff',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  fontSize: '3rem',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #ffb74d, #f97316)',
                }}
              >
                {formData.firstName[0]}{formData.lastName[0]}
              </Avatar>
              <IconButton
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  bgcolor: 'primary.main',
                  color: 'white',
                  '&:hover': { bgcolor: 'primary.dark' },
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                }}
                size="small"
              >
                <CameraIcon fontSize="small" />
              </IconButton>
            </Box>

            {/* User Info */}
            <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>{formData.firstName} {formData.lastName}</Typography>
              <Typography color="text.secondary" sx={{ mb: 1 }}>{formData.headline}</Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' }, color: 'text.disabled', fontSize: '0.85rem', flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocIcon fontSize="small" /> {formData.location}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <WebIcon fontSize="small" /> {formData.website}
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <EmailIcon fontSize="small" /> {formData.email}
                </Box>
              </Box>
            </Box>

            {/* Actions */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" startIcon={<EditIcon />} sx={{ borderRadius: '50px', textTransform: 'none', fontWeight: 600 }}>Edit Public Profile</Button>
            </Box>
          </Paper>

          {/* Main Content Grid */}
          <Grid container spacing={3}>
            {/* Left Sidebar Tabs */}
            <Grid size={{ xs: 12, md: 3 }}>
              <Paper elevation={0} sx={{ borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <Tabs
                  orientation="vertical"
                  value={activeTab}
                  onChange={(_, v) => setActiveTab(v)}
                  sx={{
                    '& .MuiTab-root': {
                      alignItems: 'flex-start',
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      minHeight: 48,
                      px: 3,
                    },
                    '& .Mui-selected': {
                      bgcolor: 'rgba(255,164,36,0.08)',
                      color: 'primary.dark',
                      borderRight: '3px solid #ffa424',
                    },
                    '& .MuiTabs-indicator': { display: 'none' }, // Custom indicator via borderRight
                  }}
                >
                  <Tab icon={<PersonIcon sx={{ mr: 1 }} />} iconPosition="start" label="Personal Info" />
                  <Tab icon={<SecurityIcon sx={{ mr: 1 }} />} iconPosition="start" label="Security" />
                  <Tab icon={<BellIcon sx={{ mr: 1 }} />} iconPosition="start" label="Notifications" />
                </Tabs>
              </Paper>
            </Grid>

            {/* Right Content Area */}
            <Grid size={{ xs: 12, md: 9 }}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                {activeTab === 0 && (
                  <Box className="ld-fade-in-0">
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Personal Information</Typography>
                    <Grid container spacing={3}>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField fullWidth label="First Name" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} variant="outlined" />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField fullWidth label="Last Name" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} variant="outlined" />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField fullWidth label="Headline" value={formData.headline} onChange={(e) => setFormData({...formData, headline: e.target.value})} variant="outlined" helperText="Appears below your name on your profile" />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                        <TextField fullWidth multiline rows={4} label="Bio" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} variant="outlined" />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField fullWidth label="Phone Number" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} variant="outlined" InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon fontSize="small" /></InputAdornment> }} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField fullWidth label="Website" value={formData.website} onChange={(e) => setFormData({...formData, website: e.target.value})} variant="outlined" InputProps={{ startAdornment: <InputAdornment position="start"><WebIcon fontSize="small" /></InputAdornment> }} />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                         <Divider sx={{ my: 2 }} />
                         <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                           <Button variant="contained" size="large" sx={{ borderRadius: '50px', px: 4, textTransform: 'none', fontWeight: 600, color: 'white' }}>Save Changes</Button>
                         </Box>
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {activeTab === 1 && (
                  <Box className="ld-fade-in-0">
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Login & Security</Typography>
                    
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>Change Password</Typography>
                    <Grid container spacing={2} sx={{ mb: 4 }}>
                       <Grid size={{ xs: 12 }}>
                         <TextField
                            fullWidth
                            type={showPassword ? 'text' : 'password'}
                            label="Current Password"
                            variant="outlined"
                         />
                       </Grid>
                       <Grid size={{ xs: 12, sm: 6 }}>
                         <TextField
                            fullWidth
                            type={showPassword ? 'text' : 'password'}
                            label="New Password"
                            variant="outlined"
                         />
                       </Grid>
                       <Grid size={{ xs: 12, sm: 6 }}>
                         <TextField
                            fullWidth
                            type={showPassword ? 'text' : 'password'}
                            label="Confirm New Password"
                            variant="outlined"
                            InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                      {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                  </InputAdornment>
                                ),
                            }}
                         />
                       </Grid>
                       <Grid size={{ xs: 12 }}>
                          <Button variant="outlined" sx={{ borderRadius: '50px', textTransform: 'none', fontWeight: 600 }}>Update Password</Button>
                       </Grid>
                    </Grid>

                    <Divider sx={{ mb: 3 }} />

                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>Two-Factor Authentication</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                       <Box>
                         <Typography variant="body2">Add an extra layer of security to your account.</Typography>
                         <Typography variant="caption" color="text.secondary">We'll send a code to your phone number when you log in.</Typography>
                       </Box>
                       <Switch defaultChecked color="primary" />
                    </Box>

                    <Divider sx={{ my: 3 }} />
                    
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>Active Sessions</Typography>
                    <Box sx={{ bgcolor: 'rgba(0,0,0,0.02)', p: 2, borderRadius: '8px', display: 'flex', alignItems: 'center', gap: 2 }}>
                       <DevicesIcon color="action" />
                       <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" fontWeight={600}>Windows PC - Chrome</Typography>
                          <Typography variant="caption" color="text.secondary">San Francisco, US · Active now</Typography>
                       </Box>
                       <Button size="small" color="error" startIcon={<DeleteIcon />}>Revoke</Button>
                    </Box>
                  </Box>
                )}

                {activeTab === 2 && (
                  <Box className="ld-fade-in-0">
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Notification Settings</Typography>

                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'primary.main' }}>Email Notifications</Typography>
                    <Box sx={{ mb: 3 }}>
                       <FormControlLabel control={<Switch checked={notifications.emailCourse} onChange={() => handleToggle('emailCourse')} />} label="Course updates and announcements" sx={{ display: 'block', mb: 1 }} />
                       <FormControlLabel control={<Switch checked={notifications.emailPromos} onChange={() => handleToggle('emailPromos')} />} label="Promotional offers and recommendations" sx={{ display: 'block', mb: 1 }} />
                       <FormControlLabel control={<Switch checked={notifications.emailSecurity} onChange={() => handleToggle('emailSecurity')} />} label="Security alerts and account activity" sx={{ display: 'block', mb: 1 }} />
                    </Box>

                    <Divider sx={{ mb: 3 }} />

                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, color: 'primary.main' }}>Push Notifications</Typography>
                    <Box sx={{ mb: 3 }}>
                       <FormControlLabel control={<Switch checked={notifications.pushNewContent} onChange={() => handleToggle('pushNewContent')} />} label="New content available in enrolled courses" sx={{ display: 'block', mb: 1 }} />
                       <FormControlLabel control={<Switch checked={notifications.pushMentions} onChange={() => handleToggle('pushMentions')} />} label="Mentions in discussion forums" sx={{ display: 'block', mb: 1 }} />
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
                       <Button variant="contained" sx={{ borderRadius: '50px', px: 4, textTransform: 'none', fontWeight: 600, color: 'white' }}>Save Preferences</Button>
                    </Box>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default LearnerProfilePage;
