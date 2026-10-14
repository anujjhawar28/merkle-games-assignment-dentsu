<script setup lang="ts">
withDefaults(defineProps<{ compact?: boolean }>(), {
  compact: false
})
</script>

<template>
  <p class="eyebrow" :class="{ 'eyebrow--compact': compact }">
    <slot />
  </p>
</template>

<style scoped lang="scss">
.eyebrow {
  margin: 0 0 14px;
  color: var(--color-text-muted);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.4px;
}

.eyebrow--compact {
  margin-bottom: 8px;
}

.eyebrow :slotted(span) {
  color: var(--color-accent-strong);
}
</style>
