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
    const body = await request.json()
    console.log('DEMO MODE: Creating booking for topic:', body.topic)
    
    // Simulate delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return NextResponse.json({
      id: 'demo-booking-' + Math.random().toString(36).substr(2, 9),
      status: 'pending',
      message: 'Booking berhasil (Demo Mode)'
    })

  } catch (error: any) {
    console.error('Booking Error:', error)
    return NextResponse.json({ message: 'Gagal membuat booking' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  // DEMO MODE: Return mock bookings
  return NextResponse.json([
    {
      id: 'demo-1',
      scheduled_at: new Date().toISOString(),
      duration_minutes: 60,
      status: 'confirmed',
      topic: 'Konsultasi Hukum Perdata',
      total_price: 500000,
      consultants: {
        id: 'f1111111-1111-1111-1111-111111111111',
        profiles: { full_name: 'Budi Arto, S.H.', avatar_url: '' }
      }
    }
  ])
}
