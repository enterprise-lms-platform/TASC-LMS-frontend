import React, { useState } from 'react';
import {
  Box, CssBaseline, Toolbar, Typography, Paper, Grid, Button, Chip, Checkbox,
  FormControlLabel, Select, MenuItem, FormControl, InputLabel,
} from '@mui/material';
import {
  FileDownload as DownloadIcon,
  TableChart as CsvIcon,
  PictureAsPdf as PdfIcon,
  DataObject as JsonIcon,
  Description as XlsxIcon,
  DateRange as DateIcon,
  Schedule as ScheduleIcon,
  CheckCircle as DoneIcon,
} from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../components/finance/Sidebar';
import TopBar from '../components/finance/TopBar';

interface ExportTemplate {
  id: string;
  name: string;
  description: string;
  format: string;
  icon: React.ReactElement;
  size: string;
  lastExported: string;
  fields: string[];
}

const templates: ExportTemplate[] = [
  { id: '1', name: 'Payments Report', description: 'All payment transactions with status, amounts, and methods', format: 'CSV', icon: <CsvIcon />, size: '~2.4 MB', lastExported: 'Feb 23, 2026', fields: ['Transaction ID', 'Date', 'Amount', 'Status', 'Method', 'User'] },
  { id: '2', name: 'Invoice Summary', description: 'Generated and paid invoices with amounts and dates', format: 'PDF', icon: <PdfIcon />, size: '~1.8 MB', lastExported: 'Feb 20, 2026', fields: ['Invoice #', 'Student', 'Amount', 'Due Date', 'Status'] },
  { id: '3', name: 'Subscription Data', description: 'Active subscriptions, billing cycles, and usage', format: 'XLSX', icon: <XlsxIcon />, size: '~3.1 MB', lastExported: 'Feb 18, 2026', fields: ['Subscriber', 'Plan', 'Start Date', 'Next Billing', 'Usage', 'Status'] },
  { id: '4', name: 'Revenue by Gateway', description: 'Breakdown of revenue by payment gateway', format: 'JSON', icon: <JsonIcon />, size: '~820 KB', lastExported: 'Feb 22, 2026', fields: ['Gateway', 'Revenue', 'Transactions', 'Percentage', 'Growth'] },
  { id: '5', name: 'Churn Report', description: 'Cancellations, reasons, and at-risk subscribers', format: 'CSV', icon: <CsvIcon />, size: '~1.2 MB', lastExported: 'Feb 15, 2026', fields: ['User', 'Plan', 'Cancel Date', 'Reason', 'Duration'] },
  { id: '6', name: 'Full Financial Data', description: 'Complete financial dump — all tables combined', format: 'XLSX', icon: <XlsxIcon />, size: '~8.6 MB', lastExported: 'Feb 10, 2026', fields: ['All fields'] },
];

const formatColors: Record<string, string> = {
  CSV: '#10b981', PDF: '#ef4444', XLSX: '#6366f1', JSON: '#f59e0b',
};

