<script setup>
import BrandLogo from './ui/BrandLogo.vue'
import BrandIcon from './ui/BrandIcon.vue'
import { brand, socials } from '@/data/site'

const links = [
  { href: '#inicio', label: 'Início' },
  { href: '#como-funciona', label: 'Como funciona' },
  { href: '#beneficios', label: 'Benefícios' },
  { href: '#planos', label: 'Planos' },
  { href: '#faq', label: 'FAQ' },
  { href: '#contato', label: 'Contato' }
]
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="footer__top">
        <div class="footer__brand">
          <BrandLogo :height="48" />
          <p>Cartões de visita inteligentes com NFC + QR Code para marcas que querem ser lembradas.</p>
        </div>

        <nav aria-label="Rodapé">
          <ul class="footer__links">
            <li v-for="l in links" :key="l.href">
              <a :href="l.href">{{ l.label }}</a>
            </li>
          </ul>
        </nav>

        <ul class="footer__socials">
          <li v-for="s in socials" :key="s.name">
            <a :href="s.href" :aria-label="s.name" target="_blank" rel="noopener">
              <BrandIcon :name="s.icon" :size="18" />
            </a>
          </li>
        </ul>
      </div>

      <div class="footer__bottom">
        <p>© 2026 Nmento Technology. Todos os direitos reservados.</p>
        <a :href="`mailto:${brand.email}`">{{ brand.email }}</a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  border-top: 1px solid var(--border);
  background: rgba(255, 255, 255, 0.5);
}

.footer__top {
  display: grid;
  grid-template-columns: 1.1fr 1.5fr auto;
  align-items: center;
  gap: 40px;
  padding-block: 56px 44px;
}

.footer__brand p {
  margin-top: 16px;
  max-width: 320px;
  font-size: 14.5px;
  color: var(--ink-2);
}

.footer__links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px 32px;
}

.footer__links a {
  font-size: 15px;
  font-weight: 500;
  color: #3a3a3a;
  transition: color 0.3s var(--ease-out);
}

.footer__links a:hover {
  color: var(--violet);
}

.footer__socials {
  display: flex;
  gap: 10px;
}

.footer__socials a {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: #fff;
  color: var(--ink);
  transition:
    color 0.3s var(--ease-out),
    border-color 0.3s var(--ease-out),
    transform 0.3s var(--ease-out);
}

.footer__socials a:hover {
  color: var(--violet);
  border-color: rgba(86, 53, 245, 0.35);
  transform: translateY(-2px);
}

.footer__bottom {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 12px;
  padding-block: 24px 32px;
  border-top: 1px solid var(--border-soft);
  font-size: 13.5px;
  color: var(--ink-3);
}

.footer__bottom a:hover {
  color: var(--violet);
}

@media (max-width: 900px) {
  .footer__top {
    grid-template-columns: 1fr;
    justify-items: center;
    text-align: center;
    gap: 32px;
  }

  .footer__brand {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .footer__bottom {
    justify-content: center;
    text-align: center;
  }
}
</style>
