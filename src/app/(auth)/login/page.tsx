import { LoginForm } from '@/components/auth/LoginForm'
import Link from 'next/link'
import { Suspense } from 'react'

export const metadata = {
  title: 'Masuk — KonsulIn',
  description: 'Masuk ke akun KonsulIn Anda.',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <span className="text-xl font-bold text-slate-900">KonsulIn</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Masuk ke akun Anda</h1>
          <p className="text-slate-500 mt-2">
            Belum punya akun?{' '}
            <Link
              href="/register"
              className="text-blue-600 hover:underline font-medium"
            >
              Daftar sekarang
            </Link>
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          {/* Suspense diperlukan karena LoginForm menggunakan useSearchParams */}
          <Suspense fallback={<div className="h-48 animate-pulse bg-slate-50 rounded-lg" />}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
