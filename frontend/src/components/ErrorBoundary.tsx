import React, { Component, ReactNode } from 'react';
import { RefreshCw, AlertTriangle, Home, ArrowLeft } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  handleGoBack = () => {
    window.history.back();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Oops! Something went wrong
              </h1>
              <p className="text-gray-600">
                We encountered an unexpected error. Don't worry, we're working on fixing it.
              </p>
            </div>

            {this.props.showDetails && this.state.error && (
              <div className="mb-6 text-left">
                <details className="bg-gray-50 rounded-lg p-4">
                  <summary className="cursor-pointer text-sm font-medium text-gray-700 mb-2">
                    Error Details
                  </summary>
                  <div className="text-xs font-mono text-gray-600 break-all">
                    <p className="mb-2">
                      <strong>Error:</strong> {this.state.error.message}
                    </p>
                    {this.state.errorInfo?.componentStack && (
                      <p>
                        <strong>Component Stack:</strong>
                        <pre className="mt-1 whitespace-pre-wrap">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </p>
                    )}
                  </div>
                </details>
              </div>
            )}

            <div className="space-y-3">
              <button
                onClick={this.handleReset}
                className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg hover:bg-emerald-700 transition-colors font-medium flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </button>
              
              <div className="flex space-x-3">
                <button
                  onClick={this.handleGoBack}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Go Back</span>
                </button>
                
                <button
                  onClick={this.handleGoHome}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </button>
              </div>
            </div>

            <div className="mt-6 text-xs text-gray-500">
              <p>Error ID: {Date.now()}</p>
              <p>Time: {new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;