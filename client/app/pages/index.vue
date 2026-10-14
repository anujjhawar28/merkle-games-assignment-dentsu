<script setup lang="ts">
import { computed, ref } from 'vue'
import { mergeStats, sortGames, selectRandomIds } from '../utils/games'
import type { FeaturedGame, GameStats } from '../types/games'

useSeoMeta({
  title: 'Discover games',
  description: 'Browse a hand-picked random selection of games released from 2015 to 2017.'
})

const api = useGamesApi()
const search = ref('')
const genre = ref('all')
const sortBy = ref<'rating' | 'date'>('rating')

const { data: games, pending, error, refresh } = await useAsyncData<FeaturedGame[]>(
  'featured-games',
  async () => {
    const ids = await api.getIdsByDateRange('2015-01-01', '2017-12-31')
    const selected = selectRandomIds(ids, 15)
    const records = await Promise.all(selected.map(async (id) => {
      const [game, stats] = await Promise.all([
        api.getGame(id),
        api.getStats(id).catch(() => ({} as GameStats))
      ])
      return mergeStats(game, stats)
    }))
    return sortGames(records, 'rating')
  },
  { default: () => [] }
)

const genres = computed(() => [...new Set((games.value ?? [])
  .map(game => game.genre?.name)
  .filter((name): name is string => Boolean(name)))].sort((a, b) => a.localeCompare(b)))

const visibleGames = computed(() => {
  const query = search.value.trim().toLocaleLowerCase()
  return sortGames((games.value ?? []).filter((game) => {
    const matchesSearch = !query || game.title.toLocaleLowerCase().includes(query)
    const matchesGenre = genre.value === 'all' || game.genre?.name === genre.value
    return matchesSearch && matchesGenre
  }), sortBy.value)
})

function retry() {
  refresh()
}
</script>

<template>
  <div class="site-shell">
    <a class="skip-link" href="#main-content">Skip to games</a>
    <header class="site-header">
      <NuxtLink class="brand" to="/" aria-label="Merkle Games home">
        <span class="brand__mark" aria-hidden="true">M</span>
        <span>MERKLE<span class="brand__light"> / GAMES</span></span>
      </NuxtLink>
      <span class="header-note">THE 2015–17 ARCHIVE <i aria-hidden="true" /></span>
    </header>

    <main id="main-content" class="browse-main">
      <section class="browse-intro" aria-labelledby="page-title">
        <div>
          <p class="eyebrow"><span>FIELD NOTES</span> · VOL. 01</p>
          <h1 id="page-title">A few great<br><em>games.</em></h1>
        </div>
        <p class="intro-copy">Fifteen picks from a remarkable stretch in games. Browse the archive, find your next favorite.</p>
        <div class="intro-stamp" aria-hidden="true"><span>2015</span><b>—</b><span>2017</span></div>
      </section>

      <section class="library" aria-labelledby="library-heading">
        <div class="library-heading">
          <div>
            <p class="eyebrow">THE COLLECTION</p>
            <h2 id="library-heading">Selected games <span>{{ games.length.toString().padStart(2, '0') }}</span></h2>
          </div>
          <p class="sort-caption">SORTED BY <strong>{{ sortBy === 'rating' ? 'COMMUNITY RATING' : 'RELEASE DATE' }}</strong></p>
        </div>

        <form class="controls" role="search" @submit.prevent>
          <label class="search-control">
            <span class="sr-only">Search games by title</span>
            <span class="search-glyph" aria-hidden="true">⌕</span>
            <input v-model="search" type="search" placeholder="Find a game..." autocomplete="off">
          </label>
          <label class="select-control">
            <span class="sr-only">Filter by genre</span>
            <select v-model="genre">
              <option value="all">All genres</option>
              <option v-for="name in genres" :key="name" :value="name">{{ name }}</option>
            </select>
          </label>
          <fieldset class="sort-control">
            <legend class="sr-only">Sort games</legend>
            <button type="button" :aria-pressed="sortBy === 'rating'" @click="sortBy = 'rating'">Top rated</button>
            <button type="button" :aria-pressed="sortBy === 'date'" @click="sortBy = 'date'">Latest</button>
          </fieldset>
        </form>

        <output v-if="pending" class="status-panel" aria-live="polite">
          <span class="loading-mark" aria-hidden="true" />
          <span class="status-panel__message">Gathering the collection<span class="loading-dots">...</span></span>
        </output>
        <div v-else-if="error" class="status-panel status-panel--error" role="alert">
          <p class="eyebrow">CONNECTION INTERRUPTED</p>
          <h3>The archive didn’t load.</h3>
          <p>Check that the Games API is running, then try again.</p>
          <button class="text-button" type="button" @click="retry">Try again <span aria-hidden="true">↗</span></button>
        </div>
        <div v-else-if="visibleGames.length" class="game-grid">
          <GameCard v-for="(game, index) in visibleGames" :key="game.id" :game="game" :style="{ '--card-order': index }" />
        </div>
        <div v-else class="empty-state">
          <p class="eyebrow">NO MATCHES</p>
          <h3>Nothing in this corner of the archive.</h3>
          <button class="text-button" type="button" @click="search = ''; genre = 'all'">Clear filters <span aria-hidden="true">↗</span></button>
        </div>
      </section>
    </main>

    <footer class="site-footer">
      <span>MERKLE GAMES <span class="footer-dot">●</span> A SMALL ARCHIVE OF BIG WORLDS</span>
      <a href="http://localhost:8000/api-docs" target="_blank" rel="noreferrer">API NOTES <span aria-hidden="true">↗</span></a>
    </footer>
  </div>
</template>