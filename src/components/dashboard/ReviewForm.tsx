'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Star } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils/cn'

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      toast.error('Silakan pilih rating bintang terlebih dahulu')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          booking_id: bookingId,
          consultant_id: consultantId,
          rating,
          comment
        })
      })

      if (!response.ok) throw new Error('Gagal mengirim review')

      toast.success('Terima kasih!', { description: 'Review Anda telah dipublikasikan.' })
      onSuccess?.()
    } catch (error) {
      toast.error('Gagal mengirim review')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-1">
      <div className="text-center space-y-2">
        <Label className="text-lg font-bold">Berikan Rating</Label>
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="focus:outline-none transition-transform hover:scale-110"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
            >
              <Star
                className={cn(
                  "h-10 w-10 transition-colors",
                  (hover || rating) >= star 
                    ? "fill-amber-400 text-amber-400" 
                    : "text-slate-300"
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="comment">Pengalaman Anda (Opsional)</Label>
        <Textarea
          id="comment"
          placeholder="Ceritakan pengalaman Anda berkonsultasi..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="min-h-[120px] border-slate-200 focus:ring-blue-500"
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-700"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Mengirim...' : 'Kirim Review'}
      </Button>
    </form>
  )
}
