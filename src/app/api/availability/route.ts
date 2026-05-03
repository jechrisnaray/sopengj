import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const consultantId = searchParams.get('consultantId')

    if (!consultantId) {
      return NextResponse.json({ error: 'Consultant ID diperlukan' }, { status: 400 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase
      .from('availability')
      .select('*')
      .eq('consultant_id', consultantId)
      .eq('is_active', true)

    if (error || !data || data.length === 0) {
      // DEMO MODE: Mock availability (Mon-Fri, 09:00-17:00)
      return NextResponse.json([1, 2, 3, 4, 5].map(day => ({
        consultant_id: consultantId,
        day_of_week: day,
        start_time: '09:00',
        end_time: '17:00',
        is_active: true
      })))
    }

    return NextResponse.json(data)
  } catch (error: any) {
    console.error('API Availability Error:', error)
    return NextResponse.json({ error: 'Gagal memuat ketersediaan' }, { status: 500 })
  }
}
