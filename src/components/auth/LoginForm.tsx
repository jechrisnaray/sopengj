'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Eye, EyeOff, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const loginSchema = z.object({
  email: z.email('Email tidak valid'),
  password: z.string().min(6, 'Password minimal 6 karakter'),
})

type LoginValues = z.infer<typeof loginSchema>

import { useMutation } from 'convex/react'
import { api } from '../../../convex/_generated/api'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirectTo') ?? '/dashboard'
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const syncProfile = useMutation(api.profiles.syncProfile)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (values: LoginValues) => {
    setLoading(true)
    const supabase = createClient()

    // MOCK LOGIN CHECK
    if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('dummy')) {
      console.log('DEMO MODE: Simulating login...')
      await new Promise(resolve => setTimeout(resolve, 1000))
      document.cookie = "mock-auth=true; path=/; max-age=86400"
      const role = values.email.includes('consultant') ? 'consultant' : 'user'
      document.cookie = `mock-role=${role}; path=/; max-age=86400`
      
      // Sync to Convex even in mock
      await syncProfile({
        userId: 'mock-user-id',
        fullName: values.email.split('@')[0],
        email: values.email,
        role: role as any,
      })

      toast.success('Login Berhasil (Demo Mode)')
      router.push(role === 'consultant' ? '/dashboard/consultant' : '/dashboard/user')
      router.refresh()
      return
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    })

    if (error) {
      toast.error('Login gagal', {
        description: error.message === 'Invalid login credentials' ? 'Email atau password salah' : error.message,
      })
      setLoading(false)
      return
    }

    // Sync to Convex
    const profile = await syncProfile({
      userId: data.user.id,
      fullName: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User',
      email: data.user.email!,
      role: data.user.user_metadata?.role || 'user',
      avatarUrl: data.user.user_metadata?.avatar_url,
    })

    toast.success(`Selamat datang, ${profile.fullName}!`)

    const dest = profile.role === 'consultant' 
      ? '/dashboard/consultant' 
      : redirectTo.startsWith('/dashboard') || redirectTo.startsWith('/booking') 
        ? redirectTo 
        : '/dashboard/user'

    router.push(dest)
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Email */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700">Email</label>
        <input
          {...register('email')}
          type="email"
          placeholder="nama@email.com"
          autoComplete="email"
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
            placeholder="Masukkan password"
            autoComplete="current-password"
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

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition"
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        {loading ? 'Memproses...' : 'Masuk'}
      </button>
    </form>
  )
}
