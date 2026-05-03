'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Eye, EyeOff, Loader2, Users, Briefcase } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const registerSchema = z
  .object({
    fullName: z.string().min(3, 'Nama minimal 3 karakter'),
    email: z.email('Email tidak valid'),
    password: z.string().min(8, 'Password minimal 8 karakter'),
    confirmPassword: z.string(),
    role: z.enum(['user', 'consultant']),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password tidak cocok',
    path: ['confirmPassword'],
  })

type RegisterValues = z.infer<typeof registerSchema>

import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'

export function RegisterForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const syncProfile = useMutation(api.profiles.syncProfile)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: 'user' },
  })

  const selectedRole = watch('role')

  const onSubmit = async (values: RegisterValues) => {
    setLoading(true)
    const supabase = createClient()

    // MOCK REGISTER CHECK
    if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('dummy')) {
      console.log('DEMO MODE: Simulating registration...')
      await new Promise(resolve => setTimeout(resolve, 1500))
      document.cookie = "mock-auth=true; path=/; max-age=86400"
      document.cookie = `mock-role=${values.role}; path=/; max-age=86400`
      
      await syncProfile({
        userId: 'mock-user-' + Math.random().toString(36).substr(2, 9),
        fullName: values.fullName,
        email: values.email,
        role: values.role,
      })

      toast.success('Pendaftaran Berhasil (Demo Mode)')
      router.push(values.role === 'consultant' ? '/dashboard/consultant' : '/dashboard/user')
      router.refresh()
      return
    }

    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        data: {
          full_name: values.fullName,
          role: values.role,
        },
      },
    })

    if (error) {
      toast.error('Pendaftaran gagal', { description: error.message })
      setLoading(false)
      return
    }

    if (data.user) {
      // Sync to Convex immediately
      await syncProfile({
        userId: data.user.id,
        fullName: values.fullName,
        email: values.email,
        role: values.role,
      })

      toast.success('Akun berhasil dibuat!', {
        description: 'Silakan masuk dengan akun Anda.',
      })
      router.push('/login')
    } else {
      toast.error('Gagal membuat akun')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Pilih Role */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-700">
          Saya mendaftar sebagai
        </label>
        <div className="grid grid-cols-2 gap-3">
          {/* Pengguna */}
          <button
            type="button"
            onClick={() => setValue('role', 'user')}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition ${
              selectedRole === 'user'
                ? 'border-blue-500 bg-blue-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <Users
              size={24}
              className={selectedRole === 'user' ? 'text-blue-600' : 'text-slate-400'}
            />
            <span
              className={`text-sm font-medium ${
                selectedRole === 'user' ? 'text-blue-700' : 'text-slate-600'
              }`}
            >
              Pengguna
            </span>
            <span className="text-xs text-slate-400 text-center">
              Cari &amp; booking konsultan
            </span>
          </button>

          {/* Konsultan */}
          <button
            type="button"
            onClick={() => setValue('role', 'consultant')}
            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition ${
              selectedRole === 'consultant'
                ? 'border-emerald-500 bg-emerald-50'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <Briefcase
              size={24}
              className={
                selectedRole === 'consultant' ? 'text-emerald-600' : 'text-slate-400'
              }
            />
            <span
              className={`text-sm font-medium ${
                selectedRole === 'consultant' ? 'text-emerald-700' : 'text-slate-600'
              }`}
            >
              Konsultan
            </span>
            <span className="text-xs text-slate-400 text-center">
              Terima klien &amp; konsultasi
            </span>
          </button>
        </div>
        {/* Hidden input untuk react-hook-form */}
        <input type="hidden" {...register('role')} />
      </div>

      {/* Nama Lengkap */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700">Nama Lengkap</label>
        <input
          {...register('fullName')}
          type="text"
          placeholder="Masukkan nama lengkap"
          className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
        {errors.fullName && (
          <p className="text-xs text-red-500">{errors.fullName.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700">Email</label>
        <input
          {...register('email')}
          type="email"
          placeholder="nama@email.com"
          className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700">Password</label>
        <div className="relative">
          <input
            {...register('password')}
            type={showPassword ? 'text' : 'password'}
            placeholder="Minimal 8 karakter"
            className="w-full px-3 py-2.5 pr-10 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>

      {/* Konfirmasi Password */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700">
          Konfirmasi Password
        </label>
        <input
          {...register('confirmPassword')}
          type="password"
          placeholder="Ulangi password"
          className="w-full px-3 py-2.5 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition"
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        {loading ? 'Memproses...' : 'Buat Akun'}
      </button>

      <p className="text-xs text-center text-slate-400">
        Dengan mendaftar, Anda menyetujui syarat &amp; ketentuan KonsulIn
      </p>
    </form>
  )
}
