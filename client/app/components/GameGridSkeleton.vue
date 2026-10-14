<script setup lang="ts">
import { GAME_CONFIG } from '@/constants'
</script>

<template>
  <div class="skeleton-grid" aria-hidden="true">
    <div v-for="item in GAME_CONFIG.skeletonCount" :key="item" class="skeleton-card">
      <span class="skeleton-card__art" />
      <span class="skeleton-card__line skeleton-card__line--short" />
      <span class="skeleton-card__line" />
      <span class="skeleton-card__line skeleton-card__line--meta" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 31px 22px;
}

.skeleton-card {
  padding: 10px;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
}

.skeleton-card__art,
.skeleton-card__line {
  display: block;
  background: var(--color-surface-muted);
  animation: pulse 1.2s ease-in-out infinite alternate;
}

.skeleton-card__art {
  aspect-ratio: 1.48;
}

.skeleton-card__line {
  height: 12px;
  margin-top: 12px;
}

.skeleton-card__line--short {
  width: 30%;
  height: 8px;
  margin-top: 14px;
}

.skeleton-card__line--meta {
  width: 65%;
  height: 8px;
  margin-top: 10px;
}

@keyframes pulse {
  to {
    opacity: .45;
  }
}

@media (max-width: 900px) {
  .skeleton-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 27px 18px;
  }
}

@media (max-width: 620px) {
  .skeleton-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .skeleton-card__art {
    aspect-ratio: 1.15;
  }
}

@media (prefers-reduced-motion: reduce) {

  .skeleton-card__art,
  .skeleton-card__line {
    animation: none;
  }
}
</style>
