import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorBoundary from './components/shared/ErrorBoundary.jsx';
import AppShell from './components/layout/AppShell.jsx';

/* Lazy-loaded pages */
const WelcomePage = lazy(() => import('./pages/WelcomePage.jsx'));
const JoinPage = lazy(() => import('./pages/JoinPage.jsx'));
const HuntPage = lazy(() => import('./pages/HuntPage.jsx'));
const ScanPage = lazy(() => import('./pages/ScanPage.jsx'));
const CompletePage = lazy(() => import('./pages/CompletePage.jsx'));
const PassportPage = lazy(() => import('./pages/PassportPage.jsx'));
const AdminPage = lazy(() => import('./pages/AdminPage.jsx'));

function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="inline-block w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
        <p className="mt-4 text-primary-500 font-display text-lg">Loading...</p>
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
      { index: true, element: lazyPage(WelcomePage) },
      { path: 'join', element: lazyPage(JoinPage) },
      { path: 'hunt', element: lazyPage(HuntPage) },
      { path: 'scan/:slug', element: lazyPage(ScanPage) },
      { path: 'complete', element: lazyPage(CompletePage) },
      { path: 'passport', element: lazyPage(PassportPage) },
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
