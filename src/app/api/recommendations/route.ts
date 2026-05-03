import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getAIRecommendations } from '@/lib/ai/groq'
import * as z from 'zod'

const recommendationSchema = z.object({
  description: z.string().min(10, 'Ceritakan lebih detail masalah Anda'),
  budget: z.number().positive().optional(),
  preferredTime: z.enum(['pagi', 'siang', 'sore', 'malam']).optional(),
  consultantIds: z.array(z.string()).optional(),
})

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 1. Validasi Input
    const body = await request.json()
    const validatedData = recommendationSchema.parse(body)

    // 2. Fetch Data Konsultan dari Supabase
    let query = supabase
      .from('consultants')
      .select(`
        *,
        profiles:profile_id (full_name, avatar_url),
        availability (*)
      `)
      .eq('is_available', true)

    if (validatedData.consultantIds && validatedData.consultantIds.length > 0) {
      query = query.in('id', validatedData.consultantIds)
    }

    const { data: consultants, error: dbError } = await query

    if (dbError || !consultants) {
      throw new Error('Gagal mengambil data konsultan')
    }

    // Transform data ke format yang diharapkan fungsi scoring/AI
    const formattedConsultants = consultants.map((c: any) => ({
      ...c,
      full_name: c.profiles.full_name,
      avatar_url: c.profiles.avatar_url
    }))

    // 3. Dapatkan Rekomendasi
    const result = await getAIRecommendations(
      {
        topic: validatedData.description,
        budget: validatedData.budget,
        preferredTime: validatedData.preferredTime
      },
      formattedConsultants
    )

    // 4. Rate Limiting (Simpan log di Supabase jika perlu)
    // Untuk demo, kita langsung kembalikan hasil
    return NextResponse.json(result)

  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues[0].message }, { status: 400 })
    }
    console.error('Recommendation API Error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan sistem' }, { status: 500 })
  }
}
