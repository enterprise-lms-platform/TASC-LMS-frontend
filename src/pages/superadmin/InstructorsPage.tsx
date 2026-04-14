import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box, Paper, Typography, Grid, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, IconButton, Avatar, Button, TextField, CircularProgress,
} from '@mui/material';
import {
  School as InstructorIcon, Star as StarIcon, MenuBook as CourseIcon,
  Edit as EditIcon, Visibility as ViewIcon, PersonAdd as InviteIcon,
} from '@mui/icons-material';
import SuperadminLayout from '../../components/superadmin/SuperadminLayout';
import InviteInstructorModal from '../../components/superadmin/InviteInstructorModal';
import { useInstructorStats } from '../../services/learning.services';
import { usersApi } from '../../services/users.services';
import KPICard from '../../components/superadmin/KPICard';

const InstructorsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [inviteOpen, setInviteOpen] = useState(false);
  const { data: stats } = useInstructorStats();

  const { data: instructorsRaw, isLoading } = useQuery({
    queryKey: ['superadmin', 'instructors', search],
    queryFn: () => usersApi.getInstructors({ search: search || undefined, page_size: 100 }).then((r) => r.data),
  });

  const instructors = Array.isArray(instructorsRaw) ? instructorsRaw : (instructorsRaw as any)?.results ?? [];

  const kpis = [
    { label: 'Total Instructors', value: String(stats?.total ?? '—'), icon: <InstructorIcon />, bgColor: '#fff3e0', badgeColor: '#ffa424', valueColor: '#e65100', labelColor: '#9a3412' },
    { label: 'Active', value: String(stats?.active ?? '—'), icon: <InstructorIcon />, bgColor: '#e8f5e9', badgeColor: '#81c784', valueColor: '#2e7d32', labelColor: '#1b5e20' },
    { label: 'Avg Courses', value: String(stats?.avg_courses_per_instructor ?? '—'), icon: <StarIcon />, bgColor: '#fff8e1', badgeColor: '#ffd54f', valueColor: '#f57f17', labelColor: '#ff6f00' },
    { label: 'With Courses', value: String(stats?.with_courses ?? '—'), icon: <CourseIcon />, bgColor: '#f4f4f5', badgeColor: '#a1a1aa', valueColor: '#27272a', labelColor: '#3f3f46' },
  ];

  return (
    <SuperadminLayout title="Instructors" subtitle="Instructor management and performance overview">
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {kpis.map((k, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={k.label}>
            <KPICard title={k.label} value={k.value} icon={k.icon} bgColor={k.bgColor} badgeColor={k.badgeColor} valueColor={k.valueColor} labelColor={k.labelColor} index={index} />
          </Grid>
        ))}
      </Grid>

      <Paper elevation={0} sx={{ p: 3, borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <TextField
            size="small"
            placeholder="Search instructors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ minWidth: 250 }}
          />
          <Button
            variant="contained"
            startIcon={<InviteIcon />}
            onClick={() => setInviteOpen(true)}
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            Invite Instructor
          </Button>
        </Box>

        <InviteInstructorModal open={inviteOpen} onClose={() => setInviteOpen(false)} />

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress size={32} />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {['Instructor', 'Courses', 'Students', 'Avg Rating', 'Status', 'Joined', 'Actions'].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: 600, color: 'text.disabled', fontSize: '0.7rem', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {instructors.map((inst: any) => (
                  <TableRow key={inst.id} sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.015)' } }}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar
                          src={inst.avatar || inst.google_picture || undefined}
                          sx={{ width: 36, height: 36, background: 'linear-gradient(135deg, #ffb74d, #f97316)', fontSize: '0.8rem', fontWeight: 700 }}
                        >
                          {`${inst.first_name?.[0] ?? ''}${inst.last_name?.[0] ?? ''}`}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>{inst.name || `${inst.first_name} ${inst.last_name}`}</Typography>
                          <Typography variant="caption" color="text.secondary">{inst.email}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell><Typography variant="body2">{inst.courses_count ?? '—'}</Typography></TableCell>
                    <TableCell><Typography variant="body2">{(inst.students_count ?? 0).toLocaleString()}</Typography></TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <StarIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{inst.rating ?? '—'}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={inst.is_active ? 'Active' : 'Inactive'}
                        size="small"
                        sx={{
                          bgcolor: inst.is_active ? 'rgba(16, 185, 129, 0.1)' : 'rgba(156, 163, 175, 0.1)',
                          color: inst.is_active ? '#10b981' : '#71717a',
                          fontWeight: 500, fontSize: '0.75rem',
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {inst.date_joined ? new Date(inst.date_joined).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : '—'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <IconButton size="small" disabled sx={{ color: 'text.disabled' }} title="View instructor profile"><ViewIcon fontSize="small" /></IconButton>
                        <IconButton size="small" disabled sx={{ color: 'text.disabled' }} title="Edit instructor"><EditIcon fontSize="small" /></IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
                {instructors.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4, color: 'text.secondary' }}>No instructors found</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </SuperadminLayout>
  );
};

export default InstructorsPage;
