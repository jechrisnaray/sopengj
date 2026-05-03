import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { BookingForm } from '@/components/booking/BookingForm'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star } from 'lucide-react'

interface BookingPageProps {
  params: {
    consultantId: string
  }
}

export default async function BookingPage({ params }: BookingPageProps) {
  const { consultantId } = params
  const supabase = await createClient()

  // Fetch consultant data
  const { data: consultant, error } = await supabase
    .from('consultants')
    .select(`
      *,
      profiles:profile_id (*)
    `)
    .eq('id', consultantId)
    .single()

  if (error || !consultant) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Pesan Sesi Konsultasi</h1>
        <p className="text-slate-600">Selesaikan langkah-langkah di bawah untuk mengamankan jadwal Anda.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <BookingForm consultant={consultant} />
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 border-slate-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={consultant.profiles?.avatar_url} />
                  <AvatarFallback>{consultant.profiles?.full_name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-slate-900">{consultant.profiles?.full_name}</h3>
                  <div className="flex items-center text-xs text-amber-500">
                    <Star className="h-3 w-3 fill-current mr-1" />
                    <span>{consultant.rating} ({consultant.total_reviews} Review)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-sm text-slate-900">Mengapa konsultasi dengan beliau?</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Ahli di bidang <span className="font-medium text-slate-900">{consultant.specialization?.join(', ')}</span> dengan pengalaman lebih dari {consultant.experience_years} tahun.
                </p>
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-xs text-blue-700 font-medium uppercase tracking-wider mb-1">Jaminan KonsulIn</p>
                <p className="text-[11px] text-blue-600">Sesi aman, privat, dan pengembalian dana 100% jika konsultan tidak hadir.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
