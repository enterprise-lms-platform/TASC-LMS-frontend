import React, { useState, useRef } from 'react';
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
  Alert,
  CircularProgress,
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
  Shield as SecurityIcon,
  Notifications as NotifIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useUpdateProfile } from '../../hooks/useAuthQueries';
import { getUserInitials } from '../../utils/userHelpers';
import { uploadApi } from '../../services/upload.services';
import { getErrorMessage } from '../../utils/config';
import Sidebar, { DRAWER_WIDTH } from '../../components/manager/Sidebar';
import FeedbackSnackbar from '../../components/common/FeedbackSnackbar';

const cardSx = {
  borderRadius: '1rem',
  overflow: 'hidden',
  mb: 3,
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
  transition: 'box-shadow 0.3s',
  '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
} as const;

const ManagerProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const updateProfile = useUpdateProfile();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const [snackError, setSnackError] = useState<string | null>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [firstName, setFirstName] = useState(user?.first_name ?? '');
  const [lastName, setLastName] = useState(user?.last_name ?? '');
  const email = user?.email ?? '';
  const [phone, setPhone] = useState(user?.phone_number ?? '');
  const [location, setLocation] = useState(user?.country ?? '');
  const [bio, setBio] = useState('');

  React.useEffect(() => {
    if (user) {
      setFirstName(user.first_name ?? '');
      setLastName(user.last_name ?? '');
      setPhone(user.phone_number ?? '');
      setLocation(user.country ?? '');
      setBio(user.bio ?? '');
    }
  }, [user]);

  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  const displayName = [firstName, lastName].filter(Boolean).join(' ') || user?.email || 'User';
  const displayInitials = getUserInitials(firstName || user?.first_name, lastName || user?.last_name);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setSnackError('Image must be under 5MB'); return; }
    if (!file.type.startsWith('image/')) { setSnackError('Please select an image file'); return; }
    try {
      setAvatarUploading(true);
      const publicUrl = await uploadApi.uploadAvatar(file);
      await updateProfile.mutateAsync({ avatar: publicUrl });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setSnackError(getErrorMessage(err));
    } finally {
      setAvatarUploading(false);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    setSnackError(null);
    try {
      await updateProfile.mutateAsync({
        first_name: firstName,
        last_name: lastName,
        phone_number: phone || null,
        country: location || null,
        bio,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setSnackError(getErrorMessage(err));
    }
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
          <Button startIcon={<BackIcon />} onClick={() => navigate('/manager')} sx={{ color: 'text.secondary', textTransform: 'none', fontWeight: 500 }}>
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
            disabled={updateProfile.isPending}
            sx={{ textTransform: 'none', fontWeight: 600, bgcolor: 'primary.main' }}
          >
            {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, minHeight: '100vh' }}>
        <Toolbar sx={{ minHeight: '72px !important' }} />

        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 900, mx: 'auto' }}>
          {saved && <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>Profile updated successfully!</Alert>}

          {/* Avatar Section */}
          <Paper elevation={0} sx={cardSx}>
            <Box sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 3, bgcolor: 'grey.50' }}>
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src={(user?.avatar ?? user?.google_picture ?? undefined) as string | undefined}
                  sx={{ width: 96, height: 96, fontSize: '2rem', fontWeight: 700, background: 'linear-gradient(135deg, #ffb74d, #f97316)' }}
                >
                  {displayInitials}
                </Avatar>
                <input ref={avatarInputRef} type="file" accept="image/*" hidden onChange={handleAvatarChange} />
                <IconButton
                  size="small"
                  onClick={() => avatarInputRef.current?.click()}
                  disabled={avatarUploading}
                  sx={{ position: 'absolute', bottom: 0, right: 0, bgcolor: 'white', border: 1, borderColor: 'divider', '&:hover': { bgcolor: 'grey.100' } }}
                >
                  {avatarUploading ? <CircularProgress size={16} /> : <CameraIcon sx={{ fontSize: 18 }} />}
                </IconButton>
              </Box>
              <Box>
                <Typography variant="h5" fontWeight={700}>{displayName}</Typography>
                <Typography variant="body2" color="text.secondary">LMS Manager</Typography>
              </Box>
            </Box>
          </Paper>

          {/* Personal Info */}
          <Paper elevation={0} sx={cardSx}>
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
                  <TextField fullWidth label="Email" value={email} disabled helperText="Email cannot be changed" InputProps={{ startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.disabled', fontSize: 20 }} /> }} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} InputProps={{ startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.disabled', fontSize: 20 }} /> }} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <TextField fullWidth label="Location" value={location} onChange={(e) => setLocation(e.target.value)} InputProps={{ startAdornment: <LocationIcon sx={{ mr: 1, color: 'text.disabled', fontSize: 20 }} /> }} />
                </Grid>
                <Grid size={{ xs: 12 }}>
                  <TextField fullWidth label="Bio" value={bio} onChange={(e) => setBio(e.target.value)} multiline minRows={3} />
                </Grid>
              </Grid>
            </Box>
          </Paper>

          {/* Notifications */}
          <Paper elevation={0} sx={cardSx}>
            <Box sx={{ p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}>
              <Typography fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <NotifIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                Notification Preferences
              </Typography>
            </Box>
            <Box sx={{ p: 3 }}>
              <FormControlLabel control={<Switch checked={emailNotifs} onChange={(e) => setEmailNotifs(e.target.checked)} color="primary" />} label="Email notifications" />
              <FormControlLabel control={<Switch checked={pushNotifs} onChange={(e) => setPushNotifs(e.target.checked)} color="primary" />} label="Push notifications" />
            </Box>
          </Paper>

          {/* Security */}
          <Paper elevation={0} sx={cardSx}>
            <Box sx={{ p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}>
              <Typography fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SecurityIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                Security
              </Typography>
            </Box>
            <Box sx={{ p: 3 }}>
              <FormControlLabel control={<Switch checked={twoFactor} onChange={(e) => setTwoFactor(e.target.checked)} color="primary" />} label="Enable two-factor authentication" />
              <Divider sx={{ my: 2 }} />
              <Button variant="outlined" sx={{ textTransform: 'none', fontWeight: 500, borderColor: 'divider', color: 'text.secondary' }}>
                Change Password
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>

      <FeedbackSnackbar message={snackError} onClose={() => setSnackError(null)} />
    </Box>
  );
};

export default ManagerProfilePage;
