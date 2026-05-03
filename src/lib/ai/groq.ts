import Groq from 'groq-sdk'
import type { ConsultantForAI, AIRecommendation } from '@/types'

// Lazy init — hanya dibuat saat pertama kali dipanggil
let groqClient: Groq | null = null

function getGroqClient(): Groq {
  if (!groqClient) {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY tidak ditemukan di environment variables')
    }
    groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY })
  }
  return groqClient
}

export async function getGroqRecommendations(
  problem: string,
  consultants: ConsultantForAI[],
  budget?: number
): Promise<AIRecommendation[]> {
  const groq = getGroqClient()

  const consultantList = consultants.map(c => ({
    id: c.id,
    nama: c.fullName,
    spesialisasi: c.specializations,
    pengalaman: `${c.experienceYears} tahun`,
    rating: c.rating,
    totalUlasan: c.totalReviews,
    hargaPerJam: c.hourlyRate,
    tersedia: c.isAvailable,
  }))

  const systemPrompt = `Kamu adalah sistem rekomendasi konsultan profesional untuk platform KonsulIn Indonesia.
Tugasmu adalah menganalisis masalah yang dideskripsikan user dan merekomendasikan 3 konsultan terbaik dari daftar yang tersedia.
Jawab HANYA dengan JSON valid, tanpa teks tambahan, tanpa markdown, tanpa backtick.`

  const userPrompt = `Masalah user: "${problem}"
${budget ? `Budget maksimal: Rp ${budget.toLocaleString('id-ID')}/jam` : ''}

Daftar konsultan tersedia:
${JSON.stringify(consultantList, null, 2)}

Berikan rekomendasi dalam format JSON ini PERSIS:
{
  "recommendations": [
    {
      "consultantId": "uuid-konsultan",
      "score": 85,
      "reason": "Alasan singkat dalam Bahasa Indonesia, maksimal 2 kalimat mengapa konsultan ini cocok.",
      "matchedKeywords": ["keyword1", "keyword2"]
    }
  ]
}

Rules:
- Pilih tepat 3 konsultan terbaik
- Prioritaskan yang tersedia (tersedia: true)
- Score 0-100, lebih tinggi = lebih cocok
- Reason dalam Bahasa Indonesia yang natural dan meyakinkan
- Jika budget ada, hindari konsultan yang harganya jauh melampaui budget`

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.3,
    max_tokens: 1000,
    response_format: { type: 'json_object' },
  })

  const content = response.choices[0]?.message?.content
  if (!content) throw new Error('Groq mengembalikan response kosong')

  const parsed = JSON.parse(content)

  if (!parsed.recommendations || !Array.isArray(parsed.recommendations)) {
    throw new Error('Format response Groq tidak valid')
  }

  // Validasi: pastikan consultantId valid
  const validIds = new Set(consultants.map(c => c.id))
  const valid = parsed.recommendations.filter((r: AIRecommendation) =>
    validIds.has(r.consultantId)
  )

  if (valid.length === 0) throw new Error('Tidak ada rekomendasi valid dari Groq')

  return valid.slice(0, 3)
}
