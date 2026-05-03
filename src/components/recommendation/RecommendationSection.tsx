'use client'

import { useState } from 'react'
import { useRecommendations } from '@/hooks/useRecommendations'
import { RecommendationCard } from './RecommendationCard'
import { Sparkles, Loader2, AlertCircle, Lock } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { useCurrentUser } from '@/hooks/useCurrentUser'

export function RecommendationSection() {
  const { user, isLoading: isAuthLoading } = useCurrentUser()
  const [problem, setProblem] = useState('')
  const [budget, setBudget] = useState('')
  const { mutate, data, isPending, isError, error, reset } = useRecommendations()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (problem.trim().length < 10) {
      toast.error('Deskripsikan masalah Anda minimal 10 karakter')
      return
    }

    reset()
    mutate(
      {
        problem: problem.trim(),
        budget: budget ? parseInt(budget.replace(/\D/g, '')) : undefined,
      },
      {
        onError: (err) => {
          toast.error('Gagal mendapatkan rekomendasi', {
            description: err.message,
          })
        },
      }
    )
  }

  return (
    <section className="py-16 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
            <Sparkles size={14} />
            Didukung AI
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-3">
            Temukan Konsultan yang Tepat
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Ceritakan masalah Anda, AI kami akan mencocokkan dengan konsultan
            paling sesuai dari ratusan profesional tersedia
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
          {!user ? (
            // Belum login — tampilkan lock state
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock size={20} className="text-slate-400" />
              </div>
              <p className="text-slate-700 font-medium mb-2">
                Masuk untuk menggunakan fitur AI
              </p>
              <p className="text-slate-400 text-sm mb-6">
                Rekomendasi AI hanya tersedia untuk pengguna yang sudah login
              </p>
              
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
              >
                Masuk Sekarang
              </Link>
            </div>
          ) : (
            // Sudah login — tampilkan form
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Textarea masalah */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Ceritakan masalah Anda
                </label>
                <textarea
                  value={problem}
                  onChange={e => setProblem(e.target.value)}
                  placeholder="Contoh: Saya ingin memulai bisnis online tapi bingung soal legalitas dan perizinan usaha. Butuh panduan dari awal..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition resize-none"
                />
                <p className="text-xs text-slate-400 text-right">
                  {problem.length}/1000 karakter
                </p>
              </div>

              {/* Budget opsional */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Budget per jam{' '}
                  <span className="text-slate-400 font-normal">(opsional)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                    Rp
                  </span>
                  <input
                    type="text"
                    value={budget}
                    onChange={e => {
                      // Format otomatis dengan titik ribuan
                      const raw = e.target.value.replace(/\D/g, '')
                      setBudget(
                        raw ? parseInt(raw).toLocaleString('id-ID') : ''
                      )
                    }}
                    placeholder="500.000"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition"
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isPending || problem.trim().length < 10}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-xl transition"
              >
                {isPending ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    AI sedang menganalisis...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    Cari Konsultan Terbaik
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Error state */}
        {isError && (
          <div className="mt-6 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm">Rekomendasi gagal dimuat</p>
              <p className="text-sm text-red-600 mt-0.5">{error?.message}</p>
            </div>
          </div>
        )}

        {/* Loading skeleton */}
        {isPending && (
          <div className="mt-8 space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 animate-pulse">
                <div className="flex gap-4">
                  <div className="w-14 h-14 bg-slate-200 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-slate-200 rounded w-1/3" />
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                    <div className="h-3 bg-slate-200 rounded w-3/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Hasil rekomendasi */}
        {data && !isPending && data.recommendations.length > 0 && (
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">
                Top 3 Konsultan untuk Anda
              </h3>
              <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                {data.source === 'groq' ? '✨ Dianalisis AI' : '📊 Berdasarkan data'}
                {data.cached && ' · dari cache'}
              </span>
            </div>

            <div className="space-y-4">
              {data.recommendations.map((rec, index) => (
                <RecommendationCard
                  key={rec.consultantId}
                  recommendation={rec}
                  rank={index + 1}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {data && !isPending && data.recommendations.length === 0 && (
          <div className="mt-8 text-center py-10 text-slate-400">
            <p className="text-lg">😕 Tidak ada konsultan yang cocok</p>
            <p className="text-sm mt-2">Coba ubah deskripsi masalah atau hapus filter budget</p>
          </div>
        )}

      </div>
    </section>
  )
}
