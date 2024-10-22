import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/home';
import { featRoutes } from './page.tsx';
import VePlayer from '@/player';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  ...featRoutes,
]);

function App() {
  useEffect(() => {
    VePlayer.prepare({
      appId: 597335,
      strategies: {
        preload: true,
        adaptRange: true,
      },
    });
  }, []);
  return <RouterProvider router={router} />;
}

export default App;
