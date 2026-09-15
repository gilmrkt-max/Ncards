<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Nfc, UserRound, Share2, Check, Globe, Mail } from 'lucide-vue-next'
import { steps } from '@/data/site'
import { useReveal } from '@/composables/useReveal'
import { prefersReducedMotion } from '@/composables/useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

const root = ref(null)
const progress = ref(null)
useReveal(root, { stagger: 0.14 })

let ctx

onMounted(() => {
  if (prefersReducedMotion()) return
  ctx = gsap.context(() => {
    // Linha que conecta os passos é "desenhada" conforme o scroll
    gsap.fromTo(
      progress.value,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: '.steps', start: 'top 75%', end: 'bottom 55%', scrub: 0.6 }
      }
    )
  }, root.value)
})

onBeforeUnmount(() => ctx?.revert())
</script>

<template>
  <section id="como-funciona" ref="root" class="section how">
    <div class="container">
      <div class="section-head section-head--center">
        <p class="eyebrow" data-reveal>Como funciona</p>
        <h2 class="section-title" data-reveal>Três passos. <span class="accent">Uma conexão.</span></h2>
        <p class="section-lead" data-reveal>
          Sem aplicativo, sem digitar nada. Quem recebe seu cartão tem todas as suas informações em segundos.
        </p>
      </div>

      <div class="steps">
        <div class="steps__track" aria-hidden="true">
          <span ref="progress" class="steps__progress" />
        </div>

        <ol class="steps__list">
          <li v-for="(step, i) in steps" :key="step.title" class="step" data-reveal="scale">
            <div class="step__visual" aria-hidden="true">
              <!-- 01 Aproxime -->
              <div v-if="i === 0" class="viz viz--approach">
                <span class="viz__phone"><span /></span>
                <span class="viz__card"><Nfc :size="14" :stroke-width="2" /></span>
              </div>

              <!-- 02 Conecte -->
              <div v-else-if="i === 1" class="viz viz--connect">
                <span class="viz__ring" /><span class="viz__ring" /><span class="viz__ring" />
                <span class="viz__core"><Nfc :size="22" :stroke-width="2" /></span>
              </div>

              <!-- 03 Compartilhe -->
              <div v-else class="viz viz--share">
                <span class="viz__profile">
                  <span class="viz__avatar"><UserRound :size="14" :stroke-width="2" /></span>
                  <span class="viz__line viz__line--lg" />
                  <span class="viz__line" />
                </span>
                <span class="viz__chip viz__chip--1"><Check :size="12" :stroke-width="2.5" /></span>
                <span class="viz__chip viz__chip--2"><Globe :size="12" :stroke-width="2" /></span>
                <span class="viz__chip viz__chip--3"><Mail :size="12" :stroke-width="2" /></span>
                <span class="viz__chip viz__chip--4"><Share2 :size="12" :stroke-width="2" /></span>
              </div>
            </div>

            <span class="step__num">{{ String(i + 1).padStart(2, '0') }}</span>
            <h3 class="step__title">{{ step.title }}</h3>
            <p class="step__text">{{ step.text }}</p>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

<style scoped>
.steps {
  position: relative;
}

.steps__track {
  position: absolute;
  left: 16.66%;
  right: 16.66%;
  top: 130px;
  height: 1px;
  background: repeating-linear-gradient(90deg, var(--border) 0 6px, transparent 6px 12px);
}

.steps__progress {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, var(--violet), var(--cyan));
  transform-origin: left center;
}

.steps__list {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(20px, 3vw, 40px);
  padding: 0;
  margin: 0;
  list-style: none;
}

.step {
  text-align: center;
  padding: 0 12px;
}

