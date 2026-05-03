export const APP_NAME = 'KonsulIn';
export const APP_DESCRIPTION = 'Platform Konsultasi Online Terpercaya';

export const RATE_LIMITS = {
  GROQ_DAILY_MAX: 14400,
  GEMINI_DAILY_MAX: 1500,
  CACHE_TTL_SECONDS: 3600, // 1 jam
} as const;

export const CATEGORIES = [
  'Hukum',
  'Keuangan',
  'Psikologi',
  'Karir',
  'Bisnis',
  'Teknologi',
  'Kesehatan',
  'Pendidikan'
] as const;

export const CONSULTATION_TYPES = [
  { value: 'video', label: 'Video Call' },
  { value: 'chat', label: 'Chat' },
  { value: 'phone', label: 'Telepon' }
] as const;

export const BOOKING_DURATIONS = [30, 60, 90] as const;
