"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { format } from 'date-fns'
import { Calendar, Clock, MessageSquare, Bell, XCircle, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function UserDashboard() {
  const { user, profile, isLoading: isAuthLoading } = useCurrentUser();
  
  const bookings = useQuery(api.bookings.listForUser, profile ? { userId: profile._id } : "skip");
  const notifications = useQuery(api.notifications.list, profile ? { userId: profile._id } : "skip");
  const cancelBooking = useMutation(api.bookings.updateStatus);

  const isLoading = isAuthLoading || bookings === undefined || notifications === undefined;

  const handleCancel = async (id: any) => {
    const confirmCancel = confirm('Apakah Anda yakin ingin membatalkan sesi ini?')
    if (!confirmCancel) return

    try {
      await cancelBooking({ id, status: 'cancelled' });
      toast.success('Booking berhasil dibatalkan');
    } catch (err) {
      toast.error('Gagal membatalkan booking');
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-slate-200 mx-auto rounded" />
          <div className="h-64 bg-slate-100 rounded-xl" />
        </div>
      </div>
    );
  }

  const upcomingBookings = bookings?.filter(b => b.status === 'pending' || b.status === 'confirmed') || []
  const historyBookings = bookings?.filter(b => b.status === 'completed' || b.status === 'cancelled') || []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard Saya</h1>
        <Button variant="outline" asChild>
          <Link href="/consultants">Cari Konsultan Baru</Link>
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Sidebar Mini / Stats */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="h-20 w-20 mx-auto mb-2 border-2 border-blue-100">
                <AvatarImage src={profile?.avatarUrl} />
                <AvatarFallback className="bg-blue-600 text-white text-xl">
                  {profile?.fullName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="text-lg">{profile?.fullName}</CardTitle>
              <CardDescription>
                Member sejak {profile?.createdAt ? format(profile.createdAt, 'yyyy') : '2024'}
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex justify-between text-sm py-2 border-t">
                <span>Total Sesi</span>
                <span className="font-bold">{bookings?.length ?? 0}</span>
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
                <Bell className="h-4 w-4 text-blue-600" /> Notifikasi
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {notifications?.slice(0, 5).map((n) => (
                <div key={n._id} className={`p-4 text-xs border-b transition-colors hover:bg-slate-50 ${!n.isRead ? 'bg-blue-50/50 border-l-2 border-l-blue-500' : ''}`}>
                  <p className="font-bold mb-1">{n.title}</p>
                  <p className="text-slate-600 mb-2">{n.message}</p>
                  <p className="text-[10px] text-slate-400">{format(n.createdAt, 'dd MMM, HH:mm')}</p>
                </div>
              ))}
              {notifications?.length === 0 && (
                <p className="p-8 text-xs text-center text-slate-400 italic">Tidak ada notifikasi baru</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 bg-slate-100 p-1">
              <TabsTrigger value="upcoming">Mendatang ({upcomingBookings.length})</TabsTrigger>
              <TabsTrigger value="history">Riwayat Sesi</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-4">
              {upcomingBookings.map((booking) => (
                <Card key={booking._id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row">
                    <div className="p-6 flex-grow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12 border">
                            <AvatarImage src={booking.consultantAvatar} />
                            <AvatarFallback>K</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-bold text-slate-900">{booking.consultantName}</h3>
                            <p className="text-xs text-blue-600 font-medium">Konsultan Ahli</p>
                          </div>
                        </div>
                        <Badge 
                          variant={booking.status === 'confirmed' ? 'default' : 'secondary'} 
                          className={booking.status === 'confirmed' ? 'bg-green-100 text-green-700 hover:bg-green-100' : 'bg-amber-100 text-amber-700 hover:bg-amber-100'}
                        >
                          {booking.status === 'confirmed' ? 'Dikonfirmasi' : 'Menunggu Persetujuan'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-slate-600 mb-4">
                        <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg">
                          <Calendar className="h-4 w-4 text-blue-500" />
                          <span className="font-medium">{format(new Date(booking.scheduledAt), 'dd MMMM yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg">
                          <Clock className="h-4 w-4 text-blue-500" />
                          <span className="font-medium">{format(new Date(booking.scheduledAt), 'HH:mm')} ({booking.durationMinutes} Menit)</span>
                        </div>
                      </div>
                      
                      <div className="text-sm bg-blue-50/30 p-3 rounded-lg border border-blue-100">
                        <p className="font-semibold text-slate-700 flex items-center gap-2 mb-1">
                          <MessageSquare className="h-3 w-3 text-blue-500" /> Topik Konsultasi:
                        </p>
                        <p className="text-slate-600">{booking.topic}</p>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50/80 border-t md:border-t-0 md:border-l p-6 flex flex-col justify-center items-center gap-3 min-w-[180px]">
                      {booking.status === 'confirmed' && (
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">Hubungi Sekarang</Button>
                      )}
                      <Button variant="outline" size="sm" className="w-full">Lihat Detail</Button>
                      {booking.status === 'pending' && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full text-red-600 hover:bg-red-50 hover:text-red-700" 
                          onClick={() => handleCancel(booking._id)}
                        >
                          <XCircle className="h-4 w-4 mr-2" /> Batalkan
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
              {upcomingBookings.length === 0 && (
                <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                  <div className="h-20 w-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <Calendar className="h-10 w-10 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Belum ada jadwal konsultasi</h3>
                  <p className="text-slate-500 max-w-xs mx-auto mb-8">Butuh saran ahli untuk masalah Anda? Cari dan booking konsultan sekarang.</p>
                  <Button size="lg" className="px-8 shadow-lg shadow-blue-200" asChild>
                    <Link href="/consultants">Cari Konsultan</Link>
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="history" className="space-y-4">
              {historyBookings.map((booking) => (
                <Card key={booking._id} className="hover:bg-slate-50/50 transition-colors">
                  <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4 w-full">
                      <div className={`p-3 rounded-xl flex-shrink-0 ${booking.status === 'completed' ? 'bg-green-100' : 'bg-slate-100'}`}>
                        {booking.status === 'completed' ? <CheckCircle2 className="h-6 w-6 text-green-600" /> : <XCircle className="h-6 w-6 text-slate-400" />}
                      </div>
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-slate-900">{booking.consultantName}</p>
                          <Badge variant="outline" className={`text-[10px] h-5 ${booking.status === 'completed' ? 'border-green-200 text-green-700 bg-green-50' : 'border-slate-200 text-slate-500'}`}>
                            {booking.status.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">
                          {format(new Date(booking.scheduledAt), 'dd MMMM yyyy, HH:mm')} • {booking.topic}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                      {booking.status === 'completed' && (
                        <Button size="sm" variant="outline" className="flex-1 md:flex-none border-blue-200 text-blue-700 hover:bg-blue-50">
                          Beri Review
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" className="flex-1 md:flex-none text-slate-500">Invoice</Button>
                    </div>
                  </div>
                </Card>
              ))}
              {historyBookings.length === 0 && (
                <div className="text-center py-16 text-slate-400 italic bg-slate-50/50 rounded-xl border">
                  Belum ada riwayat sesi konsultasi.
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