.step__visual {
  position: relative;
  display: grid;
  place-items: center;
  width: 260px;
  max-width: 100%;
  height: 260px;
  margin: 0 auto 28px;
  border-radius: 50%;
  background: radial-gradient(circle, #fff 0%, #fff 55%, rgba(255, 255, 255, 0) 70%);
}

.step__num {
  display: inline-grid;
  place-items: center;
  height: 28px;
  padding-inline: 12px;
  border-radius: 99px;
  background: var(--violet-soft);
  color: var(--violet);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
}

.step__title {
  margin-top: 16px;
  font-size: clamp(24px, 2.4vw, 30px);
  font-weight: 800;
  letter-spacing: -0.03em;
}

.step__text {
  margin: 10px auto 0;
  max-width: 280px;
  color: var(--ink-2);
}

/* ---------- Mini ilustrações ---------- */

.viz {
  position: relative;
  width: 180px;
  height: 180px;
}

/* 01 */
.viz__phone {
  position: absolute;
  right: 34px;
  top: 14px;
  width: 78px;
  height: 150px;
  border-radius: 18px;
  background: #1b1a24;
  padding: 5px;
  box-shadow: 0 20px 40px -20px rgba(17, 17, 17, 0.45);
}

.viz__phone span {
  display: block;
  height: 100%;
  border-radius: 13px;
  background: linear-gradient(170deg, #efebff, #fff 55%);
}

.viz__card {
  position: absolute;
  left: 8px;
  top: 70px;
  display: grid;
  place-items: end;
  width: 100px;
  height: 63px;
  padding: 8px;
  border-radius: 9px;
  background: linear-gradient(135deg, #fff 60%, #efebff);
  border: 1px solid var(--border);
  color: var(--violet);
  box-shadow: 0 16px 30px -14px rgba(40, 30, 90, 0.35);
  animation: approach 3.2s var(--ease-in-out) infinite;
}

.viz__card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 30px;
  height: 30px;
  border-top-left-radius: 9px;
  background: linear-gradient(135deg, var(--violet) 50%, transparent 50%);
}

@keyframes approach {
  0%,
  100% {
    transform: translate(0, 0) rotate(-10deg);
  }
  45%,
  60% {
    transform: translate(34px, -8px) rotate(-4deg);
  }
}

/* 02 */
.viz--connect {
  display: grid;
  place-items: center;
}

.viz__ring {
  position: absolute;
  inset: 10px;
  border-radius: 50%;
  border: 1.5px solid var(--cyan);
  animation: ripple 2.8s var(--ease-out) infinite;
  opacity: 0;
}

.viz__ring:nth-child(2) {
  animation-delay: 0.9s;
  border-color: var(--violet-2);
}

.viz__ring:nth-child(3) {
  animation-delay: 1.8s;
}

@keyframes ripple {
  0% {
    transform: scale(0.4);
    opacity: 0.9;
  }
  100% {
    transform: scale(1.05);
    opacity: 0;
  }
}

.viz__core {
  position: relative;
  display: grid;
  place-items: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--violet);
  color: #fff;
  box-shadow: 0 16px 30px -12px rgba(86, 53, 245, 0.6);
}

/* 03 */
.viz__profile {
  position: absolute;
  left: 40px;
  top: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  width: 100px;
  height: 120px;
  padding-top: 16px;
  border-radius: 16px;
  background: #fff;
  border: 1px solid var(--border);
  box-shadow: 0 20px 40px -24px rgba(17, 17, 17, 0.3);
}

.viz__avatar {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--violet);
  color: #fff;
}

.viz__line {
  width: 44px;
  height: 6px;
  border-radius: 6px;
  background: var(--border);
}

.viz__line--lg {
  width: 62px;
  background: #d9d5ce;
}

.viz__chip {
  position: absolute;
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: #fff;
  border: 1px solid var(--border);
  color: var(--violet);
  box-shadow: var(--shadow-sm);
  animation: bob-chip 4s ease-in-out infinite;
}

.viz__chip--1 {
  right: 8px;
  top: 18px;
  background: var(--violet);
  border-color: var(--violet);
  color: #fff;
}

.viz__chip--2 {
  left: 4px;
  top: 64px;
  animation-delay: -1s;
}

.viz__chip--3 {
  right: 2px;
  top: 104px;
  animation-delay: -2s;
  color: var(--cyan);
}

.viz__chip--4 {
  left: 70px;
  bottom: -2px;
  animation-delay: -3s;
}

@keyframes bob-chip {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}

@media (max-width: 820px) {
  .steps__track {
    display: none;
  }

  .steps__list {
    grid-template-columns: 1fr;
    gap: 56px;
  }

  .step__visual {
    width: 220px;
    height: 220px;
    margin-bottom: 18px;
  }
}
</style>
