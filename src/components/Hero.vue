<script setup>
import { ref, onMounted, onBeforeUnmount, defineAsyncComponent } from 'vue'
import { gsap } from 'gsap'
import { ArrowRight, Play, Nfc, QrCode, MousePointerClick } from 'lucide-vue-next'
import SmartphoneMockup from './SmartphoneMockup.vue'
import { prefersReducedMotion } from '@/composables/useReducedMotion'

// Three.js é carregado em um chunk separado: o texto do Hero aparece sem esperar o 3D
const InteractiveCard = defineAsyncComponent(() => import('./InteractiveCard.vue'))

const root = ref(null)
const stage = ref(null)
const phoneEl = ref(null)
const hovering = ref(false)
const tapKey = ref(0)
const linked = ref(false)

let ctx
let linkTimer

const getPhoneRect = () => phoneEl.value?.$el?.getBoundingClientRect() ?? null

function onTap() {
  tapKey.value++
  linked.value = true
  clearTimeout(linkTimer)
  linkTimer = setTimeout(() => (linked.value = false), 2200)
}

onMounted(() => {
  ctx = gsap.context(() => {
    if (prefersReducedMotion()) {
      gsap.set('[data-hero]', { opacity: 1 })
      return
    }
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
    tl.fromTo('[data-hero="eyebrow"]', { opacity: 0, x: -16 }, { opacity: 1, x: 0, duration: 0.8 })
      .fromTo(
        '.hero__line > span',
        { yPercent: 110 },
        { yPercent: 0, duration: 1.1, stagger: 0.12, ease: 'expo.out' },
        0.1
      )
      .set('[data-hero="title"]', { opacity: 1 }, 0.1)
      .fromTo('[data-hero="lead"]', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.9 }, 0.45)
      .fromTo('[data-hero="actions"]', { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.9 }, 0.58)
      .fromTo('[data-hero="stage"]', { opacity: 0 }, { opacity: 1, duration: 1.2 }, 0.2)
      .fromTo('[data-hero="badge"]', { opacity: 0, y: 12, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.9 }, 1.1)
      .fromTo('[data-hero="hint"]', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.8 }, 1.5)
  }, root.value)
})

onBeforeUnmount(() => {
  clearTimeout(linkTimer)
  ctx?.revert()
})
</script>

<template>
  <section id="inicio" ref="root" class="hero">
    <div class="bg-grid" />
    <div class="hero__glow" />

    <div class="container hero__inner">
      <!-- Texto -->
      <div class="hero__copy">
        <p class="eyebrow" data-hero="eyebrow">Cartão de visita inteligente</p>

        <h1 class="hero__title" data-hero="title">
          <span class="hero__line"><span>Seu cartão.</span></span>
          <span class="hero__line"><span class="accent">Sua conexão.</span></span>
          <span class="hero__line"><span>Seu negócio.</span></span>
        </h1>

        <p class="hero__lead" data-hero="lead">
          O cartão de visita inteligente da Nmento Technology combina tecnologia
          <strong class="accent">NFC + QR Code</strong> para levar sua marca mais longe, de forma moderna, prática e
          profissional.
        </p>

        <div class="hero__actions" data-hero="actions">
          <a href="#planos" class="btn btn--primary btn--lg">
            Criar meu cartão
            <ArrowRight class="btn__arrow" :size="18" :stroke-width="2" />
          </a>
          <a href="#como-funciona" class="btn btn--ghost btn--lg">
            <span class="play"><Play :size="10" :stroke-width="0" fill="currentColor" /></span>
            Como funciona
          </a>
        </div>
      </div>

      <!-- Palco 3D -->
      <div
        ref="stage"
        class="stage"
        :class="{ 'is-hover': hovering, 'is-linked': linked }"
        data-hero="stage"
      >
        <svg class="stage__orbit" viewBox="0 0 600 400" preserveAspectRatio="none" aria-hidden="true">
          <ellipse cx="300" cy="200" rx="290" ry="150" />
        </svg>

        <svg class="stage__beam" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M 44 42 C 58 20, 66 18, 76 28" />
        </svg>

        <span class="stage__spark stage__spark--1" />
        <span class="stage__dot stage__dot--1" />
        <span class="stage__dot stage__dot--2" />
        <span class="stage__dot stage__dot--3" />

        <SmartphoneMockup ref="phoneEl" class="stage__phone" :active="hovering" :tap-key="tapKey" />

        <InteractiveCard
          v-if="stage"
          class="stage__card"
          :event-target="stage"
          :get-target-rect="getPhoneRect"
          @hover="hovering = $event"
          @tap="onTap"
        />

        <div class="badge" data-hero="badge">
          <span class="badge__icon badge__icon--nfc"><Nfc :size="15" :stroke-width="2" /></span>
          <span class="badge__sep" />
          <span class="badge__icon"><QrCode :size="15" :stroke-width="2" /></span>
          <span class="badge__label">NFC + QR Code</span>
        </div>

        <p class="hint" data-hero="hint">
          <MousePointerClick :size="14" :stroke-width="2" />
          <span class="hint__desktop">Passe o mouse e clique no cartão</span>
          <span class="hint__touch">Toque no cartão para conectar</span>
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  padding-top: calc(var(--header-h) + 72px);
  padding-bottom: 48px;
  /* corta só na horizontal: sombras e glow podem descer sobre a próxima seção */
  overflow-x: clip;
}

