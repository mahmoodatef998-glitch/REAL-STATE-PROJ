"use client";
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-neutral-800 rounded-lg border border-red-500/30 p-8">
            <h1 className="text-3xl font-bold text-red-400 mb-4">
              ⚠️ Something went wrong
            </h1>
            <p className="text-neutral-300 mb-6">
              We&apos;re sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-4 p-4 bg-neutral-900 rounded border border-white/10">
                <summary className="text-sm text-neutral-400 cursor-pointer mb-2">
                  Error Details (Development Only)
                </summary>
                <pre className="text-xs text-red-300 overflow-auto max-h-60">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            
            <div className="flex gap-4 mt-6">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-colors focus-ring"
              >
                Refresh Page
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-3 bg-neutral-700 text-white font-semibold rounded-lg hover:bg-neutral-600 transition-colors focus-ring"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

