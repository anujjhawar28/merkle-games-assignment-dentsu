<script setup lang="ts">
withDefaults(defineProps<{
  headingId: string
  eyebrow: string
  title: string
  count?: string | number
  size?: 'default' | 'compact'
}>(), {
  size: 'default'
})
</script>

<template>
  <div class="section-heading" :class="`section-heading--${size}`">
    <div>
      <EyebrowLabel compact>{{ eyebrow }}</EyebrowLabel>
      <h2 :id="headingId">
        {{ title }}<span v-if="count !== undefined">{{ count }}</span>
      </h2>
    </div>
    <div v-if="$slots.trailing" class="section-heading__trailing">
      <slot name="trailing" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.section-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 20px;
}

.section-heading h2 {
  margin: 0;
  font: 400 34px/1.1 var(--font-display);
}

.section-heading h2 span {
  margin-left: 4px;
  color: var(--color-accent-strong);
  font: 700 11px var(--font-body);
  vertical-align: top;
}

@media (max-width: 620px) {
  .section-heading--compact h2 {
    font-size: 29px;
  }
}
</style>
