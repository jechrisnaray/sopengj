import { RecommendationSection } from '@/components/recommendation/RecommendationSection'
import { createClient } from '@/lib/supabase/server'
import { ConsultantList } from '@/components/consultant/ConsultantList'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import { Sparkles } from 'lucide-react'

export const metadata = {
  title: 'Cari Konsultan — KonsulIn',
  description: 'Temukan ahli profesional untuk solusi masalah Anda.',
}

export default async function ConsultantsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="bg-slate-50/50 min-h-screen pb-20">
      {/* Header Section */}
      <div className="bg-white border-b py-12 mb-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-widest mb-4">
            <Sparkles className="h-4 w-4" />
            <span>Marketplace Ahli</span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
            Temukan Solusi dari <span className="text-blue-600">Ahli Terbaik</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            Pilih dari ratusan konsultan terverifikasi di bidang hukum, keuangan, psikologi, dan lainnya.
          </p>
        </div>
      </div>

      {/* AI Recommendation Section */}
      <RecommendationSection />

      {/* Main Content */}
      <div className="container mx-auto px-4">
        <ErrorBoundary>
          <ConsultantList />
        </ErrorBoundary>
      </div>
    </div>
  )
}
