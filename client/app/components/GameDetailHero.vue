<script setup lang="ts">
import { FORMAT_CONFIG } from "@/constants";
import type { FeaturedGame } from "@/types/games";
import { formatArchiveNumber } from "@/utils/games";

defineProps<{ game: FeaturedGame }>();
</script>

<template>
  <section class="detail-hero">
    <div class="detail-copy">
      <EyebrowLabel
        ><span>{{ game.genre?.name || "GAME FILE" }}</span> · ARCHIVE NO.
        {{ formatArchiveNumber(game.id) }}</EyebrowLabel
      >
      <h1>{{ game.title }}</h1>
      <p class="detail-description">
        {{ game.description || "No description is available for this title." }}
      </p>
      <div class="detail-byline">
        <span>DEVELOPED BY</span>
        <strong>{{ game.developer?.name || "Unknown studio" }}</strong>
      </div>
    </div>
    <figure class="detail-art">
      <GameArtwork
        :source="game.images?.[0]?.image_url"
        :alt="`${game.title} featured artwork`"
        loading="eager"
        fetch-priority="high"
      />
      <figcaption>
        FEATURED ARTWORK
        <span
          >FIG.
          {{
            formatArchiveNumber(game.id, FORMAT_CONFIG.figureNumberDigits)
          }}</span
        >
      </figcaption>
    </figure>
  </section>
</template>

<style scoped lang="scss">
.detail-hero {
  display: grid;
  grid-template-columns: 1fr 1.02fr;
  align-items: center;
  gap: 8%;
  padding: 53px var(--section-gutter) 45px;
  border-bottom: 1px solid var(--color-border);
}
.detail-copy h1 {
  max-width: 620px;
  margin: 0 0 20px;
  font: 400 clamp(42px, 5vw, 66px) / 1 var(--font-display);
}
.detail-description {
  max-width: 490px;
  margin: 0;
  color: var(--color-text-soft);
  font: 18px/1.65 var(--font-display);
}
.detail-byline {
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 27px;
}
.detail-byline span {
  color: var(--color-text-muted);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1.3px;
}
.detail-byline strong {
  font-size: 13px;
}
.detail-art {
  min-width: 0;
  margin: 0;
}
.detail-art :deep(img) {
  aspect-ratio: 1.38;
}
.detail-art figcaption {
  display: flex;
  justify-content: space-between;
  padding-top: 10px;
  color: var(--color-text-muted);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1.4px;
}

@media (max-width: 900px) {
  .detail-hero {
    gap: 5%;
    padding-inline: 4%;
  }
}

@media (max-width: 620px) {
  .detail-hero {
    grid-template-columns: 1fr;
    gap: 28px;
    padding: 40px 2% 30px;
  }
  .detail-copy h1 {
    font-size: clamp(42px, 12vw, 58px);
  }
  .detail-description {
    font-size: 16px;
  }
  .detail-art :deep(img) {
    aspect-ratio: 1.4;
  }
}
</style>
