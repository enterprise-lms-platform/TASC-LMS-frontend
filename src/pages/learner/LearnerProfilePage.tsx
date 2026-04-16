import React, { useState, useRef } from 'react';
import {
  Box, Toolbar, CssBaseline, Paper, Typography, Grid,
  Avatar, Button, TextField, Tabs, Tab,
  IconButton, Divider, InputAdornment, CircularProgress,
} from '@mui/material';
import {
  Edit as EditIcon, CameraAlt as CameraIcon,
  Security as SecurityIcon,
  Person as PersonIcon,
  LocationOn as LocIcon, Email as EmailIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';
import '../../styles/LearnerDashboard.css';

import Sidebar, { DRAWER_WIDTH } from '../../components/learner/Sidebar';
import TopBar from '../../components/learner/TopBar';
import { useAuth } from '../../contexts/AuthContext';
import { useUpdateProfile } from '../../hooks/useAuthQueries';
import ChangePasswordForm from '../../components/common/ChangePasswordForm';
import { uploadApi } from '../../services/upload.services';
import { getUserInitials } from '../../utils/userHelpers';

/* ── Component ── */

const LearnerProfilePage: React.FC = () => {
  const { user } = useAuth();
  const updateProfile = useUpdateProfile();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const profileFields = [
    { key: 'first_name', label: 'First name', value: user?.first_name },
    { key: 'last_name', label: 'Last name', value: user?.last_name },
    { key: 'phone_number', label: 'Phone', value: (user as any)?.phone_number },
    { key: 'bio', label: 'Bio', value: (user as any)?.bio },
    { key: 'country', label: 'Country', value: (user as any)?.country },
    { key: 'timezone', label: 'Timezone', value: (user as any)?.timezone },
    { key: 'avatar', label: 'Profile photo', value: user?.avatar },
  ];
  
  const completedFields = profileFields.filter(f => f.value && String(f.value).trim()).length;
  const completionPercent = Math.round((completedFields / profileFields.length) * 100);
  const missingFields = profileFields.filter(f => !f.value || !String(f.value).trim()).map(f => f.label);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) { alert('Image must be under 5MB'); return; }
    if (!file.type.startsWith('image/')) { alert('Please select an image file'); return; }
    try {
      setAvatarUploading(true);
      const publicUrl = await uploadApi.uploadAvatar(file);
      await updateProfile.mutateAsync({ avatar: publicUrl });
    } catch {
      alert('Failed to upload avatar. Please try again.');
    } finally {
      setAvatarUploading(false);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  };

  // Form states
  const [formData, setFormData] = useState({
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    headline: user?.role === 'instructor' ? 'Instructor' : 'Learner',
    bio: (user as any)?.bio || '',
    email: user?.email || '',
    phone: (user as any)?.phone || '',
    location: (user as any)?.location || '',
  });

  const [saving, setSaving] = useState(false);



  return (
    <Box className="learner-page" sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} />

<Box component="main" sx={{ flexGrow: 1, p: 0, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, overflowX: 'hidden', minWidth: 0, maxWidth: '100vw' }}>
  <Toolbar />

  {/* Profile Completion Banner */}
  {completionPercent < 100 && (
    <Paper elevation={0} sx={{ mx: 3, mt: 2, p: 2, borderRadius: 2, bgcolor: '#fff7ed', border: '1px solid #fed7aa' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Box sx={{ flex: 1, minWidth: 200 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Typography variant="body2" fontWeight={600} color="#9a3412">
              Profile Completion: {completionPercent}%
            </Typography>
            <Box sx={{ flex: 1, height: 6, bgcolor: '#fed7aa', borderRadius: 3, overflow: 'hidden' }}>
              <Box sx={{ height: '100%', width: `${completionPercent}%`, bgcolor: completionPercent >= 80 ? '#10b981' : '#f97316', borderRadius: 3, transition: 'width 0.3s' }} />
            </Box>
          </Box>
          <Typography variant="caption" color="#9a3412">
            Complete your profile to get the most out of TASC LMS. Missing: {missingFields.slice(0, 3).join(', ')}{missingFields.length > 3 ? '...' : ''}
          </Typography>
        </Box>
        <Button 
          size="small" 
          variant="contained" 
          onClick={() => setActiveTab(1)}
          sx={{ textTransform: 'none', bgcolor: '#f97316', '&:hover': { bgcolor: '#ea580c' } }}
        >
          Complete Profile
        </Button>
      </Box>
    </Paper>
  )}

  {/* Cover Image */}
        <Box
          sx={{
            height: 200,
            backgroundImage: 'url("/new banner images/Learner Dashboard.webp")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
          }}
        >
           {/* Edit Cover Button */}
           <Button
            variant="contained"
            startIcon={<CameraIcon />}
            size="small"
            sx={{
              position: 'absolute',
              bottom: 12,
              right: { xs: 12, md: 24 },
              bgcolor: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(4px)',
              boxShadow: 'none',
              textTransform: 'none',
              fontSize: { xs: '0.75rem', sm: '0.8rem' },
              px: { xs: 1.5, sm: 2 },
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
                src={(user?.avatar ?? user?.google_picture ?? undefined) as string | undefined}
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
                {getUserInitials(formData.firstName, formData.lastName)}
              </Avatar>
              <input ref={avatarInputRef} type="file" accept="image/*" hidden onChange={handleAvatarChange} />
              <IconButton
                onClick={() => avatarInputRef.current?.click()}
                disabled={avatarUploading}
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
                {avatarUploading ? <CircularProgress size={18} sx={{ color: 'white' }} /> : <CameraIcon fontSize="small" />}
              </IconButton>
            </Box>

            {/* User Info */}
            <Box sx={{ flex: 1, textAlign: { xs: 'center', md: 'left' } }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>{formData.firstName} {formData.lastName}</Typography>
              <Typography color="text.secondary" sx={{ mb: 1 }}>{formData.headline}</Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' }, color: 'text.disabled', fontSize: '0.85rem', flexWrap: 'wrap' }}>
                {formData.location && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <LocIcon fontSize="small" /> {formData.location}
                  </Box>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <EmailIcon fontSize="small" /> {formData.email}
                </Box>
              </Box>
            </Box>

            {/* Actions */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" startIcon={<EditIcon />} size="small" sx={{ borderRadius: '50px', textTransform: 'none', fontWeight: 600, fontSize: { xs: '0.75rem', sm: '0.8rem' }, px: { xs: 1.5, sm: 2 }, whiteSpace: 'nowrap' }}>Edit Profile</Button>
            </Box>
          </Paper>

          {/* Main Content Grid */}
          <Grid container spacing={3}>
            {/* Left Sidebar Tabs — vertical on md+, horizontal on xs/sm */}
            <Grid size={{ xs: 12, md: 3 }}>
              <Paper elevation={0} sx={{ borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <Tabs
                  orientation="vertical"
                  value={activeTab}
                  onChange={(_, v) => setActiveTab(v)}
                  sx={{
                    display: { xs: 'none', md: 'flex' },
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
                    '& .MuiTabs-indicator': { display: 'none' },
                  }}
                >
                  <Tab icon={<PersonIcon sx={{ mr: 1 }} />} iconPosition="start" label="Personal Info" />
                  <Tab icon={<SecurityIcon sx={{ mr: 1 }} />} iconPosition="start" label="Security" />
                </Tabs>
                <Tabs
                  value={activeTab}
                  onChange={(_, v) => setActiveTab(v)}
                  sx={{
                    display: { xs: 'flex', md: 'none' },
                    '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.85rem', minHeight: 44 },
                    '& .MuiTabs-indicator': { height: 2.5, borderRadius: 2 },
                  }}
                >
                  <Tab icon={<PersonIcon sx={{ mr: 0.5, fontSize: 18 }} />} iconPosition="start" label="Personal Info" />
                  <Tab icon={<SecurityIcon sx={{ mr: 0.5, fontSize: 18 }} />} iconPosition="start" label="Security" />
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
                        <TextField fullWidth multiline rows={4} label="Bio" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} variant="outlined" />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField fullWidth label="Phone Number" placeholder="+256 712345678" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} variant="outlined" InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon fontSize="small" /></InputAdornment> }} />
                      </Grid>
                      <Grid size={{ xs: 12, sm: 6 }}>
                        <TextField fullWidth label="Location" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} variant="outlined" InputProps={{ startAdornment: <InputAdornment position="start"><LocIcon fontSize="small" /></InputAdornment> }} />
                      </Grid>
                      <Grid size={{ xs: 12 }}>
                         <Divider sx={{ my: 2 }} />
                         <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                           <Button
                             variant="contained"
                             size="large"
                             disabled={saving}
                             onClick={async () => {
                               try {
                                 setSaving(true);
                                 await updateProfile.mutateAsync({
                                   first_name: formData.firstName,
                                   last_name: formData.lastName,
                                   bio: formData.bio,
                                   phone_number: formData.phone,
                                   country: formData.location,
                                 });
                               } catch {
                                 alert('Failed to save changes. Please try again.');
                               } finally {
                                 setSaving(false);
                               }
                             }}
                             sx={{ borderRadius: '50px', px: { xs: 3, md: 4 }, textTransform: 'none', fontWeight: 600, color: 'white', fontSize: { xs: '0.8rem', md: '0.875rem' } }}
                           >
                             {saving ? 'Saving...' : 'Save Changes'}
                           </Button>
                         </Box>
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {activeTab === 1 && (
                  <Box className="ld-fade-in-0">
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Change Password</Typography>
                    <ChangePasswordForm />
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
