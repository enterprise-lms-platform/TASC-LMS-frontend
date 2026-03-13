import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { Description as InstructionsIcon } from '@mui/icons-material';

interface InstructionsSectionProps {
  instructions: string;
  onInstructionsChange: (value: string) => void;
}

const InstructionsSection: React.FC<InstructionsSectionProps> = ({
  instructions,
  onInstructionsChange,
}) => {
  return (
    <Paper elevation={0} sx={{ border: 1, borderColor: 'divider', borderRadius: 2, mb: 3, overflow: 'hidden' }}>
      {/* Header */}
      <Box sx={{ p: 2, px: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <InstructionsIcon sx={{ color: 'primary.main' }} />
          Instructions
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Provide clear and detailed instructions for learners. You can type or paste formatted text.
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ p: 3 }}>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          Assignment Instructions <Box component="span" sx={{ color: 'error.main' }}>*</Box>
        </Typography>
        <Box
          component="div"
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => onInstructionsChange(e.currentTarget.innerHTML)}
          dangerouslySetInnerHTML={{ __html: instructions }}
          sx={{
            minHeight: 200,
            p: 2,
            outline: 'none',
            border: 1,
            borderColor: 'divider',
            borderRadius: 1,
            '&:focus': { bgcolor: 'rgba(255, 164, 36, 0.02)', borderColor: 'primary.main' },
            '& h3': { fontSize: '1.1rem', fontWeight: 600, mt: 2, mb: 1 },
            '& p': { mb: 1 },
            '& ol, & ul': { pl: 3 },
            '& li': { mb: 0.5 },
          }}
        />
        <Typography variant="caption" color="text.disabled" display="block" sx={{ mt: 0.5 }}>
          {instructions ? '' : 'Start typing or paste formatted content. HTML is supported.'}
        </Typography>
      </Box>
    </Paper>
  );
};

export default InstructionsSection;
