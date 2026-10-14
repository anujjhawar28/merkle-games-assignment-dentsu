<script setup lang="ts">
import { computed, ref } from 'vue'
import { API_ERROR_FALLBACK, GAME_CONFIG, SITE_CONFIG } from '@/constants'
import type { FeaturedGame } from '@/types/games'
import { useGameSort } from '@/composables/useGameSort'
import { getApiErrorMessage } from '@/utils/api/fetchWithRetry'
import { mergeStats, selectRandomIds } from '@/utils/games'

useSeoMeta({
  title: 'Discover games',
  description: SITE_CONFIG.description
})

const api = useGamesApi()
const search = ref('')
const genre = ref(GAME_CONFIG.allGenresFilter)

const { data: games, pending, error, refresh } = await useLazyAsyncData<FeaturedGame[]>(
  GAME_CONFIG.featuredDataKey,
  async () => {
    const ids = await api.getIdsByDateRange(GAME_CONFIG.releaseDateFrom, GAME_CONFIG.releaseDateTo)
    const selectedIds = selectRandomIds(ids, GAME_CONFIG.featuredCount)
    const records = await Promise.all(selectedIds.map(async (id) => {
      const [game, stats] = await Promise.all([api.getGame(id), api.getStats(id)])
      return mergeStats(game, stats)
    }))
    return records
  },
  { default: () => [] }
)

const genres = computed(() => [...new Set((games.value ?? [])
  .map(game => game.genre?.name)
  .filter((name): name is string => Boolean(name)))].sort((left, right) => left.localeCompare(right)))

const filteredGames = computed(() => {
  const query = search.value.trim().toLocaleLowerCase()
  return (games.value ?? []).filter((game) => {
    const matchesTitle = !query || game.title.toLocaleLowerCase().includes(query)
    const matchesGenre = genre.value === GAME_CONFIG.allGenresFilter || game.genre?.name === genre.value
    return matchesTitle && matchesGenre
  })
})

const { sortBy, sortedGames } = useGameSort(filteredGames)
const errorMessage = computed(() => error.value
  ? getApiErrorMessage(error.value, API_ERROR_FALLBACK.gameList)
  : '')

function retry() {
  return refresh()
}
</script>

<template>
  <main id="main-content" class="browse-main">
    <section class="browse-intro" aria-labelledby="page-title">
      <div>
        <EyebrowLabel><span>FIELD NOTES</span> · VOL. 01</EyebrowLabel>
        <h1 id="page-title">A few great<br><em>games.</em></h1>
      </div>
      <p class="intro-copy">Fifteen picks from a remarkable stretch in games. Browse the archive, find your next
        favorite.</p>
      <div class="intro-stamp" aria-hidden="true"><span>2015</span><b>—</b><span>2017</span></div>
    </section>

    <section class="library" aria-labelledby="library-heading">
      <SectionHeading heading-id="library-heading" eyebrow="THE COLLECTION" title="Selected games"
        :count="games.length.toString().padStart(2, '0')" size="compact">
        <template #trailing>
          <p class="sort-caption">SORTED BY <strong>{{ sortBy === 'rating' ? 'COMMUNITY RATING' : 'RELEASE DATE'
              }}</strong></p>
        </template>
      </SectionHeading>

      <GameBrowserControls v-model:search="search" v-model:genre="genre" v-model:sort-by="sortBy" :genres="genres"
        :all-genres-filter="GAME_CONFIG.allGenresFilter" />

      <GameGridSkeleton v-if="pending" />
      <FeedbackPanel v-else-if="error" kind="error" eyebrow="CONNECTION INTERRUPTED" title="The archive didn’t load."
        :message="errorMessage">
        <template #actions>
          <button class="text-button" type="button" @click="retry">Try again <span aria-hidden="true">↗</span></button>
        </template>
      </FeedbackPanel>
      <div v-else-if="sortedGames.length" class="game-grid">
        <LazyGameCard v-for="(game, index) in sortedGames" :key="game.id" :game="game"
          :style="{ '--card-order': index }" />
      </div>
      <FeedbackPanel v-else eyebrow="NO MATCHES" title="Nothing in this corner of the archive.">
        <template #actions>
          <button class="text-button" type="button" @click="search = ''; genre = GAME_CONFIG.allGenresFilter">
            Clear filters <span aria-hidden="true">↗</span>
          </button>
        </template>
      </FeedbackPanel>
    </section>
  </main>
</template>

<style scoped lang="scss">
.browse-intro {
  position: relative;
  min-height: 328px;
  display: flex;
  align-items: end;
  justify-content: space-between;
  padding: 58px var(--section-gutter) 52px;
  overflow: hidden;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-intro) radial-gradient(var(--color-pattern) .7px, transparent .7px) 0 0 / 12px 12px;
}

.browse-intro::after {
  content: '';
  position: absolute;
  top: -175px;
  right: 15%;
  width: 310px;
  aspect-ratio: 1;
  border: 1px solid rgb(var(--color-accent-rgb) / 26%);
  border-radius: 50%;
  box-shadow: 0 0 0 26px rgb(var(--color-accent-rgb) / 3.5%), 0 0 0 58px rgb(var(--color-accent-rgb) / 3.5%);
  pointer-events: none;
}

.browse-intro h1 {
  margin: 0;
  font: 400 clamp(52px, 6vw, 78px)/.92 var(--font-display);
}

.browse-intro h1 em {
  color: var(--color-accent);
  font-weight: 400;
}

.intro-copy {
  z-index: 1;
  width: min(260px, 27%);
  margin: 0 4% 6px auto;
  color: var(--color-intro-text);
  font-size: 15px;
}

.intro-stamp {
  z-index: 1;
  position: absolute;
  top: 48px;
  right: var(--section-gutter);
  display: flex;
  align-items: center;
  gap: 9px;
  color: var(--color-accent);
  font: 18px var(--font-display);
}

.intro-stamp b {
  color: var(--color-accent-strong);
  font: 15px var(--font-body);
}

.library {
  padding: 51px var(--section-gutter) 74px;
}

.sort-caption {
  margin: 0 0 5px;
  color: var(--color-text-muted);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.4px;
}

.sort-caption strong {
  color: var(--color-text);
}

.game-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 31px 22px;
}

@media (max-width: 900px) {

  .browse-intro,
  .library {
    padding-inline: 4%;
  }

  .game-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 27px 18px;
  }
}

@media (max-width: 620px) {
  .browse-intro {
    min-height: 300px;
    align-items: start;
    flex-direction: column;
    justify-content: flex-end;
    padding: 50px 6% 45px;
  }

  .browse-intro h1 {
    font-size: 60px;
  }

  .browse-intro::after {
    top: -150px;
    right: -70px;
    width: 260px;
  }

  .intro-copy {
    width: min(270px, 90%);
    margin: 18px 0 0;
    font-size: 14px;
  }

  .intro-stamp {
    top: 29px;
    right: 7%;
    font-size: 15px;
  }

  .library {
    padding: 39px 2% 52px;
  }

  .sort-caption {
    display: none;
  }

  .game-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }
}
</style>
