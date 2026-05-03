"use client";

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { format } from 'date-fns'
import { id as localeId } from 'date-fns/locale'
import { toast } from 'sonner'
import { formatRupiah } from '@/lib/utils/format'
import { Check, ArrowRight, ArrowLeft, CalendarDays, Clock, MessageSquare, CreditCard } from 'lucide-react'
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface BookingFormProps {
  consultant: any; // Using any for flexibility during migration
}

export function BookingForm({ consultant }: BookingFormProps) {
  const router = useRouter()
  const { profile } = useCurrentUser()
  const createBooking = useMutation(api.bookings.create)

  const [step, setStep] = useState(1)
  const [date, setDate] = useState<Date>(new Date(Date.now() + 86400000))
  const [slot, setSlot] = useState<string>('09:00')
  const [duration, setDuration] = useState('60')
  const [topic, setTopic] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const totalPrice = consultant.hourlyRate * (parseInt(duration) / 60)

  const handleNext = () => {
    if (step === 1 && (!date || !slot)) {
      toast.error('Pilih tanggal dan jam terlebih dahulu')
      return
    }
    if (step === 2 && !topic) {
      toast.error('Topik konsultasi wajib diisi')
      return
    }
    setStep(step + 1)
  }

  const handleBack = () => setStep(step - 1)

  const handleConfirm = async () => {
    if (!profile) {
      toast.error('Silakan login terlebih dahulu')
      return
    }

    setIsSubmitting(true)
    try {
      const scheduledAt = new Date(date!)
      const [hours, minutes] = slot!.split(':').map(Number)
      scheduledAt.setHours(hours, minutes, 0, 0)

      await createBooking({
        userId: profile._id,
        consultantId: consultant._id,
        scheduledAt: scheduledAt.toISOString(),
        durationMinutes: parseInt(duration),
        topic,
        notes: notes || undefined,
        totalPrice: totalPrice,
      })

      toast.success('Booking berhasil dikirim ke konsultan!')
      router.push('/dashboard/user')
    } catch (error: any) {
      toast.error(error.message || 'Terjadi kesalahan saat memproses booking')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between px-4 mb-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center space-y-2 flex-1">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all ${
              step >= i ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-100 text-slate-400'
            }`}>
              {step > i ? <Check className="h-5 w-5" /> : i}
            </div>
            <span className={`text-[10px] uppercase font-black tracking-widest ${
              step >= i ? 'text-blue-600' : 'text-slate-400'
            }`}>
              {i === 1 ? 'Waktu' : i === 2 ? 'Detail' : 'Bayar'}
            </span>
          </div>
        ))}
      </div>

      <Card className="border-none shadow-xl shadow-slate-200/50 overflow-hidden">
        {step === 1 && (
          <>
            <CardHeader className="bg-slate-50/50 border-b">
              <CardTitle className="text-xl flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-blue-600" />
                Atur Waktu Konsultasi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 p-8">
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-4">
                  <Label className="text-slate-900 font-bold">1. Pilih Tanggal</Label>
                  <Input 
                    type="date" 
                    min={new Date().toISOString().split('T')[0]}
                    value={date.toISOString().split('T')[0]}
                    onChange={(e) => setDate(new Date(e.target.value))}
                    className="h-12 border-slate-200 focus:ring-blue-500"
                  />
                  <p className="text-[11px] text-slate-500">Pilih hari kerja yang tersedia untuk konsultan ini.</p>
                </div>
                <div className="space-y-4">
                  <Label className="text-slate-900 font-bold">2. Pilih Jam Mulai</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '19:00', '20:00'].map((time) => (
                      <Button
                        key={time}
                        variant={slot === time ? 'default' : 'outline'}
                        className={`h-11 transition-all ${slot === time ? 'bg-blue-600 shadow-md' : 'border-slate-200 hover:border-blue-300'}`}
                        onClick={() => setSlot(time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-4 pt-6 border-t border-slate-100">
                <Label className="text-slate-900 font-bold">3. Pilih Durasi Sesi</Label>
                <div className="flex flex-wrap gap-3">
                  {['30', '60', '90'].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDuration(d)}
                      className={`px-8 py-3 rounded-xl border-2 font-bold text-sm transition-all ${
                        duration === d 
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm' 
                        : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                      }`}
                    >
                      {d} Menit
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </>
        )}

        {step === 2 && (
          <>
            <CardHeader className="bg-slate-50/50 border-b">
              <CardTitle className="text-xl flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                Informasi Masalah
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 p-8">
              <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-200 flex items-center gap-6">
                <div className="h-14 w-14 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                  <Clock className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-1">Jadwal Sesi:</p>
                  <p className="text-lg font-bold">
                    {format(date!, 'EEEE, dd MMMM yyyy', { locale: localeId })}
                  </p>
                  <p className="text-sm opacity-90">Pukul {slot} • {duration} Menit</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="topic" className="text-slate-900 font-bold">Apa topik utama yang ingin Anda bahas? *</Label>
                  <Input 
                    id="topic" 
                    placeholder="Contoh: Perencanaan Keuangan Keluarga" 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="h-12 border-slate-200"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="notes" className="text-slate-900 font-bold">Catatan tambahan untuk konsultan (opsional)</Label>
                  <Textarea 
                    id="notes" 
                    placeholder="Ceritakan sedikit latar belakang masalah Anda agar konsultan bisa bersiap lebih baik..." 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[150px] border-slate-200 resize-none p-4"
                  />
                </div>
              </div>
            </CardContent>
          </>
        )}

        {step === 3 && (
          <>
            <CardHeader className="bg-slate-50/50 border-b">
              <CardTitle className="text-xl flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                Ringkasan Pembayaran
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8 p-8">
              <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
                <div className="bg-slate-50 p-4 border-b">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Detail Pesanan</p>
                </div>
                <div className="divide-y divide-slate-50">
                  <div className="p-4 flex justify-between items-center">
                    <span className="text-sm text-slate-500">Konsultan</span>
                    <span className="text-sm font-bold text-slate-900">{consultant.fullName}</span>
                  </div>
                  <div className="p-4 flex justify-between items-center">
                    <span className="text-sm text-slate-500">Waktu Sesi</span>
                    <span className="text-sm font-bold text-slate-900">
                      {format(date!, 'dd MMM yyyy')} • {slot} ({duration}m)
                    </span>
                  </div>
                  <div className="p-6 flex justify-between items-center bg-blue-50/50">
                    <span className="text-slate-900 font-black">TOTAL PEMBAYARAN</span>
                    <div className="text-right">
                      <span className="text-2xl font-black text-blue-600">
                        {formatRupiah(totalPrice)}
                      </span>
                      <p className="text-[10px] text-slate-400 font-bold">PAJAK TERMASUK</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl bg-amber-50 border border-amber-100 p-6 flex gap-4">
                <div className="h-10 w-10 shrink-0 rounded-full bg-amber-200 flex items-center justify-center text-amber-800 font-black">!</div>
                <div>
                  <p className="text-sm font-bold text-amber-900 mb-1">Catatan Pembayaran</p>
                  <p className="text-xs text-amber-800/80 leading-relaxed">
                    Pembayaran diproses secara manual. Konsultan akan memberikan rincian metode pembayaran (Transfer/E-Wallet) setelah booking dikonfirmasi.
                  </p>
                </div>
              </div>
            </CardContent>
          </>
        )}

        <CardFooter className="flex justify-between items-center p-8 bg-slate-50/50 border-t">
          <Button 
            variant="ghost" 
            onClick={handleBack} 
            disabled={step === 1 || isSubmitting}
            className="font-bold text-slate-500"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
          </Button>
          {step < 3 ? (
            <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 px-10 h-12 font-bold shadow-lg shadow-blue-200">
              Selanjutnya <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleConfirm} 
              disabled={isSubmitting} 
              className="bg-blue-600 hover:bg-blue-700 px-12 h-12 font-black shadow-lg shadow-blue-200"
            >
              {isSubmitting ? 'Memproses...' : 'KONFIRMASI BOOKING'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
