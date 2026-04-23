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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Snackbar,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Logout as LogoutIcon,
  Search as SearchIcon,
  ChevronLeft as PrevIcon,
  ChevronRight as NextIcon,
  PersonRemove as PersonRemoveIcon,
} from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../../components/orgadmin/Sidebar';
import { useLogout } from '../../hooks/useLogout';
import { useOrgAdminMembers, useUnassignMember } from '../../hooks/useOrgAdmin';
import { useDebounce } from '../../hooks/useDebounce';
import { getRoleDisplayName, formatDate } from '../../utils/userHelpers';
import type { UserRole } from '../../types/types';
import type { ManagerMemberItem } from '../../services/organization.services';

const PAGE_SIZE = 20;

const MembersPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [unassignTarget, setUnassignTarget] = useState<ManagerMemberItem | null>(null);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const handleLogout = useLogout();
  const unassignMember = useUnassignMember();

  const debouncedSearch = useDebounce(search, 300);

  const prevSearch = React.useRef(debouncedSearch);
  React.useEffect(() => {
    if (prevSearch.current !== debouncedSearch) {
      setPage(1);
      prevSearch.current = debouncedSearch;
    }
  }, [debouncedSearch]);

  const { data, isLoading, error } = useOrgAdminMembers({
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
    page,
    page_size: PAGE_SIZE,
  });

  const members = data?.results ?? [];
  const totalCount = data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const handleUnassign = () => {
    if (!unassignTarget?.membership_id) return;
    unassignMember.mutate(unassignTarget.membership_id, {
      onSuccess: () => {
        setSnackbar({ open: true, message: `${unassignTarget.name} has been removed from the organization.`, severity: 'success' });
        setUnassignTarget(null);
      },
      onError: () => {
        setSnackbar({ open: true, message: 'Failed to remove member. Please try again.', severity: 'error' });
        setUnassignTarget(null);
      },
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
              <>
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
                        <TableCell align="right">Actions</TableCell>
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
                        <TableCell align="right">
                          {m.membership_id ? (
                            <Tooltip title="Remove from organization">
                              <IconButton
                                size="small"
                                onClick={() => setUnassignTarget(m)}
                                sx={{ color: 'text.secondary', '&:hover': { color: '#ef4444', bgcolor: 'rgba(239,68,68,0.08)' } }}
                              >
                                <PersonRemoveIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          ) : null}
                        </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    px: 2,
                    py: 1.5,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, totalCount)} of {totalCount}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                      size="small"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      <PrevIcon />
                    </IconButton>
                    <Typography variant="body2" fontWeight={600}>
                      {page} / {totalPages}
                    </Typography>
                    <IconButton
                      size="small"
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      <NextIcon />
                    </IconButton>
                  </Box>
                </Box>
              </>
            )}
        </Paper>
        </Box>

        <Dialog open={!!unassignTarget} onClose={() => setUnassignTarget(null)}>
            <DialogTitle>Unassign Member</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to unassign <strong>{unassignTarget?.name}</strong> from your organization?
                    This will free up their seat. The user will lose access to organization content.
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setUnassignTarget(null)} sx={{ textTransform: 'none' }}>Cancel</Button>
                <Button
                    onClick={handleUnassign}
                    color="error"
                    variant="contained"
                    disabled={unassignMember.isPending}
                    sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                    {unassignMember.isPending ? 'Unassigning...' : 'Unassign'}
                </Button>
            </DialogActions>
        </Dialog>

        <Snackbar
            open={snackbar.open}
            autoHideDuration={4000}
            onClose={() => setSnackbar(s => ({ ...s, open: false }))}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert
                onClose={() => setSnackbar(s => ({ ...s, open: false }))}
                severity={snackbar.severity}
                variant="filled"
            >
                {snackbar.message}
            </Alert>
        </Snackbar>
        </Box>
        </Box>
  );
};

export default MembersPage;
