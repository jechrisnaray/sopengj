export const SITE_CONFIG = {
  name: 'KonsulIn',
  description: 'Platform Konsultasi Online No. 1 di Indonesia',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
}

export const CATEGORIES = [
  'Hukum',
  'Keuangan',
  'Psikologi',
  'Karir',
  'Bisnis',
  'Kesehatan',
  'Lainnya'
]

export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
}

export const SESSION_DURATIONS = [
  { label: '30 Menit', value: 30 },
  { label: '60 Menit', value: 60 },
  { label: '90 Menit', value: 90 }
]

export const ROLES = {
  USER: 'user',
  CONSULTANT: 'consultant',
  ADMIN: 'admin'
}
