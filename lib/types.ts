export interface Instructor {
  id: string
  display_name: string
  main_categories: string[]
  categories: string[]
  platforms: string[]
  price_min: number | null
  price_max: number | null
  youtube_url: string | null
  instagram_url: string | null
  thread_url: string | null
  is_verified: boolean
  verified_at: string | null
  verification_documents: string[]
  info_updated_at: string | null
  created_at: string
  verification_count?: number
}

export interface InstructorSummary {
  id: string
  display_name: string
  main_categories: string[]
  categories: string[]
  platforms: string[]
  youtube_url: string | null
  instagram_url: string | null
  thread_url: string | null
  is_verified: boolean
  verified_at: string | null
  verification_documents: string[]
  info_updated_at: string | null
  created_at: string
  course_count: number
  price_min: number | null
  price_max: number | null
  price_avg: number | null
  verification_count: number
}

export interface Course {
  id: string
  instructor_id: string
  title: string
  platform: string
  price: number
  url: string
  category?: string | null
  created_at: string
}

export interface VerificationRequest {
  id: string
  instructor_id: string
  user_id: string
  created_at: string
}

export interface InstructorRequest {
  id: string
  user_id: string
  user_email: string | null
  instructor_name: string
  course_url: string
  created_at: string
}
