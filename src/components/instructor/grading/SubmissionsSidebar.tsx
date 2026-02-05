import React, { useState } from 'react';
import { Box, Typography, TextField, InputAdornment, Tabs, Tab, Drawer, useMediaQuery, useTheme } from '@mui/material';
import {
  Search as SearchIcon,
  CheckCircle as GradedIcon,
  Schedule as PendingIcon,
  Warning as LateIcon,
} from '@mui/icons-material';
import SubmissionItem from './SubmissionItem';
import type { SubmissionData } from './SubmissionItem';

interface SubmissionsSidebarProps {
  submissions: SubmissionData[];
  selectedId: string | null;
  onSelectSubmission: (id: string) => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

const SIDEBAR_WIDTH = 320;

const SubmissionsSidebar: React.FC<SubmissionsSidebarProps> = ({
  submissions,
  selectedId,
  onSelectSubmission,
  mobileOpen = false,
  onMobileClose,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'graded'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  // Stats
  const gradedCount = submissions.filter((s) => s.status === 'graded').length;
  const pendingCount = submissions.filter((s) => s.status === 'pending').length;
  const lateCount = submissions.filter((s) => s.isLate).length;

  // Filtered submissions
  const filteredSubmissions = submissions.filter((s) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'pending' && s.status === 'pending') ||
      (filter === 'graded' && s.status === 'graded');
    const matchesSearch = s.studentName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleSelectSubmission = (id: string) => {
    onSelectSubmission(id);
    if (isMobile && onMobileClose) {
      onMobileClose();
    }
  };

  const sidebarContent = (
    <Box
      sx={{
        width: SIDEBAR_WIDTH,
        bgcolor: 'white',
        borderRight: { lg: 1 },
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        height: '100%',
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, px: 2.5, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle1" fontWeight={700} color="text.primary">
            Submissions
          </Typography>
          <Box
            sx={{
              px: 1,
              py: 0.25,
              bgcolor: '#ffcc80',
              borderRadius: 10,
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
          >
            {submissions.length}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, fontSize: '0.75rem', color: 'text.secondary', flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <GradedIcon sx={{ fontSize: 14, color: 'success.main' }} />
            {gradedCount} Graded
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <PendingIcon sx={{ fontSize: 14, color: 'warning.main' }} />
            {pendingCount} Pending
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <LateIcon sx={{ fontSize: 14, color: 'error.main' }} />
            {lateCount} Late
          </Box>
        </Box>
      </Box>

      {/* Filter Tabs */}
      <Tabs
        value={filter}
        onChange={(_, v) => setFilter(v)}
        variant="fullWidth"
        sx={{
          minHeight: 40,
          borderBottom: 1,
          borderColor: 'divider',
          '& .MuiTab-root': {
            minHeight: 40,
            fontSize: '0.75rem',
            fontWeight: 500,
            textTransform: 'none',
          },
        }}
      >
        <Tab value="all" label={`All (${submissions.length})`} />
        <Tab value="pending" label={`Pending (${pendingCount})`} />
        <Tab value="graded" label={`Graded (${gradedCount})`} />
      </Tabs>

      {/* Search */}
      <Box sx={{ p: 1.5, borderBottom: 1, borderColor: 'divider' }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search students..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 18, color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
          sx={{ '& .MuiInputBase-input': { fontSize: '0.875rem' } }}
        />
      </Box>

      {/* Submissions List */}
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        {filteredSubmissions.map((submission) => (
          <SubmissionItem
            key={submission.id}
            submission={submission}
            isActive={selectedId === submission.id}
            onClick={() => handleSelectSubmission(submission.id)}
          />
        ))}
      </Box>
    </Box>
  );

  // Mobile: use Drawer
  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          '& .MuiDrawer-paper': {
            width: SIDEBAR_WIDTH,
            boxSizing: 'border-box',
          },
        }}
      >
        {sidebarContent}
      </Drawer>
    );
  }

  // Desktop: static sidebar
  return sidebarContent;
};

export default SubmissionsSidebar;
