import React from 'react';
import { Box, Typography, Avatar, IconButton } from '@mui/material';
import {
  AccessTime as TimeIcon,
  AttachFile as FileIcon,
  Replay as AttemptIcon,
  ChevronLeft as PrevIcon,
  ChevronRight as NextIcon,
} from '@mui/icons-material';

interface GradingHeaderProps {
  studentName: string;
  studentInitials: string;
  email: string;
  submittedAt: string;
  fileCount: number;
  attemptNumber: number;
  currentIndex: number;
  totalCount: number;
  onPrevious: () => void;
  onNext: () => void;
}

const GradingHeader: React.FC<GradingHeaderProps> = ({
  studentName,
  studentInitials,
  email,
  submittedAt,
  fileCount,
  attemptNumber,
  currentIndex,
  totalCount,
  onPrevious,
  onNext,
}) => {
  return (
    <Box
      sx={{
        p: { xs: 2, md: 2 },
        px: { xs: 2, md: 3 },
        bgcolor: 'white',
        borderBottom: 1,
        borderColor: 'divider',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: { xs: 'flex-start', md: 'center' },
        gap: { xs: 2, md: 0 },
      }}
    >
      {/* Student Profile */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: { xs: '100%', md: 'auto' } }}>
        <Avatar
          sx={{
            width: 48,
            height: 48,
            fontWeight: 600,
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          }}
        >
          {studentInitials}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="subtitle1" fontWeight={700} color="text.primary">
            {studentName}
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 0.5 }}>
            {email}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              gap: { xs: 1, md: 2 },
              fontSize: '0.75rem',
              color: 'text.secondary',
              flexWrap: 'wrap',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TimeIcon sx={{ fontSize: 14 }} />
              {submittedAt}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <FileIcon sx={{ fontSize: 14 }} />
              {fileCount} files
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AttemptIcon sx={{ fontSize: 14 }} />
              Attempt {attemptNumber}
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Navigation */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          width: { xs: '100%', md: 'auto' },
          justifyContent: { xs: 'space-between', md: 'flex-end' },
        }}
      >
        <IconButton
          onClick={onPrevious}
          disabled={currentIndex === 0}
          sx={{
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            '&:disabled': { opacity: 0.5 },
          }}
        >
          <PrevIcon />
        </IconButton>
        <Typography variant="body2" fontWeight={500} color="text.secondary">
          {currentIndex + 1} of {totalCount}
        </Typography>
        <IconButton
          onClick={onNext}
          disabled={currentIndex === totalCount - 1}
          sx={{
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            '&:disabled': { opacity: 0.5 },
          }}
        >
          <NextIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default GradingHeader;
