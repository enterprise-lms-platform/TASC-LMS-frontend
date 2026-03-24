import React, { useState } from 'react';
import {
  Box, Paper, Typography, Tabs, Tab, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Avatar, Chip, IconButton, Button, Skeleton,
} from '@mui/material';
import {
  People as UsersIcon, Visibility as ViewIcon, Edit as EditIcon,
  Delete as DeleteIcon, FilterList as FilterIcon, PersonAdd as PersonAddIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { usersApi } from '../../services/users.services';
import type { UserListItem } from '../../services/users.services';
import type { PaginatedResponse } from '../../types/types';

const avatarColors = [
  'linear-gradient(135deg, #667eea, #764ba2)',
  'linear-gradient(135deg, #11998e, #38ef7d)',
  'linear-gradient(135deg, #f093fb, #f5576c)',
  'linear-gradient(135deg, #fa709a, #fee140)',
  'linear-gradient(135deg, #4facfe, #00f2fe)',
];

const roleStyles: Record<string, { bg: string; color: string }> = {
  instructor: { bg: 'rgba(99,102,241,0.08)', color: '#6366f1' },
  learner: { bg: '#dcfce7', color: '#10b981' },
  finance: { bg: '#fff3e0', color: '#f59e0b' },
  manager: { bg: 'rgba(59,130,246,0.08)', color: '#3b82f6' },
  superadmin: { bg: 'rgba(239,68,68,0.08)', color: '#ef4444' },
};

const cardSx = {
  borderRadius: '1rem', overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
  transition: 'box-shadow 0.3s',
  '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
};
const thSx = { fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: '#71717a', py: 1.5 };

const UsersCoursesTable: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const navigate = useNavigate();

  const { data: usersRaw, isLoading } = useQuery({
    queryKey: ['manager', 'users', 'recent'],
    queryFn: () => usersApi.getAll({ page_size: 5 }).then(r => r.data),
  });

  const paginatedData = usersRaw as PaginatedResponse<UserListItem> | undefined;
  const users = paginatedData?.results ?? [];
  const totalCount = paginatedData?.count ?? users.length;

  return (
    <Paper elevation={0} sx={cardSx}>
      {/* Tabs */}
      <Tabs value={tabValue} onChange={(_e, v) => setTabValue(v)}
        sx={{
          bgcolor: 'grey.50', px: 3, borderBottom: 1, borderColor: 'divider',
          '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '0.85rem', minHeight: 52 },
          '& .Mui-selected': { color: '#ffa424' },
          '& .MuiTabs-indicator': { bgcolor: '#ffa424', height: 3, borderRadius: '3px 3px 0 0' },
        }}>
        <Tab label="Recent Users" />
        <Tab label="Courses Overview" />
        <Tab label="Recent Enrollments" />
      </Tabs>

      {tabValue === 0 && (
        <>
          {/* Action bar */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, px: 3, flexWrap: 'wrap', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <UsersIcon sx={{ color: '#ffa424', fontSize: 20 }} />
              <Typography fontWeight={700} sx={{ fontSize: '0.95rem' }}>Recent Users</Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button variant="outlined" size="small" startIcon={<FilterIcon />}
                sx={{ textTransform: 'none', fontWeight: 500, borderRadius: 2, borderColor: 'divider', color: 'text.primary', fontSize: '0.8rem',
                  '&:hover': { borderColor: '#ffa424', color: '#ffa424' } }}>
                Filter
              </Button>
              <Button variant="contained" size="small" startIcon={<PersonAddIcon />}
                onClick={() => navigate('/manager/users')}
                sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, fontSize: '0.8rem', boxShadow: 'none',
                  bgcolor: '#ffa424', '&:hover': { bgcolor: '#f59e0b', boxShadow: '0 2px 8px rgba(255,164,36,0.3)' } }}>
                Add User
              </Button>
            </Box>
          </Box>

          {/* Table */}
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={thSx}>User</TableCell>
                  <TableCell sx={thSx}>Role</TableCell>
                  <TableCell sx={{ ...thSx, display: { xs: 'none', md: 'table-cell' } }}>Status</TableCell>
                  <TableCell sx={{ ...thSx, display: { xs: 'none', sm: 'table-cell' } }}>Joined</TableCell>
                  <TableCell sx={thSx}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  [0, 1, 2, 3, 4].map(i => (
                    <TableRow key={i}>
                      <TableCell><Skeleton width="70%" /></TableCell>
                      <TableCell><Skeleton width={60} /></TableCell>
                      <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}><Skeleton width={50} /></TableCell>
                      <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}><Skeleton width={80} /></TableCell>
                      <TableCell><Skeleton width={80} /></TableCell>
                    </TableRow>
                  ))
                ) : (
                  users.map((user, i) => {
                    const initials = `${(user.first_name || '')[0] || ''}${(user.last_name || '')[0] || ''}`.toUpperCase() || user.email[0].toUpperCase();
                    const role = user.role || 'learner';
                    const rs = roleStyles[role] || roleStyles.learner;
                    return (
                      <TableRow key={user.id} sx={{ transition: 'background 0.15s', '&:hover': { bgcolor: 'rgba(255,164,36,0.03)' } }}>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ width: 36, height: 36, background: avatarColors[i % avatarColors.length], fontSize: '0.8rem', fontWeight: 600 }}>{initials}</Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight={600}>{user.name || `${user.first_name} ${user.last_name}`}</Typography>
                              <Typography variant="caption" color="text.disabled">{user.email}</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip label={role.charAt(0).toUpperCase() + role.slice(1)} size="small" sx={{ height: 22, fontSize: '0.7rem', fontWeight: 600, bgcolor: rs.bg, color: rs.color }} />
                        </TableCell>
                        <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                          <Chip label={user.is_active ? 'Active' : 'Inactive'} size="small"
                            sx={{ height: 22, fontSize: '0.7rem', fontWeight: 600,
                              bgcolor: user.is_active ? '#dcfce7' : 'rgba(156,163,175,0.1)',
                              color: user.is_active ? '#10b981' : '#71717a' }} />
                        </TableCell>
                        <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                          <Typography variant="body2" color="text.secondary">
                            {new Date(user.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            <IconButton size="small" onClick={() => navigate('/manager/users')}
                              sx={{ borderRadius: '8px', bgcolor: 'rgba(99,102,241,0.06)', '&:hover': { bgcolor: 'rgba(99,102,241,0.12)', color: '#6366f1' } }}>
                              <ViewIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                            <IconButton size="small" onClick={() => navigate('/manager/users')}
                              sx={{ borderRadius: '8px', bgcolor: 'rgba(245,158,11,0.06)', '&:hover': { bgcolor: 'rgba(245,158,11,0.12)', color: '#f59e0b' } }}>
                              <EditIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                            <IconButton size="small"
                              sx={{ borderRadius: '8px', bgcolor: 'rgba(239,68,68,0.06)', '&:hover': { bgcolor: 'rgba(239,68,68,0.12)', color: '#ef4444' } }}>
                              <DeleteIcon sx={{ fontSize: 16 }} />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Footer */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, px: 3, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="body2" color="text.disabled" sx={{ fontSize: '0.82rem' }}>
              Showing {users.length} of {totalCount.toLocaleString()} users
            </Typography>
            <Button variant="outlined" size="small" endIcon={<ArrowIcon />}
              onClick={() => navigate('/manager/users')}
              sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 2, borderColor: 'divider', color: 'text.primary', fontSize: '0.8rem',
                '&:hover': { borderColor: '#ffa424', color: '#ffa424' } }}>
              View All Users
            </Button>
          </Box>
        </>
      )}

      {tabValue === 1 && (
        <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
          <Typography>Courses Overview content coming soon...</Typography>
        </Box>
      )}
      {tabValue === 2 && (
        <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
          <Typography>Recent Enrollments content coming soon...</Typography>
        </Box>
      )}
    </Paper>
  );
};

export default UsersCoursesTable;
