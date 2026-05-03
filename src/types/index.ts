export type UserRole = 'user' | 'consultant' | 'admin'

export interface Profile {
  id: string
  full_name: string
  avatar_url?: string
  bio?: string
  role: UserRole
  created_at: string
}

export interface Consultant {
  id: string
  profile_id: string
  specializations: string[]
  hourly_rate: number
  rating: number
  is_available: boolean
  profiles?: Profile // Join data
}

export interface Booking {
  id: string
  user_id: string
  consultant_id: string
  scheduled_at: string
  duration_minutes: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  total_price: number
  topic: string
  notes?: string
  created_at: string
  consultants?: Consultant & { profiles: Profile } // Join data
}

export interface Availability {
  id: string
  consultant_id: string
  day_of_week: number // 0-6
  start_time: string // HH:mm
  end_time: string // HH:mm
  is_active: boolean
}
