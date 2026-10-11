import type { Jewel } from '~/components/InlaidStar.variants'

/**
 * A passage of case-study copy. Drafts still carry a `todo`: what is left to
 * add, shown as a marked note after the text until the copy is final.
 */
export interface Passage {
  text?: string
  todo?: string
}

export interface Project {
  /** The project's URL segment under /projects. */
  slug: string
  name: string
  /** Mono line above the title, e.g. "01 · PERSONAL PROJECT". */
  kicker: string
  /** Short mono stack line, e.g. "NEXT.JS · TS · TAILWIND". */
  meta: string
  /** Set in the inlaid star by the project's kicker. */
  jewel: Jewel
  context: Passage
  problem: Passage
  did: Passage
  outcome: Passage
  stack: string[]
  /** The source repository's URL, linked from the case study. */
  repo?: string
}

// Draft copy from the prototype; it moves to Nuxt Content in ANA-74.
export const projects: readonly Project[] = [
  {
    slug: 'learnflow',
    name: 'LearnFlow',
    kicker: '01 · PERSONAL PROJECT',
    meta: 'NUXT · HONO · CLOUDFLARE · AI',
    jewel: 'gold',
    context: {
      text: "An AI-powered learning platform I'm building on my own time."
    },
    problem: {
      text: 'Generating structured lessons with AI, without building agent infrastructure from scratch.'
    },
    did: {
      text: 'A Nuxt frontend and a Hono/Node API, with Drizzle ORM, Better Auth and PostgreSQL, deployed on Cloudflare Workers, D1 and Pages. Lesson generation uses Claude Managed Agents in an orchestrator–subagent architecture. The architecture lives in an Obsidian vault that a Claude Code skill reads, loading only the docs relevant to each task.'
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
  },
  {
    slug: 'client-portfolio',
    name: 'Client Portfolio Website',
    kicker: '02 · CLIENT PROJECT · 2022',
    meta: 'NEXT.JS · TS · TAILWIND',
    jewel: 'red',
    repo: 'https://github.com/AnasAzkoul/martin-portfolio',
    context: {
      text: 'A portfolio-and-articles site I designed and built end to end for a client. It was my first production project.'
    },
    problem: {
      text: 'The client wanted to publish articles without running a CMS, and to bring their legacy route-optimization visualizer into the new site: an interactive Travelling Salesman–style demo on a US map, written in vanilla JavaScript.'
    },
    did: {
      text: "I built an MDX-based articles system, with frontmatter parsing and dynamic rendering, as a lightweight publishing workflow with no CMS. I ported the visualizer to TypeScript, rewriting it as typed classes and wrapping its imperative Canvas rendering in a custom React hook so it fits Next.js's lifecycle, with responsive resizing and click interaction."
    },
    outcome: {
      text: 'Live and deployed.',
      todo: 'add: live site link'
    },
    stack: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'MDX', 'Canvas']
  }
]

export function findProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug)
}
