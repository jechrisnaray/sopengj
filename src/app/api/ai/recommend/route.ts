import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getRecommendations } from '@/lib/ai/recommendation'
import { createClient } from '@/lib/supabase/server'

// Rate limit sederhana per IP (in-memory)
const requestCounts = new Map<string, { count: number; reset: number }>()
const RATE_LIMIT = 10 // max 10 request per menit per IP

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = requestCounts.get(ip)

  if (!entry || entry.reset < now) {
    requestCounts.set(ip, { count: 1, reset: now + 60_000 })
    return true
  }

  if (entry.count >= RATE_LIMIT) return false

  entry.count++
  return true
}

const requestSchema = z.object({
  problem: z.string().min(10, 'Deskripsi masalah minimal 10 karakter').max(1000),
  budget: z.number().positive().optional(),
  preferOnline: z.boolean().optional(),
})

export async function POST(request: NextRequest) {
  try {
    // Auth check — hanya user yang login yang bisa akses
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // MOCK AUTH CHECK
    const isMockAuth = request.cookies.get('mock-auth')?.value === 'true'

    if (!user && !isMockAuth) {
      return NextResponse.json(
        { error: 'Silakan masuk terlebih dahulu untuk mendapatkan rekomendasi AI' },
        { status: 401 }
      )
    }

    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Terlalu banyak permintaan. Coba lagi dalam 1 menit.' },
        { status: 429 }
      )
    }

    // Parse & validasi body
    const body = await request.json()
    const parsed = requestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? 'Input tidak valid' },
        { status: 400 }
      )
    }

    // Proses rekomendasi
    const result = await getRecommendations(parsed.data)

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error('[API /ai/recommend]', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan. Silakan coba lagi.' },
      { status: 500 }
    )
  }
}
