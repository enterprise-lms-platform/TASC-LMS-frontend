import React, { useState, useRef } from 'react';
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Paper,
  Grid,
  Chip,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  Alert,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  FileUpload as FileUploadIcon,
  CloudUpload as CloudUploadIcon,
  Download as DownloadIcon,
  InsertDriveFile as FileIcon,
  ArrowForward as ArrowIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { useMutation } from '@tanstack/react-query';
import Sidebar, { DRAWER_WIDTH } from '../../components/manager/Sidebar';
import TopBar from '../../components/manager/TopBar';
import { bulkImportApi } from '../../services/superadmin.services';

const cardSx = {
  borderRadius: '1rem',
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 6px 16px rgba(0,0,0,0.04)',
};
const headerSx = {
  p: 2,
  px: 3,
  bgcolor: 'grey.50',
  borderBottom: 1,
  borderColor: 'divider',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap' as const,
  gap: 2,
};

// Backend CSV columns
const columnMappings = [
  { csvColumn: 'email', systemField: 'Email', sampleData: 'sarah.m@acmecorp.com' },
  { csvColumn: 'first_name', systemField: 'First Name', sampleData: 'Sarah' },
  { csvColumn: 'last_name', systemField: 'Last Name', sampleData: 'Mitchell' },
  { csvColumn: 'role', systemField: 'Role', sampleData: 'learner' },
  { csvColumn: 'department', systemField: 'Department', sampleData: 'Engineering' },
  { csvColumn: 'manager_email', systemField: 'Reports To', sampleData: 'alex.o@acmecorp.com' },
];

// ── Import History ──
let importHistory = [
  { fileName: 'engineering_team_q1.csv', records: 156, successful: 152, failed: 4, date: 'Mar 6, 2026', status: 'Completed' },
  { fileName: 'new_hires_march.csv', records: 42, successful: 42, failed: 0, date: 'Mar 1, 2026', status: 'Completed' },
  { fileName: 'contractor_batch.csv', records: 28, successful: 0, failed: 28, date: 'Feb 22, 2026', status: 'Failed' },
  { fileName: 'sales_onboarding.csv', records: 89, successful: 87, failed: 2, date: 'Feb 15, 2026', status: 'Completed' },
];

interface ImportResult {
  fileName: string;
  records: number;
  successful: number;
  failed: number;
  date: string;
  status: string;
}

const ManagerBulkImportPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<ImportResult[]>(importHistory);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadTemplate = async () => {
    try {
      const response = await bulkImportApi.getCsvTemplate();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'user_import_template.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to download template:', err);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.csv')) {
        setError('Please select a CSV file');
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
      setError(null);
      setUploadResult(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError(null);
    setUploadResult(null);

    try {
      const response = await bulkImportApi.bulkImport(selectedFile);
      setUploadResult(response.data);

      const newEntry: ImportResult = {
        fileName: selectedFile.name,
        records: response.data.total || 0,
        successful: response.data.successful || 0,
        failed: response.data.failed || 0,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: response.data.failed > 0 ? 'Partial' : 'Completed',
      };
      setHistory([newEntry, ...history]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Import failed. Please check your CSV file format.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      if (!file.name.endsWith('.csv')) {
        setError('Please select a CSV file');
        return;
      }
      setSelectedFile(file);
      setError(null);
      setUploadResult(null);
    }
  };
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useMutation({
    mutationFn: (file: File) => bulkImportApi.uploadCsv(file).then((r) => r.data),
  });

  const handleFileSelect = (file: File) => {
    if (!file.name.endsWith('.csv')) return;
    setSelectedFile(file);
    uploadMutation.reset();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    uploadMutation.mutate(selectedFile);
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await bulkImportApi.downloadTemplate();
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'user_import_template.csv';
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // Silently fail — user can retry
    }
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.50', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { lg: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          minWidth: 0,
          maxWidth: '100vw',
        }}
      >
        <Toolbar />

        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400, mx: 'auto' }}>
          {/* Page Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #ffa424, #f97316)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <FileUploadIcon />
            </Box>
            <Box>
              <Typography variant="h5" fontWeight={700}>
                Bulk Import
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Import users via CSV file
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={3}>
            {/* Step 1: Upload CSV */}
            <Grid size={{ xs: 12, lg: 6 }}>
              <Paper elevation={0} sx={cardSx}>
                <Box sx={headerSx}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label="1"
                      size="small"
                      sx={{
                        fontWeight: 700,
                        bgcolor: '#ffa424',
                        color: 'white',
                        width: 28,
                        height: 28,
                        '& .MuiChip-label': { px: 0 },
                      }}
                    />
                    <Typography fontWeight={700}>Upload CSV File</Typography>
                  </Box>
                </Box>
                <Box sx={{ p: 3 }}>
                  {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {error}
                    </Alert>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileSelect(file);
                    }}
                  />
                  <Box
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    onClick={() => fileInputRef.current?.click()}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    sx={{
                      border: '2px dashed',
                      borderColor: 'grey.300',
                      borderRadius: '12px',
                      p: 5,
                      textAlign: 'center',
                      bgcolor: dragOver ? 'rgba(255,164,36,0.05)' : 'rgba(255,164,36,0.02)',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s, background 0.2s',
                      '&:hover': {
                        borderColor: '#ffa424',
                        bgcolor: 'rgba(255,164,36,0.05)',
                      },
                    }}
                  >
                    {selectedFile ? (
                      <>
                        <CheckCircleIcon sx={{ fontSize: 48, color: '#10b981', mb: 1.5 }} />
                        <Typography variant="body1" fontWeight={600} sx={{ mb: 0.5 }}>
                          {selectedFile.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {(selectedFile.size / 1024).toFixed(1)} KB - Ready to import
                        </Typography>
                      </>
                    ) : (
                      <>
                        <CloudUploadIcon sx={{ fontSize: 48, color: '#ffa424', mb: 1.5 }} />
                        <Typography variant="body1" fontWeight={600} sx={{ mb: 0.5 }}>
                          Drag and drop your CSV file here
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          or click to browse files
                        </Typography>
                      </>
                    )}
                    <Typography variant="caption" color="text.disabled">
                      Accepted format: .csv (max 10MB, up to 5,000 records)
                    </Typography>
                    <CloudUploadIcon sx={{ fontSize: 48, color: '#ffa424', mb: 1.5 }} />
                    {selectedFile ? (
                      <>
                        <Typography variant="body1" fontWeight={600} sx={{ mb: 0.5 }}>
                          {selectedFile.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {(selectedFile.size / 1024).toFixed(1)} KB — Click or drop to replace
                        </Typography>
                      </>
                    ) : (
                      <>
                        <Typography variant="body1" fontWeight={600} sx={{ mb: 0.5 }}>
                          Drag and drop your CSV file here
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          or click to browse files
                        </Typography>
                        <Typography variant="caption" color="text.disabled">
                          Accepted format: .csv (max 10MB, up to 5,000 records)
                        </Typography>
                      </>
                    )}
                  </Box>

                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".csv"
                    style={{ display: 'none' }}
                    onChange={handleFileSelect}
                  />

                  <Box sx={{ mt: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FileIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
                      <Typography variant="body2" color="text.secondary">
                        Need help with the format?
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        size="small"
                        startIcon={<DownloadIcon />}
                        onClick={handleDownloadTemplate}
                        onClick={handleDownloadTemplate}
                      sx={{
                          textTransform: 'none',
                          fontWeight: 600,
                          color: '#ffa424',
                          '&:hover': { bgcolor: 'rgba(255,164,36,0.08)' },
                        }}
                      >
                        Download Template
                      </Button>
                      {selectedFile && (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={handleUpload}
                          disabled={uploading}
                          sx={{
                            textTransform: 'none',
                            fontWeight: 600,
                            bgcolor: '#ffa424',
                            '&:hover': { bgcolor: '#e6951a' },
                          }}
                        >
                          {uploading ? <CircularProgress size={20} color="inherit" /> : 'Import Users'}
                        </Button>
                      )}
                    </Box>
                  </Box>

                  {uploadResult && (
                    <Alert
                      severity={uploadResult.failed > 0 ? 'warning' : 'success'}
                      sx={{ mt: 2 }}
                      icon={uploadResult.failed > 0 ? <ErrorIcon /> : <CheckCircleIcon />}
                    >
                      Import completed: {uploadResult.successful} successful, {uploadResult.failed} failed
                    </Alert>
                  )}
                </Box>
              </Paper>
            </Grid>

            {/* Step 2: Column Mapping */}
            <Grid size={{ xs: 12, lg: 6 }}>
              <Paper elevation={0} sx={{ ...cardSx, opacity: selectedFile ? 1 : 0.7 }}>
                <Box sx={headerSx}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label="2"
                      size="small"
                      sx={{
                        fontWeight: 700,
                        bgcolor: selectedFile ? '#ffa424' : selectedFile ? '#ffa424' : 'grey.300',
                        color: 'white',
                        width: 28,
                        height: 28,
                        '& .MuiChip-label': { px: 0 },
                      }}
                    />
                    <Typography fontWeight={700}>Column Mapping</Typography>
                  </Box>
                  <Chip
                    label={selectedFile ? 'Ready' : 'Pending Upload'}
                    size="small"
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      bgcolor: selectedFile ? 'rgba(16,185,129,0.1)' : 'grey.100',
                      color: selectedFile ? '#10b981' : 'text.secondary',
                    }}
                  />
                </Box>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.8rem' }}>CSV Column</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.8rem', width: 40 }} />
                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.8rem' }}>System Field</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.8rem' }}>Sample Data</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {columnMappings.map((mapping, idx) => (
                        <TableRow key={idx} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 500, color: 'text.secondary' }}>
                              {mapping.csvColumn}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <ArrowIcon sx={{ fontSize: 16, color: 'text.disabled' }} />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={mapping.systemField}
                              size="small"
                              sx={{ fontWeight: 600, fontSize: '0.7rem', bgcolor: 'rgba(59,130,246,0.1)', color: '#3b82f6' }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.disabled" sx={{ fontStyle: 'italic' }}>
                              {mapping.sampleData}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>

            {/* Import result errors table */}
            {uploadMutation.isSuccess && (uploadMutation.data?.errors?.length ?? 0) > 0 && (
              <Grid size={{ xs: 12 }}>
                <Paper elevation={0} sx={cardSx}>
                  <Box sx={headerSx}>
                    <Typography fontWeight={700} color="error.main">Import Errors</Typography>
                  </Box>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem' }}>Row</TableCell>
                          <TableCell sx={{ fontWeight: 700, fontSize: '0.8rem' }}>Error</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {uploadMutation.data!.errors.map((err, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{err.row}</TableCell>
                            <TableCell>{err.message}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default ManagerBulkImportPage;
