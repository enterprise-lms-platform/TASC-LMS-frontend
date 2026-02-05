import React, { useState } from 'react';
import { Box, Button, Menu, MenuItem, ListItemIcon, ListItemText, Typography, IconButton } from '@mui/material';
import {
  Add as AddIcon,
  RadioButtonChecked as MCIcon,
  CheckBox as TFIcon,
  ShortText as ShortIcon,
  Article as EssayIcon,
  CompareArrows as MatchIcon,
  TextFields as BlankIcon,
  UnfoldMore as ExpandIcon,
  UnfoldLess as CollapseIcon,
} from '@mui/icons-material';
import type { QuestionType } from './QuestionCard';

interface QuestionToolbarProps {
  questionCount: number;
  totalPoints: number;
  onAddQuestion: (type: QuestionType) => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
}

const questionTypes: { type: QuestionType; label: string; icon: React.ReactNode }[] = [
  { type: 'multiple-choice', label: 'Multiple Choice', icon: <MCIcon /> },
  { type: 'true-false', label: 'True/False', icon: <TFIcon /> },
  { type: 'short-answer', label: 'Short Answer', icon: <ShortIcon /> },
  { type: 'essay', label: 'Essay', icon: <EssayIcon /> },
  { type: 'matching', label: 'Matching', icon: <MatchIcon /> },
  { type: 'fill-blank', label: 'Fill in the Blank', icon: <BlankIcon /> },
];

const QuestionToolbar: React.FC<QuestionToolbarProps> = ({
  questionCount,
  totalPoints,
  onAddQuestion,
  onExpandAll,
  onCollapseAll,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSelectType = (type: QuestionType) => {
    onAddQuestion(type);
    handleClose();
  };

  return (
    <Box
      sx={{
        p: 1.5,
        px: 3,
        borderBottom: 1,
        borderColor: 'grey.200',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        bgcolor: 'white',
      }}
    >
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleClick}
          sx={{ textTransform: 'none' }}
        >
          Add Question
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        >
          {questionTypes.map((item) => (
            <MenuItem key={item.type} onClick={() => handleSelectType(item.type)}>
              <ListItemIcon sx={{ color: 'text.secondary' }}>{item.icon}</ListItemIcon>
              <ListItemText>{item.label}</ListItemText>
            </MenuItem>
          ))}
        </Menu>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            <Box component="span" sx={{ color: 'primary.main', fontWeight: 700 }}>{questionCount}</Box> questions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            <Box component="span" sx={{ color: 'primary.main', fontWeight: 700 }}>{totalPoints}</Box> points
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <IconButton size="small" onClick={onExpandAll} title="Expand All">
            <ExpandIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={onCollapseAll} title="Collapse All">
            <CollapseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default QuestionToolbar;
