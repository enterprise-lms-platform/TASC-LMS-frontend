import React from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import {
  Search as SearchIcon,
  ViewList as ListIcon,
  GridView as GridIcon,
} from '@mui/icons-material';

export type ViewMode = 'list' | 'grid';
export type QuestionType = '' | 'multiple-choice' | 'true-false' | 'short-answer' | 'essay' | 'matching' | 'fill-blank';
export type Difficulty = '' | 'easy' | 'medium' | 'hard';
export type Status = '' | 'active' | 'draft' | 'archived';

interface SearchFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  typeFilter: QuestionType;
  onTypeChange: (type: QuestionType) => void;
  difficultyFilter: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
  statusFilter: Status;
  onStatusChange: (status: Status) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeChange,
  difficultyFilter,
  onDifficultyChange,
  statusFilter,
  onStatusChange,
  viewMode,
  onViewModeChange,
}) => {
  return (
    <Box
      sx={{
        p: 2,
        borderBottom: 1,
        borderColor: 'divider',
        display: 'flex',
        gap: 2,
        flexWrap: 'wrap',
        alignItems: 'center',
      }}
    >
      {/* Search Box */}
      <TextField
        size="small"
        placeholder="Search questions..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        sx={{ flex: 1, minWidth: 250 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          ),
        }}
      />

      {/* Filter Dropdowns */}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <Select
            value={typeFilter}
            onChange={(e) => onTypeChange(e.target.value as QuestionType)}
            displayEmpty
          >
            <MenuItem value="">All Types</MenuItem>
            <MenuItem value="multiple-choice">Multiple Choice</MenuItem>
            <MenuItem value="true-false">True/False</MenuItem>
            <MenuItem value="short-answer">Short Answer</MenuItem>
            <MenuItem value="essay">Essay</MenuItem>
            <MenuItem value="matching">Matching</MenuItem>
            <MenuItem value="fill-blank">Fill in Blank</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 130 }}>
          <Select
            value={difficultyFilter}
            onChange={(e) => onDifficultyChange(e.target.value as Difficulty)}
            displayEmpty
          >
            <MenuItem value="">All Difficulties</MenuItem>
            <MenuItem value="easy">Easy</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="hard">Hard</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <Select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value as Status)}
            displayEmpty
          >
            <MenuItem value="">All Status</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="draft">Draft</MenuItem>
            <MenuItem value="archived">Archived</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* View Toggle */}
      <ToggleButtonGroup
        value={viewMode}
        exclusive
        onChange={(_, value) => value && onViewModeChange(value)}
        size="small"
      >
        <ToggleButton value="list">
          <ListIcon fontSize="small" />
        </ToggleButton>
        <ToggleButton value="grid">
          <GridIcon fontSize="small" />
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

export default SearchFilterBar;
