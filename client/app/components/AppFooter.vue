<template>
  <footer class="site-footer">
    <span>MERKLE GAMES <span class="footer-dot">●</span> A SMALL ARCHIVE OF BIG WORLDS</span>
  </footer>
</template>

<style scoped lang="scss">
.site-footer {
  min-height: 66px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  border-top: 1px solid var(--color-border);
  color: var(--color-text-muted);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 1.4px;
  text-align: center;
}

.footer-dot { padding: 0 5px; color: var(--color-accent-strong); font-size: 7px; }

@media (max-width: 620px) {
  .site-footer { padding: 15px 0; font-size: 8px; }
}
</style>
