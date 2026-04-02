import { Outlet } from 'react-router-dom';
import Header from './Header.jsx';
import ToastContainer from '../shared/ToastContainer.jsx';
import { useHydration } from '../../hooks/useHydration.js';

export default function AppShell() {
  const hydrated = useHydration();

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-5xl mx-auto px-4 py-6">
        <Outlet />
      </main>
      <ToastContainer />
    </div>
  );
}
