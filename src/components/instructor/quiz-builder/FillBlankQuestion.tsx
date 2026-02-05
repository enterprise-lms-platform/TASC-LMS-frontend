import React from 'react';
import { Box, Typography, TextField, IconButton } from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';

interface FillBlankQuestionProps {
  textWithBlanks: string;
  blanks: string[];
  onTextChange: (value: string) => void;
  onBlanksChange: (blanks: string[]) => void;
}

const FillBlankQuestion: React.FC<FillBlankQuestionProps> = ({
  textWithBlanks,
  blanks,
  onTextChange,
  onBlanksChange,
}) => {
  const handleBlankChange = (index: number, value: string) => {
    const newBlanks = [...blanks];
    newBlanks[index] = value;
    onBlanksChange(newBlanks);
  };

  const handleAddBlank = () => {
    onBlanksChange([...blanks, '']);
  };

  const handleDeleteBlank = (index: number) => {
    if (blanks.length > 1) {
      onBlanksChange(blanks.filter((_, i) => i !== index));
    }
  };

  // Generate preview with blanks
  const renderPreview = () => {
    let preview = textWithBlanks;
    blanks.forEach((_, i) => {
      preview = preview.replace(`[blank${i + 1}]`, `___________`);
    });
    return preview;
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" fontWeight={600} mb={1}>
          Text with Blanks
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={2}
          size="small"
          placeholder="Use [blank1], [blank2], etc. to mark blanks. Example: The capital of France is [blank1]."
          value={textWithBlanks}
          onChange={(e) => onTextChange(e.target.value)}
        />
        <Typography variant="caption" color="text.secondary">
          Use [blank1], [blank2], etc. to indicate where blanks should appear
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" fontWeight={600} mb={1}>
          Correct Answers
        </Typography>
        {blanks.map((blank, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ minWidth: 70 }}>
              Blank {index + 1}:
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Enter correct answer..."
              value={blank}
              onChange={(e) => handleBlankChange(index, e.target.value)}
            />
            <IconButton
              size="small"
              onClick={() => handleDeleteBlank(index)}
              disabled={blanks.length <= 1}
              sx={{ color: 'text.disabled', '&:hover': { color: 'error.main' } }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ))}

        <Box
          onClick={handleAddBlank}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5,
            px: 2,
            py: 1,
            color: 'primary.main',
            cursor: 'pointer',
            fontWeight: 500,
            fontSize: '0.875rem',
            '&:hover': { textDecoration: 'underline' },
          }}
        >
          <AddIcon fontSize="small" />
          Add Blank
        </Box>
      </Box>

      {/* Preview */}
      <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="caption" fontWeight={600} color="text.secondary" display="block" mb={1}>
          PREVIEW
        </Typography>
        <Typography sx={{ lineHeight: 2 }}>{renderPreview()}</Typography>
      </Box>
    </Box>
  );
};

export default FillBlankQuestion;
