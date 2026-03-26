import React, { useState, useRef, useCallback } from 'react';
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
  Alert,
  CircularProgress,
  LinearProgress,
} from '@mui/material';
import {
  FileUpload as FileUploadIcon,
  CloudUpload as CloudUploadIcon,
  Download as DownloadIcon,
  InsertDriveFile as FileIcon,
  ArrowForward as ArrowIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../../components/manager/Sidebar';
import TopBar from '../../components/manager/TopBar';
import { bulkImportApi, type BulkImportResult } from '../../services/superadmin.services';

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

interface ImportHistoryEntry {
  id: string;
  fileName: string;
  records: number;
  successful: number;
  failed: number;
  date: string;
  status: 'Completed' | 'Failed' | 'Processing';
  errors?: Array<{ row: number; email: string; error: string }>;
}

const ManagerBulkImportPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<BulkImportResult | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [importHistory, setImportHistory] = useState<ImportHistoryEntry[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadTemplate = () => {
    bulkImportApi.downloadTemplate();
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.csv')) {
      setSelectedFile(file);
      setUploadResult(null);
      setUploadError(null);
    } else {
      setUploadError('Please upload a CSV file');
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadResult(null);
      setUploadError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadResult(null);
    setUploadError(null);

    try {
      const result = await bulkImportApi.uploadCSV(selectedFile);
      setUploadResult(result);

      const newEntry: ImportHistoryEntry = {
        id: Date.now().toString(),
        fileName: selectedFile.name,
        records: result.total_rows,
        successful: result.imported,
        failed: result.failed,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        status: result.failed === 0 && result.imported > 0 ? 'Completed' : result.imported > 0 ? 'Completed' : 'Failed',
        errors: result.errors,
      };

      setImportHistory(prev => [newEntry, ...prev]);
      setSelectedFile(null);
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Upload failed. Please try again.';
      setUploadError(message);
    } finally {
      setIsUploading(false);
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
                  {selectedFile && (
                    <Chip
                      label={selectedFile.name}
                      size="small"
                      sx={{ fontWeight: 600, bgcolor: 'rgba(16,185,129,0.1)', color: '#10b981' }}
                    />
                  )}
                </Box>
                <Box sx={{ p: 3 }}>
                  <Box
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    sx={{
                      border: '2px dashed',
                      borderColor: isDragging ? '#ffa424' : selectedFile ? '#10b981' : 'grey.300',
                      borderRadius: '12px',
                      p: 5,
                      textAlign: 'center',
                      bgcolor: isDragging ? 'rgba(255,164,36,0.08)' : selectedFile ? 'rgba(16,185,129,0.02)' : 'rgba(255,164,36,0.02)',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s, background 0.2s',
                      '&:hover': {
                        borderColor: '#ffa424',
                        bgcolor: 'rgba(255,164,36,0.05)',
                      },
                    }}
                  >
                    {isUploading ? (
                      <CircularProgress size={48} sx={{ color: '#ffa424', mb: 1.5 }} />
                    ) : selectedFile ? (
                      <SuccessIcon sx={{ fontSize: 48, color: '#10b981', mb: 1.5 }} />
                    ) : (
                      <CloudUploadIcon sx={{ fontSize: 48, color: '#ffa424', mb: 1.5 }} />
                    )}
                    <Typography variant="body1" fontWeight={600} sx={{ mb: 0.5 }}>
                      {isUploading
                        ? 'Uploading...'
                        : selectedFile
                        ? `${selectedFile.name} selected`
                        : 'Drag and drop your CSV file here'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {selectedFile
                        ? `${(selectedFile.size / 1024).toFixed(1)} KB`
                        : 'or click to browse files'}
                    </Typography>
                    <Typography variant="caption" color="text.disabled">
                      Accepted format: .csv (max 10MB, up to 5,000 records)
                    </Typography>
                  </Box>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept=".csv"
                    style={{ display: 'none' }}
                  />

                  {selectedFile && !uploadResult && (
                    <Box sx={{ mt: 2.5, display: 'flex', gap: 1.5 }}>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={handleUpload}
                        disabled={isUploading}
                        startIcon={isUploading ? <CircularProgress size={16} color="inherit" /> : <FileUploadIcon />}
                        sx={{
                          bgcolor: '#ffa424',
                          '&:hover': { bgcolor: '#f97316' },
                          fontWeight: 600,
                          textTransform: 'none',
                        }}
                      >
                        {isUploading ? 'Importing...' : 'Import Users'}
                      </Button>
                      <Button
                        variant="outlined"
                        onClick={() => {
                          setSelectedFile(null);
                          setUploadError(null);
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        disabled={isUploading}
                        sx={{ textTransform: 'none', fontWeight: 600 }}
                      >
                        Clear
                      </Button>
                    </Box>
                  )}

                  {uploadError && (
                    <Alert severity="error" sx={{ mt: 2 }} onClose={() => setUploadError(null)}>
                      {uploadError}
                    </Alert>
                  )}

                  {uploadResult && (
                    <Alert
                      severity={uploadResult.failed === 0 ? 'success' : 'warning'}
                      sx={{ mt: 2 }}
                      icon={uploadResult.failed === 0 ? <SuccessIcon /> : <ErrorIcon />}
                    >
                      <Typography variant="body2" fontWeight={600}>
                        Import Complete
                      </Typography>
                      <Typography variant="body2">
                        {uploadResult.imported} users imported successfully
                        {uploadResult.failed > 0 && `, ${uploadResult.failed} failed`}
                      </Typography>
                    </Alert>
                  )}

                  <Box sx={{ mt: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FileIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
                      <Typography variant="body2" color="text.secondary">
                        Need help with the format?
                      </Typography>
                    </Box>
                    <Button
                      size="small"
                      startIcon={<DownloadIcon />}
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
                  </Box>
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
                        bgcolor: selectedFile ? '#ffa424' : 'grey.300',
                        color: 'white',
                        width: 28,
                        height: 28,
                        '& .MuiChip-label': { px: 0 },
                      }}
                    />
                    <Typography fontWeight={700}>Column Mapping</Typography>
                  </Box>
                  <Chip
                    label={selectedFile ? 'Ready to Import' : 'Pending Upload'}
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
                      {[
                        { csvColumn: 'email', systemField: 'Email', sampleData: 'sarah.m@acmecorp.com', required: true },
                        { csvColumn: 'first_name', systemField: 'First Name', sampleData: 'Sarah', required: true },
                        { csvColumn: 'last_name', systemField: 'Last Name', sampleData: 'Mitchell', required: true },
                        { csvColumn: 'role', systemField: 'Role', sampleData: 'learner', required: true },
                        { csvColumn: 'department', systemField: 'Department', sampleData: 'Engineering', required: false },
                        { csvColumn: 'phone_number', systemField: 'Phone', sampleData: '+1234567890', required: false },
                      ].map((mapping, idx) => (
                        <TableRow key={idx} sx={{ '&:last-child td': { borderBottom: 0 } }}>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 500, color: 'text.secondary' }}>
                                {mapping.csvColumn}
                              </Typography>
                              {mapping.required && (
                                <Typography sx={{ color: '#ef4444', fontSize: '0.7rem' }}>*</Typography>
                              )}
                            </Box>
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

            {/* Step 3: Import History */}
            <Grid size={{ xs: 12 }}>
              <Paper elevation={0} sx={cardSx}>
                <Box sx={headerSx}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Chip
                      label="3"
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
                    <Typography fontWeight={700}>Import History</Typography>
                  </Box>
                </Box>
                {isUploading && <LinearProgress sx={{ height: 2 }} />}
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.8rem' }}>File Name</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.8rem' }} align="center">Records</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.8rem' }} align="center">Successful</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.8rem' }} align="center">Failed</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.8rem' }}>Date</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.8rem' }}>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {importHistory.map((entry) => (
                        <TableRow
                          key={entry.id}
                          sx={{ '&:hover': { bgcolor: 'rgba(255,164,36,0.04)' }, '&:last-child td': { borderBottom: 0 } }}
                        >
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <FileIcon sx={{ fontSize: 18, color: '#ffa424' }} />
                              <Typography variant="body2" fontWeight={600}>
                                {entry.fileName}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" fontWeight={600}>
                              {entry.records}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" fontWeight={600} sx={{ color: '#10b981' }}>
                              {entry.successful}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body2" fontWeight={600} sx={{ color: entry.failed > 0 ? '#ef4444' : 'text.secondary' }}>
                              {entry.failed}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {entry.date}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={entry.status}
                              size="small"
                              sx={{
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                bgcolor:
                                  entry.status === 'Completed'
                                    ? 'rgba(16,185,129,0.1)'
                                    : entry.status === 'Processing'
                                    ? 'rgba(255,164,36,0.1)'
                                    : 'rgba(239,68,68,0.1)',
                                color:
                                  entry.status === 'Completed'
                                    ? '#10b981'
                                    : entry.status === 'Processing'
                                    ? '#ffa424'
                                    : '#ef4444',
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                      {importHistory.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                            <Typography variant="body2" color="text.secondary">
                              No import history yet
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default ManagerBulkImportPage;
