// PROTOTYPE, throw away once a phone menu is picked.
// Open state the menu variants share: Escape and any navigation close it.
export function useMenuToggle() {
  const open = ref(false)
  const route = useRoute()
  watch(
    () => route.fullPath,
    () => (open.value = false)
  )

  function onKey(event: KeyboardEvent) {
    if (event.key === 'Escape') open.value = false
  }
  onMounted(() => window.addEventListener('keydown', onKey))
  onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

  return {
    open,
    close: () => (open.value = false),
    toggle: () => (open.value = !open.value)
  }
}
