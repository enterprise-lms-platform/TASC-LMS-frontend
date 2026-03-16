import React from 'react';
import { Box, Typography } from '@mui/material';
import type { Certificate } from '../../types/types';

interface CertificatePreviewProps {
  certificate: Certificate;
}

const CertificatePreview: React.FC<CertificatePreviewProps> = ({ certificate }) => {
  const issuedDate = new Date(certificate.issued_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Box
      id="certificate-print-area"
      sx={{
        position: 'relative',
        width: '100%',
        maxWidth: 750,
        aspectRatio: '1232 / 864',
        overflow: 'hidden',
        borderRadius: { xs: 0, md: '8px' },
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        mx: 'auto',
        '@media print': {
          maxWidth: '100%',
          boxShadow: 'none',
          borderRadius: 0,
        },
      }}
    >
      {/* Background template image */}
      <Box
        component="img"
        src="/certificate/certificate A4beta.webp"
        alt="Certificate template"
        sx={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
      />

      {/* Overlay container */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        {/* Learner Name — sits just above the first horizontal line (~35.5% from top) */}
        <Typography
          sx={{
            position: 'absolute',
            top: '33%',
            left: '34%',
            width: '50%',
            textAlign: 'center',
            fontFamily: '"Georgia", "Times New Roman", serif',
            fontWeight: 700,
            fontSize: 'clamp(0.9rem, 2.5vw, 1.6rem)',
            color: '#1a1a2e',
            letterSpacing: '0.02em',
            '@media print': { fontSize: '24pt' },
          }}
        >
          {certificate.user_name}
        </Typography>

        {/* Course Title — sits just above the second horizontal line (~57.5% from top) */}
        <Typography
          sx={{
            position: 'absolute',
            top: '55%',
            left: '32%',
            width: '52%',
            textAlign: 'center',
            fontWeight: 600,
            fontSize: 'clamp(0.7rem, 1.8vw, 1.1rem)',
            color: '#2d2d44',
            lineHeight: 1.4,
            '@media print': { fontSize: '16pt' },
          }}
        >
          {certificate.course_title}
        </Typography>

        {/* Validity value — next to "Validity:" label */}
        <Typography
          sx={{
            position: 'absolute',
            bottom: '15%',
            left: '57%',
            width: '14%',
            textAlign: 'center',
            fontWeight: 700,
            fontStyle: 'italic',
            fontSize: 'clamp(0.4rem, 1vw, 0.7rem)',
            color: '#333',
            '@media print': { fontSize: '10pt' },
          }}
        >
          1 Year
        </Typography>

        {/* Date of Award value — above "Date of Award" label, centered at ~35% horizontal */}
        <Typography
          sx={{
            position: 'absolute',
            bottom: '8%',
            left: '32%',
            width: '16%',
            textAlign: 'center',
            fontWeight: 600,
            fontSize: 'clamp(0.4rem, 1vw, 0.65rem)',
            color: '#333',
            '@media print': { fontSize: '10pt' },
          }}
        >
          {issuedDate}
        </Typography>

        {/* Certificate Number value — above "Certificate Number:" label */}
        <Typography
          sx={{
            position: 'absolute',
            bottom: '8%',
            left: '52%',
            width: '16%',
            textAlign: 'center',
            fontWeight: 600,
            fontSize: 'clamp(0.35rem, 0.9vw, 0.6rem)',
            color: '#333',
            fontFamily: 'monospace',
            '@media print': { fontSize: '9pt' },
          }}
        >
          {certificate.certificate_number}
        </Typography>

        {/* Managing Director name — above "MANAGING DIRECTOR" label, centered at ~85% horizontal */}
        <Typography
          sx={{
            position: 'absolute',
            bottom: '8%',
            right: '5%',
            width: '16%',
            textAlign: 'center',
            fontWeight: 600,
            fontSize: 'clamp(0.35rem, 0.9vw, 0.6rem)',
            color: '#333',
            '@media print': { fontSize: '9pt' },
          }}
        >
          Patrick Kabahanga Mbonyo
        </Typography>
      </Box>
    </Box>
  );
};

export default CertificatePreview;
