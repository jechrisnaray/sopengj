import { getGroqRecommendations } from './groq'
import { scoreConsultants } from './scoring'
import { MOCK_CONSULTANTS } from '../data/mock-consultants'
import type {
  ConsultantForAI,
  RecommendationResult,
  RecommendationRequest,
} from '@/types'
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// In-memory cache: key = hash input, value = { result, expiry }
const cache = new Map<string, { result: RecommendationResult; expiry: number }>()
const CACHE_TTL = 60 * 60 * 1000 // 1 jam

function hashKey(req: RecommendationRequest): string {
  return `${req.problem.slice(0, 100)}_${req.budget ?? 0}`
}

// Ambil konsultan dari Convex
async function fetchConsultantsForAI(): Promise<ConsultantForAI[]> {
  try {
    const data = await convex.query(api.consultants.list, {});

    if (!data || data.length === 0) {
      throw new Error('No consultants found');
    }

    return data.map(c => ({
      id: c._id,
      fullName: c.fullName,
      specializations: c.specializations,
      experienceYears: c.experienceYears,
      rating: c.rating,
      totalReviews: c.totalReviews,
      hourlyRate: c.hourlyRate,
      isAvailable: c.isAvailable,
      languages: c.languages ?? ['Indonesia'],
    }))
  } catch (err) {
    console.warn('[AI] Using mock data for recommendation engine', err)
    return MOCK_CONSULTANTS.map(c => ({
      id: c.id,
      fullName: c.fullName,
      specializations: c.specializations,
      experienceYears: c.experienceYears,
      rating: c.rating,
      totalReviews: c.totalReviews,
      hourlyRate: c.hourlyRate,
      isAvailable: c.isAvailable,
      languages: ['Indonesia']
    }))
  }
}

// Main function: orkestrasi Groq + fallback
export async function getRecommendations(
  req: RecommendationRequest
): Promise<RecommendationResult> {
  const key = hashKey(req)

  // Cek cache
  const cached = cache.get(key)
  if (cached && cached.expiry > Date.now()) {
    return { ...cached.result, cached: true }
  }

  // Ambil data konsultan
  const consultants = await fetchConsultantsForAI()

  if (consultants.length === 0) {
    return {
      recommendations: [],
      source: 'manual',
      cached: false,
    }
  }

  let result: RecommendationResult

  // Coba Groq dulu
  try {
    const recommendations = await getGroqRecommendations(
      req.problem,
      consultants,
      req.budget
    )
    result = { recommendations, source: 'groq', cached: false }
  } catch (groqError) {
    console.warn('[AI] Groq gagal, fallback ke manual scoring:', groqError)

    // Fallback ke manual scoring
    const recommendations = scoreConsultants(
      consultants,
      req.problem,
      req.budget
    )
    result = { recommendations, source: 'manual', cached: false }
  }

  // Simpan ke cache
  cache.set(key, { result, expiry: Date.now() + CACHE_TTL })

  // Cleanup cache entries yang expired (jaga memory)
  if (cache.size > 100) {
    const now = Date.now()
    for (const [k, v] of cache.entries()) {
      if (v.expiry < now) cache.delete(k)
    }
  }

  return result
}
