'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Star } from 'lucide-react'
import { toast } from 'sonner'

interface ReviewFormProps {
  bookingId: string
  consultantId: string
  onSuccess?: () => void
}

export function ReviewForm({ bookingId, consultantId, onSuccess }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClient()

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error('Silakan pilih rating bintang')
      return
    }

    setIsSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Unauthorized')

      // 1. Insert Review
      const { error: reviewError } = await supabase
        .from('reviews')
        .insert({
          booking_id: bookingId,
          reviewer_id: user.id,
          consultant_id: consultantId,
          rating,
          comment
        })
      
      if (reviewError) throw reviewError

      // 2. Trigger rating recalculation logic (simulated here)
      // In production, best use a DB function or background worker
      toast.success('Terima kasih atas review Anda!')
      if (onSuccess) onSuccess()
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-white">
      <h3 className="font-bold text-center">Beri Penilaian Sesi</h3>
      
      <div className="flex justify-center gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="focus:outline-none"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
          >
            <Star
              className={`h-8 w-8 transition-colors ${
                (hover || rating) >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
              }`}
            />
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <Textarea
          placeholder="Tuliskan pengalaman Anda berkonsultasi..."
          value={comment}
          onChange={(e) => setComment(e.target.value.slice(0, 500))}
          className="min-h-[100px]"
        />
        <p className="text-right text-[10px] text-slate-400">{comment.length}/500</p>
      </div>

      <Button 
        className="w-full bg-blue-600 hover:bg-blue-700" 
        onClick={handleSubmit} 
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Mengirim...' : 'Kirim Review'}
      </Button>
    </div>
  )
}
