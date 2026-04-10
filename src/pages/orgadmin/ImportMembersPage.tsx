import React, { useState, useRef, useCallback } from 'react';
import {
  Box,
  CssBaseline,
  Toolbar,
  Paper,
  Typography,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  AppBar,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ArrowBack as BackIcon,
  Upload as UploadIcon,
  CloudUpload as CloudUploadIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  InsertDriveFile as FileIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Sidebar, { DRAWER_WIDTH } from '../../components/orgadmin/Sidebar';
import { managerMembersApi, type BulkImportMembersResult } from '../../services/organization.services';

const SAMPLE_CSV = `email,first_name,last_name
alice@example.com,Alice,Smith
bob@example.com,Bob,Jones`;

const ImportMembersPage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<BulkImportMembersResult | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const handleFileSelect = useCallback((file: File | null) => {
    if (!file) return;
    if (!file.name.endsWith('.csv')) {
      setSnackbar({ open: true, message: 'Please select a CSV file.', severity: 'error' });
      return;
    }
    setSelectedFile(file);
    setResult(null);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      handleFileSelect(e.dataTransfer.files[0] ?? null);
    },
    [handleFileSelect],
  );

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setResult(null);
    try {
      const data = await managerMembersApi.bulkImport(selectedFile);
      setResult(data);
      if (data.imported > 0 && data.failed === 0) {
        setSnackbar({ open: true, message: `Successfully imported ${data.imported} members.`, severity: 'success' });
      } else if (data.imported > 0) {
        setSnackbar({ open: true, message: `Imported ${data.imported} members with ${data.failed} errors.`, severity: 'success' });
      } else {
        setSnackbar({ open: true, message: 'Import completed with errors. No members were imported.', severity: 'error' });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Import failed. Please try again.';
      setSnackbar({ open: true, message, severity: 'error' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.50', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { md: `${DRAWER_WIDTH}px` },
          bgcolor: 'white',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ minHeight: '72px !important', gap: 2 }}>
          <IconButton onClick={() => setMobileOpen(!mobileOpen)} sx={{ display: { md: 'none' }, color: 'text.secondary' }}>
            <MenuIcon />
          </IconButton>
          <Button startIcon={<BackIcon />} onClick={() => navigate('/org-admin/members')} sx={{ color: 'text.secondary', textTransform: 'none', fontWeight: 500 }}>
            Back
          </Button>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={700} color="text.primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <UploadIcon sx={{ color: 'primary.main' }} />
              Import Members
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flexGrow: 1, width: { md: `calc(100% - ${DRAWER_WIDTH}px)` }, minHeight: '100vh' }}>
        <Toolbar sx={{ minHeight: '72px !important' }} />

        <Box sx={{ p: { xs: 2, md: 3 }, maxWidth: 1400 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
            Import Members
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 4 }}>
            Upload a CSV file to add multiple learners to your organization at once. All imported users will be added as learners.
          </Typography>

          {/* CSV format reference */}
          <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              CSV Format
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              Your CSV file must include these columns: <strong>email</strong>, <strong>first_name</strong>, <strong>last_name</strong>
            </Typography>
            <Box
              component="pre"
              sx={{
                bgcolor: 'grey.100',
                p: 2,
                borderRadius: 2,
                fontSize: '0.8rem',
                fontFamily: 'monospace',
                overflow: 'auto',
                m: 0,
              }}
            >
              {SAMPLE_CSV}
            </Box>
          </Paper>

          {/* Upload area */}
          <Paper elevation={0} sx={{ p: 4, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
            {isUploading && <LinearProgress sx={{ mb: 2, borderRadius: 1 }} />}

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              hidden
              onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
            />

            <Box
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              sx={{
                border: '2px dashed',
                borderColor: selectedFile ? 'primary.main' : 'grey.300',
                borderRadius: 3,
                py: 5,
                px: 3,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'border-color 0.2s',
                bgcolor: selectedFile ? 'rgba(255,164,36,0.04)' : 'transparent',
                '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(255,164,36,0.04)' },
              }}
            >
              {selectedFile ? (
                <>
                  <FileIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                  <Typography variant="body1" fontWeight={600}>
                    {selectedFile.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </Typography>
                </>
              ) : (
                <>
                  <CloudUploadIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                  <Typography variant="body1" fontWeight={600} color="text.secondary">
                    Drag & drop a CSV file here, or click to browse
                  </Typography>
                  <Typography variant="body2" color="text.disabled" sx={{ mt: 0.5 }}>
                    Max 10 MB, up to 500 rows
                  </Typography>
                </>
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button
                variant="contained"
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                startIcon={isUploading ? <CircularProgress size={18} sx={{ color: 'white' }} /> : <UploadIcon />}
                sx={{
                  flex: 1,
                  bgcolor: 'primary.main',
                  color: 'white',
                  textTransform: 'none',
                  fontWeight: 600,
                  py: 1.5,
                  '&:hover': { bgcolor: 'primary.dark' },
                }}
              >
                {isUploading ? 'Importing...' : 'Import Members'}
              </Button>
              <Button
                variant="outlined"
                onClick={handleReset}
                disabled={isUploading}
                sx={{ flex: 1, textTransform: 'none', fontWeight: 600, py: 1.5 }}
              >
                Reset
              </Button>
            </Box>
          </Paper>

          {/* Results summary */}
          {result && (
            <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                {result.failed === 0 ? (
                  <CheckCircleIcon sx={{ color: 'success.main' }} />
                ) : (
                  <ErrorIcon sx={{ color: 'warning.main' }} />
                )}
                Import Results
              </Typography>

              <Box sx={{ display: 'flex', gap: 3, mb: 2, flexWrap: 'wrap' }}>
                <Chip label={`Total rows: ${result.total_rows}`} variant="outlined" />
                <Chip label={`Imported: ${result.imported}`} color="success" variant="outlined" />
                {result.failed > 0 && (
                  <Chip label={`Failed: ${result.failed}`} color="error" variant="outlined" />
                )}
              </Box>

              {result.errors.length > 0 && (
                <>
                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                    Row Errors
                  </Typography>
                  <TableContainer sx={{ maxHeight: 300 }}>
                    <Table size="small" stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: 600 }}>Row</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>Error</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {result.errors.map((err, idx) => (
                          <TableRow key={idx}>
                            <TableCell>{err.row}</TableCell>
                            <TableCell>{err.email || '—'}</TableCell>
                            <TableCell sx={{ color: 'error.main' }}>{err.error}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </>
              )}
            </Paper>
          )}
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ImportMembersPage;
