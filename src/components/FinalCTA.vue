<script setup>
import { ref } from 'vue'
import { ArrowRight, ShieldCheck, Zap, RefreshCw } from 'lucide-vue-next'
import { brand } from '@/data/site'
import { useReveal } from '@/composables/useReveal'

const root = ref(null)
useReveal(root, { stagger: 0.1 })

const trust = [
  { icon: Zap, label: 'Pronto em poucos dias' },
  { icon: RefreshCw, label: 'Atualize quando quiser' },
  { icon: ShieldCheck, label: 'Sem aplicativo' }
]
</script>

<template>
  <section id="contato" ref="root" class="cta-wrap">
    <div class="container">
      <div class="cta" data-reveal="scale">
        <div class="cta__grid" aria-hidden="true" />
        <div class="cta__waves" aria-hidden="true">
          <span /><span /><span /><span />
        </div>

        <div class="cta__content">
          <p class="eyebrow cta__eyebrow" data-reveal>Comece agora</p>
          <h2 class="cta__title" data-reveal>
            Transforme seu cartão de visita em uma <span>experiência.</span>
          </h2>
          <p class="cta__text" data-reveal>
            Conecte sua marca às pessoas de uma forma mais moderna, prática e inteligente.
          </p>

          <div class="cta__actions" data-reveal>
            <a href="#planos" class="btn btn--primary btn--lg">
              Criar meu cartão
              <ArrowRight class="btn__arrow" :size="18" :stroke-width="2" />
            </a>
            <a :href="brand.whatsapp" target="_blank" rel="noopener" class="btn btn--lg cta__secondary">
              Falar com um especialista
            </a>
          </div>

          <ul class="cta__trust" data-reveal>
            <li v-for="t in trust" :key="t.label">
              <component :is="t.icon" :size="16" :stroke-width="2" />
              {{ t.label }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cta-wrap {
  padding-block: clamp(40px, 6vw, 80px) clamp(80px, 10vw, 120px);
}

.cta {
  position: relative;
  overflow: hidden;
  padding: clamp(56px, 8vw, 110px) clamp(24px, 6vw, 80px);
  border-radius: 32px;
  background: #111018;
  color: #fff;
  text-align: center;
  isolation: isolate;
}

.cta::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(60% 80% at 50% 115%, rgba(86, 53, 245, 0.55), transparent 70%),
    radial-gradient(30% 40% at 90% 0%, rgba(0, 184, 230, 0.16), transparent 70%);
}

.cta__grid {
  position: absolute;
  inset: 0;
  z-index: -1;
  background-image:
    linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 64px 64px;
  -webkit-mask-image: radial-gradient(ellipse 60% 70% at 50% 50%, #000, transparent 80%);
  mask-image: radial-gradient(ellipse 60% 70% at 50% 50%, #000, transparent 80%);
}

.cta__waves {
  position: absolute;
  left: 50%;
  bottom: -340px;
  z-index: -1;
  width: 680px;
  height: 680px;
  transform: translateX(-50%);
}

.cta__waves span {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1px solid rgba(160, 140, 255, 0.35);
  animation: cta-wave 8s linear infinite;
  opacity: 0;
}

.cta__waves span:nth-child(2) {
  animation-delay: -2s;
}
.cta__waves span:nth-child(3) {
  animation-delay: -4s;
}
.cta__waves span:nth-child(4) {
  animation-delay: -6s;
}

@keyframes cta-wave {
  0% {
    transform: scale(0.2);
    opacity: 0;
  }
  15% {
    opacity: 0.9;
  }
  100% {
    transform: scale(1.3);
    opacity: 0;
  }
}

.cta__content {
  max-width: 820px;
  margin-inline: auto;
}

.cta__eyebrow {
  color: #a896ff;
}

.cta__eyebrow::after {
  content: '';
  width: 34px;
  height: 1px;
  background: currentColor;
  opacity: 0.8;
}

.cta__title {
  margin-top: 22px;
  font-size: clamp(34px, 5.2vw, 64px);
  font-weight: 800;
  line-height: 1.06;
  letter-spacing: -0.032em;
}

.cta__title span {
  color: #9d85ff;
}

.cta__text {
  max-width: 560px;
  margin: 22px auto 0;
  font-size: clamp(16px, 1.4vw, 19px);
  color: rgba(255, 255, 255, 0.66);
}

.cta__actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 14px;
  margin-top: 40px;
}

.cta__secondary {
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.04);
}

.cta__secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.cta__trust {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px 28px;
  margin-top: 40px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
}

.cta__trust li {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.cta__trust svg {
  color: #9d85ff;
}

@media (max-width: 520px) {
  .cta {
    border-radius: 24px;
  }

  .cta__actions .btn {
    width: 100%;
  }
}
</style>
