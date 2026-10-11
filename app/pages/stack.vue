<script setup lang="ts">
/** Stack: the tools I work with, grouped as on the CV. */
definePageMeta({ turn: 3, crumb: 'STACK' })

const groups = [
  { area: 'Languages', tools: ['JavaScript', 'TypeScript', 'HTML', 'CSS'] },
  {
    area: 'Frontend',
    tools: [
      'Vue 3 (Composition API)',
      'Nuxt',
      'React',
      'Next.js',
      'Tailwind CSS',
      'Radix UI',
      'class-variance-authority'
    ]
  },
  {
    area: 'Backend',
    tools: [
      'Node.js',
      'REST API design',
      'Hono',
      'Drizzle ORM',
      'PostgreSQL',
      'NoSQL',
      'Better Auth'
    ]
  },
  {
    area: 'Tooling & practices',
    tools: [
      'Git',
      'ESLint',
      'Prettier',
      'Claude Code',
      'Codex',
      'Component documentation'
    ]
  }
] as const
</script>

<template>
  <FramedPanel kicker="03 · TOOLS OF THE CRAFT" title="Stack" close-to="/">
    <template v-for="group in groups" :key="group.area">
      <h3>{{ group.area }}</h3>
      <div class="flex flex-wrap gap-2">
        <Chip v-for="tool in group.tools" :key="tool">{{ tool }}</Chip>
      </div>
    </template>
  </FramedPanel>
</template>
