"use client";

import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { useParams, notFound } from "next/navigation";
import { BookingForm } from '@/components/booking/BookingForm'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Star, ShieldCheck } from 'lucide-react'

export default function BookingPage() {
  const params = useParams();
  const consultantId = params.consultantId as Id<"consultants">;
  
  const consultant = useQuery(api.consultants.getById, { id: consultantId });

  if (consultant === undefined) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-slate-500 animate-pulse font-bold">Menyiapkan halaman booking...</p>
      </div>
    );
  }

  if (consultant === null) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">Booking <span className="text-blue-600">Sesi Konsultasi</span></h1>
        <p className="text-slate-500 max-w-2xl font-medium">Lengkapi rincian sesi Anda untuk memulai konsultasi profesional dengan ahli kami.</p>
      </div>

      <div className="grid gap-10 lg:grid-cols-3">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <BookingForm consultant={consultant} />
        </div>

        {/* Sidebar Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 border-none shadow-xl shadow-slate-100 overflow-hidden">
            <div className="h-2 bg-blue-600 w-full" />
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center gap-4 mb-8 pb-8 border-b border-slate-100">
                <Avatar className="h-20 w-20 border-4 border-white shadow-lg">
                  <AvatarImage src={consultant.avatarUrl} />
                  <AvatarFallback className="bg-blue-600 text-white text-2xl font-black">{consultant.fullName?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-black text-xl text-slate-900">{consultant.fullName}</h3>
                  <div className="flex items-center justify-center gap-1 text-sm text-amber-500 mt-1">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="font-bold">{consultant.rating}</span>
                    <span className="text-slate-400 font-medium ml-1">({consultant.totalReviews} Review)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-black text-xs uppercase tracking-widest text-slate-400">Kenapa Memilih Beliau?</h4>
                <div className="space-y-3">
                   <div className="flex items-start gap-3">
                      <ShieldCheck className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-600 leading-relaxed font-medium">
                        Ahli di bidang <span className="text-slate-900 font-bold">{consultant.specializations?.join(', ')}</span>.
                      </p>
                   </div>
                   <div className="flex items-start gap-3">
                      <ShieldCheck className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-600 leading-relaxed font-medium">
                        Berpengalaman lebih dari <span className="text-slate-900 font-bold">{consultant.experienceYears} tahun</span> menangani berbagai kasus.
                      </p>
                   </div>
                </div>
              </div>

              <div className="mt-10 p-6 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-100">
                <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-80">Privasi & Keamanan</p>
                <p className="text-xs font-bold leading-relaxed">Sesi Anda dijamin 100% privat dan aman. Seluruh percakapan dienkripsi ujung-ke-ujung.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
