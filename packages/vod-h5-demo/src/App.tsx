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
      appId: 597335, // 从视频点播控制台-点播SDK-应用管理 获取，如果没有应用则创建
      strategies: {
        preload: true,
        adaptRange: true,
      },
    });
  }, []);
  return <RouterProvider router={router} />;
}

export default App;
