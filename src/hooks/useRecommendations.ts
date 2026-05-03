import { useMutation } from '@tanstack/react-query'
import type { RecommendationResult, RecommendationRequest } from '@/types'

async function fetchRecommendations(
  req: RecommendationRequest
): Promise<RecommendationResult> {
  const res = await fetch('/api/ai/recommend', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error ?? 'Gagal mendapatkan rekomendasi')
  }

  return res.json()
}

export function useRecommendations() {
  return useMutation({
    mutationFn: fetchRecommendations,
    retry: 1,
  })
}
