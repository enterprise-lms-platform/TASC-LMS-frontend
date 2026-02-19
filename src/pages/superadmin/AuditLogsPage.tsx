import React, { useState, useCallback } from 'react';
import {
  Box, Paper, Typography, TextField, MenuItem, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, Avatar, IconButton,
  TablePagination, CircularProgress, Alert,
} from '@mui/material';
import { Visibility as ViewIcon } from '@mui/icons-material';
import SuperadminLayout from '../../components/superadmin/SuperadminLayout';
import { useAuditLogs } from '../../hooks/useAuditLogs';

const actionColors: Record<string, { bg: string; color: string }> = {
  Created: { bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
  Updated: { bg: 'rgba(255, 164, 36, 0.1)', color: '#ffa424' },
  Deleted: { bg: 'rgba(113, 113, 122, 0.1)', color: '#71717a' },
  Login: { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981' },
  Logout: { bg: 'rgba(156, 163, 175, 0.1)', color: '#71717a' },
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const formatTimestamp = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
};

const AuditLogsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [resourceFilter, setResourceFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const [debouncedSearch, setDebouncedSearch] = useState('');
  const debounceRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(0);
    }, 400);
  }, []);

  const { data, isLoading, isError, error } = useAuditLogs({
    search: debouncedSearch || undefined,
    from: fromDate || undefined,
    to: toDate || undefined,
    action: actionFilter || undefined,
    resource: resourceFilter || undefined,
    page: page + 1,
    page_size: rowsPerPage,
  });

  const logs = data?.results ?? [];
  const totalCount = data?.count ?? 0;

  return (
    <SuperadminLayout title="Audit Logs" subtitle="Track all system activities and changes">
      <Paper elevation={0} sx={{ p: 3, borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)' }}>
        <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', mb: 3 }}>Activity Logs</Typography>
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <TextField
            size="small"
            placeholder="Search by user..."
            sx={{ minWidth: 200 }}
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          <TextField
            size="small"
            type="date"
            label="From"
            slotProps={{ inputLabel: { shrink: true } }}
            value={fromDate}
            onChange={(e) => { setFromDate(e.target.value); setPage(0); }}
          />
          <TextField
            size="small"
            type="date"
            label="To"
            slotProps={{ inputLabel: { shrink: true } }}
            value={toDate}
            onChange={(e) => { setToDate(e.target.value); setPage(0); }}
          />
          <TextField
            size="small"
            select
            value={actionFilter}
            onChange={(e) => { setActionFilter(e.target.value); setPage(0); }}
            sx={{ minWidth: 140 }}
            label="Action"
          >
            <MenuItem value="">All Actions</MenuItem>
            {['Created', 'Updated', 'Deleted', 'Login', 'Logout'].map((v) => (
              <MenuItem key={v} value={v}>{v}</MenuItem>
            ))}
          </TextField>
          <TextField
            size="small"
            select
            value={resourceFilter}
            onChange={(e) => { setResourceFilter(e.target.value); setPage(0); }}
            sx={{ minWidth: 140 }}
            label="Resource"
          >
            <MenuItem value="">All Resources</MenuItem>
            {['User', 'Course', 'Organization', 'Payment'].map((v) => (
              <MenuItem key={v} value={v}>{v}</MenuItem>
            ))}
          </TextField>
        </Box>

        {isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {(error as Error)?.message || 'Failed to load audit logs.'}
          </Alert>
        )}

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
                    {['Timestamp', 'User', 'Action', 'Resource', 'Details', 'IP Address', ''].map((h) => (
                      <TableCell key={h} sx={{ fontWeight: 600, color: 'text.disabled', fontSize: '0.7rem', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {logs.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body2" color="text.secondary">No audit log entries found.</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    logs.map((log) => {
                      const displayAction = capitalize(log.action);
                      return (
                        <TableRow key={log.id} sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.015)' } }}>
                          <TableCell sx={{ whiteSpace: 'nowrap' }}>
                            <Typography variant="body2">{formatTimestamp(log.timestamp)}</Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                              <Avatar sx={{ width: 32, height: 32, fontSize: '0.75rem', background: 'linear-gradient(135deg, #ffa424, #ffb74d)' }}>
                                {log.user.split(' ').map((n) => n[0]).join('')}
                              </Avatar>
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>{log.user}</Typography>
                                <Typography variant="caption" color="text.secondary">{log.email}</Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip label={displayAction} size="small" sx={{ bgcolor: actionColors[displayAction]?.bg, color: actionColors[displayAction]?.color, fontWeight: 500, fontSize: '0.75rem' }} />
                          </TableCell>
                          <TableCell><Typography variant="body2">{capitalize(log.resource)}</Typography></TableCell>
                          <TableCell><Typography variant="body2" sx={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.details}</Typography></TableCell>
                          <TableCell><Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{log.ip}</Typography></TableCell>
                          <TableCell>
                            <IconButton size="small" sx={{ color: 'text.disabled', '&:hover': { color: 'primary.main', bgcolor: 'rgba(0,0,0,0.04)' } }}><ViewIcon fontSize="small" /></IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              count={totalCount}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
              rowsPerPageOptions={[10, 20, 50]}
            />
          </>
        )}
      </Paper>
    </SuperadminLayout>
  );
};

export default AuditLogsPage;
