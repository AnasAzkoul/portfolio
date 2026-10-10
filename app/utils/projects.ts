import type { CartoucheJewel } from '~/components/Cartouche.variants'

/**
 * A passage of case-study copy. Drafts still carry a `todo`: what is left to
 * add, shown as a marked note after the text until the copy is final.
 */
export interface Passage {
  text?: string
  todo?: string
}

export interface Project {
  /** The project's URL segment under /work. */
  slug: string
  name: string
  /** Mono line above the title, e.g. "01 · QUINTET · SCALA". */
  kicker: string
  /** Short mono stack line on the cartouche. */
  meta: string
  jewel: CartoucheJewel
  context: Passage
  problem: Passage
  did: Passage
  outcome: Passage
  stack: string[]
}

// Draft copy from the prototype; it moves to Nuxt Content in ANA-74.
export const projects: readonly Project[] = [
  {
    slug: 'variant-system',
    name: 'Variant System',
    kicker: '01 · QUINTET · SCALA',
    meta: 'VUE · NUXT · TS · CVA',
    jewel: 'red',
    context: {
      text: "Quintet is Scala's menu-board platform for quick-service restaurants: a canvas-based design app and a set of self-order terminals, built in TypeScript and Nuxt. Other developers build their screens on its library of atomic UI components."
    },
    problem: {
      text: "Component variants and sizes were handled with long if/switch chains, sometimes inside a component's script block. Every new variant meant another branch, and nothing stopped a component from being used with an invalid combination."
    },
    did: {
      text: 'I introduced class-variance-authority to the codebase. Variant logic moved into dedicated TypeScript files, and the variants were exported as TS types, so misuse shows up in the editor instead of on screen. Alongside that I rebuilt many of the atomic components the team relies on and wrote their documentation.'
    },
    outcome: {
      text: "Shipped to production; the pattern wasn't in the codebase before.",
      todo: 'add: how many components use it now, or what it changed for the team'
    },
    stack: ['Vue 3', 'Nuxt', 'TypeScript', 'CVA']
  },
  {
    slug: 'nuxt-4-migration',
    name: 'Nuxt 3 → 4 Migration',
    kicker: '02 · QUINTET · SCALA',
    meta: 'NUXT 4 · CLAUDE CODE',
    jewel: 'pearl',
    context: {
      text: 'One of my last Quintet tasks: moving the platform from Nuxt 3 to Nuxt 4.'
    },
    problem: {
      text: 'A framework major-version upgrade across a multi-app production codebase.',
      todo: 'add: the breaking changes that mattered most'
    },
    did: {
      text: "I carried out the migration inside an AI-assisted workflow with Claude Code, following a process defined by the team's senior developer.",
      todo: 'add: the parts you owned and one decision you made'
    },
    outcome: { todo: 'add: result, issues found and fixed' },
    stack: ['Nuxt 4', 'Vue 3', 'TypeScript', 'Claude Code']
  },
  {
    slug: 'white-label-terminals',
    name: 'White-label Terminals',
    kicker: '03 · QUINTET SOT · SCALA',
    meta: 'THEMING · PAYMENTS',
    jewel: 'green',
    context: {
      text: "Quintet's self-order terminals are the customer-facing kiosks, deployed for different restaurant brands."
    },
    problem: {
      text: 'Each customer needed the kiosks in their own branding, and each had its own checkout process.'
    },
    did: {
      text: "I re-skinned the entire terminal UI into a themeable system, so a customer's branding becomes configuration rather than a fork, and adapted the payment flows to fit different customers' checkout processes."
    },
    outcome: {
      todo: 'add: number of brands, or what onboarding a new customer looks like now'
    },
    stack: ['Vue 3', 'Nuxt', 'TypeScript', 'Theming']
  },
  {
    slug: 'learnflow',
    name: 'LearnFlow',
    kicker: '04 · PERSONAL PROJECT',
    meta: 'NUXT · HONO · CLOUDFLARE · AI',
    jewel: 'gold',
    context: {
      text: "An AI-powered learning platform I'm building on my own time."
    },
    problem: {
      text: 'Generating structured lessons with AI, without building agent infrastructure from scratch.'
    },
    did: {
      text: 'A Nuxt frontend and a Hono/Node API, with Drizzle ORM, Better Auth and PostgreSQL, deployed on Cloudflare Workers and Pages. Lesson generation uses Claude Managed Agents in an orchestrator–subagent architecture. The architecture lives in an Obsidian vault that a Claude Code skill reads, loading only the docs relevant to each task.'
    },
    outcome: {
      text: 'In active development.',
      todo: 'add: repo or demo link once public'
    },
    stack: [
      'Nuxt',
      'Hono',
      'Drizzle',
      'PostgreSQL',
      'Better Auth',
      'Cloudflare',
      'Claude Managed Agents'
    ]
  }
]

export function findProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug)
}
