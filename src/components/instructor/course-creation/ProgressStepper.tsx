import React from 'react';
import { Box, Stepper, Step, StepButton, Typography } from '@mui/material';
import { Check as CheckIcon } from '@mui/icons-material';

const steps = [
  { label: 'Basic Info', step: 1 },
  { label: 'Details', step: 2 },
  { label: 'Curriculum', step: 3 },
  { label: 'Pricing', step: 4 },
  { label: 'Settings', step: 5 },
];

interface ProgressStepperProps {
  activeStep: number;
  completedSteps: number[];
  onStepClick: (step: number) => void;
}

const ProgressStepper: React.FC<ProgressStepperProps> = ({
  activeStep,
  completedSteps,
  onStepClick,
}) => {
  const isStepComplete = (step: number) => completedSteps.includes(step);

  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 2,
        p: 3,
        mb: 3,
        border: 1,
        borderColor: 'grey.200',
      }}
    >
      <Stepper
        nonLinear
        activeStep={activeStep - 1}
        alternativeLabel
        sx={{
          '& .MuiStepConnector-line': {
            borderTopWidth: 2,
          },
          '& .MuiStepConnector-root.Mui-active .MuiStepConnector-line, & .MuiStepConnector-root.Mui-completed .MuiStepConnector-line': {
            borderColor: 'primary.main',
          },
        }}
      >
        {steps.map(({ label, step }) => {
          const completed = isStepComplete(step);
          const active = activeStep === step;

          return (
            <Step key={step} completed={completed}>
              <StepButton onClick={() => onStepClick(step)}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                    bgcolor: completed
                      ? 'success.main'
                      : active
                      ? 'primary.main'
                      : 'grey.200',
                    color: completed || active ? 'white' : 'grey.500',
                    transition: 'all 0.3s',
                    mb: 1,
                  }}
                >
                  {completed ? <CheckIcon fontSize="small" /> : step}
                </Box>
                <Typography
                  variant="body2"
                  fontWeight={active ? 600 : 500}
                  color={
                    completed ? 'success.main' : active ? 'primary.main' : 'text.secondary'
                  }
                >
                  {label}
                </Typography>
              </StepButton>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
};

export default ProgressStepper;
