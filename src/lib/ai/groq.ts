import Groq from 'groq-sdk'
import { ConsultantData, ConsultantScore, scoreConsultants, UserNeeds } from './scoring'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

interface RecommendationResponse {
  recommendations: {
    consultant_id: string
    match_score: number
    reasons: string[]
    best_time_suggestion: string
    personalized_message: string
  }[]
  general_tip: string
}

export async function getAIRecommendations(
  needs: UserNeeds,
  consultants: ConsultantData[]
): Promise<{ recommendations: ConsultantScore[], generalTip: string, isFallback: boolean }> {
  try {
    const prompt = `
      SYSTEM:
      Kamu adalah asisten rekomendasi konsultan profesional yang berbahasa Indonesia. 
      Tugasmu menganalisis kebutuhan user dan mencocokkan dengan daftar konsultan yang tersedia.
      Selalu return dalam format JSON yang valid, tidak ada teks lain.

      USER:
      Kebutuhan user: ${needs.topic}
      Budget per jam: ${needs.budget ? `Rp ${needs.budget}` : 'Tidak ditentukan'}
      Preferensi waktu: ${needs.preferredTime || 'Fleksibel'}

      Daftar konsultan tersedia:
      ${JSON.stringify(consultants.map(c => ({
        id: c.id,
        name: c.full_name,
        specs: c.specializations,
        rate: c.hourly_rate,
        rating: c.rating
      })))}

      Pilih TOP 3 konsultan yang paling cocok. Format response:
      {
        "recommendations": [
          {
            "consultant_id": "string",
            "match_score": 0-100,
            "reasons": ["string"],
            "best_time_suggestion": "string",
            "personalized_message": "string"
          }
        ],
        "general_tip": "string"
      }
    `

    const completion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      response_format: { type: 'json_object' },
    })

    const responseContent = completion.choices[0]?.message?.content
    if (!responseContent) throw new Error('Empty response from AI')

    const data = JSON.parse(responseContent) as RecommendationResponse

    return {
      recommendations: data.recommendations.map(r => ({
        consultant_id: r.consultant_id,
        score: r.match_score,
        reasons: r.reasons,
        best_slots: [r.best_time_suggestion],
        personalized_message: r.personalized_message
      })),
      generalTip: data.general_tip,
      isFallback: false
    }

  } catch (error: any) {
    console.error('Groq API Error, falling back to manual scoring:', error)
    
    // Menggunakan algoritma manual sebagai fallback
    const manualResults = scoreConsultants(needs, consultants).slice(0, 3)
    
    return {
      recommendations: manualResults,
      generalTip: 'Tetap tenang dan siapkan daftar pertanyaan Anda sebelum sesi dimulai.',
      isFallback: true
    }
  }
}
