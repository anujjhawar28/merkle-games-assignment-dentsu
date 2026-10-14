<script setup lang="ts">
withDefaults(defineProps<{
  eyebrow: string
  title: string
  message?: string
  kind?: 'error' | 'empty'
  headingLevel?: 'h1' | 'h2' | 'h3'
}>(), {
  kind: 'empty',
  headingLevel: 'h3'
})
</script>

<template>
  <section class="feedback-panel" :class="`feedback-panel--${kind}`" :role="kind === 'error' ? 'alert' : undefined">
    <EyebrowLabel compact>{{ eyebrow }}</EyebrowLabel>
    <component :is="headingLevel" class="feedback-panel__title">{{ title }}</component>
    <p v-if="message" class="feedback-panel__message">{{ message }}</p>
    <div v-if="$slots.actions" class="feedback-panel__actions">
      <slot name="actions" />
    </div>
  </section>
</template>

<style scoped lang="scss">
.feedback-panel {
  min-height: 265px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.feedback-panel--error {
  border: 1px solid var(--color-border);
  background: rgb(var(--color-white-rgb) / 30%);
}

.feedback-panel__title {
  margin: 2px 0 6px;
  font: 30px var(--font-display);
}

.feedback-panel__message {
  margin: 0 0 8px;
  color: var(--color-text-muted);
}

.feedback-panel__actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.feedback-panel__actions :deep(.text-button) {
  padding: 4px 0;
  border: 0;
  border-bottom: 1px solid var(--color-accent-strong);
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
  font-weight: 700;
  text-decoration: none;
}

.feedback-panel__actions :deep(.text-button span) {
  margin-left: 8px;
  color: var(--color-accent-strong);
}
</style>
