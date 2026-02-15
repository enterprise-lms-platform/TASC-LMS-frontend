import React, { useState } from 'react';
import {
  Box, Paper, Typography, TextField, MenuItem, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Avatar, IconButton,
} from '@mui/material';
import { Visibility as ViewIcon } from '@mui/icons-material';
import SuperadminLayout from '../../components/superadmin/SuperadminLayout';

const actionColors: Record<string, { bg: string; color: string }> = {
  Created: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
  Updated: { bg: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' },
  Deleted: { bg: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' },
  Login: { bg: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' },
  Logout: { bg: 'rgba(156, 163, 175, 0.1)', color: '#71717a' },
};

const logs = [
  { id: 1, timestamp: 'Feb 15, 2026 14:32:05', user: 'John Kamau', email: 'john@acme.com', action: 'Login', resource: 'User', details: 'Logged in via email', ip: '192.168.1.45' },
  { id: 2, timestamp: 'Feb 15, 2026 14:28:12', user: 'Admin System', email: 'admin@tasclms.com', action: 'Created', resource: 'Course', details: 'Created "Advanced React Patterns"', ip: '10.0.0.1' },
  { id: 3, timestamp: 'Feb 15, 2026 13:55:30', user: 'Mary Wambui', email: 'mary@globaltech.com', action: 'Updated', resource: 'User', details: 'Updated profile settings', ip: '172.16.0.23' },
  { id: 4, timestamp: 'Feb 15, 2026 13:42:18', user: 'Peter Ochieng', email: 'peter@innovate.com', action: 'Created', resource: 'Payment', details: 'Payment FLW-7834 processed ($49.99)', ip: '192.168.2.78' },
  { id: 5, timestamp: 'Feb 15, 2026 13:15:44', user: 'Grace Akinyi', email: 'grace@acme.com', action: 'Updated', resource: 'Course', details: 'Published "Data Science 101"', ip: '10.0.1.15' },
  { id: 6, timestamp: 'Feb 15, 2026 12:58:02', user: 'David Mwangi', email: 'david@future.com', action: 'Deleted', resource: 'User', details: 'Removed inactive user account', ip: '172.16.1.44' },
  { id: 7, timestamp: 'Feb 15, 2026 12:30:55', user: 'Sarah Nakamura', email: 'sarah@nextgen.com', action: 'Login', resource: 'User', details: 'Logged in via Google OAuth', ip: '192.168.3.12' },
  { id: 8, timestamp: 'Feb 15, 2026 11:45:33', user: 'James Otieno', email: 'james@acme.com', action: 'Updated', resource: 'Organization', details: 'Updated Acme Corporation settings', ip: '10.0.2.88' },
  { id: 9, timestamp: 'Feb 15, 2026 11:20:17', user: 'Faith Muthoni', email: 'faith@globaltech.com', action: 'Created', resource: 'Organization', details: 'Created "TechBridge Africa"', ip: '172.16.2.33' },
  { id: 10, timestamp: 'Feb 15, 2026 10:55:08', user: 'John Kamau', email: 'john@acme.com', action: 'Logout', resource: 'User', details: 'Session ended', ip: '192.168.1.45' },
  { id: 11, timestamp: 'Feb 15, 2026 10:30:42', user: 'Admin System', email: 'admin@tasclms.com', action: 'Updated', resource: 'Payment', details: 'Refund processed for INV-2341', ip: '10.0.0.1' },
  { id: 12, timestamp: 'Feb 15, 2026 09:15:20', user: 'Peter Ochieng', email: 'peter@innovate.com', action: 'Created', resource: 'User', details: 'Invited user via CSV bulk import', ip: '192.168.2.78' },
];

const AuditLogsPage: React.FC = () => {
  const [actionFilter, setActionFilter] = useState('All');
  const [resourceFilter, setResourceFilter] = useState('All');

  const filtered = logs.filter((l) => {
    if (actionFilter !== 'All' && l.action !== actionFilter) return false;
    if (resourceFilter !== 'All' && l.resource !== resourceFilter) return false;
    return true;
  });

  return (
    <SuperadminLayout title="Audit Logs" subtitle="Track all system activities and changes">
      <Paper elevation={0} sx={{ p: 3, borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' }}>
        <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', mb: 3 }}>Activity Logs</Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <TextField size="small" placeholder="Search by user..." sx={{ minWidth: 200 }} />
          <TextField size="small" type="date" label="From" slotProps={{ inputLabel: { shrink: true } }} />
          <TextField size="small" type="date" label="To" slotProps={{ inputLabel: { shrink: true } }} />
          <TextField size="small" select value={actionFilter} onChange={(e) => setActionFilter(e.target.value)} sx={{ minWidth: 140 }}>
            {['All', 'Created', 'Updated', 'Deleted', 'Login', 'Logout'].map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}
          </TextField>
          <TextField size="small" select value={resourceFilter} onChange={(e) => setResourceFilter(e.target.value)} sx={{ minWidth: 140 }}>
            {['All', 'User', 'Course', 'Organization', 'Payment'].map((v) => <MenuItem key={v} value={v}>{v}</MenuItem>)}
          </TextField>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {['Timestamp', 'User', 'Action', 'Resource', 'Details', 'IP Address', ''].map((h) => (
                  <TableCell key={h} sx={{ fontWeight: 600, color: 'text.disabled', fontSize: '0.7rem', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>{h}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((log) => (
                <TableRow key={log.id} sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.015)' } }}>
                  <TableCell sx={{ whiteSpace: 'nowrap' }}>
                    <Typography variant="body2">{log.timestamp}</Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ width: 32, height: 32, fontSize: '0.75rem', background: 'linear-gradient(135deg, #3b82f6, #60a5fa)' }}>
                        {log.user.split(' ').map((n) => n[0]).join('')}
                      </Avatar>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>{log.user}</Typography>
                        <Typography variant="caption" color="text.secondary">{log.email}</Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip label={log.action} size="small" sx={{ bgcolor: actionColors[log.action]?.bg, color: actionColors[log.action]?.color, fontWeight: 500, fontSize: '0.75rem' }} />
                  </TableCell>
                  <TableCell><Typography variant="body2">{log.resource}</Typography></TableCell>
                  <TableCell><Typography variant="body2" sx={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.details}</Typography></TableCell>
                  <TableCell><Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{log.ip}</Typography></TableCell>
                  <TableCell>
                    <IconButton size="small" sx={{ color: 'text.disabled', '&:hover': { color: 'primary.main', bgcolor: 'rgba(0,0,0,0.04)' } }}><ViewIcon fontSize="small" /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'right' }}>
          Showing {filtered.length} of {logs.length} entries
        </Typography>
      </Paper>
    </SuperadminLayout>
  );
};

export default AuditLogsPage;
