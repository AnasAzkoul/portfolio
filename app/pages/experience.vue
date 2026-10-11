<script setup lang="ts">
/**
 * Experience: my work at Scala, then certifications, education and
 * languages, worded as on the CV. Gaps in the CV show as draft notes: a
 * role without its `start` yet, the degree's details, other languages.
 *
 * So a recruiter can skim it, a role leads with its strongest bullets and
 * keeps the rest behind "More".
 */
definePageMeta({ turn: 1, crumb: 'EXPERIENCE', stage: 'focus' })
useSeoMeta({ title: 'Experience' })

interface Role {
  title: string
  /** Set beside the title in italics, e.g. "(trainee track)". */
  track?: string
  /** When the role began, e.g. "Mar 2024". A draft note until it's known. */
  start?: string
  /** Shown up front: the role's strongest work, strongest first. */
  lead: string[]
  /** The rest, behind a "More" toggle; the CV has them all. */
  more?: string[]
}

const roles: Role[] = [
  {
    title: 'Frontend Developer, Services',
    track: '(trainee track)',
    lead: [
      "Built a breadcrumb system from scratch for the app's deeply nested, multi-level dynamic routing — a composable, component, and definePageMeta configuration — including a route cache that resolved database-ID route segments into human-readable labels and pruned obsolete entries on navigation.",
      "Re-skinned the SOT UI into a themeable, white-label system for multiple customers' branding and adapted checkout/payment flows per customer.",
      "Carried out the platform's migration from Nuxt 3 to Nuxt 4 within an AI-assisted development workflow (Claude Code) defined by the senior developer — driving the migration, reviewing generated changes, and resolving issues."
    ],
    more: [
      "Contributed production frontend code to Quintet, Scala's TypeScript/Nuxt QSR menu-board platform, across the canvas-based menu-board design app and the self-order terminals (SOT).",
      'Introduced a class-variance-authority pattern for component variants and sizes, replacing scattered if/switch logic with a dedicated typed module — making components reusable and scalable; the pattern was not previously in the codebase.',
      'Diagnosed and fixed a scheduling-page bug where an "unscheduled" warning icon only rendered for the active tab; traced it to parent-level data fetching and refactored the icon into a self-contained component with two-way parent-child communication so every tab resolved independently.',
      'Rebuilt a large portion of the shared atomic UI component library used by other developers, and wrote its documentation.'
    ]
  },
  {
    title: 'Technical Support Engineer',
    lead: [
      "Diagnose technical issues across Scala's Content Manager and Player ecosystem — log analysis, CEF/Chromium compatibility, version-compatibility constraints, and network/DNS issues — for enterprise customers.",
      'Translate informal bug reports into structured Jira tickets and maintain internal support documentation.'
    ]
  }
]

const education = [
  'Self-taught software development (2021–present); Boot.dev backend track; ongoing study in system design and API architecture.',
  'Currently learning Python, with Django planned next as a backend framework; also learning Dutch (in-person course, Weert, 2026).'
]

const languages = [
  'English — fluent (former English teacher)',
  'Dutch — beginner, in-person course from Aug 2026'
]

// A list item with a small gold diamond for its bullet.
const item =
  "relative max-w-measure pl-5 text-[20px] leading-[1.5] font-medium before:absolute before:top-[0.6em] before:left-0.5 before:size-[5px] before:rotate-45 before:border before:border-gold before:content-['']"
</script>

<template>
  <FramedPanel kicker="01 · WORK EXPERIENCE" title="Experience">
    <h3>Scala · Sittard, Netherlands</h3>
    <div v-for="role in roles" :key="role.title" data-role class="mt-5">
      <h4 class="text-[22px] leading-tight font-semibold">
        {{ role.title }}
        <span v-if="role.track" class="font-normal text-ink-dim italic">
          {{ role.track }}
        </span>
      </h4>
      <div
        data-dates
        class="mt-1 font-mono text-[12px] tracking-[1px] text-ink-dim"
      >
        <template v-if="role.start">{{ role.start }}</template>
        <DraftNote v-else>add: start date</DraftNote>
        – PRESENT
      </div>
      <ul data-lead class="mt-3 space-y-2">
        <li v-for="bullet in role.lead" :key="bullet" :class="item">
          {{ bullet }}
        </li>
      </ul>
      <!-- Closed at first, so the strongest work is what a skim takes in;
           a native disclosure, so keyboards and screen readers need nothing
           more. The chevron turns over once it's open. -->
      <details v-if="role.more" data-more class="group mt-1">
        <summary
          class="ml-5 inline-flex cursor-pointer list-none items-center gap-2.5 py-1 text-[18px] text-gold transition-colors duration-200 hover:text-gold-hi focus-visible:text-gold-hi focus-visible:outline-2 focus-visible:outline-offset-[5px] focus-visible:outline-gold [&::-webkit-details-marker]:hidden"
        >
          More
          <span
            aria-hidden="true"
            class="size-[7px] -translate-y-0.5 rotate-45 border-r border-b border-current transition-[rotate,translate] duration-200 group-open:translate-y-0.5 group-open:-rotate-135"
          />
        </summary>
        <ul class="mt-2 space-y-2">
          <li v-for="bullet in role.more" :key="bullet" :class="item">
            {{ bullet }}
          </li>
        </ul>
      </details>
    </div>

    <h3>Certifications</h3>
    <ul data-certifications class="space-y-2">
      <li :class="item">
        <strong class="font-semibold"
          >Certified Vue.js Developer (Level I)</strong
        >
        — certificates.dev / Vue School, in partnership with Vue.js (2026).
        Proctored exam with live coding, developed under review by Evan You and
        the Vue core team.
      </li>
    </ul>

    <h3>Education &amp; Learning</h3>
    <ul data-education class="space-y-2">
      <li v-for="line in education" :key="line" :class="item">{{ line }}</li>
      <li :class="item">
        Accounting degree
        <DraftNote>add: degree, institution, year</DraftNote>
      </li>
    </ul>

    <h3>Languages</h3>
    <ul data-languages class="space-y-2">
      <li v-for="line in languages" :key="line" :class="item">{{ line }}</li>
      <li :class="item">
        <DraftNote>add: Arabic and any other languages</DraftNote>
      </li>
    </ul>
  </FramedPanel>
</template>
