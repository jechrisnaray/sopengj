'use client'

import { useRouter } from 'next/navigation'

interface BookingButtonProps {
  consultantId: string
  isLoggedIn: boolean
}

export function BookingButton({ consultantId, isLoggedIn }: BookingButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (!isLoggedIn) {
      router.push(`/login?redirectTo=/booking/${consultantId}`)
      return
    }
    router.push(`/booking/${consultantId}`)
  }

  return (
    <button
      onClick={handleClick}
      className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl transition"
    >
      {isLoggedIn ? 'Booking Sekarang' : 'Masuk untuk Booking'}
    </button>
  )
}
