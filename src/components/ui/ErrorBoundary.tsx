import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center bg-slate-900/50 border border-slate-800 rounded-3xl backdrop-blur-xl">
          <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mb-6 border border-rose-500/20">
            <AlertTriangle className="w-8 h-8 text-rose-500" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-slate-400 max-w-md mb-8">
            An unexpected error occurred in the dashboard. Try refreshing the terminal.
          </p>
          <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 mb-8 w-full max-w-lg overflow-auto max-h-32">
            <code className="text-xs text-rose-400 font-mono">
              {this.state.error?.message || "Unknown error"}
            </code>
          </div>
          <Button
            onClick={this.handleReset}
            className="bg-blue-600 hover:bg-blue-500"
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Reload Terminal
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
