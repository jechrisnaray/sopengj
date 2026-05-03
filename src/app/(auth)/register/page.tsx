import { RegisterForm } from '@/components/auth/RegisterForm'
import Link from 'next/link'

export const metadata = {
  title: 'Daftar — KonsulIn',
  description: 'Buat akun KonsulIn baru sebagai pengguna atau konsultan.',
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <span className="text-xl font-bold text-slate-900">KonsulIn</span>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Buat akun baru</h1>
          <p className="text-slate-500 mt-2">
            Sudah punya akun?{' '}
            <Link
              href="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Masuk di sini
            </Link>
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}
