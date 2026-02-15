import React, { useState } from 'react';
import {
  Box, Paper, Typography, Grid, TextField, MenuItem, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, IconButton, Avatar,
} from '@mui/material';
import {
  MenuBook as CoursesIcon, Publish as PublishIcon, Edit as EditIcon,
  Drafts as DraftIcon, Archive as ArchiveIcon, Visibility as ViewIcon,
  Star as StarIcon, TrendingUp as TrendIcon,
} from '@mui/icons-material';
import SuperadminLayout from '../../components/superadmin/SuperadminLayout';

const kpis = [
  { label: 'Total Courses', value: '876', icon: <CoursesIcon />, gradient: 'linear-gradient(135deg, #3b82f6, #60a5fa)', trend: '+24 this month' },
  { label: 'Published', value: '654', icon: <PublishIcon />, gradient: 'linear-gradient(135deg, #10b981, #34d399)', trend: '74.7% of total' },
  { label: 'Draft', value: '178', icon: <DraftIcon />, gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)', trend: '20.3% of total' },
  { label: 'Archived', value: '44', icon: <ArchiveIcon />, gradient: 'linear-gradient(135deg, #8b5cf6, #a78bfa)', trend: '5% of total' },
];

const statusColors: Record<string, { bg: string; color: string }> = {
  Published: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
  Draft: { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' },
  Archived: { bg: 'rgba(156, 163, 175, 0.1)', color: '#71717a' },
};

const catColors: Record<string, { bg: string; color: string }> = {
  Technology: { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' },
  Business: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
  Design: { bg: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' },
  'Data Science': { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' },
  Marketing: { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' },
};

const courses = [
  { title: 'Advanced React Patterns', instructor: 'John Kamau', category: 'Technology', enrollments: 452, rating: 4.8, status: 'Published', price: '$49.99' },
  { title: 'Data Science Fundamentals', instructor: 'Mary Wambui', category: 'Data Science', enrollments: 389, rating: 4.9, status: 'Published', price: '$59.99' },
  { title: 'Cybersecurity Essentials', instructor: 'Peter Ochieng', category: 'Technology', enrollments: 312, rating: 4.7, status: 'Published', price: '$39.99' },
  { title: 'Digital Marketing Strategy', instructor: 'Grace Akinyi', category: 'Marketing', enrollments: 278, rating: 4.5, status: 'Published', price: '$29.99' },
  { title: 'Cloud Architecture with AWS', instructor: 'David Mwangi', category: 'Technology', enrollments: 245, rating: 4.6, status: 'Published', price: '$69.99' },
  { title: 'UX/UI Design Principles', instructor: 'Sarah Nakamura', category: 'Design', enrollments: 198, rating: 4.8, status: 'Draft', price: '$44.99' },
  { title: 'Business Analytics', instructor: 'James Otieno', category: 'Business', enrollments: 167, rating: 4.4, status: 'Published', price: '$54.99' },
  { title: 'Python for Beginners', instructor: 'Faith Muthoni', category: 'Technology', enrollments: 534, rating: 4.9, status: 'Published', price: '$19.99' },
  { title: 'Project Management Pro', instructor: 'John Kamau', category: 'Business', enrollments: 0, rating: 0, status: 'Draft', price: '$49.99' },
  { title: 'Machine Learning Basics', instructor: 'Mary Wambui', category: 'Data Science', enrollments: 45, rating: 4.2, status: 'Archived', price: '$59.99' },
];

const AllCoursesPage: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const filtered = courses.filter((c) => {
    if (statusFilter !== 'All' && c.status !== statusFilter) return false;
    if (categoryFilter !== 'All' && c.category !== categoryFilter) return false;
    return true;
  });

  return (
    <SuperadminLayout title="All Courses" subtitle="Course oversight and management">
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {kpis.map((k) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={k.label}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)', transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)', '&:hover': { boxShadow: '0 8px 25px rgba(0,0,0,0.08)', transform: 'translateY(-3px) scale(1.01)' } }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>{k.label}</Typography>
                <Box sx={{ width: 44, height: 44, borderRadius: '50%', background: k.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>{k.icon}</Box>
              </Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>{k.value}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <TrendIcon sx={{ fontSize: 18, color: 'success.main' }} />
                <Typography variant="body2" color="success.main" sx={{ fontWeight: 500 }}>{k.trend}</Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Paper elevation={0} sx={{ p: 3, borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <TextField size="small" placeholder="Search courses..." sx={{ minWidth: 200, flex: 1 }} />
          <TextField size="small" select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} sx={{ minWidth: 150 }}>
            {['All', 'Technology', 'Business', 'Design', 'Data Science', 'Marketing'].map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}
          </TextField>
          <TextField size="small" select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} sx={{ minWidth: 130 }}>
            {['All', 'Published', 'Draft', 'Archived'].map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}
          </TextField>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {['Course', 'Instructor', 'Category', 'Enrollments', 'Rating', 'Status', 'Price', 'Actions'].map((h) => (
                  <TableCell key={h} sx={{ fontWeight: 600, color: 'text.disabled', fontSize: '0.7rem', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.title} sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.015)' } }}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar variant="rounded" sx={{ width: 40, height: 40, bgcolor: 'grey.200', fontSize: '0.7rem' }}>{c.title.substring(0, 2)}</Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{c.title}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell><Typography variant="body2">{c.instructor}</Typography></TableCell>
                  <TableCell><Chip label={c.category} size="small" sx={{ bgcolor: catColors[c.category]?.bg, color: catColors[c.category]?.color, fontWeight: 500, fontSize: '0.75rem' }} /></TableCell>
                  <TableCell><Typography variant="body2">{c.enrollments.toLocaleString()}</Typography></TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <StarIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
                      <Typography variant="body2">{c.rating > 0 ? c.rating : '-'}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell><Chip label={c.status} size="small" sx={{ bgcolor: statusColors[c.status]?.bg, color: statusColors[c.status]?.color, fontWeight: 500, fontSize: '0.75rem' }} /></TableCell>
                  <TableCell><Typography variant="body2" sx={{ fontWeight: 500 }}>{c.price}</Typography></TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton size="small" sx={{ color: 'text.disabled', '&:hover': { color: 'primary.main', bgcolor: 'rgba(0,0,0,0.04)' } }}><ViewIcon fontSize="small" /></IconButton>
                      <IconButton size="small" sx={{ color: 'text.disabled', '&:hover': { color: 'primary.main', bgcolor: 'rgba(0,0,0,0.04)' } }}><EditIcon fontSize="small" /></IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'right' }}>Showing {filtered.length} of {courses.length} courses</Typography>
      </Paper>
    </SuperadminLayout>
  );
};

export default AllCoursesPage;
