import React, { useState } from 'react';
import {
  Box, Paper, Typography, Grid, TextField, MenuItem, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, IconButton, Avatar,
} from '@mui/material';
import {
  MenuBook as CoursesIcon, Publish as PublishIcon, Edit as EditIcon,
  Drafts as DraftIcon, Archive as ArchiveIcon, Visibility as ViewIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import SuperadminLayout from '../../components/superadmin/SuperadminLayout';

import KPICard from '../../components/superadmin/KPICard';

const kpis = [
  { 
    label: 'Total Courses', 
    value: '876', 
    icon: <CoursesIcon />, 
    // Warm Orange Theme
    bgColor: '#fff3e0', badgeColor: '#ffb74d', valueColor: '#e65100', labelColor: '#bf360c'
  },
  { 
    label: 'Published', 
    value: '654', 
    icon: <PublishIcon />, 
    // Mint Green Theme
    bgColor: '#e8f5e9', badgeColor: '#81c784', valueColor: '#2e7d32', labelColor: '#1b5e20'
  },
  { 
    label: 'Draft', 
    value: '178', 
    icon: <DraftIcon />, 
    // Light Amber Theme
    bgColor: '#fff8e1', badgeColor: '#ffd54f', valueColor: '#f57f17', labelColor: '#ff6f00'
  },
  { 
    label: 'Archived', 
    value: '44', 
    icon: <ArchiveIcon />, 
    // Cool Gray-Blue Theme
    bgColor: '#eceff1', badgeColor: '#90a4ae', valueColor: '#37474f', labelColor: '#263238'
  },
];

// ... (statusColors and catColors dictionaries remain unchanged)

const statusColors: Record<string, { bg: string; color: string }> = {
  Published: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
  Draft: { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' },
  Archived: { bg: 'rgba(156, 163, 175, 0.1)', color: '#71717a' },
};

const catColors: Record<string, { bg: string; color: string }> = {
  Technology: { bg: 'rgba(255, 164, 36, 0.1)', color: '#ffa424' },
  Business: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
  Design: { bg: 'rgba(113, 113, 122, 0.1)', color: '#71717a' },
  'Data Science': { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' },
  Marketing: { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981' },
};

const courses = [
  { title: 'Advanced React Patterns', instructor: 'John Kamau', category: 'Technology', enrollments: 452, rating: 4.8, status: 'Published' },
  { title: 'Data Science Fundamentals', instructor: 'Mary Wambui', category: 'Data Science', enrollments: 389, rating: 4.9, status: 'Published' },
  { title: 'Cybersecurity Essentials', instructor: 'Peter Ochieng', category: 'Technology', enrollments: 312, rating: 4.7, status: 'Published' },
  { title: 'Digital Marketing Strategy', instructor: 'Grace Akinyi', category: 'Marketing', enrollments: 278, rating: 4.5, status: 'Published' },
  { title: 'Cloud Architecture with AWS', instructor: 'David Mwangi', category: 'Technology', enrollments: 245, rating: 4.6, status: 'Published' },
  { title: 'UX/UI Design Principles', instructor: 'Sarah Nakamura', category: 'Design', enrollments: 198, rating: 4.8, status: 'Draft' },
  { title: 'Business Analytics', instructor: 'James Otieno', category: 'Business', enrollments: 167, rating: 4.4, status: 'Published' },
  { title: 'Python for Beginners', instructor: 'Faith Muthoni', category: 'Technology', enrollments: 534, rating: 4.9, status: 'Published' },
  { title: 'Project Management Pro', instructor: 'John Kamau', category: 'Business', enrollments: 0, rating: 0, status: 'Draft' },
  { title: 'Machine Learning Basics', instructor: 'Mary Wambui', category: 'Data Science', enrollments: 45, rating: 4.2, status: 'Archived' },
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
                {['Course', 'Instructor', 'Category', 'Enrollments', 'Rating', 'Status', 'Actions'].map((h) => (
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
