import { useMutation } from '@tanstack/react-query'

interface RecommendationParams {
  topic: string
  budget: number
  time: string
}

async function fetchRecommendations(params: RecommendationParams) {
  const response = await fetch('/api/recommendations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })

  if (!response.ok) {
    throw new Error('Gagal mendapatkan rekomendasi')
  }

  return response.json()
}

export function useRecommendations() {
  return useMutation({
    mutationFn: fetchRecommendations,
  })
}
