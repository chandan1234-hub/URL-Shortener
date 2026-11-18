import { createBrowserRouter } from 'react-router-dom'
import Home from './pages/home'
import NotFound from './pages/not-found'
import Shortener from './pages/shortener'
import SiteLayout from './components/site-layout'
import { routePaths } from './route-links'

export const router = createBrowserRouter([
  {
    element: <SiteLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: routePaths.shorten.slice(1), element: <Shortener /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])
