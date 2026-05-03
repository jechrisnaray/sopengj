'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { startOfMonth, endOfMonth, format, addMonths } from 'date-fns'

export function useAvailability(consultantId: string, selectedDate?: Date) {
  const supabase = createClient()

  // 1. Fetch Weekly Availability
  const availabilityQuery = useQuery({
    queryKey: ['availability', consultantId],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('availability')
          .select('*')
          .eq('consultant_id', consultantId)
          .eq('is_active', true)
        
        if (error || !data || data.length === 0) throw new Error('No data')
        return data
      } catch (e) {
        // DEMO MODE: Mock availability (Senin-Jumat)
        return [1, 2, 3, 4, 5].map(day => ({
          day_of_week: day,
          start_time: '09:00:00',
          end_time: '17:00:00',
          is_active: true
        }))
      }
    },
    staleTime: 1000 * 60 * 5,
  })

  // 2. Fetch Existing Bookings (to block occupied slots)
  const bookingsQuery = useQuery({
    queryKey: ['bookings-range', consultantId, selectedDate?.getMonth()],
    enabled: !!selectedDate,
    queryFn: async () => {
      try {
        if (!selectedDate) return []
        
        const start = startOfMonth(selectedDate)
        const end = endOfMonth(addMonths(selectedDate, 1))

        const { data, error } = await supabase
          .from('bookings')
          .select('scheduled_at, duration_minutes')
          .eq('consultant_id', consultantId)
          .in('status', ['pending', 'confirmed'])
          .gte('scheduled_at', start.toISOString())
          .lte('scheduled_at', end.toISOString())
        
        if (error) throw error
        return data || []
      } catch (e) {
        return [] // DEMO MODE: No occupied slots
      }
    },
  })

  // 3. Get Available Dates for Calendar
  const availableDays = availabilityQuery.data?.map(a => a.day_of_week) || []

  // 4. Get Slots for Selected Date
  const getAvailableSlots = (date: Date) => {
    if (!date || !availabilityQuery.data) return []
    
    const dayOfWeek = date.getDay()
    const dayConfig = availabilityQuery.data.filter(a => a.day_of_week === dayOfWeek)
    
    if (dayConfig.length === 0) return []

    // Generate slots based on start/end time (simplified example)
    const slots: string[] = []
    dayConfig.forEach(config => {
      let current = config.start_time
      while (current < config.end_time) {
        slots.push(current.slice(0, 5))
        // Increment by 1 hour for simplicity
        const [h, m] = current.split(':').map(Number)
        const nextH = h + 1
        current = `${nextH.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:00`
      }
    })

    // Filter out occupied slots
    const occupied = bookingsQuery.data?.filter(b => {
      const bDate = new Date(b.scheduled_at)
      return bDate.toDateString() === date.toDateString()
    }).map(b => format(new Date(b.scheduled_at), 'HH:mm')) || []

    return slots.filter(s => !occupied.includes(s))
  }

  return {
    isAvailableDay: (date: Date) => availableDays.includes(date.getDay()),
    availableSlots: selectedDate ? getAvailableSlots(selectedDate) : [],
    isLoading: availabilityQuery.isLoading || bookingsQuery.isLoading,
    availability: availabilityQuery.data,
  }
}
