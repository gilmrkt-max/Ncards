# Cartão de Visita Inteligente — Nmento Technology

Landing page do cartão de visita NFC + QR Code. Vue 3, Vite, Three.js e GSAP.

## Como rodar

```bash
npm install
npm run dev       # desenvolvimento
npm run build     # build de produção em /dist
npm run preview   # servir o build localmente
```

## Logo oficial (obrigatório)

Coloque a logo em **`public/brand/nmento-logo.png`** (PNG com fundo transparente, pelo menos 1200 px de largura).
Ela é usada sem alterações no header, no footer, no smartphone e **na textura do cartão 3D**.
Enquanto o arquivo não existir, aparece só o nome da empresa em texto.

## Estrutura

```
src/
├─ App.vue
├─ data/site.js              ← textos, links, planos, FAQ, URL do QR Code
├─ styles/main.css           ← tokens de design (cores, raios, sombras), botões, base
├─ composables/
│  ├─ useReveal.js           ← animações de entrada no scroll (GSAP ScrollTrigger)
│  └─ useReducedMotion.js    ← respeita prefers-reduced-motion
├─ three/
│  ├─ CardScene.js           ← cena 3D: cartão, luzes, flutuação, parallax, ondas NFC, toque
│  └─ cardTextures.js        ← frente/verso desenhados em canvas (logo, NFC, QR Code real)
└─ components/
   ├─ Navbar.vue  Hero.vue  InteractiveCard.vue  SmartphoneMockup.vue
   ├─ Benefits.vue  HowItWorks.vue  Features.vue  Pricing.vue  FAQ.vue
   ├─ FinalCTA.vue  Footer.vue
   └─ ui/ (BrandLogo, AppIcon, BrandIcon)
```

## Interação do Hero

| Estado | O que acontece |
| --- | --- |
| Repouso | O cartão flutua (seno em Y com leve rotação em X/Y/Z), as ondas NFC pulsam e o smartphone fica ao fundo |
| Mouse na página | O cartão inclina na direção do cursor com suavização exponencial e volta devagar ao centro quando o mouse sai |
| Hover no cartão (raycast) | O cartão se aproxima do smartphone, as ondas ficam mais intensas, o telefone reage e mostra "Pronto para conectar" |
| Clique/toque | O cartão encosta no smartphone, que mostra "Conectando via NFC…", abre o perfil e anima os itens |

## Performance

- Three.js fica em um chunk próprio e só carrega com o cartão (`defineAsyncComponent`). O texto do Hero não espera o 3D.
- Pixel ratio limitado (2 no desktop, 1.5 no mobile). No mobile a textura é menor e o material mais simples.
- O loop de render pausa quando o cartão sai da tela ou a aba fica oculta.
- Sem WebGL, aparece um cartão estático em CSS.
- Com `prefers-reduced-motion`: sem parallax, flutuação mínima e reveals instantâneos.

## Personalização rápida

- **Preços e planos:** `src/data/site.js` → `plans` (`price: null` exibe "Sob consulta"; `price: '89'` exibe R$ 89)
- **URL do QR Code:** `brand.profileUrl`
- **WhatsApp / e-mail / redes:** `brand` e `socials`
- **Pose e intensidade do cartão:** constantes `BASE` e `#render()` em `src/three/CardScene.js`
- **Tamanho/posição do cartão por breakpoint:** `LAYOUTS` em `InteractiveCard.vue`
