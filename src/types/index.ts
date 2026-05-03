export type UserRole = 'user' | 'consultant' | 'admin';
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';
export type ConsultationType = 'video' | 'chat' | 'phone';

export interface Profile {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  role: UserRole;
  bio?: string;
  phone?: string;
  createdAt: number;
}

export interface Consultant {
  id: string;
  profileId: string;
  specializations: string[];
  experienceYears: number;
  hourlyRate: number;
  rating: number;
  totalReviews: number;
  isAvailable: boolean;
  languages?: string[];
  bio: string;
  about?: string;
  location?: string;
  fullName?: string; // Flattened
  avatarUrl?: string; // Flattened
}

export interface Availability {
  id: string;
  consultantId: string;
  dayOfWeek: number; // 0-6
  slots: { start: string; end: string }[];
  isActive: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  consultantId: string;
  scheduledAt: string;
  durationMinutes: number;
  status: BookingStatus;
  topic: string;
  notes?: string;
  totalPrice: number;
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  meetingLink?: string;
  createdAt: number;
  consultantName?: string; // Flattened
  consultantAvatar?: string; // Flattened
  userName?: string; // Flattened
  userAvatar?: string; // Flattened
}

export interface Review {
  id: string;
  bookingId: string;
  userId: string;
  consultantId: string;
  rating: number;
  comment: string;
  createdAt: number;
  userName?: string;
  userAvatar?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  type: string;
  link?: string;
  createdAt: number;
}

export interface Message {
  id: string;
  bookingId: string;
  senderId: string;
  content: string;
  type: 'text' | 'file' | 'system';
  fileUrl?: string;
  createdAt: number;
}

// AI Recommendation types
export interface ConsultantForAI {
  id: string
  fullName: string
  specializations: string[]
  experienceYears: number
  rating: number
  totalReviews: number
  hourlyRate: number
  isAvailable: boolean
  languages: string[]
}

export interface AIRecommendation {
  consultantId: string
  score: number
  reason: string 
  matchedKeywords: string[]
}

export interface RecommendationResult {
  recommendations: AIRecommendation[]
  source: 'groq' | 'manual'
  cached: boolean
}

export interface RecommendationRequest {
  problem: string
  budget?: number
  preferOnline?: boolean
}
