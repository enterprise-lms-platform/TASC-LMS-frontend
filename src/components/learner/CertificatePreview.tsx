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
        maxWidth: 900,
        aspectRatio: '1.414 / 1',
        overflow: 'hidden',
        borderRadius: { xs: 0, md: '8px' },
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
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
        src="/certificate/certificate template.webp"
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
        {/* Learner Name */}
        <Typography
          sx={{
            position: 'absolute',
            top: '33%',
            left: '50%',
            transform: 'translateX(-35%)',
            width: '50%',
            textAlign: 'center',
            fontFamily: '"Georgia", "Times New Roman", serif',
            fontWeight: 700,
            fontSize: 'clamp(0.9rem, 2.5vw, 1.6rem)',
            color: '#1a1a2e',
            letterSpacing: '0.02em',
          }}
        >
          {certificate.user_name}
        </Typography>

        {/* Course Title */}
        <Typography
          sx={{
            position: 'absolute',
            top: '52%',
            left: '50%',
            transform: 'translateX(-30%)',
            width: '55%',
            textAlign: 'center',
            fontWeight: 600,
            fontSize: 'clamp(0.7rem, 1.8vw, 1.1rem)',
            color: '#2d2d44',
            lineHeight: 1.4,
          }}
        >
          {certificate.course_title}
        </Typography>

        {/* Date of Award */}
        <Typography
          sx={{
            position: 'absolute',
            bottom: '5%',
            left: '13%',
            width: '20%',
            textAlign: 'center',
            fontWeight: 600,
            fontSize: 'clamp(0.5rem, 1.2vw, 0.8rem)',
            color: '#333',
          }}
        >
          {issuedDate}
        </Typography>

        {/* Certificate Number */}
        <Typography
          sx={{
            position: 'absolute',
            bottom: '5%',
            left: '40%',
            width: '22%',
            textAlign: 'center',
            fontWeight: 600,
            fontSize: 'clamp(0.45rem, 1.1vw, 0.75rem)',
            color: '#333',
            fontFamily: 'monospace',
          }}
        >
          {certificate.certificate_number}
        </Typography>

        {/* Managing Director */}
        <Typography
          sx={{
            position: 'absolute',
            bottom: '5%',
            right: '5%',
            width: '22%',
            textAlign: 'center',
            fontWeight: 600,
            fontSize: 'clamp(0.5rem, 1.2vw, 0.75rem)',
            color: '#333',
          }}
        >
          Patrick Kabahanga Mbonyo
        </Typography>
      </Box>
    </Box>
  );
};

export default CertificatePreview;
