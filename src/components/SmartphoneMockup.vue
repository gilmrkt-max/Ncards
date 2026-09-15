<script setup>
/**
 * Smartphone com o perfil digital aberto pelo cartão.
 * - active: cartão em hover → telefone "escuta" o NFC
 * - tapKey: incrementado a cada toque → animação de conexão + perfil
 */
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { gsap } from 'gsap'
import {
  ContactRound,
  Globe,
  Mail,
  Users,
  ChevronRight,
  Signal,
  Wifi,
  BatteryFull,
  Nfc,
  Check,
  UserRound
} from 'lucide-vue-next'
import BrandLogo from './ui/BrandLogo.vue'
import BrandIcon from './ui/BrandIcon.vue'
import { brand } from '@/data/site'
import { prefersReducedMotion } from '@/composables/useReducedMotion'

const props = defineProps({
  active: { type: Boolean, default: false },
  tapKey: { type: Number, default: 0 },
  introDelay: { type: Number, default: 0.6 }
})

const actions = [
  { label: 'Salvar contato', icon: ContactRound, primary: true },
  { label: 'Site', icon: Globe },
  { label: 'WhatsApp', brand: 'whatsapp' },
  { label: 'E-mail', icon: Mail },
  { label: 'Redes sociais', icon: Users }
]

const root = ref(null)
const device = ref(null)
const screen = ref(null)
const phase = ref('idle') // idle | connecting | connected | open

let ctx
let xTo
let yTo
let timers = []

function onPointerMove(e) {
  if (e.pointerType !== 'mouse') return
  const nx = e.clientX / window.innerWidth - 0.5
  const ny = e.clientY / window.innerHeight - 0.5
  xTo?.(nx * -18)
  yTo?.(ny * -14)
}

function resetParallax() {
  xTo?.(0)
  yTo?.(0)
}

onMounted(() => {
  const reduced = prefersReducedMotion()

  ctx = gsap.context(() => {
    if (!reduced) {
      gsap.from(device.value, {
        opacity: 0,
        y: 60,
        rotateY: -38,
        duration: 1.6,
        delay: props.introDelay,
        ease: 'expo.out'
      })
      xTo = gsap.quickTo(root.value, 'x', { duration: 1.2, ease: 'power3.out' })
      yTo = gsap.quickTo(root.value, 'y', { duration: 1.2, ease: 'power3.out' })
      window.addEventListener('pointermove', onPointerMove, { passive: true })
      document.documentElement.addEventListener('mouseleave', resetParallax)
    }
  }, root.value)
})

watch(
  () => props.tapKey,
  () => {
    timers.forEach(clearTimeout)
    phase.value = 'connecting'
    timers = [
      setTimeout(() => (phase.value = 'connected'), 950),
      setTimeout(() => {
        phase.value = 'open'
        if (!prefersReducedMotion()) {
          gsap.fromTo(
            screen.value.querySelectorAll('[data-stagger]'),
            { opacity: 0, y: 14 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.06, ease: 'power3.out', clearProps: 'all' }
          )
        }
      }, 1600),
      setTimeout(() => (phase.value = 'idle'), 4200)
    ]
  }
)

onBeforeUnmount(() => {
  timers.forEach(clearTimeout)
  window.removeEventListener('pointermove', onPointerMove)
  document.documentElement.removeEventListener('mouseleave', resetParallax)
  ctx?.revert()
})
</script>

<template>
  <div ref="root" class="phone-wrap" :class="{ 'is-active': active, [`is-${phase}`]: true }">
    <div ref="device" class="phone">
      <div class="phone__frame">
        <div ref="screen" class="phone__screen">
          <!-- Status bar -->
          <div class="status">
            <span>9:41</span>
            <span class="status__island" />
            <span class="status__icons">
              <Signal :size="10" :stroke-width="2.5" />
              <Wifi :size="10" :stroke-width="2.5" />
              <BatteryFull :size="12" :stroke-width="2" />
            </span>
          </div>

          <!-- Aviso de leitura NFC (hover) -->
          <div class="nfc-toast" role="status">
            <Nfc :size="12" :stroke-width="2.2" />
            <span>Pronto para conectar</span>
          </div>

          <!-- Cabeçalho do perfil -->
          <header class="profile" data-stagger>
            <div class="profile__cover">
              <BrandLogo :height="34" eager />
            </div>
            <div class="profile__avatar">
              <UserRound :size="18" :stroke-width="2" />
            </div>
            <h3 class="profile__name">{{ brand.name }}</h3>
            <p class="profile__role">{{ brand.tagline }}</p>
          </header>

          <ul class="actions">
            <li
              v-for="a in actions"
              :key="a.label"
              class="action"
              :class="{ 'action--primary': a.primary }"
              data-stagger
            >
              <span class="action__icon">
                <BrandIcon v-if="a.brand" :name="a.brand" :size="13" />
                <component :is="a.icon" v-else :size="13" :stroke-width="2" />
              </span>
              <span class="action__label">{{ a.label }}</span>
              <ChevronRight class="action__chev" :size="12" :stroke-width="2" />
            </li>
          </ul>

          <div class="socials" data-stagger>
            <span><BrandIcon name="linkedin" :size="13" /></span>
            <span><BrandIcon name="instagram" :size="13" /></span>
            <span><BrandIcon name="youtube" :size="13" /></span>
          </div>

          <span class="home-indicator" />

          <!-- Overlay de conexão (toque no cartão) -->
          <div class="connect" aria-hidden="true">
            <div class="connect__rings">
              <span /><span /><span />
              <div class="connect__core">
                <Nfc v-if="phase !== 'connected'" :size="20" :stroke-width="2" />
                <Check v-else :size="20" :stroke-width="2.5" />
              </div>
            </div>
            <p>{{ phase === 'connected' ? 'Perfil aberto' : 'Conectando via NFC…' }}</p>
          </div>
        </div>
      </div>
      <span class="phone__btn phone__btn--power" />
      <span class="phone__btn phone__btn--vol1" />
      <span class="phone__btn phone__btn--vol2" />
    </div>
  </div>
