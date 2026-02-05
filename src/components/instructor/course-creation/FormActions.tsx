import React from 'react';
import { Box, Button, Paper } from '@mui/material';
import {
  Save as SaveIcon,
  Delete as DiscardIcon,
  ArrowBack as PrevIcon,
  ArrowForward as NextIcon,
  Rocket as PublishIcon,
} from '@mui/icons-material';

interface FormActionsProps {
  currentStep: number;
  totalSteps: number;
  onSaveDraft: () => void;
  onDiscard: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onPublish: () => void;
}

const FormActions: React.FC<FormActionsProps> = ({
  currentStep,
  totalSteps,
  onSaveDraft,
  onDiscard,
  onPrevious,
  onNext,
  onPublish,
}) => {
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;

  return (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 3,
        borderTop: 1,
        borderColor: 'grey.200',
        position: 'sticky',
        bottom: 0,
        zIndex: 80,
        bgcolor: 'background.paper',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 2, sm: 0 },
      }}
    >
      {/* Left Actions */}
      <Box sx={{ display: 'flex', gap: 1.5, width: { xs: '100%', sm: 'auto' } }}>
        <Button
          variant="outlined"
          startIcon={<SaveIcon />}
          onClick={onSaveDraft}
          sx={{
            flex: { xs: 1, sm: 'none' },
            borderColor: 'grey.300',
            color: 'text.secondary',
            '&:hover': { borderColor: 'grey.400', bgcolor: 'grey.50' },
          }}
        >
          Save as Draft
        </Button>
        <Button
          variant="text"
          startIcon={<DiscardIcon />}
          onClick={onDiscard}
          sx={{
            color: 'text.secondary',
            '&:hover': { bgcolor: 'grey.100' },
          }}
        >
          Discard
        </Button>
      </Box>

      {/* Right Actions */}
      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          width: { xs: '100%', sm: 'auto' },
          justifyContent: { xs: 'flex-end', sm: 'flex-end' },
        }}
      >
        {!isFirstStep && (
          <Button
            variant="outlined"
            startIcon={<PrevIcon />}
            onClick={onPrevious}
            sx={{
              borderColor: 'grey.300',
              color: 'text.secondary',
              '&:hover': { borderColor: 'grey.400', bgcolor: 'grey.50' },
            }}
          >
            Previous
          </Button>
        )}

        {isLastStep ? (
          <Button
            variant="contained"
            startIcon={<PublishIcon />}
            onClick={onPublish}
            sx={{
              bgcolor: 'success.main',
              '&:hover': { bgcolor: 'success.dark' },
            }}
          >
            Publish Course
          </Button>
        ) : (
          <Button
            variant="contained"
            endIcon={<NextIcon />}
            onClick={onNext}
            sx={{
              bgcolor: 'primary.main',
              '&:hover': { bgcolor: 'primary.dark' },
            }}
          >
            Next Step
          </Button>
        )}
      </Box>
    </Paper>
  );
};

export default FormActions;