.hero__glow {
  position: absolute;
  right: -10%;
  top: 10%;
  width: 60vw;
  height: 60vw;
  max-width: 900px;
  max-height: 900px;
  pointer-events: none;
  background: radial-gradient(circle, rgba(112, 71, 255, 0.07) 0%, rgba(0, 184, 230, 0.03) 35%, transparent 65%);
}

.hero__inner {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.08fr);
  align-items: center;
  gap: 24px;
}

.hero__copy {
  position: relative;
  z-index: 3;
  max-width: 600px;
}

[data-hero] {
  opacity: 0;
}

.hero__title {
  margin-top: 26px;
  font-size: clamp(46px, 6.1vw, 88px);
  font-weight: 800;
  line-height: 1.02;
  letter-spacing: -0.03em;
}

.hero__line {
  display: block;
  overflow: hidden;
  /* espaço para descendentes (ç, g) sem cortar */
  padding-bottom: 0.08em;
  margin-bottom: -0.08em;
}

.hero__line > span {
  display: inline-block;
}

.hero__lead {
  margin-top: 30px;
  max-width: 520px;
  font-size: clamp(16px, 1.35vw, 19px);
  line-height: 1.65;
  color: var(--ink-2);
}

.hero__lead strong {
  font-weight: 600;
}

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 40px;
}

.play {
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1.5px solid var(--violet);
  color: var(--violet);
  padding-left: 2px;
}

/* ---------- Palco ---------- */

.stage {
  position: relative;
  height: clamp(500px, 44vw, 640px);
}

.stage__card {
  z-index: 2;
  /* canvas maior que a coluna para o cartão respirar */
  inset: -60px -40px -40px -140px !important;
}

.stage__phone {
  position: absolute;
  z-index: 1;
  right: 2%;
  top: 2%;
  width: clamp(210px, 18.5vw, 272px);
}

.stage__orbit {
  position: absolute;
  left: -2%;
  top: 14%;
  width: 96%;
  height: 76%;
  pointer-events: none;
  overflow: visible;
}

.stage__orbit ellipse {
  fill: none;
  stroke: rgba(86, 53, 245, 0.22);
  stroke-width: 1;
  stroke-dasharray: 2 7;
  vector-effect: non-scaling-stroke;
  transform-origin: center;
  animation: orbit 40s linear infinite;
}

@keyframes orbit {
  to {
    stroke-dashoffset: -400;
  }
}

