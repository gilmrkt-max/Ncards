<script setup>
import { ref } from 'vue'
import { Check, ArrowRight, Sparkles } from 'lucide-vue-next'
import { plans } from '@/data/site'
import { useReveal } from '@/composables/useReveal'

const root = ref(null)
useReveal(root, { stagger: 0.12 })
</script>

<template>
  <section id="planos" ref="root" class="section pricing">
    <div class="container">
      <div class="section-head section-head--center">
        <p class="eyebrow" data-reveal>Planos</p>
        <h2 class="section-title" data-reveal>Escolha como sua marca <span class="accent">se conecta.</span></h2>
        <p class="section-lead" data-reveal>
          Para profissionais, empreendedores e equipes inteiras. Fale com a gente e receba um orçamento sob medida.
        </p>
      </div>

      <ul class="plans">
        <li v-for="plan in plans" :key="plan.name" data-reveal>
          <article class="plan" :class="{ 'plan--featured': plan.featured }">
            <span v-if="plan.featured" class="plan__tag">
              <Sparkles :size="13" :stroke-width="2" /> Mais escolhido
            </span>

            <header>
              <h3 class="plan__name">{{ plan.name }}</h3>
              <p class="plan__desc">{{ plan.description }}</p>
            </header>

            <div class="plan__price">
              <template v-if="plan.price">
                <span class="plan__currency">R$</span>
                <span class="plan__value">{{ plan.price }}</span>
              </template>
              <span v-else class="plan__value plan__value--text">Sob consulta</span>
              <span class="plan__period">{{ plan.period }}</span>
            </div>

            <a
              href="#contato"
              class="btn btn--block"
              :class="plan.featured ? 'btn--primary' : 'btn--ghost'"
            >
              {{ plan.cta }}
              <ArrowRight class="btn__arrow" :size="17" :stroke-width="2" />
            </a>

            <ul class="plan__features">
              <li v-for="feat in plan.features" :key="feat">
                <span class="plan__check"><Check :size="12" :stroke-width="3" /></span>
                {{ feat }}
              </li>
            </ul>
          </article>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.pricing {
  background: linear-gradient(180deg, transparent 0%, rgba(255, 255, 255, 0.6) 30%, rgba(255, 255, 255, 0.6) 70%, transparent 100%);
}

.plans {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 22px;
  align-items: stretch;
  max-width: 1160px;
  margin-inline: auto;
}

.plans > li {
  display: flex;
}

.plan {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 36px 32px 38px;
  border-radius: var(--radius-lg);
  background: var(--surface);
  border: 1px solid var(--border-soft);
  box-shadow: var(--shadow-sm);
  transition:
    transform 0.45s var(--ease-out),
    box-shadow 0.45s var(--ease-out);
}

.plan:hover {
  transform: translateY(-4px);
  box-shadow: 0 1px 2px rgba(17, 17, 17, 0.03), 0 26px 50px -26px rgba(40, 30, 90, 0.25);
}

.plan--featured {
  border: 1.5px solid var(--violet);
  box-shadow:
    0 0 0 6px rgba(86, 53, 245, 0.06),
    0 30px 60px -30px rgba(86, 53, 245, 0.45);
}

.plan--featured:hover {
  box-shadow:
    0 0 0 6px rgba(86, 53, 245, 0.08),
    0 36px 70px -30px rgba(86, 53, 245, 0.55);
}

.plan--featured::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(120% 60% at 50% 0%, rgba(112, 71, 255, 0.07), transparent 60%);
  pointer-events: none;
}

.plan__tag {
  position: absolute;
  top: -14px;
  left: 32px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  padding-inline: 12px;
  border-radius: 99px;
  background: var(--violet);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  box-shadow: var(--shadow-violet);
}

.plan__name {
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.plan--featured .plan__name {
  color: var(--violet);
}

.plan__desc {
  margin-top: 8px;
  min-height: 3.2em;
  font-size: 14.5px;
  line-height: 1.6;
  color: var(--ink-2);
}

.plan__price {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  column-gap: 6px;
  margin: 28px 0 28px;
  padding-top: 26px;
  border-top: 1px solid var(--border-soft);
}

.plan__currency {
  font-size: 18px;
  font-weight: 700;
  color: var(--ink-2);
}

.plan__value {
  font-size: 52px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.04em;
}

.plan__value--text {
  font-size: 34px;
  line-height: 52px;
}

.plan__period {
  flex-basis: 100%;
  margin-top: 8px;
  font-size: 13.5px;
  color: var(--ink-3);
}

.plan__features {
  display: grid;
  gap: 14px;
  margin-top: 30px;
}

.plan__features li {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 15px;
  font-weight: 500;
  color: #2b2b2b;
}

.plan__check {
  display: grid;
  place-items: center;
  flex: none;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--violet-soft);
  color: var(--violet);
}

.plan--featured .plan__check {
  background: var(--violet);
  color: #fff;
}

@media (max-width: 980px) {
  .plans {
    grid-template-columns: 1fr;
    max-width: 480px;
    gap: 30px;
  }

  .plan__desc {
    min-height: 0;
  }
}
</style>