const cardSx = {
  borderRadius: '1rem', overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
  transition: 'box-shadow 0.3s',
  '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
};
const headerSx = { p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' };

const FinanceExportPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState('6months');

  const toggle = (id: string) => setSelected((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMenuClick={() => setMobileOpen(!mobileOpen)} />
      <Box component="main" sx={{ flexGrow: 1, width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` }, minWidth: 0 }}>
        <Toolbar />
        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: 'auto' }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <DownloadIcon sx={{ color: 'primary.main' }} />
              <Box>
                <Typography variant="h5" fontWeight={700}>Export Data</Typography>
                <Typography variant="body2" color="text.secondary">Download financial data in multiple formats</Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <InputLabel>Date Range</InputLabel>
                <Select value={dateRange} onChange={(e) => setDateRange(e.target.value)} label="Date Range">
                  <MenuItem value="30days">Last 30 days</MenuItem>
                  <MenuItem value="3months">Last 3 months</MenuItem>
                  <MenuItem value="6months">Last 6 months</MenuItem>
                  <MenuItem value="year">This Year</MenuItem>
                  <MenuItem value="all">All Time</MenuItem>
                </Select>
              </FormControl>
              <Button size="small" variant="contained" startIcon={<DownloadIcon />} disabled={selected.length === 0}
                sx={{ textTransform: 'none', borderRadius: 2, boxShadow: 'none', '&:hover': { boxShadow: '0 2px 8px rgba(255,164,36,0.3)' } }}>
                Export{selected.length > 0 ? ` (${selected.length})` : ''}
              </Button>
            </Box>
          </Box>

          {/* KPI Stats */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[
              { label: 'Export Templates', value: templates.length.toString(), icon: <CsvIcon />, bgcolor: 'rgba(99,102,241,0.08)', iconBg: '#6366f1', color: '#312e81', subColor: '#4338ca' },
              { label: 'Formats Available', value: '4', icon: <JsonIcon />, bgcolor: '#dcfce7', iconBg: '#4ade80', color: '#14532d', subColor: '#166534' },
              { label: 'Last Export', value: 'Feb 23', icon: <DateIcon />, bgcolor: '#fff3e0', iconBg: '#ffa424', color: '#7c2d12', subColor: '#9a3412' },
              { label: 'Scheduled', value: '3', icon: <ScheduleIcon />, bgcolor: '#f4f4f5', iconBg: '#a1a1aa', color: '#27272a', subColor: '#3f3f46' },
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

          {/* Export Templates */}
          <Paper elevation={0} sx={cardSx}>
            <Box sx={{ ...headerSx, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography fontWeight={700}>Export Templates</Typography>
              <Typography variant="caption" color="text.secondary">{selected.length} selected</Typography>
            </Box>
            {templates.map((t, i) => (
              <Box key={t.id} sx={{
                display: 'flex', alignItems: 'center', gap: 2, p: 2, px: 3,
                borderBottom: i < templates.length - 1 ? 1 : 0, borderColor: 'divider',
                bgcolor: selected.includes(t.id) ? 'rgba(255,164,36,0.04)' : 'transparent',
                '&:hover': { bgcolor: 'rgba(255,164,36,0.06)' },
              }}>
                <FormControlLabel
                  control={<Checkbox size="small" checked={selected.includes(t.id)} onChange={() => toggle(t.id)} sx={{ '&.Mui-checked': { color: '#ffa424' } }} />}
                  label="" sx={{ m: 0, mr: -1 }}
                />
                <Box sx={{ width: 38, height: 38, borderRadius: '10px', bgcolor: `${formatColors[t.format]}12`, color: formatColors[t.format], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {t.icon}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                    <Typography variant="body2" fontWeight={600}>{t.name}</Typography>
                    <Chip label={t.format} size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700, bgcolor: `${formatColors[t.format]}18`, color: formatColors[t.format] }} />
                  </Box>
                  <Typography variant="caption" color="text.secondary">{t.description}</Typography>
                </Box>
                <Box sx={{ display: { xs: 'none', md: 'block' }, textAlign: 'right', minWidth: 80 }}>
                  <Typography variant="caption" fontWeight={600}>{t.size}</Typography>
                  <Typography variant="caption" color="text.secondary" display="block">{t.lastExported}</Typography>
                </Box>
                <Button size="small" variant="outlined" startIcon={<DownloadIcon sx={{ fontSize: 16 }} />}
                  sx={{ textTransform: 'none', borderRadius: 2, fontSize: '0.75rem', fontWeight: 600, minWidth: 90, borderColor: 'divider', color: 'text.primary', '&:hover': { borderColor: '#ffa424', color: '#ffa424' } }}>
                  Export
                </Button>
              </Box>
            ))}
          </Paper>

          {/* Recent Exports */}
          <Paper elevation={0} sx={{ ...cardSx, mt: 3 }}>
            <Box sx={headerSx}>
              <Typography fontWeight={700}>Recent Exports</Typography>
            </Box>
            {[
              { name: 'Payments Report', format: 'CSV', date: 'Feb 23, 2026 · 14:32', size: '2.4 MB', by: 'Finance Admin' },
              { name: 'Revenue by Gateway', format: 'JSON', date: 'Feb 22, 2026 · 09:15', size: '812 KB', by: 'Finance Admin' },
              { name: 'Invoice Summary', format: 'PDF', date: 'Feb 20, 2026 · 16:48', size: '1.7 MB', by: 'Finance Admin' },
              { name: 'Subscription Data', format: 'XLSX', date: 'Feb 18, 2026 · 11:03', size: '3.0 MB', by: 'Finance Admin' },
            ].map((e, i, arr) => (
              <Box key={e.date} sx={{
                display: 'flex', alignItems: 'center', gap: 2, p: 2, px: 3,
                borderBottom: i < arr.length - 1 ? 1 : 0, borderColor: 'divider',
                '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
              }}>
                <DoneIcon sx={{ fontSize: 18, color: '#10b981' }} />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" fontWeight={600}>{e.name}</Typography>
                    <Chip label={e.format} size="small" sx={{ height: 18, fontSize: '0.6rem', fontWeight: 700, bgcolor: `${formatColors[e.format]}18`, color: formatColors[e.format] }} />
                  </Box>
                  <Typography variant="caption" color="text.secondary">{e.date} · {e.by}</Typography>
                </Box>
                <Typography variant="caption" fontWeight={500}>{e.size}</Typography>
                <Button size="small" sx={{ textTransform: 'none', fontSize: '0.75rem', minWidth: 'auto', color: '#ffa424' }}>Re-download</Button>
              </Box>
            ))}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};

export default FinanceExportPage;
