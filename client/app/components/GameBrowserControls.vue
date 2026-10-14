<script setup lang="ts">
defineProps<{
  genres: string[]
  allGenresFilter: string
}>()

const search = defineModel<string>('search', { required: true })
const genre = defineModel<string>('genre', { required: true })
const sortBy = defineModel<'rating' | 'date'>('sortBy', { required: true })
</script>

<template>
  <form class="controls" role="search" @submit.prevent>
    <label class="search-control">
      <span class="sr-only">Search games by title</span>
      <span class="search-glyph" aria-hidden="true">⌕</span>
      <input v-model="search" type="search" placeholder="Find a game..." autocomplete="off">
    </label>
    <label class="select-control">
      <span class="sr-only">Filter by genre</span>
      <select v-model="genre">
        <option :value="allGenresFilter">All genres</option>
        <option v-for="name in genres" :key="name" :value="name">{{ name }}</option>
      </select>
    </label>
    <fieldset class="sort-control">
      <legend class="sr-only">Sort games</legend>
      <button type="button" :aria-pressed="sortBy === 'rating'" @click="sortBy = 'rating'">Top rated</button>
      <button type="button" :aria-pressed="sortBy === 'date'" @click="sortBy = 'date'">Latest</button>
    </fieldset>
  </form>
</template>

<style scoped lang="scss">
.controls {
  display: flex;
  min-height: 57px;
  align-items: center;
  gap: 10px;
  margin: 24px 0 26px;
  padding: 8px 0;
  border-block: 1px solid var(--color-border);
}

.search-control,
.select-control {
  display: flex;
  align-items: center;
}

.search-control {
  flex: 1;
  min-width: 140px;
}

.search-control input {
  width: 100%;
  min-height: 37px;
  border: 0;
  background: transparent;
  color: var(--color-text);
}

.search-control input::placeholder {
  color: var(--color-placeholder);
}

.search-glyph {
  padding: 0 8px 3px 3px;
  color: var(--color-accent);
  font-size: 25px;
  line-height: 1;
}

.select-control select {
  min-width: 140px;
  min-height: 37px;
  padding: 0 28px 0 11px;
  border: 0;
  border-left: 1px solid var(--color-border);
  background: transparent;
  color: var(--color-text);
}

.sort-control {
  display: flex;
  gap: 3px;
  margin: 0 0 0 8px;
  padding: 0;
  border: 0;
}

.sort-control button {
  min-height: 36px;
  padding: 0 13px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  font-size: 12px;
}

.sort-control button[aria-pressed='true'] {
  border-color: var(--color-text);
  background: var(--color-text);
  color: var(--color-surface);
}

@media (max-width: 620px) {
  .controls {
    flex-wrap: wrap;
    gap: 7px;
    margin: 18px 0 20px;
  }

  .search-control {
    flex-basis: 100%;
    border-bottom: 1px solid var(--color-border);
  }

  .select-control {
    flex: 1;
  }

  .select-control select {
    width: 100%;
    padding-left: 2px;
    border-left: 0;
  }

  .sort-control {
    margin-left: auto;
  }

  .sort-control button {
    padding: 0 9px;
  }
}
</style>
