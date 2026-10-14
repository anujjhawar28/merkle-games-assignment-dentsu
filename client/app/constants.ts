export const SITE_CONFIG = {
  name: 'Merkle Games',
  titleTemplate: '%s | Merkle Games',
  description: 'Discover standout games released between 2015 and 2017.',
  themeColor: '#f3f4ef'
} as const

export const GAME_CONFIG = {
  releaseDateFrom: '2015-01-01',
  releaseDateTo: '2017-12-31',
  featuredCount: 15,
  skeletonCount: 6,
  featuredDataKey: 'featured-games',
  detailDataKeyPrefix: 'game-',
  defaultSort: 'rating',
  allGenresFilter: 'all'
} as const

export const API_ERROR_FALLBACK = {
  gameList: 'The games could not be loaded. Please try again.',
  gameDetails: 'The game details could not be loaded. Please try again.'
} as const

export const API_CONFIG = {
  defaultBaseUrl: 'http://localhost:8000/api/v1',
  maxRetries: 2,
  retryDelayMs: 300,
  timeoutMs: 10_000,
  gamesPath: '/games',
  gameIdsByDateRangePath: '/games/by-date-range',
  gameStatsPath: '/stats'
} as const

export const FORMAT_CONFIG = {
  archiveNumberDigits: 4,
  figureNumberDigits: 2,
  locale: 'en'
} as const

export const APP_PATHS = {
  home: '/',
  games: '/games',
  gameDetails: (id: number) => `/games/${id}`,
  gameImageFallback: '/game-fallback.svg'
} as const
