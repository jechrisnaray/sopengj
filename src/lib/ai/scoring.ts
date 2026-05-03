import type { ConsultantForAI, AIRecommendation } from '@/types'

// Keyword mapping per kategori masalah
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  hukum: ['hukum', 'hukm', 'legal', 'kontrak', 'perjanjian', 'gugatan', 'pidana', 'perdata', 'advokat', 'pengacara', 'sengketa', 'warisan', 'perceraian', 'perusahaan'],
  keuangan: ['keuangan', 'investasi', 'saham', 'reksa dana', 'pajak', 'utang', 'pinjaman', 'asuransi', 'perencanaan keuangan', 'tabungan', 'pensiun', 'kripto', 'modal'],
  psikologi: ['psikologi', 'stress', 'stres', 'anxiety', 'cemas', 'depresi', 'mental', 'trauma', 'hubungan', 'keluarga', 'motivasi', 'karir', 'burnout', 'self', 'emosi'],
  bisnis: ['bisnis', 'usaha', 'startup', 'pemasaran', 'marketing', 'manajemen', 'operasional', 'strategi', 'brand', 'produk', 'pelanggan', 'revenue', 'profit', 'ukm'],
  teknologi: ['teknologi', 'software', 'aplikasi', 'website', 'programming', 'it', 'digital', 'data', 'keamanan', 'cyber', 'cloud', 'ai', 'sistem'],
  kesehatan: ['kesehatan', 'medis', 'dokter', 'gizi', 'nutrisi', 'diet', 'olahraga', 'penyakit', 'obat', 'terapi', 'fisik'],
  pendidikan: ['pendidikan', 'belajar', 'kuliah', 'sekolah', 'karir', 'beasiswa', 'cv', 'interview', 'kerja', 'skill'],
}

// Ekstrak keyword dari teks masalah user
function extractKeywords(problem: string): string[] {
  const lower = problem.toLowerCase()
  const found: string[] = []

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        found.push(kw)
        if (!found.includes(category)) found.push(category)
      }
    }
  }

  return [...new Set(found)]
}

// Hitung score 0-100 untuk satu konsultan
function scoreOne(
  consultant: ConsultantForAI,
  keywords: string[],
  budget?: number
): number {
  let score = 0

  // 1. Keyword match dalam spesialisasi (max 40 poin)
  const specializationText = consultant.specializations
    .join(' ')
    .toLowerCase()
  const matchCount = keywords.filter(kw =>
    specializationText.includes(kw)
  ).length
  score += Math.min(matchCount * 10, 40)

  // 2. Rating (max 25 poin)
  score += (consultant.rating / 5) * 25

  // 3. Pengalaman (max 15 poin)
  score += Math.min(consultant.experienceYears * 1.5, 15)

  // 4. Ketersediaan (10 poin)
  if (consultant.isAvailable) score += 10

  // 5. Jumlah review sebagai social proof (max 10 poin)
  score += Math.min(consultant.totalReviews * 0.5, 10)

  // 6. Filter budget — kurangi score jika melebihi budget
  if (budget && consultant.hourlyRate > budget) {
    score -= 20
  }

  return Math.max(0, Math.min(100, score))
}

// Buat alasan dalam Bahasa Indonesia
function buildReason(
  consultant: ConsultantForAI,
  keywords: string[],
  score: number
): string {
  const matched = keywords.filter(kw =>
    consultant.specializations.join(' ').toLowerCase().includes(kw)
  )

  const parts: string[] = []

  if (matched.length > 0) {
    parts.push(`Spesialisasi di bidang ${matched.slice(0, 2).join(' dan ')}`)
  }

  if (consultant.experienceYears >= 5) {
    parts.push(`berpengalaman ${consultant.experienceYears} tahun`)
  }

  if (consultant.rating >= 4.5) {
    parts.push(`rating tinggi ${consultant.rating.toFixed(1)}/5`)
  } else if (consultant.rating >= 4.0) {
    parts.push(`rating ${consultant.rating.toFixed(1)}/5`)
  }

  if (consultant.totalReviews >= 20) {
    parts.push(`${consultant.totalReviews} ulasan positif`)
  }

  if (parts.length === 0) {
    return 'Konsultan yang tersedia dan sesuai dengan kebutuhan Anda.'
  }

  return parts.join(', ') + '.'
}

// Main function: scoring manual untuk semua konsultan
export function scoreConsultants(
  consultants: ConsultantForAI[],
  problem: string,
  budget?: number
): AIRecommendation[] {
  const keywords = extractKeywords(problem)

  const scored = consultants.map(c => {
    const score = scoreOne(c, keywords, budget)
    return {
      consultantId: c.id,
      score,
      reason: buildReason(c, keywords, score),
      matchedKeywords: keywords.filter(kw =>
        c.specializations.join(' ').toLowerCase().includes(kw)
      ),
    }
  })

  // Sort descending, ambil top 3
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
}
