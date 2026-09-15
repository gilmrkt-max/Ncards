<script setup>
import { ref } from 'vue'
import AppIcon from './ui/AppIcon.vue'
import { benefits } from '@/data/site'
import { useReveal } from '@/composables/useReveal'

const root = ref(null)
useReveal(root, { stagger: 0.1 })
</script>

<template>
  <section ref="root" class="benefits" aria-label="Principais benefícios">
    <div class="container">
      <ul class="benefits__card surface" data-reveal="fade">
        <li v-for="(item, i) in benefits" :key="item.title" class="benefit" data-reveal>
          <span class="icon-tile"><AppIcon :name="item.icon" :size="24" /></span>
          <div>
            <span class="benefit__num">{{ String(i + 1).padStart(2, '0') }}</span>
            <h3 class="benefit__title">{{ item.title }}</h3>
            <p class="benefit__text">{{ item.text }}</p>
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.benefits {
  position: relative;
  z-index: 2;
  padding-block: 24px 0;
}

.benefits__card {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  padding: 40px 12px;
  border-radius: var(--radius-lg);
}

.benefit {
  position: relative;
  display: flex;
  gap: 22px;
  padding: 6px clamp(18px, 2.4vw, 36px);
}

.benefit + .benefit::before {
  content: '';
  position: absolute;
  left: 0;
  top: 6px;
  bottom: 6px;
  width: 1px;
  background: var(--border);
}

.benefit:hover .icon-tile {
  background: var(--violet);
  border-color: var(--violet);
  color: #fff;
}

.benefit__num {
  display: block;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  color: var(--ink-3);
}

.benefit__title {
  margin-top: 2px;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: -0.015em;
  line-height: 1.3;
}

.benefit__text {
  margin-top: 8px;
  font-size: 14.5px;
  line-height: 1.6;
  color: var(--ink-2);
}

@media (max-width: 1100px) {
  .benefits__card {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    row-gap: 36px;
  }

  .benefit:nth-child(3)::before {
    display: none;
  }
}

@media (max-width: 640px) {
  .benefits__card {
    grid-template-columns: 1fr;
    padding: 12px 4px;
    row-gap: 0;
  }

  .benefit {
    padding: 22px 20px;
  }

  .benefit + .benefit::before {
    display: block !important;
    left: 20px;
    right: 20px;
    top: 0;
    bottom: auto;
    width: auto;
    height: 1px;
  }
}
</style>
