<script setup lang="ts">
/**
 * Projects: an index of the projects beside a framed preview of the one under
 * the pointer or keyboard focus (the first until then). The preview shows
 * its kicker, name, context and stack, so a visitor can read before opening
 * the case study. On a phone, or a screen too short for the preview, it's the
 * index alone.
 *
 * When the page arrives the index rows rise into place one after another,
 * each row's `--d` delaying it a step more. Closing a case study doesn't
 * replay it: the index never left.
 *
 * A project opens as the child route /projects/<slug>, over the index. The
 * index stays mounted underneath, hidden and inert, so it keeps the
 * previewed project for when the case study closes.
 */
import { framedPanel } from '~/components/FramedPanel.variants'

definePageMeta({ turn: 2, crumb: 'PROJECTS', stage: 'horizon' })
useSeoMeta({ title: 'Projects' })

const route = useRoute()
const projectOpen = computed(() => route.params.slug !== undefined)

const previewed = ref(0)
const preview = computed(() => projects[previewed.value]!)

const twoDigits = (n: number) => String(n).padStart(2, '0')

// The first row waits 250ms, then each one 80ms more (the prototype's timing).
const rowDelay = (i: number) => 250 + i * 80
</script>

<template>
  <div class="grid place-items-center *:[grid-area:1/1]">
    <div
      data-projects-index
      class="grid w-[min(1000px,94vw)] grid-cols-[minmax(0,330px)_1fr] items-center gap-12 max-[720px]:grid-cols-1 short:grid-cols-1"
      :class="{ invisible: projectOpen }"
      :inert="projectOpen"
    >
      <div>
        <div class="mb-2 font-mono text-[11px] tracking-[4px] text-gold-hi">
          02 · SELECTED PROJECTS
        </div>
        <h2
          tabindex="-1"
          class="text-[clamp(32px,4vw,44px)] leading-none font-medium focus:outline-none"
        >
          Projects
        </h2>
        <ol data-projects-list class="mt-7 border-t border-gold/18">
          <li
            v-for="(project, i) in projects"
            :key="project.slug"
            :style="{ '--d': `${rowDelay(i)}ms` }"
            class="transition-[opacity,translate] delay-(--d) duration-600 ease-settle motion-reduce:transition-none starting:translate-y-2.5 starting:opacity-0"
          >
            <NuxtLink
              :to="`/projects/${project.slug}`"
              :data-previewed="i === previewed ? '' : undefined"
              class="flex items-baseline gap-4 border-b border-gold/18 py-4 no-underline transition-colors duration-300 focus-visible:outline-1 focus-visible:outline-gold"
              :class="
                i === previewed ? 'text-gold-hi' : 'text-ink-dim hover:text-ink'
              "
              @mouseenter="previewed = i"
              @focus="previewed = i"
            >
              <span class="font-mono text-[10px] tracking-[2px] text-gold">
                {{ twoDigits(i + 1) }}
              </span>
              <span
                data-project-name
                class="text-[clamp(20px,2.2vw,25px)] leading-none font-medium"
              >
                {{ project.name }}
              </span>
              <span
                aria-hidden="true"
                class="ml-auto size-[7px] shrink-0 rotate-45 border border-gold-hi transition-opacity duration-300"
                :class="i === previewed ? 'opacity-100' : 'opacity-0'"
              />
            </NuxtLink>
          </li>
        </ol>
      </div>

      <Transition
        mode="out-in"
        enter-from-class="translate-y-1 opacity-0"
        leave-to-class="opacity-0"
        enter-active-class="transition-[opacity,translate] duration-300 motion-reduce:transition-none"
        leave-active-class="transition-opacity duration-150 motion-reduce:transition-none"
      >
        <article
          :key="preview.slug"
          data-projects-preview
          :class="framedPanel({ variant: 'fluid' })"
          class="px-9 py-8 max-[720px]:hidden short:hidden"
        >
          <div
            class="mb-2.5 flex items-center gap-3 font-mono text-[11px] tracking-[4px] text-gold-hi"
          >
            <InlaidStar :jewel="preview.jewel" class="size-[26px]" />
            {{ preview.kicker }}
          </div>
          <h3 class="text-[clamp(30px,3.4vw,42px)] leading-none font-medium">
            {{ preview.name }}
          </h3>
          <p
            class="mt-5 text-[20px] leading-[1.55] font-medium text-ink lining-nums"
          >
            {{ preview.context.text }}
            <DraftNote v-if="preview.context.todo">
              {{ preview.context.todo }}
            </DraftNote>
          </p>
          <div class="mt-5 flex flex-wrap gap-2">
            <Chip v-for="item in preview.stack" :key="item">{{ item }}</Chip>
          </div>
          <!-- Out of the tab order: the index link above already opens it. -->
          <NuxtLink
            :to="`/projects/${preview.slug}`"
            tabindex="-1"
            class="mt-7 inline-block border border-gold/45 px-3.5 py-2 font-mono text-[11px] tracking-[3px] text-gold-hi no-underline transition-colors duration-200 hover:border-gold-hi"
          >
            OPEN CASE STUDY →
          </NuxtLink>
        </article>
      </Transition>
    </div>
    <NuxtPage />
  </div>
</template>
