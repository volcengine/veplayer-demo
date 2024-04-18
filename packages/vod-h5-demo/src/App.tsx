import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/home';
import { featRoutes } from './page.tsx';

// const isProd = process.env.NODE_ENV === 'production';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Home />,
    },
    ...featRoutes,
  ],
  // { basename: isProd ? '/veplayer-h5' : '' },
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
