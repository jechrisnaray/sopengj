import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const specialization = searchParams.get('specialization')
    const search = searchParams.get('search')

    const supabase = await createClient()

    let query = supabase
      .from('consultants')
      .select(`
        *,
        profiles:profile_id (
          full_name,
          avatar_url,
          bio
        )
      `)
      .eq('is_available', true)

    if (specialization && specialization !== 'Semua') {
      query = query.contains('specializations', [specialization])
    }

    if (search) {
      query = query.ilike('profiles.full_name', `%${search}%`)
    }

    const { data, error } = await query.order('rating', { ascending: false })

    if (error || !data || data.length === 0) {
      console.warn('Using mock data as fallback')
      return NextResponse.json(MOCK_CONSULTANTS)
    }

    // Transform data to flatten profile info
    const consultants = data.map(c => ({
      ...c,
      full_name: c.profiles?.full_name || 'Konsultan',
      avatar_url: c.profiles?.avatar_url || '',
      bio: c.profiles?.bio
    }))

    return NextResponse.json(consultants)
  } catch (error: any) {
    console.error('API Consultants Error, using mock data:', error)
    return NextResponse.json(MOCK_CONSULTANTS)
  }
}

import { MOCK_CONSULTANTS } from '@/lib/data/mock-consultants'
