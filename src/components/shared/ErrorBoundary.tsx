'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw } from 'lucide-react'

interface Props {
  children?: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center p-6 text-center">
          <div className="mb-4 rounded-full bg-red-50 p-3">
            <AlertCircle className="h-10 w-10 text-red-600" />
          </div>
          <h2 className="mb-2 text-xl font-bold text-slate-900">Oops, terjadi kesalahan</h2>
          <p className="mb-6 text-slate-600 max-w-md">
            Halaman ini tidak dapat dimuat dengan benar. Silakan coba muat ulang halaman.
          </p>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Muat Ulang
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
