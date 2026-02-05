import React from 'react';
import { Box, Paper, Typography, Grid } from '@mui/material';
import {
  PlayCircle as VideoIcon,
  Description as DocIcon,
  ViewInAr as ScormIcon,
  Link as LinkIcon,
} from '@mui/icons-material';

type ContentType = 'video' | 'document' | 'scorm' | 'link';

interface UploadTypeOption {
  type: ContentType;
  title: string;
  description: string;
  formats: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  accentColor: string;
}

const uploadTypes: UploadTypeOption[] = [
  {
    type: 'video',
    title: 'Video',
    description: 'Upload video lessons and tutorials',
    formats: 'MP4, WebM, MOV • Max 2GB',
    icon: <VideoIcon />,
    iconBg: '#dbeafe',
    iconColor: '#3b82f6',
    accentColor: '#3b82f6',
  },
  {
    type: 'document',
    title: 'Document',
    description: 'Upload PDFs, slides, and worksheets',
    formats: 'PDF, DOCX, PPTX • Max 50MB',
    icon: <DocIcon />,
    iconBg: '#d1fae5',
    iconColor: '#10b981',
    accentColor: '#10b981',
  },
  {
    type: 'scorm',
    title: 'SCORM Package',
    description: 'Upload interactive learning packages',
    formats: 'SCORM 1.2 / 2004 • ZIP',
    icon: <ScormIcon />,
    iconBg: '#ede9fe',
    iconColor: '#8b5cf6',
    accentColor: '#8b5cf6',
  },
  {
    type: 'link',
    title: 'External Link',
    description: 'Add YouTube, Vimeo, or web links',
    formats: 'YouTube, Vimeo, Website URLs',
    icon: <LinkIcon />,
    iconBg: '#fce7f3',
    iconColor: '#ec4899',
    accentColor: '#ec4899',
  },
];

interface UploadTypeSelectorProps {
  selectedType: ContentType;
  onTypeChange: (type: ContentType) => void;
}

const UploadTypeSelector: React.FC<UploadTypeSelectorProps> = ({ selectedType, onTypeChange }) => {
  return (
    <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 2, border: 1, borderColor: 'grey.200' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight={700} mb={0.5}>
          Select Content Type
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Choose the type of content you want to upload
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {uploadTypes.map((item) => {
          const isActive = selectedType === item.type;
          return (
            <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={item.type}>
              <Box
                onClick={() => onTypeChange(item.type)}
                sx={{
                  p: 3,
                  border: 2,
                  borderColor: isActive ? item.accentColor : 'grey.200',
                  borderRadius: 2,
                  textAlign: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s',
                  bgcolor: isActive ? `${item.accentColor}08` : 'transparent',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    bgcolor: isActive ? item.accentColor : 'transparent',
                    transition: 'background-color 0.3s',
                  },
                  '&:hover': {
                    borderColor: item.accentColor,
                    transform: 'translateY(-4px)',
                    boxShadow: 3,
                  },
                }}
              >
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 2,
                    bgcolor: item.iconBg,
                    color: item.iconColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2,
                    fontSize: 28,
                    '& svg': { fontSize: 28 },
                  }}
                >
                  {item.icon}
                </Box>
                <Typography fontWeight={700} mb={0.5}>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={1.5}>
                  {item.description}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    px: 1.5,
                    py: 0.5,
                    bgcolor: 'grey.100',
                    borderRadius: 1,
                    color: 'text.secondary',
                  }}
                >
                  {item.formats}
                </Typography>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Paper>
  );
};

export default UploadTypeSelector;
export type { ContentType };
