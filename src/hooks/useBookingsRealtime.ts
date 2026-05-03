'use client'

import { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function useBookingsRealtime() {
  const supabase = createClient()
  const router = useRouter()
  const channelRef = useRef<any>(null)

  useEffect(() => {
    if (channelRef.current) return

    const setup = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      channelRef.current = supabase
        .channel(`user-bookings-${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'bookings',
            // Kita dengerin semua update yang melibatkan user ini
            // Baik sebagai klien maupun sebagai konsultan (melalui logic dashboard)
          },
          (payload) => {
            // Jika status berubah, beri tahu user dan refresh data
            if (payload.old.status !== payload.new.status) {
              const statusMap: Record<string, string> = {
                confirmed: 'dikonfirmasi',
                cancelled: 'dibatalkan',
                completed: 'selesai'
              }
              
              toast.success(`Status booking diperbarui menjadi: ${statusMap[payload.new.status] || payload.new.status}`)
              router.refresh()
            }
          }
        )
        .subscribe()
    }

    setup()

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [supabase, router])
}
