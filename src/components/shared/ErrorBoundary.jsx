import { Component } from 'react';
import { useRouteError, Link } from 'react-router-dom';

class ErrorBoundaryClass extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }
    return this.props.children;
  }
}

function ErrorFallback({ error }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-card shadow-lg p-8 max-w-md text-center">
        <div className="text-5xl mb-4">🗺️</div>
        <h1 className="font-display text-2xl font-bold text-surface-800 mb-2">
          Oops! Wrong turn
        </h1>
        <p className="text-surface-500 mb-6">
          Something went wrong. Let's get you back on track.
        </p>
        {error?.message && (
          <pre className="bg-surface-100 text-surface-600 text-xs p-3 rounded-lg mb-6 text-left overflow-auto">
            {error.message}
          </pre>
        )}
        <Link
          to="/home"
          className="inline-block bg-primary-500 text-white font-semibold px-6 py-2.5 rounded-button hover:bg-primary-600 transition-colors no-underline"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}

/* Router error boundary (used as errorElement) */
export function RouteErrorBoundary() {
  const error = useRouteError();
  return <ErrorFallback error={error} />;
}

export default ErrorBoundaryClass;
