import { createClient } from '@/lib/supabase/server'
import { ConsultantCard } from '@/components/consultant/ConsultantCard'
import RecommendationSection from '@/components/recommendation/RecommendationSection'
import { Input } from '@/components/ui/input'
import { Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function ConsultantsPage() {
  const supabase = await createClient()
  
  // Fetch real consultants
  const { data: consultants } = await supabase
    .from('consultants')
    .select(`
      *,
      profiles:profile_id (full_name, avatar_url)
    `)
    .eq('is_available', true)

  // Mock data if database is empty for initial demo
  const mockConsultants = [
    {
      id: '1',
      full_name: 'Dr. Ahmad Hidayat',
      specializations: ['Hukum', 'Pidana'],
      hourly_rate: 250000,
      rating: 4.9,
      is_available: true,
      avatar_url: ''
    },
    {
      id: '2',
      full_name: 'Siska Putri, MBA',
      specializations: ['Bisnis', 'Keuangan'],
      hourly_rate: 350000,
      rating: 4.8,
      is_available: true,
      avatar_url: ''
    },
    {
      id: '3',
      full_name: 'Budi Santoso, M.Psi',
      specializations: ['Psikologi', 'Karir'],
      hourly_rate: 200000,
      rating: 4.7,
      is_available: true,
      avatar_url: ''
    }
  ]

  const displayData = consultants && consultants.length > 0 
    ? consultants.map(c => ({
        ...c,
        full_name: c.profiles.full_name,
        avatar_url: c.profiles.avatar_url
      }))
    : mockConsultants

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Cari Konsultan Profesional</h1>
        <p className="text-slate-600">Dapatkan saran ahli untuk setiap tantangan hidup Anda.</p>
      </div>

      <div className="grid gap-12 lg:grid-cols-3">
        {/* Sidebar: Filters & AI Recommendation */}
        <div className="lg:col-span-1 space-y-8">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Filter className="h-4 w-4" /> Filter
            </h3>
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input placeholder="Cari nama atau spesialisasi..." className="pl-10" />
              </div>
              <Button variant="outline" className="w-full">Terapkan Filter</Button>
            </div>
          </div>

          <RecommendationSection />
        </div>

        {/* Main: Consultant List */}
        <div className="lg:col-span-2">
          <div className="grid gap-6 md:grid-cols-2">
            {displayData.map((consultant) => (
              <ConsultantCard key={consultant.id} consultant={consultant} />
            ))}
          </div>
          
          {displayData.length === 0 && (
            <div className="text-center py-20 bg-slate-50 rounded-xl border-2 border-dashed">
              <p className="text-slate-500">Tidak ada konsultan yang ditemukan.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
