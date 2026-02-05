import React from 'react';
import { Box, Paper, Typography, IconButton } from '@mui/material';
import {
  AccountTree as TreeIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Public as AllIcon,
  Code as CodeIcon,
  Javascript as JsIcon,
  Css as CssIcon,
  Schema as SchemaIcon,
  Science as TestIcon,
  Speed as PerfIcon,
} from '@mui/icons-material';

interface Category {
  id: string;
  name: string;
  count: number;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
}

const categoriesData: Category[] = [
  { id: 'all', name: 'All Questions', count: 248, icon: <AllIcon />, iconBgColor: '#e4e4e7', iconColor: '#52525b' },
  { id: 'react-hooks', name: 'React Hooks', count: 45, icon: <CodeIcon />, iconBgColor: '#dbeafe', iconColor: '#3b82f6' },
  { id: 'javascript', name: 'JavaScript Basics', count: 62, icon: <JsIcon />, iconBgColor: '#fef3c7', iconColor: '#f59e0b' },
  { id: 'typescript', name: 'TypeScript', count: 38, icon: <CodeIcon />, iconBgColor: '#dbeafe', iconColor: '#3b82f6' },
  { id: 'css', name: 'CSS & Styling', count: 28, icon: <CssIcon />, iconBgColor: '#fce7f3', iconColor: '#ec4899' },
  { id: 'state-management', name: 'State Management', count: 32, icon: <SchemaIcon />, iconBgColor: '#ede9fe', iconColor: '#8b5cf6' },
  { id: 'testing', name: 'Testing', count: 24, icon: <TestIcon />, iconBgColor: '#d1fae5', iconColor: '#10b981' },
  { id: 'performance', name: 'Performance', count: 19, icon: <PerfIcon />, iconBgColor: '#fee2e2', iconColor: '#ef4444' },
];

interface CategoriesPanelProps {
  selectedCategory: string;
  onCategorySelect: (categoryId: string) => void;
  onAddCategory: () => void;
}

const CategoriesPanel: React.FC<CategoriesPanelProps> = ({
  selectedCategory,
  onCategorySelect,
  onAddCategory,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        border: 1,
        borderColor: 'divider',
        borderRadius: 2,
        overflow: 'hidden',
        position: 'sticky',
        top: 100,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: 'grey.50',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TreeIcon sx={{ color: 'primary.main', fontSize: 20 }} />
          <Typography fontWeight={700} color="text.primary">
            Categories
          </Typography>
        </Box>
        <IconButton size="small" onClick={onAddCategory}>
          <AddIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Categories List */}
      <Box sx={{ p: 1.5, maxHeight: 400, overflow: 'auto' }}>
        {categoriesData.map((category) => (
          <Box
            key={category.id}
            onClick={() => onCategorySelect(category.id)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 1.5,
              borderRadius: 1,
              cursor: 'pointer',
              mb: 0.5,
              transition: 'all 0.2s',
              bgcolor: selectedCategory === category.id ? 'rgba(255, 164, 36, 0.1)' : 'transparent',
              color: selectedCategory === category.id ? 'primary.main' : 'inherit',
              '&:hover': {
                bgcolor: selectedCategory === category.id ? 'rgba(255, 164, 36, 0.1)' : 'grey.50',
              },
              '& .edit-btn': { opacity: 0 },
              '&:hover .edit-btn': { opacity: 1 },
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: category.iconBgColor,
                color: category.iconColor,
                fontSize: 16,
              }}
            >
              {category.icon}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" fontWeight={500} color="text.primary" noWrap>
                {category.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {category.count} questions
              </Typography>
            </Box>
            {category.id !== 'all' && (
              <IconButton size="small" className="edit-btn" sx={{ transition: 'opacity 0.2s' }}>
                <EditIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        ))}

        {/* Add Category Button */}
        <Box
          onClick={onAddCategory}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            p: 1.5,
            mt: 1,
            border: '2px dashed',
            borderColor: 'divider',
            borderRadius: 1,
            cursor: 'pointer',
            color: 'text.secondary',
            transition: 'all 0.2s',
            '&:hover': {
              borderColor: 'primary.main',
              color: 'primary.main',
              bgcolor: 'rgba(255, 164, 36, 0.05)',
            },
          }}
        >
          <AddIcon fontSize="small" />
          <Typography variant="body2" fontWeight={500}>
            Add Category
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

export default CategoriesPanel;
