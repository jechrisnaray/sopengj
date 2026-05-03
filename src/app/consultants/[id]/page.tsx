"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Star, ShieldCheck, MapPin, Globe } from 'lucide-react'
import { notFound } from 'next/navigation'
import { BookingButton } from '@/components/booking/BookingButton'
import { BookingForm } from '@/components/booking/BookingForm'
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function ConsultantProfilePage() {
  const params = useParams();
  const id = params.id as Id<"consultants">;
  
  const consultant = useQuery(api.consultants.getById, { id });
  const { user, isLoading: isAuthLoading } = useCurrentUser();
  const isLoggedIn = !!user;

  if (consultant === undefined || isAuthLoading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-slate-500 animate-pulse">Memuat profil konsultan...</p>
      </div>
    );
  }

  if (consultant === null) notFound();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid gap-12 lg:grid-cols-3">
        {/* Kiri: Info Profil */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl border bg-white p-8 text-center shadow-sm">
            <Avatar className="h-32 w-32 mx-auto border-4 border-white shadow-md">
              <AvatarImage src={consultant.avatarUrl} />
              <AvatarFallback className="text-3xl bg-blue-50 text-blue-600">
                {consultant.fullName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <h1 className="mt-6 text-2xl font-bold text-slate-900">
              {consultant.fullName}
            </h1>
            <div className="mt-2 flex flex-wrap justify-center gap-1">
              {consultant.specializations?.map((spec: string) => (
                <Badge
                  key={spec}
                  variant="outline"
                  className="text-[10px] font-bold uppercase tracking-wider"
                >
                  {spec}
                </Badge>
              ))}
            </div>
            <div className="mt-6 flex items-center justify-center space-x-2 text-amber-500 font-bold">
              <Star className="h-5 w-5 fill-current" />
              <span>{consultant.rating?.toFixed(1) ?? '0.0'}</span>
              <span className="text-slate-400 font-normal text-sm">
                ({consultant.totalReviews ?? 0} Review)
              </span>
            </div>

            <div className="mt-6">
              <BookingButton
                consultantId={consultant._id}
                isLoggedIn={isLoggedIn}
              />
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900">Tentang Konsultan</h3>
            <p className="text-sm leading-relaxed text-slate-600">
              {consultant.bio}
            </p>
            <div className="pt-4 space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <ShieldCheck className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>Identitas Terverifikasi</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <MapPin className="h-4 w-4 text-slate-400 flex-shrink-0" />
                <span>Jakarta, Indonesia</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Globe className="h-4 w-4 text-slate-400 flex-shrink-0" />
                <span>
                  {consultant.languages?.join(', ') ?? 'Bahasa Indonesia'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Kanan: Form Booking (hanya tampil jika sudah login) */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border bg-white p-8 shadow-sm">
            <div className="mb-8 border-b pb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Pesan Sesi Konsultasi
              </h2>
              <p className="text-slate-500">
                {isLoggedIn
                  ? 'Pilih waktu yang sesuai untuk sesi privat Anda.'
                  : 'Silakan masuk terlebih dahulu untuk melakukan booking.'}
              </p>
            </div>

            {isLoggedIn ? (
              <BookingForm consultant={consultant as any} />
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-500 mb-6">
                  Anda perlu masuk untuk melihat jadwal dan melakukan pemesanan.
                </p>
                <BookingButton
                  consultantId={consultant._id}
                  isLoggedIn={false}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
