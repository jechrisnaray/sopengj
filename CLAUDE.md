# KonsulIn — Platform Konsultasi Online

## Stack Teknologi (Semua Gratis)
- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (free tier)
- **Auth**: Supabase Auth
- **AI Utama**: Groq API — model llama-3.3-70b-versatile (gratis)
- **AI Backup**: Google Gemini API — gemini-1.5-flash (gratis, opsional)
- **Fallback**: Algoritma scoring manual (tanpa API)
- **Scraping**: browser-use Python + Groq (gratis)
- **Deploy**: Vercel (free Hobby plan)

## Batasan Free Tier yang Perlu Dijaga
- **Groq**: max 14.400 request/hari → tambahkan caching di API route
- **Gemini**: max 1.500 request/hari → gunakan sebagai backup saja
- **Supabase**: 500MB DB → monitor di dashboard Supabase

## Struktur Folder
- `src/app/` → Next.js pages (App Router)
- `src/components/`
  - `ui/` → shadcn/ui base components
  - `consultant/` → ConsultantCard, ConsultantList, dll
  - `booking/` → BookingForm, Calendar, TimeSlotPicker
  - `recommendation/` → RecommendationSection, RecommendationCard
  - `dashboard/` → Sidebar, StatsCard, BookingCard
  - `shared/` → Navbar, Footer, Loading, Error
- `src/lib/`
  - `supabase/` → client.ts (browser), server.ts (server)
  - `ai/` → groq.ts, scoring.ts, recommendation.ts
  - `utils/` → cn.ts, format.ts (Rupiah formatter), constants.ts
- `src/types/` → TypeScript interfaces
- `src/hooks/` → custom React hooks
- `scripts/` → Python browser-use scripts
- `docs/` → dokumentasi proyek
- `design-system/` → MASTER.md dan page overrides

## Konvensi Kode
- Server Components by default, 'use client' hanya jika interaktif
- Validasi input selalu pakai Zod
- Error handling: try/catch di semua fetch + user-friendly message
- Harga: selalu format dengan Intl.NumberFormat('id-ID')
- Tanggal: gunakan date-fns dengan locale id (Indonesia)
- Jangan hardcode API key — selalu dari .env.local

## Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GROQ_API_KEY` (gratis di console.groq.com)
- `NEXT_PUBLIC_APP_URL=http://localhost:3000`

## Cara Dapat API Key Gratis
1. **Groq**: daftar di console.groq.com → Create API Key
2. **Supabase**: daftar di supabase.com → New Project → Settings → API

## Status Sprint
**Sprint aktif**: SELESAI — Siap Deploy
**Task terakhir**: Audit menyeluruh, perbaikan kompatibilitas Next.js 16, & pembersihan 0 lint error.
**Task berikutnya**: Deploy ke Vercel (Hobby Plan)
**Error aktif**: Tidak ada (System build stable)

## Keputusan Arsitektur
- App Router (bukan Pages Router)
- Supabase Auth dengan SSR
- TanStack Query untuk server state
- Groq sebagai AI utama (gratis)
- Algoritma manual sebagai fallback AI
