import { Consultant } from '@/types'

export const MOCK_CONSULTANTS: (Consultant & { full_name: string, avatar_url: string, bio: string })[] = [
  {
    id: 'f1111111-1111-1111-1111-111111111111',
    profile_id: 'a1111111-1111-1111-1111-111111111111',
    full_name: 'Budi Arto, S.H., LL.M.',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Budi',
    bio: 'Pengacara spesialis hukum perdata dan korporat dengan pengalaman 10 tahun.',
    specializations: ['Hukum', 'Perdata', 'Korporat'],
    hourly_rate: 500000,
    rating: 4.9,
    is_available: true
  },
  {
    id: 'f2222222-2222-2222-2222-222222222222',
    profile_id: 'b2222222-2222-2222-2222-222222222222',
    full_name: 'Sari Keuangan, CFP',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sari',
    bio: 'Perencana keuangan bersertifikasi yang fokus pada manajemen kekayaan keluarga.',
    specializations: ['Keuangan', 'Investasi', 'Pajak'],
    hourly_rate: 350000,
    rating: 4.8,
    is_available: true
  },
  {
    id: 'f3333333-3333-3333-3333-333333333333',
    profile_id: 'c3333333-3333-3333-3333-333333333333',
    full_name: 'Dr. Andi Psikolog, M.Psi',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Andi',
    bio: 'Psikolog klinis berpengalaman menangani kesehatan mental remaja dan dewasa.',
    specializations: ['Psikologi', 'Kesehatan Mental'],
    hourly_rate: 300000,
    rating: 4.9,
    is_available: true
  },
  {
    id: 'f4444444-4444-4444-4444-444444444444',
    profile_id: 'd4444444-4444-4444-4444-444444444444',
    full_name: 'Maya Karir, HRD Professional',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya',
    bio: 'HR Consultant yang membantu ribuan orang mendapatkan pekerjaan impian.',
    specializations: ['Karir', 'HRD', 'Resume'],
    hourly_rate: 250000,
    rating: 4.7,
    is_available: true
  },
  {
    id: 'f5555555-5555-5555-5555-555555555555',
    profile_id: 'e5555555-5555-5555-5555-555555555555',
    full_name: 'Hendra Bisnis, MBA',
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hendra',
    bio: 'Serial entrepreneur yang siap membantu startup Anda tumbuh lebih cepat.',
    specializations: ['Bisnis', 'Startup', 'Strategi'],
    hourly_rate: 750000,
    rating: 5.0,
    is_available: true
  }
]
