<script setup lang="ts">
/**
 * Home: the name at the heart of the lattice, with the eyebrow above it and
 * the role and tagline below.
 *
 * It rises into place once, just after the first load, together with the
 * lattice. Coming back to Home later shows it at once.
 */
// No crumb: the layout invites a choice instead.
definePageMeta({ turn: 0 })

const revealed = useState('home-revealed', () => false)
let revealTimer: ReturnType<typeof setTimeout> | undefined
onMounted(() => {
  if (!revealed.value) {
    revealTimer = setTimeout(() => (revealed.value = true), 180)
  }
})
onBeforeUnmount(() => clearTimeout(revealTimer))

const reveal = computed(() => [
  'transition-[opacity,translate] duration-1000 ease-[ease] motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none',
  { 'translate-y-2.5 opacity-0': !revealed.value }
])
</script>

<template>
  <div class="text-center">
    <div
      data-eyebrow
      class="mb-[22px] flex items-center justify-center gap-3.5 font-mono text-[12px] tracking-[5px] text-gold-hi delay-500"
      :class="reveal"
    >
      <span
        aria-hidden="true"
        class="h-px w-[34px] bg-[linear-gradient(90deg,transparent,var(--color-gold),transparent)]"
      />
      <span lang="ar" class="font-serif text-[20px] tracking-normal text-pearl">
        دمشق
      </span>
      <span>DAMASCUS → SITTARD</span>
      <span
        aria-hidden="true"
        class="h-px w-[34px] bg-[linear-gradient(90deg,transparent,var(--color-gold),transparent)]"
      />
    </div>
    <!-- Sized by the screen's height as well as its width, like the lattice,
         so on wide screens the name stays inside the ring. -->
    <h1
      id="home-title"
      tabindex="-1"
      class="text-[clamp(52px,min(11vw,13dvh),140px)] leading-[0.9] font-medium tracking-[1px] text-ink delay-[680ms] focus:outline-none"
      :class="reveal"
    >
      Anas <span class="font-normal italic">Azkoul</span>
    </h1>
    <DiamondDivider
      class="mx-auto mt-5 mb-[18px] delay-[680ms]"
      :class="reveal"
    />
    <p
      data-role
      class="font-mono text-[clamp(12px,1.6vw,15px)] tracking-[8px] text-ink-dim uppercase delay-[860ms]"
      :class="reveal"
    >
      Frontend Engineer
    </p>
    <p
      data-tagline
      class="mt-[26px] text-[clamp(17px,2.4vw,22px)] text-gold-hi/90 italic delay-[860ms]"
      :class="reveal"
    >
      Old-city craft, built in code.
    </p>
  </div>
</template>
