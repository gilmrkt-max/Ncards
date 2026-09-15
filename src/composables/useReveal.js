import { onMounted, onBeforeUnmount } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from './useReducedMotion'

gsap.registerPlugin(ScrollTrigger)

/**
 * Anima a entrada de todos os [data-reveal] dentro do elemento raiz
 * conforme entram na viewport. Elementos próximos entram em cascata.
 *
 * data-reveal="up" (padrão) | "fade" | "scale"
 */
export function useReveal(rootRef, { y = 28, stagger = 0.08 } = {}) {
  let ctx

  onMounted(() => {
    const root = rootRef.value
    if (!root) return

    ctx = gsap.context(() => {
      const items = gsap.utils.toArray('[data-reveal]', root)
      if (!items.length) return

      if (prefersReducedMotion()) {
        gsap.set(items, { opacity: 1 })
        return
      }

      const from = (el) => {
        const type = el.dataset.reveal
        if (type === 'fade') return { opacity: 0 }
        if (type === 'scale') return { opacity: 0, scale: 0.96, y: y / 2 }
        return { opacity: 0, y }
      }

      items.forEach((el) => gsap.set(el, from(el)))

      ScrollTrigger.batch(items, {
        start: 'top 88%',
        once: true,
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: 'power3.out',
            stagger,
            overwrite: true,
            clearProps: 'transform'
          })
      })
    }, root)
  })

  onBeforeUnmount(() => ctx?.revert())
}
