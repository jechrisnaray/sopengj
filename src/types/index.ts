export type UserRole = 'user' | 'consultant' | 'admin';
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type ConsultationType = 'video' | 'chat' | 'phone';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  role: UserRole;
  bio?: string;
  created_at: string;
  updated_at: string;
}

export interface Consultant {
  id: string;
  profile_id: string;
  specialization: string[];
  experience_years: number;
  hourly_rate: number;
  rating: number;
  total_reviews: number;
  is_available: boolean;
  languages: string[];
  education?: string;
  certifications?: string[];
  consultation_types: ConsultationType[];
  created_at: string;
  profiles?: Profile; // Joined data
}

export interface Availability {
  id: string;
  consultant_id: string;
  day_of_week: number; // 0-6
  start_time: string;
  end_time: string;
  is_active: boolean;
}

export interface Booking {
  id: string;
  user_id: string;
  consultant_id: string;
  scheduled_at: string;
  duration_minutes: number;
  status: BookingStatus;
  consultation_type: ConsultationType;
  topic: string;
  notes?: string;
  total_price: number;
  meeting_url?: string;
  created_at: string;
  user_profile?: Profile; // Joined data
  consultants?: Consultant; // Joined data
}

export interface Review {
  id: string;
  booking_id: string;
  reviewer_id: string;
  consultant_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}
