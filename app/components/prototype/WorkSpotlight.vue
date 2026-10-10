<script setup lang="ts">
/**
 * PROTOTYPE, Work variant E "Spotlight": an index on the left and, on the
 * right, a framed preview of whichever project is hovered or focused:
 * kicker, name, context and stack, with a link into the full case study.
 * You can read before you click. The preview is hidden on a phone.
 */
import { framedPanel } from '~/components/FramedPanel.variants'

const route = useRoute()
const active = ref(0)
const project = computed(() => projects[active.value]!)
const twoDigits = (n: number) => String(n).padStart(2, '0')
const linkTo = (slug: string) => ({ path: `/work/${slug}`, query: route.query })
</script>

<template>
  <div
    class="grid w-[min(1000px,94vw)] grid-cols-[minmax(0,330px)_1fr] items-center gap-12 max-[720px]:grid-cols-1"
  >
    <div>
      <div class="mb-2 font-mono text-[11px] tracking-[4px] text-gold-hi">
        01 · SELECTED WORK
      </div>
      <h2
        tabindex="-1"
        class="text-[clamp(32px,4vw,44px)] leading-none font-medium focus:outline-none"
      >
        Selected Work
      </h2>
      <ol class="mt-7 border-t border-gold/18">
        <li v-for="(p, i) in projects" :key="p.slug">
          <NuxtLink
            :to="linkTo(p.slug)"
            class="flex items-baseline gap-4 border-b border-gold/18 py-4 no-underline transition-colors duration-300 focus-visible:outline-none"
            :class="
              i === active ? 'text-gold-hi' : 'text-ink-dim hover:text-ink'
            "
            @mouseenter="active = i"
            @focus="active = i"
          >
            <span class="font-mono text-[10px] tracking-[2px] text-gold">
              {{ twoDigits(i + 1) }}
            </span>
            <span
              class="text-[clamp(20px,2.2vw,25px)] leading-none font-medium"
            >
              {{ p.name }}
            </span>
            <span
              aria-hidden="true"
              class="ml-auto size-[7px] shrink-0 rotate-45 border border-gold-hi transition-opacity duration-300"
              :class="i === active ? 'opacity-100' : 'opacity-0'"
            />
          </NuxtLink>
        </li>
      </ol>
    </div>

    <Transition
      mode="out-in"
      enter-from-class="opacity-0 translate-y-1"
      leave-to-class="opacity-0"
      enter-active-class="transition-[opacity,translate] duration-300"
      leave-active-class="transition-opacity duration-150"
    >
      <article
        :key="project.slug"
        :class="framedPanel({ variant: 'default' })"
        class="w-auto px-9 pt-8 pb-8 max-[720px]:hidden"
      >
        <div class="mb-2 font-mono text-[11px] tracking-[4px] text-gold-hi">
          {{ project.kicker }}
        </div>
        <h3 class="text-[clamp(30px,3.4vw,42px)] leading-none font-medium">
          {{ project.name }}
        </h3>
        <p class="mt-5 text-[19px] leading-[1.55] text-ink">
          {{ project.context.text }}
        </p>
        <div class="mt-5 flex flex-wrap gap-2">
          <Chip v-for="item in project.stack" :key="item">{{ item }}</Chip>
        </div>
        <NuxtLink
          :to="linkTo(project.slug)"
          tabindex="-1"
          class="mt-7 inline-block border border-gold/45 px-3.5 py-2 font-mono text-[11px] tracking-[3px] text-gold-hi no-underline transition-colors duration-200 hover:border-gold-hi"
        >
          OPEN CASE STUDY →
        </NuxtLink>
      </article>
    </Transition>
  </div>
</template>
