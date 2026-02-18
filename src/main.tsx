import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import '@fontsource-variable/inter/opsz-italic.css'
import './index.css'
import App from './App'
import { globalColors } from './styles/globaltheme'

declare module '@mui/material/styles' {

}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

const theme = createTheme({
  palette: {
    primary: {
      main: globalColors.primary[500],    // #ffb74d - orange
      dark: globalColors.primary[600],    // #ffa424 - darker orange
      light: globalColors.primary[400],   // #ffcc80 - lighter orange
      contrastText: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'SF Pro Display, Inter, sans-serif',
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)