.stage__beam {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.stage__beam path {
  fill: none;
  stroke: var(--cyan);
  stroke-width: 1.5;
  stroke-linecap: round;
  stroke-dasharray: 1 8;
  vector-effect: non-scaling-stroke;
  opacity: 0.35;
  animation: beam 3s linear infinite;
  transition: opacity 0.6s var(--ease-out);
}

.is-hover .stage__beam path,
.is-linked .stage__beam path {
  opacity: 1;
  animation-duration: 0.9s;
}

@keyframes beam {
  to {
    stroke-dashoffset: -36;
  }
}

.stage__spark {
  position: absolute;
  width: 46px;
  height: 2px;
  border-radius: 2px;
  background: linear-gradient(90deg, transparent, var(--violet-2));
  transform: rotate(-52deg);
}

.stage__spark--1 {
  left: 6%;
  top: 22%;
}

.stage__dot {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  animation: bob 6s ease-in-out infinite;
}

.stage__dot--1 {
  left: 58%;
  top: 7%;
  background: var(--cyan);
}

.stage__dot--2 {
  right: -1%;
  bottom: 18%;
  background: var(--violet);
  animation-delay: -2s;
}

.stage__dot--3 {
  left: 12%;
  bottom: 12%;
  width: 4px;
  height: 4px;
  background: var(--violet-2);
  opacity: 0.6;
  animation-delay: -4s;
}

@keyframes bob {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Badge flutuante */
.badge {
  position: absolute;
  z-index: 3;
  left: 26%;
  top: 4%;
  display: flex;
  align-items: center;
  gap: 10px;
  height: 46px;
  padding: 0 18px 0 14px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.86);
  border: 1px solid var(--border-soft);
  box-shadow: var(--shadow);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  font-size: 13px;
  font-weight: 600;
  color: var(--violet);
  pointer-events: none;
  /* `translate` não conflita com o transform animado pelo GSAP na entrada */
  animation: badge-float 5.5s ease-in-out infinite;
}

@keyframes badge-float {
  0%,
  100% {
    translate: 0 0;
  }
  50% {
    translate: 0 -8px;
  }
}

.badge__icon {
  display: grid;
  place-items: center;
  color: var(--violet);
}

.badge__icon--nfc {
  color: var(--violet);
}

.badge__sep {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--ink-3);
}

.badge__label {
  margin-left: 4px;
  color: var(--violet);
}

/* Dica de interação */
.hint {
  position: absolute;
  z-index: 3;
  left: 50%;
  bottom: -4px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid var(--border-soft);
  font-size: 12.5px;
  font-weight: 500;
  color: var(--ink-2);
  white-space: nowrap;
  transform: translateX(-72%);
  pointer-events: none;
}

.hint svg {
  color: var(--violet);
}

.hint__touch {
  display: none;
}

@media (hover: none) {
  .hint__desktop {
    display: none;
  }
  .hint__touch {
    display: inline;
  }
}

/* ---------- Tablet ---------- */
@media (max-width: 1100px) {
  .hero__inner {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }

  .stage {
    height: 480px;
  }

  .stage__card {
    inset: -40px -20px -30px -80px !important;
  }

  .stage__phone {
    width: clamp(180px, 20vw, 220px);
  }

  .badge {
    left: 10%;
  }

  .hint {
    left: 36%;
  }
}

/* ---------- Mobile / tablet vertical ---------- */
@media (max-width: 900px) {
  .hero {
    padding-top: calc(var(--header-h) + 56px);
  }

  .hero__inner {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .hero__copy {
    margin-inline: auto;
    text-align: center;
  }

  .hero__copy .eyebrow::after {
    content: '';
    width: 34px;
    height: 1px;
    background: currentColor;
    opacity: 0.8;
  }

  .hero__lead {
    margin-inline: auto;
  }

  .hero__actions {
    justify-content: center;
  }

  .stage {
    height: min(560px, 118vw);
    margin-top: 12px;
  }

  .stage__card {
    inset: 0 -5vw !important;
  }

  .stage__phone {
    right: 10%;
    top: 0;
    width: min(230px, 42vw);
  }

  .stage__beam {
    display: none;
  }

  .badge {
    left: 4%;
    top: 6%;
  }

  .hint {
    left: 50%;
    transform: translateX(-50%);
    bottom: 0;
  }
}

@media (max-width: 480px) {
  .hero__actions .btn {
    width: 100%;
  }

  .badge {
    height: 40px;
    font-size: 12px;
    padding: 0 12px;
  }
}
</style>
