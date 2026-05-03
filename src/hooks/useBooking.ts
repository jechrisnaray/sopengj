import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface CreateBookingParams {
  consultant_id: string
  scheduled_at: string
  duration_minutes: number
  topic: string
  notes?: string
  total_price: number
}

async function createBooking(params: CreateBookingParams) {
  const response = await fetch('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Gagal membuat pesanan')
  }

  return response.json()
}

export function useBooking() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] })
      toast.success('Booking Berhasil!', {
        description: 'Pesanan Anda telah diterima dan menunggu konfirmasi konsultan.'
      })
      router.push('/booking/success')
    },
    onError: (error: Error) => {
      toast.error('Gagal Membuat Booking', {
        description: error.message
      })
    }
  })
}
