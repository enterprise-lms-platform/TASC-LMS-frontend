import { RouterProvider } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import createAppRouter from './routes/router';


const App = () => {
  const queryClient = useQueryClient();
  const router = createAppRouter(queryClient);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
};

export default App;