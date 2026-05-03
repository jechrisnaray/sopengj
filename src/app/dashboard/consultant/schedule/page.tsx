"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { Calendar, Clock, Plus, Trash2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useCurrentUser } from "@/hooks/useCurrentUser";

const DAYS = [
  { id: 1, name: 'Senin' },
  { id: 2, name: 'Selasa' },
  { id: 3, name: 'Rabu' },
  { id: 4, name: 'Kamis' },
  { id: 5, name: 'Jumat' },
  { id: 6, name: 'Sabtu' },
  { id: 0, name: 'Minggu' },
];

export default function SchedulePage() {
  const { profile } = useCurrentUser();
  const consultant = useQuery(api.consultants.getByProfileId, profile ? { profileId: profile._id } : "skip");
  const availability = useQuery(api.availability.list, consultant ? { consultantId: consultant._id } : "skip");
  
  const updateAvailability = useMutation(api.availability.update);

  const handleToggleDay = async (dayOfWeek: number, isActive: boolean) => {
    if (!consultant) return;
    try {
      await updateAvailability({
        consultantId: consultant._id,
        dayOfWeek,
        isActive,
        slots: isActive ? [{ start: "09:00", end: "17:00" }] : []
      });
      toast.success('Jadwal diperbarui');
    } catch (err) {
      toast.error('Gagal memperbarui jadwal');
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/consultant"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Pengaturan Jadwal</h1>
          <p className="text-slate-500">Tentukan kapan Anda tersedia untuk menerima konsultasi.</p>
        </div>
      </div>

      <div className="grid gap-6">
        {DAYS.map((day) => {
          const activeDay = (availability as any[])?.find((a: any) => a.dayOfWeek === day.id);
          const isActive = activeDay?.isActive ?? false;

          return (
            <Card key={day.id} className={`border-none shadow-sm transition-all ${isActive ? 'bg-white' : 'bg-slate-50 opacity-70'}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-4 min-w-[120px]">
                    <Switch 
                      checked={isActive} 
                      onCheckedChange={(checked: boolean) => handleToggleDay(day.id, checked)}
                    />
                    <Label className="font-bold text-lg">{day.name}</Label>
                  </div>

                  {isActive ? (
                    <div className="flex-grow flex items-center gap-4">
                      <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl border border-slate-200">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <span className="text-sm font-bold">09:00 — 17:00</span>
                      </div>
                      <p className="text-xs text-slate-400 italic">Slot default (fitur edit jam menyusul)</p>
                    </div>
                  ) : (
                    <div className="flex-grow">
                      <p className="text-sm text-slate-400">Tidak ada jadwal (Libur)</p>
                    </div>
                  )}

                  {isActive && (
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-blue-600 text-white border-none shadow-xl shadow-blue-100">
        <CardContent className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-bold">Sinkronisasi Kalender</h3>
            <p className="text-blue-100 text-sm">Hubungkan jadwal Anda dengan Google Calendar untuk manajemen yang lebih mudah.</p>
          </div>
          <Button className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-8 h-12 rounded-xl border-none">
            Hubungkan Sekarang
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
