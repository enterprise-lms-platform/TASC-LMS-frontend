/**
 * ErrorPage Component
 * Displays error when route loading fails
 * Used as the errorElement in router configuration
 */

import { useRouteError, isRouteErrorResponse } from 'react-router-dom';
import { Box, Container, Typography, Button, Stack } from '@mui/material';
import { loginColors } from '../styles/loginTheme';

const ErrorPage: React.FC = () => {
  const error = useRouteError();

  let errorTitle = 'Oops! Something went wrong';
  let errorMessage = 'An unexpected error occurred. Please try again.';
  let statusCode = '';

  if (isRouteErrorResponse(error)) {
    statusCode = `${error.status}`;
    errorTitle = error.statusText || errorTitle;
    if (error.data?.message) {
      errorMessage = error.data.message;
    } else if (error.status === 404) {
      errorMessage = 'The page you\'re looking for doesn\'t exist.';
    } else if (error.status === 401) {
      errorMessage = 'You need to be logged in to access this page.';
    } else if (error.status === 403) {
      errorMessage = 'You don\'t have permission to access this page.';
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  const handleRefresh = () => {
    window.location.href = '/';
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: loginColors.neutral[50],
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            textAlign: 'center',
            bgcolor: 'white',
            p: 4,
            borderRadius: 2,
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          }}
        >
          {statusCode && (
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                color: loginColors.status.error,
                mb: 2,
              }}
            >
              {statusCode}
            </Typography>
          )}

          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              color: loginColors.neutral[800],
              mb: 2,
            }}
          >
            {errorTitle}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: loginColors.neutral[600],
              mb: 4,
              maxWidth: 400,
              mx: 'auto',
            }}
          >
            {errorMessage}
          </Typography>

          <Stack
            direction="row"
            spacing={2}
            justifyContent="center"
            sx={{ flexWrap: 'wrap' }}
          >
            <Button
              variant="contained"
              onClick={handleGoBack}
              sx={{
                bgcolor: loginColors.primary[500],
                color: 'white',
                '&:hover': {
                  bgcolor: loginColors.primary[600],
                },
                px: 3,
              }}
            >
              Go Back
            </Button>

            <Button
              variant="outlined"
              onClick={handleRefresh}
              sx={{
                borderColor: loginColors.neutral[300],
                color: loginColors.neutral[600],
                '&:hover': {
                  borderColor: loginColors.primary[500],
                  bgcolor: loginColors.neutral[50],
                },
                px: 3,
              }}
            >
              Go to Home
            </Button>
          </Stack>

          {import.meta.env.NODE_ENV === 'development' && error instanceof Error && (
            <Box
              sx={{
                mt: 4,
                p: 2,
                bgcolor: loginColors.neutral[100],
                borderRadius: 1,
                textAlign: 'left',
              }}
            >
              <Typography variant="caption" sx={{ color: loginColors.status.error }}>
                <strong>Debug Info:</strong>
              </Typography>
              <Typography
                variant="caption"
                component="pre"
                sx={{
                  display: 'block',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  color: loginColors.neutral[700],
                  mt: 1,
                }}
              >
                {error.message}
              </Typography>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default ErrorPage;
