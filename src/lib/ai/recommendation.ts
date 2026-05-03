import { getAIRecommendations } from './groq'
import { ConsultantData, scoreConsultants } from './scoring'
import { Consultant, Profile } from '@/types'

interface UserNeeds {
  topic: string
  budget?: number
  preferredTime?: 'pagi' | 'siang' | 'sore' | 'malam'
}

export async function getRecommendations(needs: UserNeeds, consultants: Consultant[]) {
  try {
    // 1. Coba gunakan AI (Groq)
    console.log('Fetching AI recommendation from Groq...')
    const data = consultants.map(c => ({
      ...c,
      full_name: (c as any).profiles?.full_name || 'Konsultan',
      avatar_url: (c as any).profiles?.avatar_url || ''
    })) as ConsultantData[]

    const aiResult = await getAIRecommendations(needs, data)
    
    if (aiResult.recommendations && aiResult.recommendations.length > 0) {
      return aiResult.recommendations
    }
    
    throw new Error('AI returned empty result')
  } catch (error) {
    // 2. Fallback ke scoring manual jika AI gagal
    console.warn('AI Recommendation failed, falling back to manual scoring:', error)
    return scoreConsultants(needs, consultants.map(c => ({
      ...c,
      full_name: (c as any).profiles?.full_name || 'Konsultan',
      avatar_url: (c as any).profiles?.avatar_url || ''
    })) as ConsultantData[])
  }
}
