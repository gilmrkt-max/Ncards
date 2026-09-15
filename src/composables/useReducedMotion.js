import { ref, onMounted, onBeforeUnmount } from 'vue'

const QUERY = '(prefers-reduced-motion: reduce)'

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia(QUERY).matches
}

/** Ref reativa que acompanha a preferência "reduzir movimento" do sistema. */
export function useReducedMotion() {
  const reduced = ref(prefersReducedMotion())
  let mql

  const update = (e) => (reduced.value = e.matches)

  onMounted(() => {
    mql = window.matchMedia(QUERY)
    reduced.value = mql.matches
    mql.addEventListener('change', update)
  })

  onBeforeUnmount(() => mql?.removeEventListener('change', update))

  return reduced
}
