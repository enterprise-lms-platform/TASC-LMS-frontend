import React, { useState } from 'react';
import {
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Paper,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Skeleton,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import { Search as SearchIcon, Download as DownloadIcon } from '@mui/icons-material';
import Sidebar, { DRAWER_WIDTH } from '../../components/orgadmin/Sidebar';
import TopBar from '../../components/orgadmin/TopBar';
import { useOrgCertificates } from '../../hooks/useOrgAdmin';

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
};

interface Certificate {
  id: number;
  user: { id: number; name: string; email: string };
  course: { id: number; title: string };
  certificate_number: string;
  issued_at: string;
  status: 'issued' | 'pending';
}

const CertificatesPage: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const { data: certificatesData, isLoading } = useOrgCertificates({ page_size: 20 });
  const certificates: Certificate[] = (certificatesData as unknown as { results?: Certificate[] })?.results ?? [];

  const filteredCertificates = certificates.filter(
    (c) => search === '' || c.user.name.toLowerCase().includes(search.toLowerCase()) || c.course.title.toLowerCase().includes(search.toLowerCase()) || c.certificate_number.toLowerCase().includes(search.toLowerCase())
  );

  const handleDownload = () => {
    setSnackbarOpen(true);
  };

  const getStatusChip = (status: string) => {
    if (status === 'issued') {
      return <Chip label="Issued" size="small" sx={{ bgcolor: '#dcfce7', color: '#10b981', fontWeight: 600, fontSize: '0.7rem' }} />;
    }
    return <Chip label="Pending" size="small" sx={{ bgcolor: '#fff3e0', color: '#f59e0b', fontWeight: 600, fontSize: '0.7rem' }} />;
  };

  return (
    <Box sx={{ display: 'flex', bgcolor: 'grey.50', minHeight: '100vh' }}>
      <CssBaseline />
      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMobileMenuToggle={() => setMobileOpen(!mobileOpen)} title="Certificates" />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          minWidth: 0,
          maxWidth: '100vw',
        }}
      >
        <Toolbar sx={{ minHeight: '72px !important' }} />
        <Box sx={{ p: { xs: 2, md: 3 } }}>
          <Paper elevation={0} sx={cardSx}>
            <Box sx={{ ...headerSx, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1" fontWeight={700}>
                Certificates
              </Typography>
              <TextField
                size="small"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{ width: 250 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            {isLoading ? (
              <Box sx={{ p: 2 }}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} height={56} sx={{ mb: 1 }} />
                ))}
              </Box>
            ) : filteredCertificates.length === 0 ? (
              <Box sx={{ p: 6, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No certificates issued yet
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>Member</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>Course</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>Certificate Number</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>Issue Date</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600, color: 'text.secondary', fontSize: '0.75rem', textTransform: 'uppercase' }}></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredCertificates.map((cert) => (
                      <TableRow key={cert.id} hover>
                        <TableCell>
                          <Typography variant="body2" fontWeight={500}>
                            {cert.user.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {cert.user.email}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ fontWeight: 500 }}>{cert.course.title}</TableCell>
                        <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{cert.certificate_number}</TableCell>
                        <TableCell sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                          {new Date(cert.issued_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{getStatusChip(cert.status)}</TableCell>
                        <TableCell>
                          <IconButton size="small" onClick={handleDownload}>
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Box>
      </Box>

      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={() => setSnackbarOpen(false)}>
        <Alert severity="info" onClose={() => setSnackbarOpen(false)}>
          Download coming soon
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CertificatesPage;