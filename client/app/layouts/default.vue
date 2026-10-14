<template>
  <div class="site-shell">
    <a class="skip-link" href="#main-content">Skip to content</a>
    <AppHeader />
    <slot />
    <AppFooter />
  </div>
</template>

<style scoped lang="scss">
.site-shell {
  width: min(calc(100% - var(--page-inset)), var(--content-width));
  margin: 0 auto;
}

.skip-link {
  position: fixed;
  z-index: 10;
  top: 8px;
  left: 8px;
  padding: 9px 14px;
  transform: translateY(-150%);
  background: var(--color-text);
  color: var(--color-white);
}

.skip-link:focus {
  transform: translateY(0);
}

@media (max-width: 900px) {
  .site-shell {
    --page-inset: 44px;
    --content-width: 760px;
  }
}

@media (max-width: 620px) {
  .site-shell {
    --page-inset: 32px;
  }
}
</style>
