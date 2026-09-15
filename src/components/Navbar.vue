<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { gsap } from 'gsap'
import { ArrowRight, Menu, X } from 'lucide-vue-next'
import BrandLogo from './ui/BrandLogo.vue'
import { navLinks } from '@/data/site'
import { prefersReducedMotion } from '@/composables/useReducedMotion'

const header = ref(null)
const active = ref('inicio')
const scrolled = ref(false)
const open = ref(false)

let observer

function onScroll() {
  scrolled.value = window.scrollY > 12
}

function close() {
  open.value = false
}

function onKey(e) {
  if (e.key === 'Escape') close()
}

watch(open, (v) => document.body.classList.toggle('no-scroll', v))

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKey)

  // Marca o link da seção que ocupa a faixa central da viewport
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) active.value = entry.target.id
      })
    },
    { rootMargin: '-45% 0px -50% 0px' }
  )
  navLinks.forEach(({ id }) => {
    const el = document.getElementById(id)
    if (el) observer.observe(el)
  })

  if (!prefersReducedMotion()) {
    gsap.from(header.value, { y: -24, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.05 })
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKey)
  observer?.disconnect()
  document.body.classList.remove('no-scroll')
})
</script>

<template>
  <header ref="header" class="nav" :class="{ 'is-scrolled': scrolled, 'is-open': open }">
    <nav class="nav__bar" aria-label="Principal">
      <a href="#inicio" class="nav__logo" aria-label="Nmento Technology — início" @click="close">
        <BrandLogo :height="46" eager />
      </a>

      <ul class="nav__links">
        <li v-for="link in navLinks" :key="link.id">
          <a
            :href="`#${link.id}`"
            class="nav__link"
            :class="{ 'is-active': active === link.id }"
            :aria-current="active === link.id ? 'true' : undefined"
          >
            {{ link.label }}
          </a>
        </li>
      </ul>

      <a href="#planos" class="btn btn--primary btn--sm nav__cta">
        Quero meu cartão
        <ArrowRight class="btn__arrow" :size="16" :stroke-width="2" />
      </a>

      <button
        class="nav__toggle"
        :aria-expanded="open"
        aria-controls="mobile-menu"
        :aria-label="open ? 'Fechar menu' : 'Abrir menu'"
        @click="open = !open"
      >
        <X v-if="open" :size="22" :stroke-width="2" />
        <Menu v-else :size="22" :stroke-width="2" />
      </button>
    </nav>

    <Transition name="drop">
      <div v-if="open" id="mobile-menu" class="nav__panel">
        <ul>
          <li v-for="link in navLinks" :key="link.id">
            <a :href="`#${link.id}`" :class="{ 'is-active': active === link.id }" @click="close">
              {{ link.label }}
              <ArrowRight :size="16" :stroke-width="2" />
            </a>
          </li>
        </ul>
        <a href="#planos" class="btn btn--primary btn--block" @click="close">
          Quero meu cartão
          <ArrowRight class="btn__arrow" :size="18" :stroke-width="2" />
        </a>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.nav {
  position: fixed;
  z-index: 50;
  top: 16px;
  left: 0;
  right: 0;
  width: var(--container);
  margin-inline: auto;
}

.nav__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  height: var(--header-h);
  padding: 0 14px 0 28px;
  border-radius: var(--radius);
  background: rgba(255, 255, 255, 0.62);
  border: 1px solid #e8e6e2;
  backdrop-filter: blur(14px) saturate(1.4);
  -webkit-backdrop-filter: blur(14px) saturate(1.4);
  transition:
    background-color 0.4s var(--ease-out),
    box-shadow 0.4s var(--ease-out);
}

.is-scrolled .nav__bar,
.is-open .nav__bar {
  background: rgba(255, 255, 255, 0.86);
  box-shadow: 0 10px 30px -18px rgba(17, 17, 17, 0.18);
}

.nav__logo {
  display: flex;
  flex: none;
}

.nav__links {
  display: flex;
  align-items: center;
  gap: clamp(20px, 3.2vw, 52px);
}

.nav__link {
  position: relative;
  display: block;
  padding: 8px 4px;
  font-size: 15px;
  font-weight: 500;
  color: #333;
  transition: color 0.3s var(--ease-out);
}

.nav__link::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -4px;
  height: 2px;
  border-radius: 2px;
  background: var(--violet);
  transform: scaleX(0);
  transition: transform 0.45s var(--ease-out);
}

.nav__link:hover {
  color: var(--ink);
}

.nav__link.is-active {
  color: var(--violet);
}

.nav__link.is-active::after {
  transform: scaleX(1);
}

.nav__cta {
  flex: none;
}

.nav__toggle {
  display: none;
  place-items: center;
  width: 46px;
  height: 46px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: #fff;
}

.nav__panel {
  margin-top: 10px;
  padding: 12px;
  border-radius: var(--radius);
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid #e8e6e2;
  box-shadow: var(--shadow);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

.nav__panel ul {
  margin-bottom: 12px;
}

.nav__panel li a {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 12px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
}

.nav__panel li a svg {
  color: var(--ink-3);
}

.nav__panel li a.is-active,
.nav__panel li a:hover {
  background: var(--violet-soft);
  color: var(--violet);
}

.drop-enter-active,
.drop-leave-active {
  transition:
    opacity 0.3s var(--ease-out),
    transform 0.4s var(--ease-out);
}

.drop-enter-from,
.drop-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (max-width: 1024px) {
  .nav__links {
    gap: 22px;
  }
  .nav__link {
    font-size: 14px;
  }
}

@media (max-width: 900px) {
  .nav {
    top: 12px;
    width: calc(100vw - 24px);
  }

  .nav__bar {
    height: 64px;
    padding: 0 9px 0 18px;
  }

  .nav__links,
  .nav__cta {
    display: none;
  }

  .nav__toggle {
    display: grid;
  }

  .nav__logo :deep(.brand-logo) {
    height: 38px !important;
  }
}
</style>

<style>
body.no-scroll {
  overflow: hidden;
}
</style>
