<script setup lang="ts">
import type { Review } from '@/types/games'
import { formatRating, formatReleaseDate } from '@/utils/games'

const props = defineProps<{
  reviews?: Review[]
  totalReviews: number
}>()

function reviewRating(review: Review): number {
  return Number(review.rating_score ?? review.rating ?? 0)
}
</script>

<template>
  <section class="reviews-section" aria-labelledby="reviews-title">
    <SectionHeading heading-id="reviews-title" eyebrow="PLAYER IMPRESSIONS" title="The reviews"
      :count="props.reviews?.length ?? 0">
      <template #trailing>
        <span class="review-total">{{ totalReviews.toLocaleString() }} TOTAL RATINGS</span>
      </template>
    </SectionHeading>
    <div v-if="reviews?.length" class="review-list">
      <article v-for="review in reviews" :key="review.id" class="review-item">
        <div class="review-item__top">
          <strong>{{ review.user?.username || 'Anonymous player' }}</strong>
          <span class="review-score"><span aria-hidden="true">★</span> {{ formatRating(reviewRating(review)) }}</span>
        </div>
        <p>{{ review.review_text || 'This player left a rating without written notes.' }}</p>
        <time v-if="review.review_date" :datetime="review.review_date">{{ formatReleaseDate(review.review_date)
          }}</time>
      </article>
    </div>
    <p v-else class="no-reviews">No written reviews yet. Be the first to leave an impression.</p>
  </section>
</template>

<style scoped lang="scss">
.reviews-section {
  padding: 48px var(--section-gutter) 72px;
}

.review-total {
  padding-bottom: 5px;
  color: var(--color-text-muted);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1.4px;
}

.review-list {
  margin-top: 20px;
  border-top: 1px solid var(--color-border);
}

.review-item {
  padding: 18px 0 17px;
  border-bottom: 1px solid var(--color-border);
}

.review-item__top {
  display: flex;
  justify-content: space-between;
  gap: 15px;
}

.review-item__top strong {
  font-size: 13px;
}

.review-item p {
  max-width: 850px;
  margin: 8px 0;
  color: var(--color-text-soft);
}

.review-item time {
  color: var(--color-text-muted);
  font-size: 10px;
}

.review-score {
  font-size: 12px;
  font-weight: 800;
}

.review-score>span {
  color: var(--color-accent-strong);
}

.no-reviews {
  margin: 26px 0 0;
  padding: 25px;
  background: var(--color-surface-muted);
  color: var(--color-text-muted);
  text-align: center;
}

@media (max-width: 900px) {
  .reviews-section {
    padding-inline: 4%;
  }
}

@media (max-width: 620px) {
  .reviews-section {
    padding: 38px 2% 50px;
  }

  :deep(.review-total) {
    max-width: 120px;
    text-align: right;
    line-height: 1.5;
  }
}
</style>
