import React, { useState } from 'react';
import { useCourseStats } from '../../services/learning.services';
import { useCourses } from '../../hooks/useCatalogue';
import {
  Box, Paper, Typography, Grid, TextField, MenuItem, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, IconButton, Avatar, CircularProgress, Button,
} from '@mui/material';
import {
  MenuBook as CoursesIcon, Publish as PublishIcon, Edit as EditIcon,
  Drafts as DraftIcon, Archive as ArchiveIcon, Visibility as ViewIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import SuperadminLayout from '../../components/superadmin/SuperadminLayout';
import KPICard from '../../components/superadmin/KPICard';
import { exportApi } from '../../services/superadmin.services';

const statusColors: Record<string, { bg: string; color: string }> = {
  published: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
  draft: { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' },
  pending_approval: { bg: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' },
  approved: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
  rejected: { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' },
  archived: { bg: 'rgba(156, 163, 175, 0.1)', color: '#71717a' },
};

const AllCoursesPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const { data: stats } = useCourseStats();
  const { data: coursesRaw, isLoading } = useCourses({ page_size: 100 });

  const courses = Array.isArray(coursesRaw) ? coursesRaw : (coursesRaw as any)?.results ?? [];

  const kpis = [
    {
      label: 'Total Courses',
      value: String(stats?.total ?? '—'),
      icon: <CoursesIcon />,
      bgColor: '#fff3e0', badgeColor: '#ffb74d', valueColor: '#e65100', labelColor: '#bf360c'
    },
    {
      label: 'Published',
      value: String(stats?.published ?? '—'),
      icon: <PublishIcon />,
      bgColor: '#e8f5e9', badgeColor: '#81c784', valueColor: '#2e7d32', labelColor: '#1b5e20'
    },
    {
      label: 'Draft',
      value: String(stats?.draft ?? '—'),
      icon: <DraftIcon />,
      bgColor: '#fff8e1', badgeColor: '#ffd54f', valueColor: '#f57f17', labelColor: '#ff6f00'
    },
    {
      label: 'Archived',
      value: String(stats?.archived ?? '—'),
      icon: <ArchiveIcon />,
      bgColor: '#eceff1', badgeColor: '#90a4ae', valueColor: '#37474f', labelColor: '#263238'
    },
  ];

  const categories = ['All', ...Array.from(new Set(courses.map((c: any) => c.category?.name).filter(Boolean)))];

  const filtered = courses.filter((c: any) => {
    if (statusFilter !== 'All' && c.status !== statusFilter) return false;
    if (categoryFilter !== 'All' && c.category?.name !== categoryFilter) return false;
    return true;
  });

  return (
    <SuperadminLayout title="All Courses" subtitle="Course oversight and management">
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {kpis.map((k, index) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={k.label}>
            <KPICard
              title={k.label}
              value={k.value}
              icon={k.icon}
              bgColor={k.bgColor}
              badgeColor={k.badgeColor}
              valueColor={k.valueColor}
              labelColor={k.labelColor}
              index={index}
            />
          </Grid>
        ))}
      </Grid>

      <Paper elevation={0} sx={{ p: 3, borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <TextField size="small" placeholder="Search courses..." sx={{ minWidth: 200, flex: 1 }} />
          <TextField size="small" select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} sx={{ minWidth: 150 }}>
            {categories.map((v) => <MenuItem key={v as string} value={v as string}>{v as string}</MenuItem>)}
          </TextField>
          <TextField size="small" select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} sx={{ minWidth: 130 }}>
            {['All', 'published', 'draft', 'pending_approval', 'approved', 'archived'].map((v) => (
              <MenuItem key={v} value={v}>{v === 'All' ? 'All' : v.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}</MenuItem>
            ))}
          </TextField>
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<DownloadIcon />}
            onClick={() => exportApi.courses()}
            sx={{ textTransform: 'none', fontWeight: 600, ml: 'auto' }}
          >
            Export CSV
          </Button>
        </Box>

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
            <CircularProgress size={32} />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {['Course', 'Instructor', 'Category', 'Enrollments', 'Status', 'Actions'].map((h) => (
                      <TableCell key={h} sx={{ fontWeight: 600, color: 'text.disabled', fontSize: '0.7rem', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map((c: any) => (
                    <TableRow key={c.id} sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.015)' } }}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar variant="rounded" src={c.thumbnail || undefined} sx={{ width: 40, height: 40, bgcolor: 'grey.200', fontSize: '0.7rem' }}>
                            {c.title?.substring(0, 2)}
                          </Avatar>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>{c.title}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell><Typography variant="body2">{c.instructor_name || '—'}</Typography></TableCell>
                      <TableCell>
                        {c.category?.name ? (
                          <Chip label={c.category.name} size="small" sx={{ fontWeight: 500, fontSize: '0.75rem' }} />
                        ) : (
                          <Typography variant="body2" color="text.secondary">—</Typography>
                        )}
                      </TableCell>
                      <TableCell><Typography variant="body2">{(c.enrollment_count ?? 0).toLocaleString()}</Typography></TableCell>
                      <TableCell>
                        <Chip
                          label={c.status?.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                          size="small"
                          sx={{ bgcolor: statusColors[c.status]?.bg, color: statusColors[c.status]?.color, fontWeight: 500, fontSize: '0.75rem' }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          <IconButton size="small" sx={{ color: 'text.disabled', '&:hover': { color: 'primary.main', bgcolor: 'rgba(0,0,0,0.04)' } }}><ViewIcon fontSize="small" /></IconButton>
                          <IconButton size="small" sx={{ color: 'text.disabled', '&:hover': { color: 'primary.main', bgcolor: 'rgba(0,0,0,0.04)' } }}><EditIcon fontSize="small" /></IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 4, color: 'text.secondary' }}>No courses found</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'right' }}>
              Showing {filtered.length} of {courses.length} courses
            </Typography>
          </>
        )}
      </Paper>
    </SuperadminLayout>
  );
};

export default AllCoursesPage;
