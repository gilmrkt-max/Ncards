<script setup>
/**
 * Logo oficial da Nmento Technology (asset em /public/brand).
 * A imagem é usada sem alterações; se o arquivo ainda não existir,
 * mostra apenas o nome da empresa em texto como fallback temporário.
 */
import { ref } from 'vue'
import { brand } from '@/data/site'

defineProps({
  height: { type: Number, default: 44 },
  eager: { type: Boolean, default: false }
})

const failed = ref(false)
</script>

<template>
  <span class="brand-logo" :style="{ height: `${height}px` }">
    <img
      v-if="!failed"
      :src="brand.logo"
      :alt="brand.name"
      :loading="eager ? 'eager' : 'lazy'"
      decoding="async"
      @error="failed = true"
    />
    <span v-else class="brand-logo__fallback" :style="{ fontSize: `${height * 0.46}px` }">
      <strong>Nmento</strong>
      <small>Technology</small>
    </span>
  </span>
</template>

<style scoped>
.brand-logo {
  display: inline-flex;
  align-items: center;
}

.brand-logo img {
  height: 100%;
  width: auto;
  object-fit: contain;
}

.brand-logo__fallback {
  display: inline-flex;
  flex-direction: column;
  line-height: 1;
  color: var(--ink);
}

.brand-logo__fallback strong {
  font-weight: 800;
  letter-spacing: -0.03em;
}

.brand-logo__fallback small {
  margin-top: 0.18em;
  font-size: 0.42em;
  font-weight: 500;
  letter-spacing: 0.32em;
  color: var(--ink-2);
}
</style>
