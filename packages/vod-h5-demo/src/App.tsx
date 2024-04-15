import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './pages/home';
import { featRoutes } from './page.tsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  ...featRoutes,
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
