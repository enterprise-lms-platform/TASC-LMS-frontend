import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box, CssBaseline, Toolbar, Typography, Paper, Grid, Button, Chip, Checkbox,
  FormControlLabel, Select, MenuItem, FormControl, InputLabel, CircularProgress,
  Snackbar, Alert,
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
  Error as ErrorIcon,
  HourglassBottom as ProcessingIcon,
} from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../../components/finance/Sidebar';
import TopBar from '../../components/finance/TopBar';
import { reportsApi, type Report } from '../../services/reports.services';

const REPORT_TYPE_MAP: Record<string, { name: string; description: string; format: string }> = {
  revenue: { name: 'Revenue Report', description: 'Revenue breakdown by period, gateway, and course', format: 'CSV' },
  enrollment: { name: 'Enrollment Summary', description: 'Enrollment data with dates, courses, and status', format: 'CSV' },
  course_performance: { name: 'Course Performance', description: 'Course completion rates, ratings, and engagement', format: 'CSV' },
  user_activity: { name: 'User Activity', description: 'User login history, progress, and engagement metrics', format: 'CSV' },
  completion: { name: 'Completion Report', description: 'Course and module completion rates per learner', format: 'CSV' },
  assessment: { name: 'Assessment Results', description: 'Quiz scores, assignment grades, and submission data', format: 'CSV' },
};

const formatIcons: Record<string, React.ReactElement> = {
  CSV: <CsvIcon />, PDF: <PdfIcon />, XLSX: <XlsxIcon />, JSON: <JsonIcon />,
};
const formatColors: Record<string, string> = {
  CSV: '#10b981', PDF: '#ef4444', XLSX: '#6366f1', JSON: '#f59e0b',
};

const DATE_RANGE_PARAMS: Record<string, { date_from?: string }> = {
  '30days': { date_from: new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0] },
  '3months': { date_from: new Date(Date.now() - 90 * 86400000).toISOString().split('T')[0] },
  '6months': { date_from: new Date(Date.now() - 180 * 86400000).toISOString().split('T')[0] },
  year: { date_from: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0] },
  all: {},
};

