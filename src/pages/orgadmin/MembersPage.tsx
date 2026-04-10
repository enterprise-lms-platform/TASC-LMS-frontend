import React, { useState } from 'react';
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Paper,
  IconButton,
  AppBar,
  Button,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import Sidebar, { DRAWER_WIDTH } from '../../components/orgadmin/Sidebar';
import { useLogout } from '../../hooks/useLogout';
import { managerMembersApi } from '../../services/organization.services';
import { getRoleDisplayName } from '../../utils/userHelpers';
import type { UserRole } from '../../types/types';

const MembersPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const handleLogout = useLogout();

  const debouncedSearch = useDebounce(search, 300);

  const { data: members = [], isLoading, error } = useQuery({
    queryKey: ['manager-members', debouncedSearch],
    queryFn: () =>
      managerMembersApi
        .getAll(debouncedSearch ? { search: debouncedSearch } : undefined)
        .then((r) => r.data),
  });

  const formatDate = (iso: string | null) => {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.50', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          bgcolor: 'white',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ minHeight: '72px !important', gap: 2 }}>
          <IconButton onClick={() => setMobileOpen(!mobileOpen)} sx={{ display: { md: 'none' }, color: 'text.secondary' }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" fontWeight={700} color="text.primary">
            Members
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{
              color: 'text.secondary',
              textTransform: 'none',
              fontWeight: 600,
              borderRadius: '10px',
              '&:hover': { color: '#ef4444', bgcolor: 'rgba(239,68,68,0.08)' },
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

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

        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400 }}>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 0.5 }}>
            Organization Members
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Users linked to your organization
          </Typography>

          <Paper
            elevation={0}
            sx={{
              borderRadius: '1rem',
              border: '1px solid',
              borderColor: 'divider',
              overflow: 'hidden',
            }}
          >
            <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              <TextField
                size="small"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'text.disabled', fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{ width: { xs: '100%', sm: 320 } }}
              />
            </Box>

            {error ? (
              <Alert severity="error" sx={{ m: 2 }}>
                Failed to load members. Please try again.
              </Alert>
            ) : isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress />
              </Box>
            ) : members.length === 0 ? (
              <Box sx={{ py: 6, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  {search ? 'No members match your search.' : 'No members found in your organization.'}
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow sx={{ '& th': { fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' } }}>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Role</TableCell>
                      <TableCell>Active</TableCell>
                      <TableCell>Verified</TableCell>
                      <TableCell>Joined</TableCell>
                      <TableCell>Last Login</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {members.map((m) => (
                      <TableRow key={m.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
                        <TableCell sx={{ fontWeight: 500 }}>{m.name}</TableCell>
                        <TableCell sx={{ color: 'text.secondary' }}>{m.email}</TableCell>
                        <TableCell>
                          <Chip
                            label={getRoleDisplayName(m.role as UserRole)}
                            size="small"
                            sx={{
                              fontWeight: 600,
                              fontSize: '0.7rem',
                              bgcolor: 'rgba(255,164,36,0.08)',
                              color: 'primary.dark',
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={m.is_active ? 'Active' : 'Inactive'}
                            size="small"
                            color={m.is_active ? 'success' : 'default'}
                            variant="outlined"
                            sx={{ fontWeight: 500, fontSize: '0.7rem' }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={m.email_verified ? 'Yes' : 'No'}
                            size="small"
                            color={m.email_verified ? 'success' : 'warning'}
                            variant="outlined"
                            sx={{ fontWeight: 500, fontSize: '0.7rem' }}
                          />
                        </TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                          {formatDate(m.date_joined)}
                        </TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                          {formatDate(m.last_login)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

function useDebounce<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = React.useState(value);
  React.useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);
  return debounced;
}

export default MembersPage;
