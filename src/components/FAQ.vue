<script setup>
import { ref } from 'vue'
import { Plus } from 'lucide-vue-next'
import { faqs } from '@/data/site'
import { useReveal } from '@/composables/useReveal'

const root = ref(null)
const openIndex = ref(0)
useReveal(root, { stagger: 0.06 })

const toggle = (i) => (openIndex.value = openIndex.value === i ? -1 : i)
</script>

<template>
  <section id="faq" ref="root" class="section faq">
    <div class="container faq__inner">
      <div class="section-head faq__head">
        <p class="eyebrow" data-reveal>FAQ</p>
        <h2 class="section-title" data-reveal>Perguntas <span class="accent">frequentes.</span></h2>
        <p class="section-lead" data-reveal>
          Ainda com dúvidas? Fale com a nossa equipe e receba uma demonstração do cartão.
        </p>
      </div>

      <ul class="faq__list">
        <li v-for="(item, i) in faqs" :key="item.q" data-reveal>
          <div class="qa" :class="{ 'is-open': openIndex === i }">
            <h3>
              <button
                :id="`faq-q-${i}`"
                class="qa__q"
                :aria-expanded="openIndex === i"
                :aria-controls="`faq-a-${i}`"
                @click="toggle(i)"
              >
                {{ item.q }}
                <span class="qa__icon"><Plus :size="16" :stroke-width="2" /></span>
              </button>
            </h3>
            <div :id="`faq-a-${i}`" class="qa__a" role="region" :aria-labelledby="`faq-q-${i}`">
              <div>
                <p>{{ item.a }}</p>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.faq__inner {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr);
  gap: clamp(40px, 6vw, 96px);
  align-items: start;
}

.faq__head {
  position: sticky;
  top: calc(var(--header-h) + 48px);
}

.faq__list {
  display: grid;
  gap: 12px;
}

.qa {
  border-radius: var(--radius);
  background: var(--surface);
  border: 1px solid var(--border-soft);
  transition:
    border-color 0.35s var(--ease-out),
    box-shadow 0.35s var(--ease-out);
}

.qa.is-open {
  border-color: rgba(86, 53, 245, 0.2);
  box-shadow: var(--shadow-sm);
}

.qa__q {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  width: 100%;
  padding: 22px 24px;
  text-align: left;
  font-size: 16.5px;
  font-weight: 600;
  letter-spacing: -0.01em;
  line-height: 1.4;
}

.qa__icon {
  display: grid;
  place-items: center;
  flex: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid var(--border);
  color: var(--ink-2);
  transition:
    transform 0.45s var(--ease-out),
    background-color 0.35s var(--ease-out),
    color 0.35s var(--ease-out),
    border-color 0.35s var(--ease-out);
}

.is-open .qa__icon {
  transform: rotate(45deg);
  background: var(--violet);
  border-color: var(--violet);
  color: #fff;
}

/* altura animada sem medir via JS */
.qa__a {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.45s var(--ease-out);
}

.is-open .qa__a {
  grid-template-rows: 1fr;
}

.qa__a > div {
  overflow: hidden;
}

.qa__a p {
  padding: 0 24px 24px;
  max-width: 620px;
  color: var(--ink-2);
}

@media (max-width: 900px) {
  .faq__inner {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .faq__head {
    position: static;
  }

  .qa__q {
    padding: 18px 18px;
    font-size: 15.5px;
  }

  .qa__a p {
    padding: 0 18px 20px;
  }
}
</style>
