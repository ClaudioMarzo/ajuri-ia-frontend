<template>
  <!-- Camada de fundo botânica: fixa, atrás de todo o conteúdo, decorativa.
       100% CSS/SVG, adapta ao tema via tokens. Intensidade: forte. -->
  <div class="botanical" aria-hidden="true">
    <svg class="leaf leaf--tr" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.1">
      <path d="M50 95 C50 60 30 40 8 30 C30 36 46 50 50 70 C54 50 70 36 92 30 C70 40 50 60 50 95Z" />
      <path d="M50 78 L50 95" />
      <path d="M50 70 C58 64 64 60 72 58" />
      <path d="M50 70 C42 64 36 60 28 58" />
    </svg>
    <svg class="leaf leaf--bl" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.1">
      <path d="M20 90 C40 70 50 50 52 18 C56 50 68 68 86 80 C64 74 54 80 52 92 C50 80 40 84 20 90Z" />
      <path d="M52 60 C60 58 66 54 70 48" />
      <path d="M52 44 C58 42 62 38 64 32" />
    </svg>
    <svg class="leaf leaf--mr" viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="1.1">
      <path d="M50 92 C50 60 34 44 14 36 C34 40 47 52 50 70 C53 52 66 40 86 36 C66 44 50 60 50 92Z" />
    </svg>
  </div>
</template>

<script setup>
// Componente puramente decorativo — sem lógica.
</script>

<style scoped>
.botanical {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;
  /* Brilhos orgânicos (forte). Calor no topo (atrás do hero, longe dos cards)
     + cantos. Sem brilho no centro-baixo para os cards manterem contraste. */
  background:
    radial-gradient(46% 34% at 50% 4%, color-mix(in srgb, var(--color-coral) 10%, transparent), transparent 70%),
    radial-gradient(50% 45% at 96% -6%, color-mix(in srgb, var(--color-coral) 13%, transparent), transparent 68%),
    radial-gradient(48% 42% at 0% 108%, color-mix(in srgb, var(--color-leaf) 14%, transparent), transparent 68%);
}

/* Tema claro: brilhos um pouco mais fortes para destacar sobre o creme */
html:not(.dark) .botanical {
  background:
    radial-gradient(46% 34% at 50% 4%, color-mix(in srgb, var(--color-coral) 13%, transparent), transparent 70%),
    radial-gradient(52% 46% at 97% -6%, color-mix(in srgb, var(--color-coral) 16%, transparent), transparent 68%),
    radial-gradient(50% 44% at 0% 108%, color-mix(in srgb, var(--color-leaf) 20%, transparent), transparent 68%);
}

.leaf {
  position: absolute;
  color: var(--color-leaf);
  opacity: 0.14; /* tema claro: folhagem precisa de mais presença sobre o creme */
}
html.dark .leaf { opacity: 0.11; }

.leaf--tr { top: -44px; right: -34px; width: 280px; transform: rotate(8deg); }
.leaf--bl { bottom: -64px; left: -54px; width: 320px; transform: rotate(-12deg); }
.leaf--mr { top: 38%; right: -70px; width: 200px; transform: rotate(150deg); }

@media (max-width: 640px) {
  .leaf--tr { width: 200px; }
  .leaf--bl { width: 230px; }
  .leaf--mr { display: none; }
}
</style>
