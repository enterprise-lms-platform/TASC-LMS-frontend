import React, { useState } from 'react';
import {
  Box, Paper, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Chip, IconButton, Skeleton, Tabs, Tab, Menu,
  MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Button,
  TextField, Tooltip, Avatar,
} from '@mui/material';
import {
  Notes as NotesIcon,
  Business as CompanyIcon,
  ExpandMore as ChevronIcon,
} from '@mui/icons-material';
import SuperadminLayout from '../../components/superadmin/SuperadminLayout';
import { useSuperadminDemoRequests, useUpdateDemoRequest } from '../../hooks/useSuperadmin';
import type { DemoRequest } from '../../services/superadmin.services';

type StatusFilter = 'all' | 'new' | 'contacted' | 'closed';

const STATUS_TABS: { label: string; value: StatusFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'New', value: 'new' },
  { label: 'Contacted', value: 'contacted' },
  { label: 'Closed', value: 'closed' },
];

const STATUS_META: Record<string, { label: string; bg: string; color: string }> = {
  new:       { label: 'New',       bg: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' },
  contacted: { label: 'Contacted', bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' },
  closed:    { label: 'Closed',    bg: 'rgba(16, 185, 129, 0.1)', color: '#10b981' },
};

const thSx = {
  fontWeight: 600,
  fontSize: '0.7rem',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.06em',
  color: '#71717a',
  py: 1.5,
};

interface StatusMenuProps {
  request: DemoRequest;
}

const StatusChip: React.FC<StatusMenuProps> = ({ request }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const updateMutation = useUpdateDemoRequest();
  const meta = STATUS_META[request.status] ?? STATUS_META.new;

  const handleChange = (newStatus: 'new' | 'contacted' | 'closed') => {
    setAnchorEl(null);
    if (newStatus !== request.status) {
      updateMutation.mutate({ id: request.id, data: { status: newStatus } });
    }
  };

  return (
    <>
      <Chip
        label={meta.label}
        size="small"
        deleteIcon={<ChevronIcon sx={{ fontSize: '14px !important' }} />}
        onDelete={(e) => setAnchorEl(e.currentTarget.parentElement as HTMLElement)}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{
          bgcolor: meta.bg,
          color: meta.color,
          fontWeight: 600,
          fontSize: '0.73rem',
          cursor: 'pointer',
          '& .MuiChip-deleteIcon': { color: meta.color, opacity: 0.6 },
        }}
      />
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}
        slotProps={{ paper: { sx: { borderRadius: 2, boxShadow: '0 4px 16px rgba(0,0,0,0.1)', minWidth: 140 } } }}>
        {(['new', 'contacted', 'closed'] as const).map((s) => (
          <MenuItem key={s} onClick={() => handleChange(s)} selected={s === request.status}
            sx={{ fontSize: '0.85rem', fontWeight: s === request.status ? 600 : 400 }}>
            {STATUS_META[s].label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

interface NotesDialogProps {
  request: DemoRequest;
  open: boolean;
  onClose: () => void;
}

const NotesDialog: React.FC<NotesDialogProps> = ({ request, open, onClose }) => {
  const [notes, setNotes] = useState(request.notes ?? '');
  const updateMutation = useUpdateDemoRequest();

  const handleSave = () => {
    updateMutation.mutate(
      { id: request.id, data: { notes } },
      { onSuccess: onClose },
    );
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 700 }}>
        Notes — {request.first_name} {request.last_name}
      </DialogTitle>
      <DialogContent>
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
          {request.company} · {request.email}
        </Typography>
        <TextField
          multiline
          rows={5}
          fullWidth
          placeholder="Add notes about this lead..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={updateMutation.isPending}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={updateMutation.isPending} sx={{ textTransform: 'none' }}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={updateMutation.isPending}
          sx={{ textTransform: 'none', fontWeight: 600 }}>
          Save notes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const DemoRequestsPage: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [notesTarget, setNotesTarget] = useState<DemoRequest | null>(null);

  const activeFilter = STATUS_TABS[tabIndex].value;
  const params = activeFilter === 'all' ? undefined : { status: activeFilter };
  const { data, isLoading } = useSuperadminDemoRequests(params);
  const requests: DemoRequest[] = (data as any)?.results ?? (Array.isArray(data) ? data : []);

  return (
    <SuperadminLayout title="Demo Requests" subtitle="Leads submitted via the For Business page">
      <Paper elevation={0} sx={{ borderRadius: '1rem', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <Tabs
          value={tabIndex}
          onChange={(_, v) => setTabIndex(v)}
          sx={{ px: 3, borderBottom: '1px solid', borderColor: 'divider' }}
        >
          {STATUS_TABS.map((t) => (
            <Tab key={t.value} label={t.label} sx={{ textTransform: 'none', fontWeight: 600 }} />
          ))}
        </Tabs>

        <Box sx={{ p: 3 }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[0, 1, 2, 3, 4].map((i) => <Skeleton key={i} height={52} sx={{ borderRadius: 1 }} />)}
            </Box>
          ) : requests.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6, color: 'text.secondary' }}>
              <CompanyIcon sx={{ fontSize: 48, color: 'grey.300', mb: 1 }} />
              <Typography variant="body2">No {activeFilter === 'all' ? '' : activeFilter} demo requests</Typography>
            </Box>
          ) : (
            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: 700 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.50' }}>
                    {['Contact', 'Company', 'Team Size', 'Phone', 'Status', 'Received', 'Notes'].map((h) => (
                      <TableCell key={h} sx={thSx}>{h}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requests.map((req) => (
                    <TableRow key={req.id} sx={{ '&:hover': { bgcolor: 'rgba(0,0,0,0.015)' } }}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ width: 34, height: 34, fontSize: '0.78rem', fontWeight: 700,
                            background: 'linear-gradient(135deg, #ffa424, #f97316)' }}>
                            {`${req.first_name?.[0] ?? ''}${req.last_name?.[0] ?? ''}`}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {req.first_name} {req.last_name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">{req.email}</Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{req.company}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{req.team_size || '—'}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{req.phone || '—'}</Typography>
                      </TableCell>
                      <TableCell>
                        <StatusChip request={req} />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(req.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Tooltip title={req.notes ? 'View / edit notes' : 'Add notes'}>
                          <IconButton size="small" onClick={() => setNotesTarget(req)}
                            sx={{ color: req.notes ? 'primary.main' : 'text.disabled',
                              '&:hover': { bgcolor: 'rgba(255,164,36,0.08)' } }}>
                            <NotesIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Paper>

      {notesTarget && (
        <NotesDialog
          request={notesTarget}
          open={Boolean(notesTarget)}
          onClose={() => setNotesTarget(null)}
        />
      )}
    </SuperadminLayout>
  );
};

export default DemoRequestsPage;
