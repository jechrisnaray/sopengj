import { createClient } from '@/lib/supabase/server'
import { BookingForm } from '@/components/booking/BookingForm'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Star, ShieldCheck, MapPin, Globe } from 'lucide-react'
import { notFound } from 'next/navigation'

export default async function ConsultantProfilePage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  // Fetch real consultant data
  const { data: consultant } = await supabase
    .from('consultants')
    .select(`
      *,
      profiles:profile_id (full_name, avatar_url, bio)
    `)
    .eq('id', params.id)
    .single()

  // Fallback for demo
  if (!consultant && params.id.length > 5) return notFound()

  const displayData = consultant ? {
    ...consultant,
    full_name: consultant.profiles.full_name,
    avatar_url: consultant.profiles.avatar_url,
    bio: consultant.profiles.bio || 'Ahli berpengalaman di bidangnya.'
  } : {
    id: params.id,
    full_name: 'Konsultan Terpercaya',
    specializations: ['Umum', 'Konsultasi'],
    hourly_rate: 200000,
    rating: 4.9,
    avatar_url: '',
    bio: 'Berpengalaman membantu ratusan klien mencapai tujuannya.'
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid gap-12 lg:grid-cols-3">
        {/* Left: Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
            <Avatar className="h-32 w-32 mx-auto border-4 border-white shadow-md">
              <AvatarImage src={displayData.avatar_url} />
              <AvatarFallback className="text-3xl bg-blue-50 text-blue-600">
                {displayData.full_name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <h1 className="mt-6 text-2xl font-bold text-slate-900">{displayData.full_name}</h1>
            <div className="mt-2 flex flex-wrap justify-center gap-1">
              {displayData.specializations.map((spec: string) => (
                <Badge key={spec} variant="outline" className="text-[10px] font-bold uppercase tracking-wider">
                  {spec}
                </Badge>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-center space-x-2 text-amber-500 font-bold">
              <Star className="h-5 w-5 fill-current" />
              <span>{displayData.rating.toFixed(1)}</span>
              <span className="text-slate-400 font-normal text-sm">(120+ Review)</span>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900">Tentang Konsultan</h3>
            <p className="text-sm leading-relaxed text-slate-600">
              {displayData.bio}
            </p>
            <div className="pt-4 space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <ShieldCheck className="h-4 w-4 text-green-500" />
                <span>Identitas Terverifikasi</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <MapPin className="h-4 w-4 text-slate-400" />
                <span>Jakarta, Indonesia</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Globe className="h-4 w-4 text-slate-400" />
                <span>Bahasa Indonesia, Inggris</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Booking Form */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border bg-white p-8 shadow-sm">
            <div className="mb-8 border-b pb-6">
              <h2 className="text-2xl font-bold text-slate-900">Pesan Sesi Konsultasi</h2>
              <p className="text-slate-500">Pilih waktu yang sesuai untuk sesi privat Anda.</p>
            </div>
            
            <BookingForm consultant={displayData} />
          </div>
        </div>
      </div>
    </div>
  )
}
