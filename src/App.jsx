import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import ErrorBoundary from './components/shared/ErrorBoundary.jsx';
import AppShell from './components/layout/AppShell.jsx';

/* Lazy-loaded pages */
const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const RegisterPage = lazy(() => import('./pages/RegisterPage.jsx'));
const HuntPage = lazy(() => import('./pages/HuntPage.jsx'));
const CollectionPage = lazy(() => import('./pages/CollectionPage.jsx'));
const RewardPage = lazy(() => import('./pages/RewardPage.jsx'));
const ScanPage = lazy(() => import('./pages/ScanPage.jsx'));
const AdminPage = lazy(() => import('./pages/AdminPage.jsx'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="inline-block w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
        <p className="mt-4 text-surface-500 font-display text-lg">Loading...</p>
      </div>
    </div>
  );
}

function lazyPage(Component) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      { path: 'home', element: lazyPage(HomePage) },
      { path: 'register', element: lazyPage(RegisterPage) },
      { path: 'hunt/:huntSlug', element: lazyPage(HuntPage) },
      { path: 'hunt/:huntSlug/collection', element: lazyPage(CollectionPage) },
      { path: 'hunt/:huntSlug/reward', element: lazyPage(RewardPage) },
      { path: 'scan/:huntSlug/:stopId', element: lazyPage(ScanPage) },
      { path: 'admin', element: lazyPage(AdminPage) },
    ],
  },
]);

export default function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}
