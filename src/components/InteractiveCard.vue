<script setup>
/**
 * Cartão NFC 3D (Three.js).
 * A lógica de cena fica em /three/CardScene.js; este componente cuida do
 * ciclo de vida Vue, breakpoints e da ponte de eventos com o Hero.
 */
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { CardScene } from '@/three/CardScene'
import { brand } from '@/data/site'
import { useReducedMotion } from '@/composables/useReducedMotion'
import BrandLogo from './ui/BrandLogo.vue'

const props = defineProps({
  /** Elemento que recebe cliques (normalmente o palco do Hero) */
  eventTarget: { type: Object, default: null },
  /** Retorna o DOMRect do smartphone para a animação de aproximação */
  getTargetRect: { type: Function, default: null },
  introDelay: { type: Number, default: 0.35 }
})

const emit = defineEmits(['hover', 'tap', 'ready'])

const wrap = ref(null)
const canvas = ref(null)
const failed = ref(false)
const reduced = useReducedMotion()

let scene = null
let mqMobile
let mqTablet

const LAYOUTS = {
  desktop: { widthRatio: 0.5, offsetX: -0.07, offsetY: -0.02 },
  tablet: { widthRatio: 0.56, offsetX: -0.08, offsetY: -0.04 },
  mobile: { widthRatio: 0.76, offsetX: -0.05, offsetY: -0.12 }
}

function applyLayout() {
  if (!scene) return
  const key = mqMobile.matches ? 'mobile' : mqTablet.matches ? 'tablet' : 'desktop'
  scene.setLayout(LAYOUTS[key])
}

function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

onMounted(() => {
  mqMobile = window.matchMedia('(max-width: 900px)')
  mqTablet = window.matchMedia('(max-width: 1100px)')

  if (!hasWebGL()) {
    failed.value = true
    emit('ready')
    return
  }

  try {
    scene = new CardScene({
      canvas: canvas.value,
      container: wrap.value,
      eventTarget: props.eventTarget ?? wrap.value,
      lowPower: window.matchMedia('(max-width: 1024px), (pointer: coarse)').matches,
      reducedMotion: reduced.value,
      logoSrc: brand.logo,
      qrText: brand.profileUrl,
      getTargetRect: props.getTargetRect,
      onHover: (v) => emit('hover', v),
      onTap: () => emit('tap')
    })
  } catch (err) {
    console.warn('[InteractiveCard] WebGL indisponível, usando fallback.', err)
    failed.value = true
    emit('ready')
    return
  }

  applyLayout()
  mqMobile.addEventListener('change', applyLayout)
  mqTablet.addEventListener('change', applyLayout)

  scene.start()
  scene.playIntro(props.introDelay)
  emit('ready')
})

watch(reduced, (v) => scene?.setReducedMotion(v))

onBeforeUnmount(() => {
  mqMobile?.removeEventListener('change', applyLayout)
  mqTablet?.removeEventListener('change', applyLayout)
  scene?.dispose()
  scene = null
})

defineExpose({ tap: () => scene?.playTap() })
</script>

<template>
  <div ref="wrap" class="card3d" aria-hidden="true">
    <canvas v-show="!failed" ref="canvas" class="card3d__canvas" />

    <!-- Fallback estático caso WebGL não esteja disponível -->
    <div v-if="failed" class="card3d__fallback">
      <div class="fallback-card">
        <BrandLogo :height="64" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.card3d {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.card3d__canvas {
  width: 100%;
  height: 100%;
}

.card3d__fallback {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  perspective: 1200px;
}

.fallback-card {
  display: grid;
  place-items: center;
  width: min(62%, 440px);
  aspect-ratio: 1.586;
  border-radius: 22px;
  background: linear-gradient(135deg, #fff, #f1efea);
  border: 1px solid var(--border);
  box-shadow: 0 40px 80px -40px rgba(40, 30, 90, 0.35);
  transform: rotateX(12deg) rotateY(-18deg) rotateZ(6deg);
}
</style>
