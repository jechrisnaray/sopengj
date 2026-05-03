'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { Calendar, Clock, MessageSquare, Bell, XCircle, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

import { useBookingsRealtime } from '@/hooks/useBookingsRealtime'

export default function UserDashboard() {
  useBookingsRealtime()
  const [bookings, setBookings] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Fetch Bookings
    const { data: bookingData } = await supabase
      .from('bookings')
      .select(`
        *,
        consultant:consultant_id (
          id,
          specializations,
          profiles:profile_id (full_name, avatar_url)
        )
      `)
      .eq('user_id', user.id)
      .order('scheduled_at', { ascending: true })

    // Fetch Notifications
    const { data: notifData } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    setBookings(bookingData || [])
    setNotifications(notifData || [])
    setIsLoading(false)
  }

  const handleCancel = async (id: string) => {
    const confirmCancel = confirm('Apakah Anda yakin ingin membatalkan sesi ini?')
    if (!confirmCancel) return

    const { error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', id)

    if (error) {
      toast.error('Gagal membatalkan booking')
    } else {
      toast.success('Booking berhasil dibatalkan')
      fetchData()
    }
  }

  const upcomingBookings = bookings.filter(b => b.status === 'pending' || b.status === 'confirmed')
  const historyBookings = bookings.filter(b => b.status === 'completed' || b.status === 'cancelled')

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard Saya</h1>

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Sidebar Mini / Stats */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="h-20 w-20 mx-auto mb-2">
                <AvatarFallback className="bg-blue-600 text-white text-xl">U</AvatarFallback>
              </Avatar>
              <CardTitle className="text-lg">Pengguna Setia</CardTitle>
              <CardDescription>Member sejak 2024</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex justify-between text-sm py-2 border-t">
                <span>Total Sesi</span>
                <span className="font-bold">{bookings.length}</span>
              </div>
              <div className="flex justify-between text-sm py-2 border-t">
                <span>Sesi Aktif</span>
                <span className="font-bold text-blue-600">{upcomingBookings.length}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Bell className="h-4 w-4" /> Notifikasi Terbaru
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {notifications.slice(0, 3).map((n) => (
                <div key={n.id} className={`p-4 text-xs border-b ${!n.is_read ? 'bg-blue-50' : ''}`}>
                  <p className="font-bold mb-1">{n.title}</p>
                  <p className="text-slate-600">{n.message}</p>
                </div>
              ))}
              {notifications.length === 0 && <p className="p-4 text-xs text-center text-slate-400">Tidak ada notifikasi</p>}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="upcoming">Booking Mendatang ({upcomingBookings.length})</TabsTrigger>
              <TabsTrigger value="history">Riwayat Sesi</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4">
              {upcomingBookings.map((booking) => (
                <Card key={booking.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="p-6 flex-grow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={booking.consultant.profiles.avatar_url} />
                            <AvatarFallback>K</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-bold">{booking.consultant.profiles.full_name}</h3>
                            <p className="text-xs text-slate-500">{booking.consultant.specializations.join(', ')}</p>
                          </div>
                        </div>
                        <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'} className={booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : ''}>
                          {booking.status === 'confirmed' ? 'Dikonfirmasi' : 'Menunggu'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm text-slate-600 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-blue-500" />
                          {format(new Date(booking.scheduled_at), 'dd MMM yyyy')}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-blue-500" />
                          {format(new Date(booking.scheduled_at), 'HH:mm')} ({booking.duration_minutes}m)
                        </div>
                      </div>
                      
                      <div className="text-sm bg-slate-50 p-3 rounded-lg border">
                        <p className="font-semibold text-slate-700 flex items-center gap-2 mb-1">
                          <MessageSquare className="h-3 w-3" /> Topik:
                        </p>
                        <p className="italic">{booking.topic}</p>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 border-l p-6 flex flex-col justify-center items-center gap-2">
                      <Button variant="outline" size="sm" className="w-full">Detail</Button>
                      <Button variant="ghost" size="sm" className="w-full text-red-600 hover:bg-red-50" onClick={() => handleCancel(booking.id)}>
                        <XCircle className="h-4 w-4 mr-2" /> Batalkan
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              {upcomingBookings.length === 0 && (
                <div className="text-center py-20 bg-slate-50 rounded-xl border-2 border-dashed">
                  <Calendar className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                  <h3 className="text-lg font-semibold text-slate-600">Belum ada booking</h3>
                  <p className="text-sm text-slate-400 mb-6">Butuh saran dari ahli? Temukan konsultan Anda sekarang.</p>
                  <Button asChild><Link href="/consultants">Cari Konsultan</Link></Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              {historyBookings.map((booking) => (
                <Card key={booking.id} className="opacity-75">
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${booking.status === 'completed' ? 'bg-green-100' : 'bg-slate-100'}`}>
                        {booking.status === 'completed' ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <XCircle className="h-5 w-5 text-slate-400" />}
                      </div>
                      <div>
                        <p className="font-bold">{booking.consultant.profiles.full_name}</p>
                        <p className="text-xs text-slate-500">{format(new Date(booking.scheduled_at), 'dd MMMM yyyy')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className="capitalize">{booking.status}</Badge>
                      {booking.status === 'completed' && (
                        <Button size="sm" variant="secondary">Beri Review</Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
              {historyBookings.length === 0 && <p className="text-center py-10 text-slate-400">Belum ada riwayat sesi.</p>}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
