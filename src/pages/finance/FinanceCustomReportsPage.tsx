import React, { useState } from 'react';
import {
  Box, CssBaseline, Toolbar, Typography, Paper, Grid, Button, Chip, IconButton,
  TextField, InputAdornment, Select, MenuItem, FormControl, InputLabel, CircularProgress,
} from '@mui/material';
import {
  Assessment as ReportsIcon,
  Add as AddIcon,
  Search as SearchIcon,
  PlayArrow as RunIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Schedule as ScheduleIcon,
  Visibility as ViewIcon,
  BarChart as ChartIcon,
  PieChart as PieIcon,
  TableChart as TableIcon,
  Timeline as LineIcon,
  ContentCopy as DuplicateIcon,
} from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../../components/finance/Sidebar';
import TopBar from '../../components/finance/TopBar';
import { useReports, useReportTypes } from '../../hooks/usePayments';

const typeConfig: Record<string, { icon: React.ReactElement; color: string; bg: string; label: string }> = {
  table: { icon: <TableIcon sx={{ fontSize: 18 }} />, color: '#6366f1', bg: 'rgba(99,102,241,0.1)', label: 'Table' },
  bar: { icon: <ChartIcon sx={{ fontSize: 18 }} />, color: '#ffa424', bg: 'rgba(255,164,36,0.1)', label: 'Bar Chart' },
  pie: { icon: <PieIcon sx={{ fontSize: 18 }} />, color: '#10b981', bg: 'rgba(16,185,129,0.1)', label: 'Pie Chart' },
  line: { icon: <LineIcon sx={{ fontSize: 18 }} />, color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', label: 'Line Chart' },
};

const statusConfig: Record<string, { color: string; bg: string }> = {
  ready: { color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  processing: { color: '#6366f1', bg: 'rgba(99,102,241,0.1)' },
  failed: { color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
};

const cardSx = {
  borderRadius: '1rem', overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
  transition: 'box-shadow 0.3s',
  '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
};
const headerSx = { p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' };

const FinanceCustomReportsPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const { data: reports, isLoading } = useReports();
  const { data: reportTypes } = useReportTypes();

  const filtered = (reports || []).filter((r) => {
    if (typeFilter !== 'all' && r.report_type !== typeFilter) return false;
    if (search && !r.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMenuClick={() => setMobileOpen(!mobileOpen)} />
      <Box component="main" sx={{ flexGrow: 1, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, minWidth: 0 }}>
        <Toolbar />
        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: 'auto' }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <ReportsIcon sx={{ color: 'primary.main' }} />
              <Box>
                <Typography variant="h5" fontWeight={700}>Custom Reports</Typography>
                <Typography variant="body2" color="text.secondary">Build and schedule custom financial reports</Typography>
              </Box>
            </Box>
            <Button size="small" variant="contained" startIcon={<AddIcon />}
              sx={{ textTransform: 'none', borderRadius: 2, boxShadow: 'none', '&:hover': { boxShadow: '0 2px 8px rgba(255,164,36,0.3)' } }}>
              New Report
            </Button>
          </Box>

          {/* KPI Stats */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[
              { label: 'Total Reports', value: (reports || []).length.toString(), icon: <ReportsIcon />, bgcolor: 'rgba(99,102,241,0.08)', iconBg: '#6366f1', color: '#312e81', subColor: '#4338ca' },
              { label: 'Types Available', value: (reportTypes || []).length.toString(), icon: <ScheduleIcon />, bgcolor: '#dcfce7', iconBg: '#4ade80', color: '#14532d', subColor: '#166534' },
              { label: 'Recently Run', value: (reports || []).filter(r => r.status === 'ready').length.toString(), icon: <RunIcon />, bgcolor: '#fff3e0', iconBg: '#ffa424', color: '#7c2d12', subColor: '#9a3412' },
              { label: 'Failed Reports', value: (reports || []).filter(r => r.status === 'failed').length.toString(), icon: <EditIcon />, bgcolor: 'rgba(239,68,68,0.08)', iconBg: '#ef4444', color: '#991b1b', subColor: '#b91c1c' },
            ].map((s) => (
              <Grid size={{ xs: 6, md: 3 }} key={s.label}>
                <Paper elevation={0} sx={{
                  bgcolor: s.bgcolor, borderRadius: '20px', p: 3,
                  position: 'relative', minHeight: 160, display: 'flex',
                  flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
                  textAlign: 'center', transition: 'transform 0.2s', cursor: 'pointer',
                  '&:hover': { transform: 'translateY(-4px)' },
                }}>
                  <Box sx={{
                    position: 'absolute', top: 16, right: 16, width: 40, height: 40,
                    borderRadius: '50%', bgcolor: s.iconBg, display: 'flex',
                    alignItems: 'center', justifyContent: 'center', color: 'white',
                    '& svg': { fontSize: 20 },
                  }}>{s.icon}</Box>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: s.color, fontSize: { xs: '2rem', md: '2.5rem' }, lineHeight: 1, mb: 1 }}>{s.value}</Typography>
                  <Typography variant="body2" sx={{ color: s.subColor, fontWeight: 500, fontSize: '0.875rem', opacity: 0.8 }}>{s.label}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Filters */}
          <Paper elevation={0} sx={{ ...cardSx, mb: 3 }}>
            <Box sx={{ p: 2, px: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              <TextField size="small" placeholder="Search reports..." value={search} onChange={(e) => setSearch(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: 'text.disabled' }} /></InputAdornment> }}
                sx={{ flex: 1, minWidth: 200, '& .MuiOutlinedInput-root': { borderRadius: '50px', bgcolor: 'rgba(0,0,0,0.02)' } }} />
              <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel>Report Type</InputLabel>
                <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} label="Report Type">
                  <MenuItem value="all">All Types</MenuItem>
                  {reportTypes?.map(t => (
                    <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Paper>

          {/* Reports List */}
          <Paper elevation={0} sx={cardSx}>
            <Box sx={{ ...headerSx, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography fontWeight={700}>Reports</Typography>
              <Typography variant="caption" color="text.secondary">{filtered.length} report{filtered.length !== 1 ? 's' : ''}</Typography>
            </Box>
            {isLoading ? (
              <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress size={32} /></Box>
            ) : filtered.map((r, i) => {
              const sCfg = statusConfig[r.status] || statusConfig.failed;
              return (
                <Box key={r.id} sx={{
                  display: 'flex', alignItems: 'center', gap: 2, p: 2, px: 3,
                  borderBottom: i < filtered.length - 1 ? 1 : 0, borderColor: 'divider',
                  '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
                }}>
                  <Box sx={{ width: 38, height: 38, borderRadius: '10px', bgcolor: 'rgba(255,164,36,0.1)', color: 'primary.main', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <TableIcon sx={{ fontSize: 18 }} />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                      <Typography variant="body2" fontWeight={600} noWrap>{r.name}</Typography>
                      <Chip label={r.report_type} size="small" sx={{ height: 18, fontSize: '0.6rem', fontWeight: 600, bgcolor: 'rgba(0,0,0,0.05)', color: 'text.secondary' }} />
                      <Chip label={r.status} size="small" sx={{ height: 18, fontSize: '0.6rem', fontWeight: 600, bgcolor: sCfg.bg, color: sCfg.color, textTransform: 'capitalize' }} />
                    </Box>
                    <Typography variant="caption" color="text.secondary" noWrap>Generated {new Date(r.generated_at).toLocaleString()}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 0.25 }}>
                    <IconButton size="small" title="View" sx={{ color: 'text.disabled', '&:hover': { color: '#6366f1' } }}><ViewIcon sx={{ fontSize: 18 }} /></IconButton>
                    <IconButton size="small" title="Delete" sx={{ color: 'text.disabled', '&:hover': { color: '#ef4444' } }}><DeleteIcon sx={{ fontSize: 18 }} /></IconButton>
                  </Box>
                </Box>
              );
            })}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default FinanceCustomReportsPage;
