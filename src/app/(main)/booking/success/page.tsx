import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2, Calendar, Clock, ArrowRight, Search } from 'lucide-react'

export default function BookingSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[70vh]">
      <div className="mb-6 rounded-full bg-green-100 p-4">
        <CheckCircle2 className="h-16 w-16 text-green-600" />
      </div>
      
      <h1 className="mb-2 text-3xl font-bold text-slate-900">Booking Berhasil!</h1>
      <p className="mb-10 text-center text-slate-600 max-w-md">
        Pesanan konsultasi Anda telah kami terima. Konsultan akan segera menghubungi Anda melalui email atau WhatsApp untuk konfirmasi dan mengirim link meeting.
      </p>

      <Card className="w-full max-w-md mb-10 overflow-hidden border-green-100 bg-green-50/30">
        <CardContent className="p-6">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-green-800">Ringkasan Pesanan</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-slate-700">
              <Calendar className="h-4 w-4 text-slate-400" />
              <span className="text-sm">Jadwal telah ditambahkan ke kalender Anda</span>
            </div>
            <div className="flex items-center gap-3 text-slate-700">
              <Clock className="h-4 w-4 text-slate-400" />
              <span className="text-sm">Notifikasi akan dikirim 30 menit sebelum sesi dimulai</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Button className="flex-1 bg-blue-600 hover:bg-blue-700" asChild>
          <Link href="/dashboard/user">
            Lihat Booking Saya <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" className="flex-1" asChild>
          <Link href="/consultants">
            <Search className="mr-2 h-4 w-4" /> Cari Konsultan Lain
          </Link>
        </Button>
      </div>
    </div>
  )
}
