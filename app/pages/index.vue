<script setup lang="ts">
/**
 * Home: the name at the heart of the lattice, with the eyebrow above it and
 * the role and tagline below; then the work I want, and the two next steps
 * for a recruiter: the projects and the CV.
 *
 * It rises into place once, just after the first load, together with the
 * lattice. Coming back to Home later shows it at once.
 */
// No crumb: the layout shows no breadcrumb on Home.
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

// The two next steps share one bordered look, on the framed panel's ground
// so the lattice's lines don't run through their labels.
const nextStep =
  'inline-block border border-gold/45 bg-panel px-5 py-2.5 backdrop-blur-[3px] text-[18px] leading-[1.3] text-gold-hi no-underline transition-colors duration-200 hover:border-gold-hi focus-visible:border-gold-hi focus-visible:outline-2 focus-visible:outline-offset-[5px] focus-visible:outline-gold'
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
      <!-- Read aloud as "Damascus to Weert", not "Damascus right arrow Weert". -->
      <span>
        DAMASCUS <span aria-hidden="true">→</span
        ><span class="sr-only">to</span>
        WEERT
      </span>
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
      Anas Azkoul
    </h1>
    <!-- On a short screen (a phone on its side) the ornament and tagline drop
         out, so the line about work and the links to Projects and the CV
         still fit. -->
    <DiamondDivider
      data-divider
      class="mx-auto mt-5 mb-[18px] delay-[680ms] short:hidden"
      :class="reveal"
    />
    <p
      data-role
      class="font-mono text-[clamp(12px,1.6vw,15px)] tracking-[8px] text-ink-dim uppercase delay-[860ms] short:mt-3"
      :class="reveal"
    >
      Frontend Developer
    </p>
    <p
      data-tagline
      class="mt-[26px] text-[clamp(17px,2.4vw,22px)] text-gold-hi/90 italic delay-[860ms] short:hidden"
      :class="reveal"
    >
      Old-city craft, built in code.
    </p>
    <p
      data-availability
      class="mx-auto mt-3 max-w-[44ch] text-[clamp(16px,1.9vw,19px)] leading-[1.4] text-balance text-ink delay-[860ms]"
      :class="reveal"
    >
      Open to frontend roles in the Netherlands.
    </p>
    <!-- The wrapper rises in with the rest; the links keep their own quick
         hover transition, free of the reveal's delay. -->
    <div
      class="mt-7 flex flex-wrap justify-center gap-3 delay-[1040ms] short:mt-4"
      :class="reveal"
    >
      <NuxtLink to="/projects" data-home-cta :class="nextStep">
        See projects
      </NuxtLink>
      <a :href="cvHref" download data-home-cv :class="nextStep">
        Download CV (PDF)
      </a>
    </div>
  </div>
</template>
