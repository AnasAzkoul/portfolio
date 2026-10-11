<script setup lang="ts">
/**
 * One project's case study, opened over the Projects index as its child
 * route. It keeps the Projects lattice turn and breadcrumb, so the lattice
 * stays put when a project opens.
 *
 * A project with a repo links its source, in a new tab.
 *
 * An unknown slug goes back to /projects.
 */
definePageMeta({
  turn: 2,
  crumb: 'PROJECTS',
  middleware: (to) => {
    if (!findProject(String(to.params.slug))) {
      return navigateTo('/projects', { replace: true })
    }
  }
})

const route = useRoute()
// The middleware has already turned away unknown slugs.
const project = computed(() => findProject(String(route.params.slug))!)

// Named over the Projects index's own title while it's open.
useSeoMeta({ title: () => project.value.name })

const passages = computed(() => [
  { heading: 'Context', passage: project.value.context },
  { heading: 'Problem', passage: project.value.problem },
  { heading: 'What I did', passage: project.value.did },
  { heading: 'Outcome', passage: project.value.outcome }
])

// Shown without the scheme, e.g. "github.com/AnasAzkoul/martin-portfolio".
const repoLabel = computed(() => project.value.repo?.replace(/^https:\/\//, ''))
</script>

<template>
  <FramedPanel
    :kicker="project.kicker"
    :title="project.name"
    close-to="/projects"
    close-label="Back to all projects"
  >
    <template v-for="{ heading, passage } in passages" :key="heading">
      <h3>{{ heading }}</h3>
      <p>
        {{ passage.text }}
        <DraftNote v-if="passage.todo">{{ passage.todo }}</DraftNote>
      </p>
    </template>
    <h3>Stack</h3>
    <div class="flex flex-wrap gap-2">
      <Chip v-for="item in project.stack" :key="item">{{ item }}</Chip>
    </div>
    <template v-if="project.repo">
      <h3>Source</h3>
      <a
        data-repo
        :href="project.repo"
        target="_blank"
        rel="noopener"
        class="font-mono text-[12px] tracking-[2px] text-ink-dim no-underline transition-colors duration-200 hover:text-gold-hi focus-visible:text-gold-hi focus-visible:outline-none"
      >
        {{ repoLabel }} ↗<span class="sr-only">, opens in a new tab</span>
      </a>
    </template>
  </FramedPanel>
</template>
