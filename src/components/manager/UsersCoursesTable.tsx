import React, { useState } from 'react';
import {
  Box, Paper, Typography, Tabs, Tab, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Avatar, Chip, IconButton, Button,
} from '@mui/material';
import {
  People as UsersIcon, Visibility as ViewIcon, Edit as EditIcon,
  Delete as DeleteIcon, FilterList as FilterIcon, PersonAdd as PersonAddIcon,
  ArrowForward as ArrowIcon,
} from '@mui/icons-material';

const usersData = [
  { name: 'Michael Rodriguez', email: 'michael.r@acme.com', initials: 'MR', avatarColor: 'linear-gradient(135deg, #667eea, #764ba2)', role: 'Instructor', roleBg: 'rgba(99,102,241,0.08)', roleColor: '#6366f1', department: 'Engineering', courses: '4 courses', status: 'Active', statusBg: '#dcfce7', statusColor: '#10b981' },
  { name: 'Emma Chen', email: 'emma.c@acme.com', initials: 'EC', avatarColor: 'linear-gradient(135deg, #11998e, #38ef7d)', role: 'Learner', roleBg: '#dcfce7', roleColor: '#10b981', department: 'Marketing', courses: '6 courses', status: 'Active', statusBg: '#dcfce7', statusColor: '#10b981' },
  { name: 'David Wilson', email: 'david.w@acme.com', initials: 'DW', avatarColor: 'linear-gradient(135deg, #f093fb, #f5576c)', role: 'Instructor', roleBg: 'rgba(99,102,241,0.08)', roleColor: '#6366f1', department: 'Sales', courses: '3 courses', status: 'Pending', statusBg: '#fff3e0', statusColor: '#f59e0b' },
  { name: 'Lisa Thompson', email: 'lisa.t@acme.com', initials: 'LT', avatarColor: 'linear-gradient(135deg, #fa709a, #fee140)', role: 'Finance', roleBg: '#fff3e0', roleColor: '#f59e0b', department: 'Finance', courses: '2 courses', status: 'Active', statusBg: '#dcfce7', statusColor: '#10b981' },
  { name: 'James Kariuki', email: 'james.k@acme.com', initials: 'JK', avatarColor: 'linear-gradient(135deg, #4facfe, #00f2fe)', role: 'Learner', roleBg: '#dcfce7', roleColor: '#10b981', department: 'Engineering', courses: '8 courses', status: 'Active', statusBg: '#dcfce7', statusColor: '#10b981' },
];

const cardSx = {
  borderRadius: '1rem', overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
  transition: 'box-shadow 0.3s',
  '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
};
const thSx = { fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase' as const, letterSpacing: '0.06em', color: '#71717a', py: 1.5 };

const UsersCoursesTable: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

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
                  <TableCell sx={{ ...thSx, display: { xs: 'none', md: 'table-cell' } }}>Department</TableCell>
                  <TableCell sx={{ ...thSx, display: { xs: 'none', sm: 'table-cell' } }}>Courses</TableCell>
                  <TableCell sx={thSx}>Status</TableCell>
                  <TableCell sx={thSx}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {usersData.map((user, i) => (
                  <TableRow key={i} sx={{ transition: 'background 0.15s', '&:hover': { bgcolor: 'rgba(255,164,36,0.03)' } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ width: 36, height: 36, background: user.avatarColor, fontSize: '0.8rem', fontWeight: 600 }}>{user.initials}</Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight={600}>{user.name}</Typography>
                          <Typography variant="caption" color="text.disabled">{user.email}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={user.role} size="small" sx={{ height: 22, fontSize: '0.7rem', fontWeight: 600, bgcolor: user.roleBg, color: user.roleColor }} />
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                      <Typography variant="body2" color="text.secondary">{user.department}</Typography>
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                      <Typography variant="body2" color="text.secondary">{user.courses}</Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={user.status} size="small"
                        sx={{ height: 22, fontSize: '0.7rem', fontWeight: 600, bgcolor: user.statusBg, color: user.statusColor,
                          '& .MuiChip-label': { display: 'flex', alignItems: 'center', gap: 0.5 } }} />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton size="small" sx={{ borderRadius: '8px', bgcolor: 'rgba(99,102,241,0.06)', '&:hover': { bgcolor: 'rgba(99,102,241,0.12)', color: '#6366f1' } }}>
                          <ViewIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                        <IconButton size="small" sx={{ borderRadius: '8px', bgcolor: 'rgba(245,158,11,0.06)', '&:hover': { bgcolor: 'rgba(245,158,11,0.12)', color: '#f59e0b' } }}>
                          <EditIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                        <IconButton size="small" sx={{ borderRadius: '8px', bgcolor: 'rgba(239,68,68,0.06)', '&:hover': { bgcolor: 'rgba(239,68,68,0.12)', color: '#ef4444' } }}>
                          <DeleteIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Footer */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, px: 3, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="body2" color="text.disabled" sx={{ fontSize: '0.82rem' }}>
              Showing 5 of 2,450 users
            </Typography>
            <Button variant="outlined" size="small" endIcon={<ArrowIcon />}
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
