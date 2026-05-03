export interface UserNeeds {
  topic: string
  budget?: number
  preferredTime?: 'pagi' | 'siang' | 'sore' | 'malam'
  language?: string
}

export interface ConsultantData {
  id: string
  full_name: string
  specializations: string[]
  hourly_rate: number
  rating: number
  is_available: boolean
  avatar_url?: string
  availability?: Array<{
    day_of_week: number
    start_time: string
    end_time: string
  }>
}

export interface ConsultantScore {
  consultant_id: string
  score: number
  reasons: string[]
  best_slots: string[]
  personalized_message?: string
}

export function scoreConsultants(
  needs: UserNeeds,
  consultants: ConsultantData[]
): ConsultantScore[] {
  return consultants.map((c) => {
    let score = 0
    const reasons: string[] = []
    const topicLower = needs.topic.toLowerCase()

    // 1. Kecocokan Spesialisasi (40 poin)
    const matches = c.specializations.filter((spec) =>
      topicLower.includes(spec.toLowerCase())
    )
    
    if (matches.length > 0) {
      const isFullMatch = c.specializations.some(s => s.toLowerCase() === topicLower)
      const points = isFullMatch ? 40 : 20
      score += points
      reasons.push(isFullMatch ? 'Keahlian sangat sesuai dengan topik Anda' : 'Memiliki spesialisasi yang relevan')
    }

    // 2. Rating Konsultan (30 poin)
    const ratingPoints = Math.round(c.rating * 6)
    score += ratingPoints
    if (c.rating >= 4.5) reasons.push('Konsultan dengan rating sangat tinggi')

    // 3. Kesesuaian Budget (20 poin)
    if (needs.budget) {
      if (c.hourly_rate <= needs.budget) {
        score += 20
        reasons.push('Sesuai dengan budget Anda')
      } else if (c.hourly_rate <= needs.budget * 1.2) {
        score += 10
        reasons.push('Sedikit di atas budget, namun kualitas sebanding')
      }
    } else {
      score += 10 // Default
    }

    // 4. Ketersediaan (10 poin)
    if (c.is_available) {
      score += 10
      reasons.push('Tersedia untuk sesi segera')
    }

    // Saran Waktu Terbaik
    const best_slots = getBestSlots(c.availability || [], needs.preferredTime)

    return {
      consultant_id: c.id,
      score: Math.min(score, 100),
      reasons,
      best_slots,
      personalized_message: `Berdasarkan algoritma kami, ${c.full_name} adalah pilihan yang solid untuk membantu Anda.`
    }
  }).sort((a, b) => b.score - a.score)
}

function getBestSlots(availability: any[], preferredTime?: string): string[] {
  if (availability.length === 0) return ['Jadwal fleksibel']
  
  const timeRanges: Record<string, { start: string, end: string }> = {
    pagi: { start: '06:00', end: '11:59' },
    siang: { start: '12:00', end: '14:59' },
    sore: { start: '15:00', end: '17:59' },
    malam: { start: '18:00', end: '21:59' },
  }

  const range = preferredTime ? timeRanges[preferredTime] : null
  
  const slots = availability
    .filter(slot => {
      if (!range) return true
      return slot.start_time >= range.start && slot.start_time <= range.end
    })
    .map(slot => `${getDayName(slot.day_of_week)}, ${slot.start_time.slice(0, 5)}`)
    .slice(0, 3)

  return slots.length > 0 ? slots : ['Cek ketersediaan di profil']
}

function getDayName(day: number): string {
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
  return days[day]
}
