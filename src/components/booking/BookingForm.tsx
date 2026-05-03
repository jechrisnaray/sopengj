'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { AvailabilityCalendar } from './AvailabilityCalendar'
import { TimeSlotPicker } from './TimeSlotPicker'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { toast } from 'sonner'
import { formatRupiah } from '@/lib/utils/format'
import { Check, ArrowRight, ArrowLeft, CalendarDays, Clock, MessageSquare, CreditCard } from 'lucide-react'

import { Consultant } from '@/types'

interface BookingFormProps {
  consultant: Consultant & { full_name: string }
}

export function BookingForm({ consultant }: BookingFormProps) {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [date, setDate] = useState<Date>()
  const [slot, setSlot] = useState<string>()
  const [duration, setDuration] = useState('60')
  const [topic, setTopic] = useState('')
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const totalPrice = consultant.hourly_rate * (parseInt(duration) / 60)

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
    setIsSubmitting(true)
    try {
      const scheduledAt = new Date(date!)
      const [hours, minutes] = slot!.split(':').map(Number)
      scheduledAt.setHours(hours, minutes, 0, 0)

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          consultant_id: consultant.id,
          scheduled_at: scheduledAt.toISOString(),
          duration_minutes: parseInt(duration),
          topic,
          notes,
          total_price: totalPrice,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Gagal membuat booking')
      }

      toast.success('Booking berhasil dikonfirmasi!')
      router.push('/booking/success')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between px-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex flex-col items-center space-y-2">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
              step >= i ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
            }`}>
              {step > i ? <Check className="h-4 w-4" /> : i}
            </div>
            <span className={`text-[10px] uppercase font-bold tracking-wider ${
              step >= i ? 'text-blue-600' : 'text-slate-400'
            }`}>
              {i === 1 ? 'Jadwal' : i === 2 ? 'Detail' : 'Konfirmasi'}
            </span>
          </div>
        ))}
      </div>

      <Card>
        {step === 1 && (
          <>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-blue-600" />
                Pilih Jadwal Konsultasi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-8 md:grid-cols-2">
                <div className="space-y-4">
                  <Label>1. Pilih Tanggal</Label>
                  <AvailabilityCalendar 
                    consultantId={consultant.id} 
                    selectedDate={date} 
                    onDateSelect={setDate} 
                  />
                </div>
                <div className="space-y-4">
                  <Label>2. Pilih Jam</Label>
                  {date ? (
                    <TimeSlotPicker 
                      consultantId={consultant.id} 
                      selectedDate={date} 
                      selectedSlot={slot} 
                      onSlotSelect={setSlot} 
                    />
                  ) : (
                    <div className="flex h-[300px] items-center justify-center rounded-lg border-2 border-dashed bg-slate-50">
                      <p className="text-sm text-slate-500 text-center px-4">Silakan pilih tanggal di kalender terlebih dahulu</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-4 pt-4 border-t">
                <Label>3. Pilih Durasi Sesi</Label>
                <ToggleGroup value={[duration]} onValueChange={(val: string[]) => val[0] && setDuration(val[0])} className="justify-start">
                  <ToggleGroupItem value="30" className="px-6">30 Menit</ToggleGroupItem>
                  <ToggleGroupItem value="60" className="px-6">60 Menit</ToggleGroupItem>
                  <ToggleGroupItem value="90" className="px-6">90 Menit</ToggleGroupItem>
                </ToggleGroup>
              </div>
            </CardContent>
          </>
        )}

        {step === 2 && (
          <>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-600" />
                Detail Konsultasi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
                <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-blue-900">Jadwal Terpilih:</p>
                  <p className="text-blue-800">
                    {format(date!, 'EEEE, dd MMMM yyyy', { locale: id })} | Pukul {slot} ({duration} menit)
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="topic">Apa topik utama yang ingin Anda bahas? *</Label>
                  <Input 
                    id="topic" 
                    placeholder="Contoh: Perencanaan Keuangan Keluarga" 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Catatan tambahan untuk konsultan (opsional)</Label>
                  <Textarea 
                    id="notes" 
                    placeholder="Ceritakan sedikit latar belakang masalah Anda..." 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>
              </div>
            </CardContent>
          </>
        )}

        {step === 3 && (
          <>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-blue-600" />
                Konfirmasi Booking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="divide-y rounded-lg border bg-slate-50/50">
                <div className="p-4 flex justify-between">
                  <span className="text-slate-500">Konsultan</span>
                  <span className="font-semibold">{consultant.full_name}</span>
                </div>
                <div className="p-4 flex justify-between">
                  <span className="text-slate-500">Tanggal & Waktu</span>
                  <span className="font-semibold">
                    {format(date!, 'dd MMM yyyy')} | {slot}
                  </span>
                </div>
                <div className="p-4 flex justify-between">
                  <span className="text-slate-500">Durasi</span>
                  <span className="font-semibold">{duration} Menit</span>
                </div>
                <div className="p-4 flex justify-between">
                  <span className="text-slate-500 text-lg font-bold">Total Pembayaran</span>
                  <span className="text-lg font-bold text-blue-600">
                    {formatRupiah(totalPrice)}
                  </span>
                </div>
              </div>
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-4 flex gap-3">
                <div className="h-5 w-5 rounded-full bg-amber-200 flex items-center justify-center text-[10px] font-bold mt-0.5">!</div>
                <p className="text-sm text-amber-800">
                  Pembayaran dilakukan secara langsung kepada konsultan saat sesi berlangsung melalui metode yang disepakati bersama.
                </p>
              </div>
            </CardContent>
          </>
        )}

        <CardFooter className="flex justify-between border-t pt-6 bg-slate-50/30">
          <Button variant="ghost" onClick={handleBack} disabled={step === 1 || isSubmitting}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
          </Button>
          {step < 3 ? (
            <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700 px-8">
              Lanjut <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleConfirm} disabled={isSubmitting} className="bg-green-600 hover:bg-green-700 px-10">
              {isSubmitting ? 'Memproses...' : 'Konfirmasi Booking'}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
