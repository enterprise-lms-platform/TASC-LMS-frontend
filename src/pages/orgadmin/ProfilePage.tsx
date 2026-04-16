import React, { useState, useRef } from 'react';
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Paper,
  Grid,
  Avatar,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  Person as ProfileIcon,
  PhotoCamera as CameraIcon,
  Save as SaveIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Shield as SecurityIcon,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import { useUpdateProfile } from '../../hooks/useAuthQueries';
import { getUserInitials } from '../../utils/userHelpers';
import { uploadApi } from '../../services/upload.services';
import Sidebar, { DRAWER_WIDTH } from '../../components/orgadmin/Sidebar';
import TopBar from '../../components/orgadmin/TopBar';
import ChangePasswordForm from '../../components/common/ChangePasswordForm';
import FeedbackSnackbar from '../../components/common/FeedbackSnackbar';

const cardSx = {
  borderRadius: '1rem',
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
};

const ProfilePage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [snackError, setSnackError] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');

  const { user, refreshUser } = useAuth();
  const updateProfile = useUpdateProfile();

  React.useEffect(() => {
    if (user) {
      setFirstName(user.first_name || '');
      setLastName(user.last_name || '');
    }
  }, [user]);

  const userInitials = getUserInitials(user?.first_name, user?.last_name);

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setSaving(true);
      const url = await uploadApi.uploadAvatar(file);
      await updateProfile.mutateAsync({ avatar: url });
      await refreshUser();
      setSnackError(null);
    } catch (err) {
      setSnackError('Failed to upload avatar');
    } finally {
      setSaving(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateProfile.mutateAsync({
        first_name: firstName,
        last_name: lastName,
        phone_number: phone || null,
        country: location || null,
        bio,
      });
      await refreshUser();
      setSnackError(null);
    } catch (err) {
      setSnackError('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.50', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} title="My Profile" />

      <Box component="main" sx={{ flexGrow: 1, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, minHeight: '100vh', minWidth: 0, maxWidth: '100vw' }}>
        <Toolbar sx={{ minHeight: '72px !important' }} />
        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 900 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Box sx={{ width: 44, height: 44, borderRadius: '12px', background: 'linear-gradient(135deg, #ffa424, #f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <ProfileIcon />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700}>My Profile</Typography>
              <Typography variant="body2" color="text.secondary">Manage your personal information</Typography>
            </Box>
          </Box>

          <Paper elevation={0} sx={{ ...cardSx, p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar sx={{ width: 96, height: 96, background: 'linear-gradient(135deg, #ffb74d, #f97316)', fontSize: '2rem', fontWeight: 600 }}>
                  {userInitials}
                </Avatar>
                <IconButton size="small" onClick={handleAvatarClick} sx={{ position: 'absolute', bottom: 0, right: 0, bgcolor: 'white', boxShadow: 1, '&:hover': { bgcolor: 'grey.100' } }}>
                  <CameraIcon fontSize="small" />
                </IconButton>
                <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleAvatarChange} />
              </Box>
              <Box>
                <Typography variant="h6" fontWeight={700}>{user?.first_name} {user?.last_name}</Typography>
                <Typography variant="body2" color="text.secondary">{user?.email}</Typography>
                <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                  <Typography variant="caption" sx={{ bgcolor: 'rgba(255,164,36,0.08)', color: '#b45309', px: 1, py: 0.25, borderRadius: 1, fontWeight: 600 }}>
                    Organization Admin
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ ml: 'auto' }}>
                <Button variant="contained" startIcon={saving ? <CircularProgress size={16} /> : <SaveIcon />} onClick={handleSave} disabled={saving} sx={{ textTransform: 'none', fontWeight: 600, borderRadius: '10px' }}>
                  Save Changes
                </Button>
              </Box>
            </Box>
          </Paper>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper elevation={0} sx={{ ...cardSx, p: 3 }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2 }}>Personal Information</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <TextField label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} fullWidth />
                  <TextField label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} fullWidth />
                  <TextField label="Email" value={user?.email || ''} fullWidth disabled InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon color="action" /></InputAdornment> }} />
                  <TextField label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} fullWidth placeholder="Enter phone number" InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon color="action" /></InputAdornment> }} />
                  <TextField label="Location" value={location} onChange={(e) => setLocation(e.target.value)} fullWidth placeholder="Enter location" InputProps={{ startAdornment: <InputAdornment position="start"><LocationIcon color="action" /></InputAdornment> }} />
                  <TextField label="Bio" value={bio} onChange={(e) => setBio(e.target.value)} fullWidth multiline rows={3} placeholder="Tell us about yourself" />
                </Box>
              </Paper>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <Paper elevation={0} sx={{ ...cardSx, p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <SecurityIcon sx={{ color: '#ffa424' }} />
                  <Typography variant="subtitle1" fontWeight={700}>Security</Typography>
                </Box>
                <ChangePasswordForm />
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>

      {snackError && <FeedbackSnackbar message={snackError} onClose={() => setSnackError(null)} />}
    </Box>
  );
};

export default ProfilePage;