import React, { useState } from 'react';
import { Box, Paper, Typography, IconButton, Tabs, Tab } from '@mui/material';
import {
  Upload as UploadIcon,
  PlayCircle as VideoIcon,
  Description as DocIcon,
  Quiz as QuizIcon,
  AddCircle as AddIcon,
} from '@mui/icons-material';

interface LibraryItem {
  id: string;
  name: string;
  type: 'video' | 'document' | 'quiz';
  meta: string;
}

interface ContentLibraryWidgetProps {
  videos?: LibraryItem[];
  documents?: LibraryItem[];
  quizzes?: LibraryItem[];
  onAddItem?: (item: LibraryItem) => void;
  onUpload?: () => void;
}

const defaultVideos: LibraryItem[] = [
  { id: 'v1', name: 'React Hooks Overview.mp4', type: 'video', meta: '15:30 • Uploaded Jan 15' },
  { id: 'v2', name: 'State Management Deep Dive.mp4', type: 'video', meta: '28:45 • Uploaded Jan 18' },
  { id: 'v3', name: 'Context API Tutorial.mp4', type: 'video', meta: '20:10 • Uploaded Jan 20' },
  { id: 'v4', name: 'Performance Optimization.mp4', type: 'video', meta: '35:20 • Uploaded Jan 22' },
];

const typeIcons = {
  video: <VideoIcon />,
  document: <DocIcon />,
  quiz: <QuizIcon />,
};

const typeColors = {
  video: { bg: '#dbeafe', color: '#3b82f6' },
  document: { bg: '#d1fae5', color: '#10b981' },
  quiz: { bg: '#ede9fe', color: '#8b5cf6' },
};

const ContentLibraryWidget: React.FC<ContentLibraryWidgetProps> = ({
  videos = defaultVideos,
  documents = [],
  quizzes = [],
  onAddItem,
  onUpload,
}) => {
  const [tab, setTab] = useState(0);

  const getItems = () => {
    switch (tab) {
      case 0: return videos;
      case 1: return documents;
      case 2: return quizzes;
      default: return videos;
    }
  };

  const items = getItems();

  return (
    <Paper elevation={0} sx={{ borderRadius: 2, border: 1, borderColor: 'grey.200', overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ p: 2, px: 3, borderBottom: 1, borderColor: 'grey.200', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography fontWeight={700}>Content Library</Typography>
        <IconButton size="small" onClick={onUpload}>
          <UploadIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{
          borderBottom: 1,
          borderColor: 'grey.200',
          minHeight: 42,
          '& .MuiTab-root': { minHeight: 42, py: 1, textTransform: 'none', fontWeight: 500 },
        }}
      >
        <Tab label="Videos" />
        <Tab label="Docs" />
        <Tab label="Quizzes" />
      </Tabs>

      {/* Content */}
      <Box sx={{ p: 2, maxHeight: 300, overflowY: 'auto' }}>
        {items.length === 0 ? (
          <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
            No items found
          </Typography>
        ) : (
          items.map((item) => {
            const colors = typeColors[item.type];
            return (
              <Box
                key={item.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 1.5,
                  border: 1,
                  borderColor: 'grey.200',
                  borderRadius: 1,
                  mb: 1,
                  cursor: 'grab',
                  '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(255, 164, 36, 0.05)' },
                  '&:hover .add-btn': { opacity: 1 },
                }}
              >
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 1,
                    bgcolor: colors.bg,
                    color: colors.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '& svg': { fontSize: 18 },
                  }}
                >
                  {typeIcons[item.type]}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography variant="body2" fontWeight={500} noWrap>
                    {item.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {item.meta}
                  </Typography>
                </Box>
                <Box className="add-btn" sx={{ opacity: 0, color: 'primary.main', transition: 'opacity 0.2s' }}>
                  <AddIcon onClick={() => onAddItem?.(item)} sx={{ cursor: 'pointer' }} />
                </Box>
              </Box>
            );
          })
        )}
      </Box>
    </Paper>
  );
};

export default ContentLibraryWidget;
