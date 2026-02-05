import React from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Chip,
  FormControl,
  Select,
  MenuItem,
  Grid,
} from '@mui/material';
import {
  Assignment as RequirementsIcon,
  PictureAsPdf as PdfIcon,
  Description as DocIcon,
  Image as ImageIcon,
  FolderZip as ZipIcon,
  Code as CodeIcon,
  Slideshow as PptIcon,
  InsertDriveFile as FileIcon,
} from '@mui/icons-material';

type FileType = 'pdf' | 'doc' | 'image' | 'zip' | 'code' | 'ppt' | 'any';

const fileTypes: Array<{ type: FileType; icon: React.ReactNode; label: string }> = [
  { type: 'pdf', icon: <PdfIcon />, label: 'PDF' },
  { type: 'doc', icon: <DocIcon />, label: 'DOC/DOCX' },
  { type: 'image', icon: <ImageIcon />, label: 'Images' },
  { type: 'zip', icon: <ZipIcon />, label: 'ZIP' },
  { type: 'code', icon: <CodeIcon />, label: 'Code Files' },
  { type: 'ppt', icon: <PptIcon />, label: 'PPT' },
  { type: 'any', icon: <FileIcon />, label: 'Any File' },
];

interface SubmissionRequirementsSectionProps {
  maxPoints: number;
  onMaxPointsChange: (value: number) => void;
  maxAttempts: string;
  onMaxAttemptsChange: (value: string) => void;
  allowedFileTypes: FileType[];
  onFileTypeToggle: (type: FileType) => void;
  maxFileSize: number;
  onMaxFileSizeChange: (value: number) => void;
}

const SubmissionRequirementsSection: React.FC<SubmissionRequirementsSectionProps> = ({
  maxPoints,
  onMaxPointsChange,
  maxAttempts,
  onMaxAttemptsChange,
  allowedFileTypes,
  onFileTypeToggle,
  maxFileSize,
  onMaxFileSizeChange,
}) => {
  return (
    <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2, mb: 3, overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <RequirementsIcon sx={{ color: 'primary.main' }} />
          Submission Requirements
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Define grading and file submission settings
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ p: 3 }}>
        {/* Points & Attempts */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Maximum Points <Box component="span" sx={{ color: 'error.main' }}>*</Box>
            </Typography>
            <TextField
              type="number"
              fullWidth
              value={maxPoints}
              onChange={(e) => onMaxPointsChange(Number(e.target.value))}
              InputProps={{
                endAdornment: <Typography color="text.secondary">points</Typography>,
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom>
              Submission Attempts
            </Typography>
            <FormControl fullWidth>
              <Select value={maxAttempts} onChange={(e) => onMaxAttemptsChange(e.target.value)}>
                <MenuItem value="1">1 attempt only</MenuItem>
                <MenuItem value="2">2 attempts</MenuItem>
                <MenuItem value="3">3 attempts</MenuItem>
                <MenuItem value="unlimited">Unlimited</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {/* Allowed File Types */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Allowed File Types
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {fileTypes.map((ft) => (
              <Chip
                key={ft.type}
                icon={ft.icon as React.ReactElement}
                label={ft.label}
                onClick={() => onFileTypeToggle(ft.type)}
                variant={allowedFileTypes.includes(ft.type) ? 'filled' : 'outlined'}
                sx={{
                  px: 1,
                  fontWeight: 500,
                  borderWidth: 2,
                  borderColor: allowedFileTypes.includes(ft.type) ? 'primary.main' : 'divider',
                  bgcolor: allowedFileTypes.includes(ft.type) ? 'rgba(255, 164, 36, 0.1)' : 'transparent',
                  color: allowedFileTypes.includes(ft.type) ? 'primary.main' : 'text.secondary',
                  '&:hover': { borderColor: 'primary.main' },
                }}
              />
            ))}
          </Box>
        </Box>

        {/* Max File Size */}
        <Box>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Maximum File Size
          </Typography>
          <TextField
            type="number"
            value={maxFileSize}
            onChange={(e) => onMaxFileSizeChange(Number(e.target.value))}
            InputProps={{
              endAdornment: <Typography color="text.secondary">MB</Typography>,
            }}
            sx={{ width: 150 }}
          />
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
            Maximum size per uploaded file
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default SubmissionRequirementsSection;
export type { FileType };
