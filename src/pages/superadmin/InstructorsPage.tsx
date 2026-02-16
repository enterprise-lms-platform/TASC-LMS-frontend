import React from 'react';
import {
  Box, Paper, Typography, Grid, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, IconButton, Avatar, Button, TextField,
} from '@mui/material';
import {
  School as InstructorIcon, Star as StarIcon, MenuBook as CourseIcon,
  Edit as EditIcon, Visibility as ViewIcon,
  PersonAdd as InviteIcon,
} from '@mui/icons-material';
import SuperadminLayout from '../../components/superadmin/SuperadminLayout';

import KPICard from '../../components/superadmin/KPICard';

const kpis = [
  { 
    label: 'Total Instructors', 
    value: '156', 
    icon: <InstructorIcon />, 
    // Soft Blue Theme
    bgColor: '#e3f2fd', badgeColor: '#64b5f6', valueColor: '#1565c0', labelColor: '#0d47a1'
  },
  { 
    label: 'Active', 
    value: '142', 
    icon: <InstructorIcon />, 
    // Mint Green Theme
    bgColor: '#e8f5e9', badgeColor: '#81c784', valueColor: '#2e7d32', labelColor: '#1b5e20'
  },
  { 
    label: 'Avg Rating', 
    value: '4.6', 
    icon: <StarIcon />, 
    // Light Amber Theme
    bgColor: '#fff8e1', badgeColor: '#ffd54f', valueColor: '#f57f17', labelColor: '#ff6f00'
  },
  { 
    label: 'Total Courses Created', 
    value: '876', 
    icon: <CourseIcon />, 
    // Dusty Lavender Theme
    bgColor: '#f3e5f5', badgeColor: '#ba68c8', valueColor: '#6a1b9a', labelColor: '#4a148c'
  },
];

const statusColors: Record<string, { bg: string; color: string }> = {
  Active: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
  Inactive: { bg: 'rgba(156, 163, 175, 0.1)', color: '#71717a' },
  Pending: { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' },
};

const instructors = [
  { name: 'John Kamau', email: 'john@acme.com', org: 'Acme Corporation', courses: 12, students: 1245, rating: 4.8, status: 'Active', joined: 'Jan 2025' },
  { name: 'Mary Wambui', email: 'mary@globaltech.com', org: 'Global Tech Inc', courses: 8, students: 987, rating: 4.9, status: 'Active', joined: 'Feb 2025' },
  { name: 'Peter Ochieng', email: 'peter@innovate.com', org: 'Innovate Solutions', courses: 6, students: 756, rating: 4.7, status: 'Active', joined: 'Mar 2025' },
  { name: 'Grace Akinyi', email: 'grace@acme.com', org: 'Acme Corporation', courses: 10, students: 1102, rating: 4.6, status: 'Active', joined: 'Jan 2025' },
  { name: 'David Mwangi', email: 'david@future.com', org: 'Future Dynamics', courses: 4, students: 432, rating: 4.5, status: 'Active', joined: 'Apr 2025' },
  { name: 'Sarah Nakamura', email: 'sarah@nextgen.com', org: 'NextGen Partners', courses: 7, students: 623, rating: 4.8, status: 'Inactive', joined: 'May 2025' },
  { name: 'James Otieno', email: 'james@acme.com', org: 'Acme Corporation', courses: 5, students: 378, rating: 4.4, status: 'Active', joined: 'Jun 2025' },
  { name: 'Faith Muthoni', email: 'faith@globaltech.com', org: 'Global Tech Inc', courses: 9, students: 890, rating: 4.7, status: 'Pending', joined: 'Dec 2025' },
];

const InstructorsPage: React.FC = () => (
  <SuperadminLayout title="Instructors" subtitle="Instructor management and performance overview">
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <TextField size="small" placeholder="Search instructors..." sx={{ minWidth: 250 }} />
        <Button variant="contained" startIcon={<InviteIcon />} sx={{ textTransform: 'none', fontWeight: 600 }}>Invite Instructor</Button>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {['Instructor', 'Organization', 'Courses', 'Students', 'Avg Rating', 'Status', 'Joined', 'Actions'].map((h) => (
                <TableCell key={h} sx={{ fontWeight: 600, color: 'text.disabled', fontSize: '0.7rem', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>{h}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {instructors.map((inst) => (
              <TableRow key={inst.email} sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.015)' } }}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ width: 36, height: 36, background: 'linear-gradient(135deg, #ffb74d, #f97316)', fontSize: '0.8rem', fontWeight: 700 }}>
                      {inst.name.split(' ').map((n) => n[0]).join('')}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>{inst.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{inst.email}</Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell><Typography variant="body2">{inst.org}</Typography></TableCell>
                <TableCell><Typography variant="body2">{inst.courses}</Typography></TableCell>
                <TableCell><Typography variant="body2">{inst.students.toLocaleString()}</Typography></TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <StarIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>{inst.rating}</Typography>
                  </Box>
                </TableCell>
                <TableCell><Chip label={inst.status} size="small" sx={{ bgcolor: statusColors[inst.status]?.bg, color: statusColors[inst.status]?.color, fontWeight: 500, fontSize: '0.75rem' }} /></TableCell>
                <TableCell><Typography variant="body2">{inst.joined}</Typography></TableCell>
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
    </Paper>
  </SuperadminLayout>
);

export default InstructorsPage;
