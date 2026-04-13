import React, { useState } from 'react';
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Paper,
  TextField,
  Chip,
  Avatar,
  Alert,
} from '@mui/material';
import Sidebar, { DRAWER_WIDTH } from '../../components/orgadmin/Sidebar';
import TopBar from '../../components/orgadmin/TopBar';
import { useAuth } from '../../contexts/AuthContext';
import { getUserInitials } from '../../utils/userHelpers';

const cardSx = {
  borderRadius: '1rem',
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
};

const ProfilePage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();

  const userInitials = getUserInitials(user?.first_name, user?.last_name);

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.50', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} title="My Profile" />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          minWidth: 0,
          maxWidth: '100vw',
        }}
      >
        <Toolbar sx={{ minHeight: '72px !important' }} />
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Paper elevation={0} sx={{ ...cardSx, p: 4, maxWidth: 600 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 4 }}>
              <Avatar
                sx={{
                  width: 80,
                  height: 80,
                  background: 'linear-gradient(135deg, #ffb74d, #f97316)',
                  fontSize: '1.5rem',
                  fontWeight: 600,
                }}
              >
                {userInitials}
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight={700}>
                  {user?.first_name} {user?.last_name}
                </Typography>
                <Chip
                  label="Organization Admin"
                  size="small"
                  sx={{ mt: 1, bgcolor: 'rgba(255,164,36,0.08)', color: 'primary.dark', fontWeight: 600 }}
                />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <TextField
                label="First Name"
                value={user?.first_name ?? ''}
                fullWidth
                disabled
              />
              <TextField
                label="Last Name"
                value={user?.last_name ?? ''}
                fullWidth
                disabled
              />
              <TextField
                label="Email"
                value={user?.email ?? ''}
                fullWidth
                disabled
              />
              <TextField
                label="Role"
                value="Organization Admin"
                fullWidth
                disabled
              />
            </Box>

            <Alert severity="info" sx={{ mt: 3 }}>
              Edit profile coming soon
            </Alert>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;