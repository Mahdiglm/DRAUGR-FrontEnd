import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-midnight text-white">
          <h1 className="text-3xl font-bold mb-4 text-draugr-500">خطایی رخ داد</h1>
          <p className="mb-4">لطفاً صفحه را رفرش کنید یا بعداً دوباره تلاش کنید.</p>
          <div className="bg-black bg-opacity-50 p-4 rounded-md w-full max-w-4xl overflow-auto">
            <p className="text-draugr-500 font-bold mb-2">خطا:</p>
            <p className="text-gray-400 mb-4">{this.state.error && this.state.error.toString()}</p>
            <p className="text-draugr-500 font-bold mb-2">اطلاعات بیشتر:</p>
            <pre className="text-gray-400 text-sm overflow-auto">
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </div>
          <button 
            className="mt-6 bg-gradient-to-r from-draugr-800 to-draugr-600 text-white px-6 py-2 rounded-md"
            onClick={() => window.location.reload()}
          >
            رفرش صفحه
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary; 