const cardSx = {
  borderRadius: '1rem', overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
  transition: 'box-shadow 0.3s',
  '&:hover': { boxShadow: '0 2px 6px rgba(0,0,0,0.08), 0 8px 24px rgba(0,0,0,0.06)' },
};
const headerSx = { p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' };

const statusIcon = (status: Report['status']) => {
  if (status === 'ready') return <DoneIcon sx={{ fontSize: 18, color: '#10b981' }} />;
  if (status === 'processing') return <ProcessingIcon sx={{ fontSize: 18, color: '#f59e0b' }} />;
  return <ErrorIcon sx={{ fontSize: 18, color: '#ef4444' }} />;
};

const FinanceExportPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState('6months');
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' | 'info' }>({ open: false, message: '', severity: 'info' });
  const queryClient = useQueryClient();

  // Fetch available report types
  const { data: reportTypesData } = useQuery({
    queryKey: ['reportTypes'],
    queryFn: () => reportsApi.getTypes().then(r => r.data),
  });
  const reportTypes = Array.isArray(reportTypesData) ? reportTypesData : [];

  // Fetch recent reports (past exports)
  const { data: reportsData, isLoading: reportsLoading } = useQuery({
    queryKey: ['financeReports'],
    queryFn: () => reportsApi.getAll({ page_size: 10 }).then(r => {
      const d = r.data;
      return Array.isArray(d) ? d : d?.results ?? [];
    }),
  });
  const recentReports = reportsData ?? [];

  // Generate report mutation
  const generateMutation = useMutation({
    mutationFn: (reportType: string) =>
      reportsApi.generate({
        report_type: reportType,
        parameters: DATE_RANGE_PARAMS[dateRange] ?? {},
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['financeReports'] });
      setToast({ open: true, message: 'Report generation started. It will appear below when ready.', severity: 'success' });
    },
    onError: () => {
      setToast({ open: true, message: 'Failed to generate report. Please try again.', severity: 'error' });
    },
  });

  // Download report
  const handleDownload = async (reportId: number) => {
    try {
      const res = await reportsApi.download(reportId);
      const url = res.data.download_url;
      if (url) {
        window.open(url, '_blank');
      } else {
        setToast({ open: true, message: 'Download URL not available yet.', severity: 'info' });
      }
    } catch {
      setToast({ open: true, message: 'Failed to download report.', severity: 'error' });
    }
  };

  // Bulk export selected types
  const handleBulkExport = () => {
    selected.forEach((type) => generateMutation.mutate(type));
    setSelected([]);
  };

  const toggle = (id: string) => setSelected((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);

  // Build template list from API report types, with fallback metadata
  const templates = reportTypes.map((rt) => {
    const meta = REPORT_TYPE_MAP[rt.id] || { name: rt.name, description: rt.description || '', format: 'CSV' };
    return { id: rt.id, name: meta.name, description: meta.description, format: meta.format };
  });

  // If API hasn't returned types yet, show fallback from our map
  const displayTemplates = templates.length > 0 ? templates : Object.entries(REPORT_TYPE_MAP).map(([id, meta]) => ({ id, ...meta }));

  const readyCount = recentReports.filter((r: Report) => r.status === 'ready').length;
  const lastExport = recentReports.length > 0
    ? new Date(recentReports[0].generated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : '—';

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
              <Button size="small" variant="contained" startIcon={<DownloadIcon />}
                disabled={selected.length === 0 || generateMutation.isPending}
                onClick={handleBulkExport}
                sx={{ textTransform: 'none', borderRadius: 2, boxShadow: 'none', '&:hover': { boxShadow: '0 2px 8px rgba(255,164,36,0.3)' } }}>
                {generateMutation.isPending ? 'Generating...' : `Export${selected.length > 0 ? ` (${selected.length})` : ''}`}
              </Button>
            </Box>
          </Box>

          {/* KPI Stats */}
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[
              { label: 'Report Types', value: displayTemplates.length.toString(), icon: <CsvIcon />, bgcolor: 'rgba(99,102,241,0.08)', iconBg: '#6366f1', color: '#312e81', subColor: '#4338ca' },
              { label: 'Formats Available', value: '4', icon: <JsonIcon />, bgcolor: '#dcfce7', iconBg: '#4ade80', color: '#14532d', subColor: '#166534' },
              { label: 'Last Export', value: lastExport, icon: <DateIcon />, bgcolor: '#fff3e0', iconBg: '#ffa424', color: '#7c2d12', subColor: '#9a3412' },
              { label: 'Ready to Download', value: String(readyCount), icon: <ScheduleIcon />, bgcolor: '#f4f4f5', iconBg: '#a1a1aa', color: '#27272a', subColor: '#3f3f46' },
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
            {displayTemplates.map((t, i) => (
              <Box key={t.id} sx={{
                display: 'flex', alignItems: 'center', gap: 2, p: 2, px: 3,
                borderBottom: i < displayTemplates.length - 1 ? 1 : 0, borderColor: 'divider',
                bgcolor: selected.includes(t.id) ? 'rgba(255,164,36,0.04)' : 'transparent',
                '&:hover': { bgcolor: 'rgba(255,164,36,0.06)' },
              }}>
                <FormControlLabel
                  control={<Checkbox size="small" checked={selected.includes(t.id)} onChange={() => toggle(t.id)} sx={{ '&.Mui-checked': { color: '#ffa424' } }} />}
                  label="" sx={{ m: 0, mr: -1 }}
                />
                <Box sx={{ width: 38, height: 38, borderRadius: '10px', bgcolor: `${formatColors[t.format] || '#6366f1'}12`, color: formatColors[t.format] || '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {formatIcons[t.format] || <CsvIcon />}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.25 }}>
                    <Typography variant="body2" fontWeight={600}>{t.name}</Typography>
                    <Chip label={t.format} size="small" sx={{ height: 20, fontSize: '0.65rem', fontWeight: 700, bgcolor: `${formatColors[t.format] || '#6366f1'}18`, color: formatColors[t.format] || '#6366f1' }} />
                  </Box>
                  <Typography variant="caption" color="text.secondary">{t.description}</Typography>
                </Box>
                <Button size="small" variant="outlined" startIcon={<DownloadIcon sx={{ fontSize: 16 }} />}
                  disabled={generateMutation.isPending}
                  onClick={() => generateMutation.mutate(t.id)}
                  sx={{ textTransform: 'none', borderRadius: 2, fontSize: '0.75rem', fontWeight: 600, minWidth: 90, borderColor: 'divider', color: 'text.primary', '&:hover': { borderColor: '#ffa424', color: '#ffa424' } }}>
                  Export
                </Button>
              </Box>
            ))}
          </Paper>

          {/* Recent Exports (from API) */}
          <Paper elevation={0} sx={{ ...cardSx, mt: 3 }}>
            <Box sx={headerSx}>
              <Typography fontWeight={700}>Recent Exports</Typography>
            </Box>
            {reportsLoading ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <CircularProgress size={24} sx={{ color: '#ffa424' }} />
              </Box>
            ) : recentReports.length === 0 ? (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">No exports yet. Generate a report above to get started.</Typography>
              </Box>
            ) : (
              recentReports.map((r: Report, i: number) => (
                <Box key={r.id} sx={{
                  display: 'flex', alignItems: 'center', gap: 2, p: 2, px: 3,
                  borderBottom: i < recentReports.length - 1 ? 1 : 0, borderColor: 'divider',
                  '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' },
                }}>
                  {statusIcon(r.status)}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" fontWeight={600}>
                        {REPORT_TYPE_MAP[r.report_type]?.name || r.name || r.report_type}
                      </Typography>
                      <Chip
                        label={r.status}
                        size="small"
                        sx={{
                          height: 18, fontSize: '0.6rem', fontWeight: 700,
                          bgcolor: r.status === 'ready' ? '#dcfce7' : r.status === 'processing' ? '#fef3c7' : '#fee2e2',
                          color: r.status === 'ready' ? '#166534' : r.status === 'processing' ? '#92400e' : '#991b1b',
                        }}
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      {new Date(r.generated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      {r.file_size ? ` · ${r.file_size}` : ''}
                    </Typography>
                  </Box>
                  {r.status === 'ready' && (
                    <Button size="small" onClick={() => handleDownload(r.id)}
                      sx={{ textTransform: 'none', fontSize: '0.75rem', minWidth: 'auto', color: '#ffa424' }}>
                      Download
                    </Button>
                  )}
                  {r.status === 'processing' && (
                    <CircularProgress size={16} sx={{ color: '#f59e0b' }} />
                  )}
                </Box>
              ))
            )}
          </Paper>
        </Box>
      </Box>

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast(p => ({ ...p, open: false }))} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={toast.severity} onClose={() => setToast(p => ({ ...p, open: false }))} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FinanceExportPage;
