import { useState } from 'react';
import { Box, Container, Typography, Paper, TextField, Button, CircularProgress, Alert, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faCertificate, faSearch, faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { certificateApi } from '../../services/learning.services';
import type { Certificate } from '../../types/types';

const CertificateValidationPage = () => {
  const navigate = useNavigate();
  const [certificateNumber, setCertificateNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Certificate | null>(null);
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certificateNumber.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);
    setSearched(true);

    try {
      const { data } = await certificateApi.verify(certificateNumber.trim());
      setResult(data);
    } catch {
      setError('Certificate not found. Please check the certificate number and try again.');
    } finally {
      setLoading(false);
    }
  };

  const issuedDate = result
    ? new Date(result.issued_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : '';

  const expiryDate = result?.expiry_date
    ? new Date(result.expiry_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fafaf8', py: { xs: 3, md: 6 } }}>
      <Container maxWidth="sm">
        <Button
          onClick={() => navigate(-1)}
          sx={{
            color: '#71717a',
            textTransform: 'none',
            fontSize: '0.875rem',
            mb: 3,
            '&:hover': { color: '#3f3f46', background: 'transparent' },
          }}
        >
          <FontAwesomeIcon icon={faArrowLeft} style={{ marginRight: 8 }} />
          Back
        </Button>

        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box sx={{ display: 'inline-flex', p: 1.5, borderRadius: '50%', bgcolor: 'rgba(255,164,36,0.1)', mb: 2 }}>
              <FontAwesomeIcon icon={faCertificate} style={{ fontSize: '1.5rem', color: '#ffa424' }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', mb: 1 }}>
              Certificate Validation
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Verify the authenticity of a TASC certificate
            </Typography>
          </Box>

          <Divider sx={{ mb: 4 }} />

          {/* Search Form */}
          <Box component="form" onSubmit={handleVerify} sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Enter certificate number (e.g. TASC-2024-00001)"
              value={certificateNumber}
              onChange={(e) => setCertificateNumber(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': { borderColor: '#ffa424' },
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading || !certificateNumber.trim()}
              sx={{
                bgcolor: '#ffa424',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                whiteSpace: 'nowrap',
                '&:hover': { bgcolor: '#f97316' },
              }}
            >
              {loading ? <CircularProgress size={20} color="inherit" /> : (
                <>
                  <FontAwesomeIcon icon={faSearch} style={{ marginRight: 8 }} />
                  Verify
                </>
              )}
            </Button>
          </Box>

          {/* Error */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Result */}
          {result && (
            <Box
              sx={{
                p: 3,
                borderRadius: 2,
                border: '1px solid',
                borderColor: result.is_valid && !result.is_expired ? '#10b981' : '#ef4444',
                bgcolor: result.is_valid && !result.is_expired ? 'rgba(16,185,129,0.05)' : 'rgba(239,68,68,0.05)',
              }}
            >
              {/* Status Badge */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
                <FontAwesomeIcon
                  icon={result.is_valid && !result.is_expired ? faCheckCircle : faTimesCircle}
                  style={{
                    fontSize: '1.5rem',
                    color: result.is_valid && !result.is_expired ? '#10b981' : '#ef4444',
                  }}
                />
                <Typography variant="h6" sx={{ fontWeight: 700, color: result.is_valid && !result.is_expired ? '#10b981' : '#ef4444' }}>
                  {result.is_valid && !result.is_expired ? 'Valid Certificate' : result.is_expired ? 'Expired Certificate' : 'Invalid Certificate'}
                </Typography>
              </Box>

              <Divider sx={{ mb: 2 }} />

              {/* Details */}
              <Box sx={{ display: 'grid', gap: 1.5 }}>
                <DetailRow label="Certificate Number" value={result.certificate_number} />
                <DetailRow label="Holder Name" value={result.user_name} />
                <DetailRow label="Course" value={result.course_title} />
                <DetailRow label="Date of Award" value={issuedDate} />
                {expiryDate && <DetailRow label="Expiry Date" value={expiryDate} />}
              </Box>
            </Box>
          )}

          {/* Empty state */}
          {searched && !loading && !result && !error && (
            <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.disabled', py: 4 }}>
              No results found.
            </Typography>
          )}

          {/* Info text */}
          {!searched && (
            <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.disabled', mt: 2 }}>
              Enter the certificate number found on the bottom of the certificate to verify its authenticity.
            </Typography>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
      {label}
    </Typography>
    <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', fontSize: '0.875rem', textAlign: 'right' }}>
      {value}
    </Typography>
  </Box>
);

export default CertificateValidationPage;
