<script setup>
/**
 * Mapeia chaves semânticas de conteúdo (site.js) para ícones Lucide.
 * Mantém os dados desacoplados da biblioteca de ícones.
 */
import { computed } from 'vue'
import { Nfc, QrCode, UserRound, Share2, RefreshCw, Leaf, BadgeCheck, Sparkles } from 'lucide-vue-next'

const props = defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: 24 },
  strokeWidth: { type: [Number, String], default: 1.75 }
})

const map = {
  nfc: Nfc,
  qr: QrCode,
  user: UserRound,
  share: Share2,
  refresh: RefreshCw,
  leaf: Leaf,
  badge: BadgeCheck,
  sparkles: Sparkles
}

const component = computed(() => map[props.name] ?? Sparkles)
</script>

<template>
  <component :is="component" :size="size" :stroke-width="strokeWidth" aria-hidden="true" />
</template>
