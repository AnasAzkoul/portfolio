<script setup lang="ts">
/**
 * One project's case study, opened over the Work grid as its child route.
 * It keeps Work's lattice turn and breadcrumb, so the lattice stays put when
 * a project opens.
 *
 * An unknown slug goes back to /work.
 */
definePageMeta({
  turn: 1,
  crumb: 'WORK',
  middleware: (to) => {
    if (!findProject(String(to.params.slug))) {
      return navigateTo('/work', { replace: true })
    }
  }
})

const route = useRoute()
// The middleware has already turned away unknown slugs.
const project = computed(() => findProject(String(route.params.slug))!)

const passages = computed(() => [
  { heading: 'Context', passage: project.value.context },
  { heading: 'Problem', passage: project.value.problem },
  { heading: 'What I did', passage: project.value.did },
  { heading: 'Outcome', passage: project.value.outcome }
])
</script>

<template>
  <FramedPanel
    :kicker="project.kicker"
    :title="project.name"
    close-to="/work"
    close-label="Back to all work"
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
  </FramedPanel>
</template>
