<script setup lang="ts">
/**
 * PROTOTYPE, throw away once a Work layout is picked.
 * Floating bar that cycles `?variant=` with its arrows or the ← → keys.
 */
const { variants, current } = defineProps<{
  variants: readonly { key: string; name: string }[]
  current: string
}>()

const router = useRouter()
const route = useRoute()

const index = computed(() =>
  Math.max(
    0,
    variants.findIndex((v) => v.key === current)
  )
)
const label = computed(() => {
  const v = variants[index.value]!
  return `${v.key} · ${v.name}`
})

function go(step: number) {
  const next =
    variants[(index.value + step + variants.length) % variants.length]!
  router.replace({ query: { ...route.query, variant: next.key } })
}

function onKey(event: KeyboardEvent) {
  const target = event.target as HTMLElement | null
  if (target?.closest('input, textarea, [contenteditable]')) return
  if (event.key === 'ArrowLeft') go(-1)
  if (event.key === 'ArrowRight') go(1)
}
onMounted(() => window.addEventListener('keydown', onKey))
onBeforeUnmount(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div
    class="fixed top-[26px] left-1/2 max-[720px]:top-auto max-[720px]:bottom-[60px] z-50 flex -translate-x-1/2 items-center gap-1 rounded-full bg-[#fff] px-1.5 py-1 [font-family:system-ui] text-[13px] text-[#000] shadow-[0_4px_24px_rgb(0_0_0/0.6)]"
  >
    <button
      type="button"
      class="rounded-full px-2.5 py-1 hover:bg-[rgb(0_0_0/0.1)]"
      aria-label="Previous variant"
      @click="go(-1)"
    >
      ←
    </button>
    <span class="min-w-[170px] text-center font-semibold">{{ label }}</span>
    <button
      type="button"
      class="rounded-full px-2.5 py-1 hover:bg-[rgb(0_0_0/0.1)]"
      aria-label="Next variant"
      @click="go(1)"
    >
      →
    </button>
  </div>
</template>
