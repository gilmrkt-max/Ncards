<script setup>
import { ref } from 'vue'
import AppIcon from './ui/AppIcon.vue'
import { features } from '@/data/site'
import { useReveal } from '@/composables/useReveal'

const root = ref(null)
useReveal(root, { stagger: 0.07 })

/** Destaque de luz que acompanha o cursor dentro do card */
function trackGlow(e) {
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  el.style.setProperty('--mx', `${e.clientX - r.left}px`)
  el.style.setProperty('--my', `${e.clientY - r.top}px`)
}
</script>

<template>
  <section id="beneficios" ref="root" class="section features">
    <div class="container">
      <div class="features__head">
        <div class="section-head">
          <p class="eyebrow" data-reveal>Benefícios</p>
          <h2 class="section-title" data-reveal>
            Muito mais que um cartão.<br />
            <span class="accent">Uma vitrine da sua marca.</span>
          </h2>
        </div>
        <p class="section-lead features__lead" data-reveal>
          Tecnologia, praticidade e presença profissional reunidas em um único cartão que nunca fica desatualizado.
        </p>
      </div>

      <ul class="features__grid">
        <!-- reveal (GSAP) no <li>, hover (CSS) no <article>: transforms não competem -->
        <li v-for="(f, i) in features" :key="f.title" data-reveal>
          <article class="feature" @pointermove="trackGlow">
            <div class="feature__top">
              <span class="icon-tile"><AppIcon :name="f.icon" :size="22" /></span>
              <span class="feature__num">{{ String(i + 1).padStart(2, '0') }}</span>
            </div>
            <h3 class="feature__title">{{ f.title }}</h3>
            <p class="feature__text">{{ f.text }}</p>
          </article>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.features {
  padding-top: clamp(40px, 6vw, 80px);
}

.features__head {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  align-items: end;
  gap: 40px;
  margin-bottom: clamp(48px, 6vw, 72px);
}

.features__head .section-head {
  margin-bottom: 0;
}

.features__lead {
  max-width: 440px;
  justify-self: end;
}

.features__grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 20px;
}

.feature {
  --mx: 50%;
  --my: 0%;
  position: relative;
  height: 100%;
  padding: 28px 26px 30px;
  border-radius: 22px;
  background: var(--surface);
  border: 1px solid var(--border-soft);
  box-shadow: var(--shadow-xs);
  overflow: hidden;
  transition:
    transform 0.45s var(--ease-out),
    box-shadow 0.45s var(--ease-out),
    border-color 0.45s var(--ease-out);
}

/* luz violeta que segue o cursor */
.feature::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(260px circle at var(--mx) var(--my), rgba(112, 71, 255, 0.08), transparent 70%);
  opacity: 0;
  transition: opacity 0.45s var(--ease-out);
  pointer-events: none;
}

/* filete superior roxo */
.feature::after {
  content: '';
  position: absolute;
  left: 26px;
  right: 26px;
  top: 0;
  height: 2px;
  border-radius: 0 0 2px 2px;
  background: linear-gradient(90deg, var(--violet), var(--violet-2));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.55s var(--ease-out);
}

.feature:hover {
  transform: translateY(-4px);
  border-color: rgba(86, 53, 245, 0.18);
  box-shadow: 0 1px 2px rgba(17, 17, 17, 0.03), 0 22px 40px -22px rgba(40, 30, 90, 0.22);
}

.feature:hover::before {
  opacity: 1;
}

.feature:hover::after {
  transform: scaleX(1);
}

.feature:hover .icon-tile {
  background: var(--violet);
  border-color: var(--violet);
  color: #fff;
}

.feature__top {
  position: relative;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.feature__num {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: #cfcac2;
}

.feature__title {
  position: relative;
  margin-top: 34px;
  font-size: 18px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.feature__text {
  position: relative;
  margin-top: 8px;
  font-size: 14.5px;
  line-height: 1.6;
  color: var(--ink-2);
}

@media (max-width: 1100px) {
  .features__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 820px) {
  .features__head {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .features__lead {
    justify-self: start;
    margin-top: 18px;
  }
}

@media (max-width: 560px) {
  .features__grid {
    grid-template-columns: 1fr;
    gap: 14px;
  }

  .feature__title {
    margin-top: 22px;
  }
}
</style>
