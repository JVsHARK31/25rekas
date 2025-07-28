import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-erkas-background p-4">
          <Card className="max-w-lg w-full">
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center gap-2">
                ⚠️ Terjadi Kesalahan
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-erkas-secondary">
                Maaf, terjadi kesalahan yang tidak terduga. Silakan coba muat ulang halaman.
              </div>
              
              {this.state.error && (
                <details className="text-xs bg-gray-100 p-3 rounded border">
                  <summary className="cursor-pointer font-medium">Detail Error</summary>
                  <pre className="mt-2 whitespace-pre-wrap">
                    {this.state.error.toString()}
                    {this.state.errorInfo?.componentStack}
                  </pre>
                </details>
              )}
              
              <div className="flex gap-2">
                <Button 
                  onClick={() => window.location.reload()}
                  className="flex-1"
                >
                  Muat Ulang Halaman
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = '/dashboard'}
                  className="flex-1"
                >
                  Kembali ke Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;