import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import * as z from 'zod'

const bookingSchema = z.object({
  consultant_id: z.string().uuid(),
  scheduled_at: z.string().datetime(),
  duration_minutes: z.number().refine(v => [30, 60, 90].includes(v)),
  topic: z.string().min(3),
  notes: z.string().optional(),
  total_price: z.number().positive(),
})

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = bookingSchema.parse(body)

    // 1. Cek apakah slot sudah terisi (Race Condition Prevention)
    const { data: existingBooking } = await supabase
      .from('bookings')
      .select('id')
      .eq('consultant_id', validatedData.consultant_id)
      .eq('scheduled_at', validatedData.scheduled_at)
      .in('status', ['pending', 'confirmed'])
      .maybeSingle()

    if (existingBooking) {
      return NextResponse.json({ message: 'Maaf, slot waktu ini baru saja dipesan oleh orang lain.' }, { status: 409 })
    }

    // 2. Insert Booking
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        user_id: user.id,
        consultant_id: validatedData.consultant_id,
        scheduled_at: validatedData.scheduled_at,
        duration_minutes: validatedData.duration_minutes,
        topic: validatedData.topic,
        notes: validatedData.notes,
        total_price: validatedData.total_price,
        status: 'pending'
      })
      .select()
      .single()

    if (bookingError) throw bookingError

    // 3. Insert Notifications
    await supabase.from('notifications').insert([
      {
        user_id: user.id,
        title: 'Booking Terkirim',
        message: 'Pesanan konsultasi Anda telah terkirim. Menunggu konfirmasi dari konsultan.',
        type: 'booking_confirmed'
      },
      {
        user_id: (await supabase.from('consultants').select('profile_id').eq('id', validatedData.consultant_id).single()).data?.profile_id,
        title: 'Ada Booking Baru!',
        message: `Seseorang ingin berkonsultasi dengan Anda tentang: ${validatedData.topic}`,
        type: 'booking_confirmed'
      }
    ])

    return NextResponse.json(booking)

  } catch (error: any) {
    console.error('Booking Error:', error)
    return NextResponse.json({ message: error.message || 'Internal Server Error' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let query = supabase
    .from('bookings')
    .select(`
      *,
      consultants:consultant_id (
        id,
        specializations,
        profiles:profile_id (full_name, avatar_url)
      )
    `)
    .eq('user_id', user.id)
    .order('scheduled_at', { ascending: false })

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}
