<script setup lang="ts">
/** Stack: the tools I work with, grouped by area. */
definePageMeta({ turn: 2, crumb: 'STACK' })

const groups = [
  {
    area: 'Frontend',
    tools: [
      'Vue 3',
      'Nuxt',
      'TypeScript',
      'JavaScript',
      'React',
      'Next.js',
      'Tailwind CSS',
      'CVA'
    ]
  },
  {
    area: 'Backend',
    tools: ['Node.js', 'Hono', 'REST APIs', 'Better Auth', 'PHP (basic)']
  },
  { area: 'Data', tools: ['PostgreSQL', 'Drizzle ORM', 'NoSQL'] },
  {
    area: 'Platform',
    tools: ['Cloudflare Workers', 'Cloudflare Pages', 'Vercel', 'Docker']
  },
  {
    area: 'AI-assisted development',
    tools: ['Claude Code', 'Claude Managed Agents']
  }
] as const
</script>

<template>
  <FramedPanel kicker="02 · TOOLS OF THE CRAFT" title="Stack" close-to="/">
    <template v-for="group in groups" :key="group.area">
      <h3>{{ group.area }}</h3>
      <div class="flex flex-wrap gap-2">
        <Chip v-for="tool in group.tools" :key="tool">{{ tool }}</Chip>
      </div>
    </template>
  </FramedPanel>
</template>
