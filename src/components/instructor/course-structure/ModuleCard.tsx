import React from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Chip,
  Collapse,
} from '@mui/material';
import {
  DragIndicator as DragIcon,
  ChevronRight as ChevronIcon,
  PlayCircle as PlayIcon,
  Edit as EditIcon,
  ContentCopy as CopyIcon,
  MoreVert as MoreIcon,
  Description as FileIcon,
  AccessTime as TimeIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';

type ModuleStatus = 'published' | 'draft' | 'hidden';

interface ModuleData {
  id: string;
  title: string;
  icon?: React.ReactNode;
  lessonCount: number;
  duration: string;
  completionPercent: number;
  status: ModuleStatus;
}

interface ModuleCardProps {
  module: ModuleData;
  expanded: boolean;
  onToggle: () => void;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onMore?: () => void;
  children?: React.ReactNode;
}

const statusColors: Record<ModuleStatus, { bg: string; color: string }> = {
  published: { bg: '#d1fae5', color: '#10b981' },
  draft: { bg: '#fef3c7', color: '#f59e0b' },
  hidden: { bg: '#e4e4e7', color: '#52525b' },
};

const ModuleCard: React.FC<ModuleCardProps> = ({
  module,
  expanded,
  onToggle,
  onEdit,
  onDuplicate,
  onMore,
  children,
}) => {
  const statusStyle = statusColors[module.status];

  return (
    <Paper
      elevation={0}
      sx={{
        mb: 2,
        border: 1,
        borderColor: 'grey.200',
        borderRadius: 2,
        overflow: 'hidden',
        bgcolor: 'grey.50',
      }}
    >
      {/* Module Header */}
      <Box
        onClick={onToggle}
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          cursor: 'pointer',
          '&:hover': { bgcolor: 'grey.100' },
          '&:hover .module-actions': { opacity: 1 },
        }}
      >
        {/* Drag Handle */}
        <Box sx={{ color: 'grey.400', cursor: 'grab', '&:active': { cursor: 'grabbing' } }}>
          <DragIcon />
        </Box>

        {/* Expand Icon */}
        <Box
          sx={{
            color: 'grey.500',
            transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s',
          }}
        >
          <ChevronIcon />
        </Box>

        {/* Module Icon */}
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 1,
            background: 'linear-gradient(135deg, #ffb74d, #ffa424)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
          }}
        >
          {module.icon || <PlayIcon />}
        </Box>

        {/* Module Info */}
        <Box sx={{ flex: 1 }}>
          <Typography fontWeight={600} color="text.primary">
            {module.title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <FileIcon sx={{ fontSize: 14 }} /> {module.lessonCount} Lessons
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <TimeIcon sx={{ fontSize: 14 }} /> {module.duration}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CheckIcon sx={{ fontSize: 14 }} /> {module.completionPercent}% Complete
            </Typography>
          </Box>
        </Box>

        {/* Status Badge */}
        <Chip
          label={module.status.charAt(0).toUpperCase() + module.status.slice(1)}
          size="small"
          sx={{
            bgcolor: statusStyle.bg,
            color: statusStyle.color,
            fontWeight: 600,
            fontSize: '0.75rem',
          }}
        />

        {/* Actions */}
        <Box
          className="module-actions"
          sx={{ display: 'flex', gap: 0.5, opacity: 0, transition: 'opacity 0.2s' }}
          onClick={(e) => e.stopPropagation()}
        >
          <IconButton size="small" onClick={onEdit}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={onDuplicate}>
            <CopyIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={onMore}>
            <MoreIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Lessons Container */}
      <Collapse in={expanded}>
        <Box sx={{ px: 2, pb: 2 }}>{children}</Box>
      </Collapse>
    </Paper>
  );
};

export default ModuleCard;
export type { ModuleData, ModuleStatus };
