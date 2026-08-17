import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an unhandled UI exception:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#060813] text-slate-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#0C1222] border border-[#1A253F] rounded-3xl p-8 text-center space-y-6 shadow-2xl animate-entrance">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/20">
              <AlertTriangle size={32} />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-white tracking-tight">Something Went Wrong</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                An unexpected UI rendering exception occurred. Don't worry—your progress and session data remain safe.
              </p>
            </div>

            {this.state.error?.message && (
              <div className="p-3 rounded-xl bg-[#05070E] border border-rose-500/20 text-xs font-mono text-rose-300 text-left truncate">
                {this.state.error.message}
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/25 border border-blue-400/30 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <RefreshCw size={15} />
                <span>Reload Page</span>
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex-1 py-3 rounded-xl bg-[#141A2B] hover:bg-slate-800 text-slate-300 font-bold text-xs border border-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <Home size={15} />
                <span>Dashboard</span>
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
