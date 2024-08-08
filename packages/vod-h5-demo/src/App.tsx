import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/home';
import { featRoutes } from './page.tsx';
import VePlayer, { mp4Encrypt } from '@/player';
import { os } from './utils/index';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Home />,
    },
    ...featRoutes,
  ],
  { basename: __BASE__PATH__ },
);

function App() {
  useEffect(() => {
    if (os.isAndroid || os.isPc) {
      VePlayer.prepare({
        appId: 597335,
        strategies: {
          preload: true,
          adaptRange: true,
        },
      });
    }
  }, []);
  return <RouterProvider router={router} />;
}

export default App;
