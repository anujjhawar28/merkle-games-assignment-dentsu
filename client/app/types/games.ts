export type ApiNumeric = number | string | null

export interface Genre {
  id: number
  name: string
}

export interface Company {
  id: number
  name: string
}

export interface GameImage {
  id: number
  image_url?: string | null
  image_type?: string | null
}

export interface Review {
  id: number
  rating_score?: ApiNumeric
  rating?: ApiNumeric
  review_text?: string | null
  review_date?: string | null
  user?: { id: number; username: string } | null
}

export interface Game {
  id: number
  title: string
  description?: string | null
  release_date?: string | null
  platform?: string | null
  genre?: Genre | null
  developer?: Company | null
  publisher?: Company | null
  images?: GameImage[]
  reviews?: Review[]
  average_rating?: ApiNumeric
  total_reviews?: ApiNumeric
}

export interface ApiResource<T> {
  data: T
}

export interface GameStats {
  average_rating?: ApiNumeric
  total_reviews?: ApiNumeric
}

export interface FeaturedGame extends Game {
  average_rating: number
  total_reviews: number
}