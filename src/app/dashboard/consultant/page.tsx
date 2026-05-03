"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { format } from 'date-fns'
import { toast } from 'sonner'
import { formatRupiah } from '@/lib/utils/format'
import { Users, Star, Banknote, CalendarCheck, Check, X, Clock, TrendingUp } from 'lucide-react'
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function ConsultantDashboard() {
  const { profile, isLoading: isAuthLoading } = useCurrentUser();
  
  // Get consultant record for this profile
  const consultant = useQuery(api.consultants.getByProfileId, profile ? { profileId: profile._id } : "skip");
  
  // Get bookings for this consultant
  const bookings = useQuery(api.bookings.listForConsultant, consultant ? { consultantId: consultant._id } : "skip");
  
  // Get stats
  const stats = useQuery(api.stats.getConsultantStats, consultant ? { consultantId: consultant._id } : "skip");

  const updateStatus = useMutation(api.bookings.updateStatus);

  const isLoading = isAuthLoading || consultant === undefined || bookings === undefined || stats === undefined;

  const handleUpdateStatus = async (id: any, status: 'confirmed' | 'cancelled') => {
    try {
      await updateStatus({ id, status });
      toast.success(`Booking berhasil ${status === 'confirmed' ? 'diterima' : 'ditolak'}`);
    } catch (err) {
      toast.error('Gagal memperbarui status');
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center animate-pulse">
        <div className="h-10 w-64 bg-slate-200 mx-auto mb-8 rounded" />
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-slate-100 rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (!consultant) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Profil Konsultan Tidak Ditemukan</h2>
        <p className="text-slate-500 mb-8">Anda harus terdaftar sebagai konsultan untuk mengakses halaman ini.</p>
        <Button asChild><a href="/consultants/register">Daftar Jadi Konsultan</a></Button>
      </div>
    );
  }

  const pendingBookings = bookings?.filter(b => b.status === 'pending') || [];
  const upcomingBookings = bookings?.filter(b => b.status === 'confirmed') || [];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 bg-slate-50/30 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Konsultan</h1>
          <p className="text-slate-500 mt-1">Selamat datang kembali, {profile?.fullName}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="bg-white">Edit Profil</Button>
          <Button className="bg-blue-600 hover:bg-blue-700" asChild>
            <Link href="/dashboard/consultant/schedule">Atur Jadwal</Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-4">
        <StatCard 
          title="Total Sesi" 
          value={stats?.totalSessions ?? 0} 
          icon={<Users className="h-6 w-6 text-blue-600" />}
          description="Selesai"
        />
        <StatCard 
          title="Rating Ahli" 
          value={(stats?.rating ?? 0).toFixed(1)} 
          icon={<Star className="h-6 w-6 text-amber-500 fill-amber-500" />}
          description={`${consultant.totalReviews} ulasan`}
        />
        <StatCard 
          title="Pendapatan" 
          value={formatRupiah(stats?.totalIncome ?? 0)} 
          icon={<Banknote className="h-6 w-6 text-green-600" />}
          description="Total saldo"
        />
        <StatCard 
          title="Permintaan" 
          value={stats?.pendingCount ?? 0} 
          icon={<Clock className="h-6 w-6 text-orange-500" />}
          description="Butuh konfirmasi"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Pending Requests */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-white border-b border-slate-100">
              <CardTitle className="text-lg flex items-center gap-2">
                <CalendarCheck className="h-5 w-5 text-blue-600" /> Booking Masuk
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {pendingBookings.map((b) => (
                  <div key={b._id} className="flex flex-col sm:flex-row items-center justify-between p-6 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4 w-full">
                      <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                        <AvatarImage src={b.userAvatar} />
                        <AvatarFallback>U</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-slate-900">{b.userName}</p>
                          <Badge variant="secondary" className="bg-blue-50 text-blue-700 text-[10px]">NEW</Badge>
                        </div>
                        <p className="text-xs text-slate-500 font-medium">
                          {format(new Date(b.scheduledAt), 'EEEE, dd MMM • HH:mm')}
                        </p>
                        <p className="text-sm text-slate-700 mt-2 line-clamp-1 italic font-medium">"{b.topic}"</p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4 sm:mt-0 w-full sm:w-auto">
                      <Button 
                        size="sm" 
                        className="flex-1 bg-green-600 hover:bg-green-700 h-9" 
                        onClick={() => handleUpdateStatus(b._id, 'confirmed')}
                      >
                        <Check className="h-4 w-4 mr-2" /> Terima
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 h-9" 
                        onClick={() => handleUpdateStatus(b._id, 'cancelled')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {pendingBookings.length === 0 && (
                  <div className="text-center py-16">
                    <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CalendarCheck className="h-8 w-8 text-slate-300" />
                    </div>
                    <p className="text-sm text-slate-400">Tidak ada permintaan booking baru.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Schedule Preview */}
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-white border-b border-slate-100">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" /> Jadwal Sesi Mendatang
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-4">
                {upcomingBookings.slice(0, 5).map((b) => (
                  <div key={b._id} className="flex items-center gap-4 p-4 border-l-4 border-blue-600 bg-white shadow-sm rounded-r-lg group hover:bg-slate-50 transition-colors">
                    <div className="text-center min-w-[60px] border-r pr-4">
                      <p className="text-[10px] font-bold uppercase text-blue-600">{format(new Date(b.scheduledAt), 'MMM')}</p>
                      <p className="text-2xl font-black leading-none text-slate-900">{format(new Date(b.scheduledAt), 'dd')}</p>
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{b.topic}</p>
                      <p className="text-xs text-slate-500 font-medium">Klien: {b.userName} • {format(new Date(b.scheduledAt), 'HH:mm')}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-100">Confirmed</Badge>
                      <button className="text-[10px] text-blue-600 font-bold hover:underline">Link Meeting</button>
                    </div>
                  </div>
                ))}
                {upcomingBookings.length === 0 && (
                  <p className="text-center py-10 text-sm text-slate-400 italic">Belum ada sesi yang terkonfirmasi.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-600" /> Analitik Cepat
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Populeritas</p>
                <div className="flex items-end justify-between">
                  <p className="text-xl font-bold">Top 5%</p>
                  <span className="text-[10px] text-green-600 font-bold">+12% Bulan ini</span>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Waktu Respon</p>
                <div className="flex items-end justify-between">
                  <p className="text-xl font-bold">~15 Menit</p>
                  <span className="text-[10px] text-blue-600 font-bold">Sangat Cepat</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-600 text-white border-none shadow-lg">
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-2">Butuh Bantuan?</h3>
              <p className="text-blue-100 text-xs mb-4 leading-relaxed">
                Ada kendala dengan sistem atau pembayaran? Tim support kami siap membantu Anda 24/7.
              </p>
              <Button size="sm" className="w-full bg-white text-blue-600 hover:bg-blue-50 font-bold border-none">
                Hubungi Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function StatCard({ title, value, icon, description }: { title: string, value: any, icon: React.ReactNode, description: string }) {
  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</p>
          <p className="text-2xl font-black text-slate-900">{value}</p>
          <p className="text-[10px] text-slate-500 font-medium mt-1">{description}</p>
        </div>
        <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center shadow-inner">{icon}</div>
      </CardContent>
    </Card>
  )
}
