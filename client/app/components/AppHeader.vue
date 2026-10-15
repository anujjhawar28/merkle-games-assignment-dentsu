<script setup lang="ts">
import { computed } from "vue";
import { APP_PATHS } from "@/constants";

const route = useRoute();
const isGamePage = computed(() => route.path.startsWith(`${APP_PATHS.games}/`));
</script>

<template>
  <header class="site-header">
    <NuxtLink class="brand" :to="APP_PATHS.home">
      <span class="brand__mark" aria-hidden="true">M</span>
      <span>MERKLE<span class="brand__light"> / GAMES</span></span>
    </NuxtLink>
    <NuxtLink v-if="isGamePage" class="header-back" :to="APP_PATHS.home">
      ← <span>BACK TO THE COLLECTION</span>
    </NuxtLink>
    <span v-else class="header-note"
      >THE 2015–17 ARCHIVE <i aria-hidden="true"
    /></span>
  </header>
</template>

<style scoped lang="scss">
.site-header {
  min-height: 76px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--color-border);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 1.5px;
  text-decoration: none;
}

.brand__mark {
  display: grid;
  width: 32px;
  aspect-ratio: 1;
  place-items: center;
  background: var(--color-accent-strong);
  color: var(--color-surface);
  font: 400 21px var(--font-display);
}

.brand__light {
  color: var(--color-text-muted);
  font-weight: 500;
}
.header-note,
.header-back {
  color: var(--color-text-muted);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.4px;
}
.header-note {
  display: flex;
  align-items: center;
  gap: 10px;
}
.header-note i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--color-accent-strong);
}
.header-back {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  text-decoration: none;
}
.header-back:hover {
  color: var(--color-accent-strong);
}

@media (max-width: 620px) {
  .site-header {
    min-height: 64px;
  }
  .header-note,
  .header-back {
    font-size: 8px;
    letter-spacing: 0.8px;
  }
  .header-back {
    letter-spacing: 0.7px;
  }
}
</style>
