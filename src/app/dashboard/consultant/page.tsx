'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { Users, Star, Banknote, CalendarCheck, Check, X, Clock } from 'lucide-react'

export default function ConsultantDashboard() {
  const [bookings, setBookings] = useState<any[]>([])
  const [stats, setStats] = useState({ totalSessions: 0, rating: 0, income: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchConsultantData()
  }, [])

  const fetchConsultantData = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Get Consultant ID
    const { data: consultant } = await supabase
      .from('consultants')
      .select('id, rating, hourly_rate')
      .eq('profile_id', user.id)
      .single()
    
    if (!consultant) return

    // Get Bookings
    const { data: bookingData } = await supabase
      .from('bookings')
      .select(`
        *,
        user:user_id (full_name, avatar_url)
      `)
      .eq('consultant_id', consultant.id)
      .order('scheduled_at', { ascending: true })

    setBookings(bookingData || [])
    
    // Calculate simple stats
    const completed = bookingData?.filter(b => b.status === 'completed') || []
    setStats({
      totalSessions: completed.length,
      rating: consultant.rating || 0,
      income: completed.reduce((acc, curr) => acc + curr.total_price, 0)
    })
    
    setIsLoading(false)
  }

  const updateBookingStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)

    if (error) {
      toast.error('Gagal memperbarui status')
    } else {
      toast.success(`Booking berhasil ${status === 'confirmed' ? 'diterima' : 'ditolak'}`)
      fetchConsultantData()
    }
  }

  const pendingBookings = bookings.filter(b => b.status === 'pending')

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold">Dashboard Konsultan</h1>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="Total Sesi" value={stats.totalSessions} icon={<Users className="h-5 w-5 text-blue-600" />} />
        <StatCard title="Rating" value={`${stats.rating}/5`} icon={<Star className="h-5 w-5 text-amber-500 fill-current" />} />
        <StatCard title="Pendapatan" value={`Rp ${stats.income.toLocaleString()}`} icon={<Banknote className="h-5 w-5 text-green-600" />} />
        <StatCard title="Antrean" value={pendingBookings.length} icon={<Clock className="h-5 w-5 text-orange-500" />} />
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Pending Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-blue-600" /> Booking Masuk
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingBookings.map((b) => (
              <div key={b.id} className="flex items-center justify-between p-4 border rounded-lg bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={b.user.avatar_url} />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-bold">{b.user.full_name}</p>
                    <p className="text-[11px] text-slate-500">{format(new Date(b.scheduled_at), 'dd MMM, HH:mm')}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="outline" className="h-8 w-8 text-green-600 hover:bg-green-50" onClick={() => updateBookingStatus(b.id, 'confirmed')}>
                    <Check className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="outline" className="h-8 w-8 text-red-600 hover:bg-red-50" onClick={() => updateBookingStatus(b.id, 'cancelled')}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {pendingBookings.length === 0 && <p className="text-center py-6 text-sm text-slate-400">Tidak ada permintaan baru.</p>}
          </CardContent>
        </Card>

        {/* Schedule Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Jadwal Sesi Mendatang</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bookings.filter(b => b.status === 'confirmed').slice(0, 5).map((b) => (
                <div key={b.id} className="flex items-center gap-4 p-3 border-l-4 border-blue-600 bg-white shadow-sm rounded-r-lg">
                  <div className="text-center min-w-[50px]">
                    <p className="text-xs font-bold uppercase">{format(new Date(b.scheduled_at), 'MMM')}</p>
                    <p className="text-xl font-bold leading-none">{format(new Date(b.scheduled_at), 'dd')}</p>
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-bold">{b.topic}</p>
                    <p className="text-xs text-slate-500">Klien: {b.user.full_name} • {format(new Date(b.scheduled_at), 'HH:mm')}</p>
                  </div>
                  <Badge variant="secondary">Siap</Badge>
                </div>
              ))}
              {bookings.filter(b => b.status === 'confirmed').length === 0 && <p className="text-center py-6 text-sm text-slate-400">Jadwal masih kosong.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon }: { title: string, value: any, icon: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="p-3 bg-slate-50 rounded-lg">{icon}</div>
      </CardContent>
    </Card>
  )
}
