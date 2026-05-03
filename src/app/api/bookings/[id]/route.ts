import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { status } = await request.json()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // 1. Ambil detail booking untuk cek izin
  const { data: booking } = await supabase
    .from('bookings')
    .select('*, consultants(profile_id)')
    .eq('id', params.id)
    .single()

  if (!booking) return NextResponse.json({ error: 'Booking not found' }, { status: 404 })

  const isConsultant = booking.consultants.profile_id === user.id
  const isOwner = booking.user_id === user.id

  // 2. Izin: Hanya konsultan yang bisa confirm/complete, hanya owner yang bisa cancel
  if (status === 'confirmed' || status === 'completed') {
    if (!isConsultant) return NextResponse.json({ error: 'Hanya konsultan yang bisa melakukan ini' }, { status: 403 })
  }

  if (status === 'cancelled') {
    if (!isOwner && !isConsultant) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const { data, error } = await supabase
    .from('bookings')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', params.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json(data)
}
