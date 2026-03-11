import React from 'react';
import { Box, Paper, Typography, IconButton } from '@mui/material';
import {
  AccountTree as TreeIcon,
  Add as AddIcon,
  Public as AllIcon,
  Folder as FolderIcon,
} from '@mui/icons-material';

/**
 * Category option for display in the panel.
 * id: use 'all' as sentinel for "All Questions", or numeric id from API for real categories.
 */
export interface CategoryOption {
  id: string | number;
  name: string;
  count?: number;
  isAll?: boolean;
}

const DEFAULT_CATEGORIES: CategoryOption[] = [
  { id: 'all', name: 'All Questions', isAll: true },
];

interface CategoriesPanelProps {
  /** Categories to display. Defaults to [All Questions] when omitted (backward compat until parent integration). */
  categories?: CategoryOption[];
  onCategorySelect: (categoryId: string) => void;
  onAddCategory?: () => void;
}

const CategoriesPanel: React.FC<CategoriesPanelProps> = ({
  categories = DEFAULT_CATEGORIES,
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
        {onAddCategory && (
          <IconButton size="small" onClick={onAddCategory}>
            <AddIcon fontSize="small" />
          </IconButton>
        )}
      </Box>

      {/* Categories List */}
      <Box sx={{ p: 1.5, maxHeight: 400, overflow: 'auto' }}>
        {categories.map((category) => (
          <Box
            key={String(category.id)}
            onClick={() => onCategorySelect(String(category.id))}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              p: 1.5,
              borderRadius: 1,
              cursor: 'pointer',
              mb: 0.5,
              transition: 'all 0.2s',
              bgcolor: selectedCategory === String(category.id) ? 'rgba(255, 164, 36, 0.1)' : 'transparent',
              color: selectedCategory === String(category.id) ? 'primary.main' : 'inherit',
              '&:hover': {
                bgcolor: selectedCategory === String(category.id) ? 'rgba(255, 164, 36, 0.1)' : 'grey.50',
              },
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
                bgcolor: category.isAll ? '#e4e4e7' : 'primary.light',
                color: category.isAll ? '#52525b' : 'primary.main',
                fontSize: 16,
              }}
            >
              {category.isAll ? <AllIcon /> : <FolderIcon />}
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="body2" fontWeight={500} color="text.primary" noWrap>
                {category.name}
              </Typography>
              {category.count !== undefined && (
                <Typography variant="caption" color="text.secondary">
                  {category.count} questions
                </Typography>
              )}
            </Box>
          </Box>
        ))}

        {onAddCategory && (
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
        )}
      </Box>
    </Paper>
  );
};

export default CategoriesPanel;