</template>

<style scoped>
.phone-wrap {
  perspective: 1600px;
  will-change: transform;
}

.phone {
  position: relative;
  width: 100%;
  aspect-ratio: 9 / 19;
  transform: rotateY(-20deg) rotateX(7deg) rotateZ(4deg);
  transform-style: preserve-3d;
  transition: transform 1s var(--ease-out);
}

.is-active .phone {
  transform: rotateY(-14deg) rotateX(5deg) rotateZ(3deg) translate3d(-10px, -6px, 30px);
}

.is-connecting .phone,
.is-connected .phone,
.is-open .phone {
  transform: rotateY(-10deg) rotateX(4deg) rotateZ(2deg) translate3d(-16px, -4px, 40px);
}

.phone__frame {
  position: absolute;
  inset: 0;
  padding: 3.6%;
  container-type: inline-size;
  border-radius: 15% / 7%;
  background: linear-gradient(145deg, #4a4561 0%, #1b1a24 35%, #2b2838 70%, #6b6590 100%);
  box-shadow:
    inset 0 0 0 1.5px rgba(255, 255, 255, 0.16),
    inset 0 0 0 5px #0d0c12,
    30px 50px 70px -30px rgba(40, 30, 90, 0.35),
    8px 16px 30px -12px rgba(17, 17, 17, 0.25);
  transition: box-shadow 0.8s var(--ease-out);
}

.is-active .phone__frame,
.is-connecting .phone__frame,
.is-connected .phone__frame {
  box-shadow:
    inset 0 0 0 1.5px rgba(255, 255, 255, 0.16),
    inset 0 0 0 5px #0d0c12,
    0 0 0 1px rgba(0, 184, 230, 0.25),
    -20px 20px 60px -20px rgba(0, 184, 230, 0.45),
    30px 50px 70px -30px rgba(40, 30, 90, 0.4);
}

.phone__btn {
  position: absolute;
  width: 3px;
  border-radius: 2px;
  background: #3a3650;
}

.phone__btn--power {
  right: -2px;
  top: 26%;
  height: 12%;
}

.phone__btn--vol1 {
  left: -2px;
  top: 22%;
  height: 7%;
}

.phone__btn--vol2 {
  left: -2px;
  top: 31%;
  height: 7%;
}

/* Tela — tipografia escala com a largura do aparelho (cqw = % da moldura) */
.phone__screen {
  position: relative;
  height: 100%;
  overflow: hidden;
  border-radius: 12.5% / 5.8%;
  background: #f7f6f3;
  display: flex;
  flex-direction: column;
  padding: 0 6cqw 5cqw;
  color: var(--ink);
}

.status {
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 15cqw;
  padding-inline: 3cqw;
  font-size: 4.6cqw;
  font-weight: 700;
}

.status__island {
  position: absolute;
  left: 50%;
  top: 3.6cqw;
  width: 30cqw;
  height: 8.4cqw;
  border-radius: 99px;
  background: #0d0c12;
  transform: translateX(-50%);
}

.status__icons {
  display: inline-flex;
  gap: 1.2cqw;
  align-items: center;
}

.status__icons :deep(svg) {
  width: 4.4cqw;
  height: auto;
}

.nfc-toast {
  position: absolute;
  z-index: 4;
  left: 50%;
  top: 3.6cqw;
  display: flex;
  align-items: center;
  gap: 2cqw;
  height: 8.4cqw;
  padding-inline: 3.4cqw;
  border-radius: 99px;
  background: #0d0c12;
  color: #fff;
  font-size: 3.6cqw;
  font-weight: 600;
  white-space: nowrap;
  opacity: 0;
  transform: translateX(-50%) scaleX(0.4);
  transition:
    opacity 0.4s var(--ease-out),
    transform 0.6s var(--ease-out);
}

.nfc-toast :deep(svg) {
  width: 4.4cqw;
  height: auto;
  color: var(--cyan);
}

.is-active .nfc-toast {
  opacity: 1;
  transform: translateX(-50%) scaleX(1);
}

.profile {
  position: relative;
  text-align: center;
  margin-inline: -6cqw;
}

.profile__cover {
  display: grid;
  place-items: center;
  height: 40cqw;
  margin-top: -15cqw;
  padding-top: 11cqw;
  padding-bottom: 6cqw;
  background:
    radial-gradient(circle at 80% 0%, rgba(0, 184, 230, 0.14), transparent 55%),
    linear-gradient(160deg, #efebff 0%, #f7f6f3 100%);
  border-bottom: 1px solid rgba(86, 53, 245, 0.08);
}

.profile__cover :deep(.brand-logo) {
  height: 13cqw !important;
}

.profile__avatar {
  display: grid;
  place-items: center;
  width: 15cqw;
  height: 15cqw;
  margin: -7.5cqw auto 0;
  border-radius: 50%;
  background: var(--violet);
  color: #fff;
  border: 1.2cqw solid #f7f6f3;
  box-shadow: 0 6px 14px -6px rgba(86, 53, 245, 0.6);
}

.profile__avatar :deep(svg) {
  width: 6.5cqw;
  height: auto;
}

.profile__name {
  margin-top: 2.4cqw;
  font-size: 6.2cqw;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.profile__role {
  font-size: 4cqw;
  color: var(--ink-2);
  line-height: 1.4;
}

.actions {
  display: grid;
  gap: 2.4cqw;
  margin-top: 5cqw;
}

.action {
  display: flex;
  align-items: center;
  gap: 3cqw;
  height: 12.5cqw;
  padding-inline: 3cqw;
  border-radius: 3.6cqw;
  background: #fff;
  border: 1px solid #ebe8e2;
  font-size: 4.2cqw;
  font-weight: 600;
}

.action__icon {
  display: grid;
  place-items: center;
  width: 7.6cqw;
  height: 7.6cqw;
  border-radius: 2.2cqw;
  background: var(--violet-soft);
  color: var(--violet);
}

.action__icon :deep(svg) {
  width: 4.4cqw;
  height: auto;
}

.action__label {
  flex: 1;
}

.action__chev {
  width: 4cqw;
  height: auto;
  color: #b9b5ad;
}

.action--primary {
  background: var(--violet);
  border-color: var(--violet);
  color: #fff;
}

.action--primary .action__icon {
  background: rgba(255, 255, 255, 0.18);
  color: #fff;
}

.action--primary .action__chev {
  color: rgba(255, 255, 255, 0.7);
}

.is-open .action--primary {
  animation: pulse-primary 1.4s var(--ease-out) 0.5s 2;
}

@keyframes pulse-primary {
  0% {
    box-shadow: 0 0 0 0 rgba(86, 53, 245, 0.45);
  }
  100% {
    box-shadow: 0 0 0 3cqw rgba(86, 53, 245, 0);
  }
}

.socials {
  display: flex;
  justify-content: center;
  gap: 4cqw;
  margin-top: auto;
  padding-top: 4cqw;
}

.socials span {
  display: grid;
  place-items: center;
  width: 9cqw;
  height: 9cqw;
  border-radius: 50%;
  background: #fff;
  border: 1px solid #ebe8e2;
  color: var(--ink);
}

.socials :deep(svg) {
  width: 4.4cqw;
  height: auto;
}

.home-indicator {
  display: block;
  width: 34cqw;
  height: 1.3cqw;
  margin: 4cqw auto 0;
  border-radius: 99px;
  background: #111;
  opacity: 0.85;
}

/* Overlay de conexão */
.connect {
  position: absolute;
  inset: 0;
  z-index: 5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8cqw;
  background: rgba(247, 246, 243, 0.86);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.45s var(--ease-out),
    visibility 0s linear 0.45s;
}

.is-connecting .connect,
.is-connected .connect {
  opacity: 1;
  visibility: visible;
  transition: opacity 0.35s var(--ease-out);
}

.connect p {
  font-size: 4.6cqw;
  font-weight: 700;
  color: var(--ink);
}

.connect__rings {
  position: relative;
  display: grid;
  place-items: center;
  width: 44cqw;
  height: 44cqw;
}

.connect__rings span {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1.5px solid var(--cyan);
  opacity: 0;
}

.is-connecting .connect__rings span {
  animation: ring 1.4s var(--ease-out) infinite;
}

.connect__rings span:nth-child(2) {
  animation-delay: 0.3s !important;
  border-color: var(--violet-2);
}

.connect__rings span:nth-child(3) {
  animation-delay: 0.6s !important;
}

@keyframes ring {
  0% {
    transform: scale(0.35);
    opacity: 0.9;
  }
  100% {
    transform: scale(1.1);
    opacity: 0;
  }
}

.connect__core {
  display: grid;
  place-items: center;
  width: 18cqw;
  height: 18cqw;
  border-radius: 50%;
  background: var(--violet);
  color: #fff;
  box-shadow: 0 10px 24px -8px rgba(86, 53, 245, 0.7);
}

.connect__core :deep(svg) {
  width: 8cqw;
  height: auto;
}
</style>
