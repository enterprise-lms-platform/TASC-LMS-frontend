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
} from '@mui/material';
import {
  FileUpload as FileUploadIcon,
  CloudUpload as CloudUploadIcon,
  Download as DownloadIcon,
  InsertDriveFile as FileIcon,
  ArrowForward as ArrowIcon,
  CheckCircle as SuccessIcon,
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
  { csvColumn: 'phone_number', systemField: 'Phone', sampleData: '+1234567890' },
];

const ManagerBulkImportPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
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
                    sx={{
                      border: '2px dashed',
                      borderColor: dragOver ? '#ffa424' : 'grey.300',
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

                  {/* Upload button */}
                  {selectedFile && !uploadMutation.isSuccess && (
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleUpload}
                      disabled={uploadMutation.isPending}
                      sx={{
                        mt: 2,
                        bgcolor: '#ffa424',
                        fontWeight: 600,
                        textTransform: 'none',
                        '&:hover': { bgcolor: '#f97316' },
                      }}
                    >
                      {uploadMutation.isPending ? 'Importing...' : 'Import Users'}
                    </Button>
                  )}

                  {uploadMutation.isPending && <LinearProgress sx={{ mt: 1 }} />}

                  {uploadMutation.isSuccess && (
                    <Alert severity="success" icon={<SuccessIcon />} sx={{ mt: 2 }}>
                      Successfully created {uploadMutation.data?.created ?? 0} users.
                      {(uploadMutation.data?.errors?.length ?? 0) > 0 && (
                        <> {uploadMutation.data!.errors.length} row(s) had errors.</>
                      )}
                    </Alert>
                  )}

                  {uploadMutation.isError && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                      Import failed. Please check your CSV format and try again.
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
