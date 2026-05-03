import { useQuery } from '@tanstack/react-query'
import { Consultant } from '@/types'

interface FetchConsultantsParams {
  specialization?: string
  search?: string
}

async function fetchConsultants({ specialization, search }: FetchConsultantsParams = {}) {
  const params = new URLSearchParams()
  if (specialization) params.append('specialization', specialization)
  if (search) params.append('search', search)

  const response = await fetch(`/api/consultants?${params.toString()}`)
  if (!response.ok) {
    throw new Error('Gagal memuat daftar konsultan')
  }
  return response.json() as Promise<Consultant[]>
}

export function useConsultants(params: FetchConsultantsParams = {}) {
  return useQuery({
    queryKey: ['consultants', params],
    queryFn: () => fetchConsultants(params),
    staleTime: 1000 * 60 * 5, // 5 menit
  })
}
