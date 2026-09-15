<script setup>
/** Ícones de redes sociais em SVG inline (traço, no mesmo estilo do Lucide). */
defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: 18 }
})
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <template v-if="name === 'instagram'">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.3" cy="6.7" r="0.6" fill="currentColor" stroke="none" />
    </template>
    <template v-else-if="name === 'linkedin'">
      <rect x="3" y="3" width="18" height="18" rx="3.5" />
      <path d="M8 10.5V16M8 7.6v.01M11.5 16v-3.2c0-1.4.9-2.3 2.1-2.3s2 .9 2 2.3V16M11.5 10.5V16" />
    </template>
    <template v-else-if="name === 'youtube'">
      <path d="M2.8 8.2c.2-1.6 1.4-2.8 3-2.9C7.7 5.1 9.8 5 12 5s4.3.1 6.2.3c1.6.1 2.8 1.3 3 2.9.2 1.3.3 2.5.3 3.8s-.1 2.5-.3 3.8c-.2 1.6-1.4 2.8-3 2.9-1.9.2-4 .3-6.2.3s-4.3-.1-6.2-.3c-1.6-.1-2.8-1.3-3-2.9C2.6 14.5 2.5 13.3 2.5 12s.1-2.5.3-3.8Z" />
      <path d="m10.2 9.2 4.6 2.8-4.6 2.8Z" fill="currentColor" />
    </template>
    <template v-else-if="name === 'whatsapp'">
      <path d="M3.5 20.5l1.3-4.1A8.5 8.5 0 1 1 8 19.3Z" />
      <path d="M9.1 8.4c.2-.4.5-.5.8-.5h.5c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .5-.1.6l-.5.6c-.1.2-.1.4 0 .6.6 1 1.4 1.8 2.4 2.3.2.1.4.1.6-.1l.6-.6c.2-.2.4-.2.6-.1l1.6.8c.2.1.4.3.4.5v.5c0 .4-.2.7-.5.9-.6.4-1.4.5-2.1.3-2.6-.8-4.6-2.8-5.4-5.4-.2-.7-.1-1.4.3-2Z" fill="currentColor" stroke="none" />
    </template>
  </svg>
</template>
