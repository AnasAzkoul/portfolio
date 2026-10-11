import { describe, expect, it, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import App from '~/app.vue'

// Every route is mounted through the app itself, so each page renders inside
// the default layout exactly as a visitor gets it.
function visit(route: string) {
  return mountSuspended(App, { route })
}

type Wrapper = Awaited<ReturnType<typeof visit>>

// What the layout shows for the page: how far the lattice turned, the
// breadcrumb, and the stage layout it sets the view and the lattice in.
function stage(wrapper: Wrapper) {
  const style = wrapper.find('[data-lattice] svg').attributes('style') ?? ''
  const crumb = wrapper.find('[data-crumb]')
  return {
    turn: style.match(/--turn: ([^;]+)/)?.[1],
    crumb: crumb.exists() ? crumb.text() : undefined,
    layout: wrapper.find('[data-stage]').attributes('data-stage')
  }
}

describe('home', () => {
  it('names the site in its heading, with the role and tagline below', async () => {
    const wrapper = await visit('/')
    expect(wrapper.find('h1').text()).toBe('Anas Azkoul')
    expect(wrapper.find('[data-role]').text()).toBe('Frontend Developer')
    expect(wrapper.find('[data-tagline]').text()).toBe(
      'Old-city craft, built in code.'
    )
  })

  it('sizes the name by the screen height too, so it stays inside the ring', async () => {
    const wrapper = await visit('/')
    expect(wrapper.find('h1').classes()).toContain(
      'text-[clamp(52px,min(11vw,13dvh),140px)]'
    )
  })

  it('rises into place shortly after it mounts', async () => {
    const wrapper = await visit('/')
    const name = wrapper.find('h1')
    await vi.waitFor(() => expect(name.classes()).not.toContain('opacity-0'))
  })

  it('says what work you want, and links to the projects', async () => {
    const wrapper = await visit('/')
    expect(wrapper.find('[data-availability]').text()).toBe(
      'Building production Nuxt apps at Scala. Open to frontend roles in the Netherlands.'
    )
    const cta = wrapper.find('[data-home-cta]')
    expect(cta.text()).toBe('See projects')
    expect(cta.attributes('href')).toBe('/projects')
  })

  it('offers the CV as a PDF download beside the link to the projects', async () => {
    const wrapper = await visit('/')
    const cv = wrapper.find('[data-home-cv]')
    expect(cv.text()).toBe('Download CV (PDF)')
    expect(cv.attributes('href')).toBe('/anas-azkoul-cv.pdf')
    expect(cv.attributes('download')).toBeDefined()
    expect(cv.element.parentElement).toBe(
      wrapper.find('[data-home-cta]').element.parentElement
    )
  })

  it('drops the ornament and tagline on a short screen, so the links still fit', async () => {
    const wrapper = await visit('/')
    expect(wrapper.find('[data-divider]').classes()).toContain('short:hidden')
    expect(wrapper.find('[data-tagline]').classes()).toContain('short:hidden')
  })

  it('leaves the lattice unturned and centred, and shows no breadcrumb', async () => {
    const wrapper = await visit('/')
    expect(stage(wrapper)).toEqual({
      turn: '0deg',
      crumb: undefined,
      layout: 'centre'
    })
  })
})

describe('experience', () => {
  it('tells the Scala roles, then certifications, education and languages', async () => {
    const wrapper = await visit('/experience')
    const body = wrapper.find('[data-panel-body]')
    expect(body.findAll('h3').map((h) => h.text())).toEqual([
      'Scala · Sittard, Netherlands',
      'Certifications',
      'Education & Learning',
      'Languages'
    ])
    expect(body.findAll('[data-role] h4').map((h) => h.text())).toEqual([
      'Frontend Developer, Services (trainee track)',
      'Technical Support Engineer'
    ])
    const bullets = body.findAll('[data-role]').map((r) => r.findAll('li'))
    expect(bullets.map((b) => b.length)).toEqual([7, 2])
    expect(body.find('[data-certifications]').text()).toContain(
      'Certified Vue.js Developer (Level I)'
    )
  })

  it('leads the developer role with its three strongest bullets, worded as on the CV', async () => {
    const wrapper = await visit('/experience')
    const lead = wrapper
      .findAll('[data-role]')[0]!
      .findAll('[data-lead] > li')
      .map((li) => li.text())
    expect(lead).toEqual([
      "Built a breadcrumb system from scratch for the app's deeply nested, multi-level dynamic routing — a composable, component, and definePageMeta configuration — including a route cache that resolved database-ID route segments into human-readable labels and pruned obsolete entries on navigation.",
      "Re-skinned the SOT UI into a themeable, white-label system for multiple customers' branding and adapted checkout/payment flows per customer.",
      "Carried out the platform's migration from Nuxt 3 to Nuxt 4 within an AI-assisted development workflow (Claude Code) defined by the senior developer — driving the migration, reviewing generated changes, and resolving issues."
    ])
  })

  it('keeps the rest of the developer role behind a "More" toggle, closed at first', async () => {
    const wrapper = await visit('/experience')
    const [developer, support] = wrapper.findAll('[data-role]')
    const more = developer!.find('details[data-more]')
    expect(more.attributes('open')).toBeUndefined()
    expect(more.find('summary').text()).toBe('More')
    const rest = more.findAll('li').map((li) => li.text())
    expect(rest).toHaveLength(4)
    expect(rest[0]).toMatch(/^Contributed production frontend code to Quintet/)
    expect(support!.find('[data-more]').exists()).toBe(false)
  })

  it('marks the gaps in the CV as copy still to be written', async () => {
    const wrapper = await visit('/experience')
    const notes = wrapper.findAll('[data-draft-note]').map((n) => n.text())
    expect(notes).toEqual([
      '[add: start date]',
      '[add: start date]',
      '[add: degree, institution, year]',
      '[add: Arabic and any other languages]'
    ])
  })

  it('opens in a panel with no close link', async () => {
    const wrapper = await visit('/experience')
    const panel = wrapper.find('section')
    expect(panel.find('h2').text()).toBe('Experience')
    expect(panel.find('header').text()).toContain('01 · WORK EXPERIENCE')
    expect(panel.find('header a').exists()).toBe(false)
  })

  it('turns the lattice one step, labels the breadcrumb and sets the view in focus', async () => {
    const wrapper = await visit('/experience')
    expect(stage(wrapper)).toEqual({
      turn: '22.5deg',
      crumb: '— EXPERIENCE —',
      layout: 'focus'
    })
  })
})

describe('projects', () => {
  it('lists each project under the title, linking to its case study', async () => {
    const wrapper = await visit('/projects')
    expect(wrapper.find('[data-view-area] h2').text()).toBe('Projects')
    expect(wrapper.find('[data-projects-index]').text()).toContain(
      '02 · SELECTED PROJECTS'
    )
    const links = wrapper.findAll('[data-projects-list] a')
    expect(
      links.map((a) => [
        a.find('[data-project-name]').text(),
        a.attributes('href')
      ])
    ).toEqual([
      ['LearnFlow', '/projects/learnflow'],
      ['Client Portfolio Website', '/projects/client-portfolio']
    ])
  })

  it('has the rows enter one after another, each 80ms after the last', async () => {
    const wrapper = await visit('/projects')
    const delays = wrapper
      .findAll('[data-projects-list] li')
      .map((row) =>
        parseFloat((row.element as HTMLElement).style.getPropertyValue('--d'))
      )
    expect(delays.length).toBeGreaterThan(1)
    expect(delays[0]).toBe(250)
    const steps = delays.slice(1).map((delay, i) => delay - delays[i]!)
    expect(steps).toEqual(steps.map(() => 80))
  })

  it('previews the first project until another is picked', async () => {
    const wrapper = await visit('/projects')
    const preview = wrapper.find('[data-projects-preview]')
    expect(preview.find('h3').text()).toBe('LearnFlow')
    expect(preview.text()).toContain('01 · PERSONAL PROJECT')
    expect(preview.text()).toContain("An AI-powered learning platform I'm")
    expect(preview.findAll('[data-chip]').map((c) => c.text())).toEqual([
      'Nuxt',
      'Hono',
      'Drizzle',
      'PostgreSQL',
      'Better Auth',
      'Cloudflare',
      'Claude Managed Agents'
    ])
    expect(preview.find('a').attributes('href')).toBe('/projects/learnflow')
  })

  it("sets the previewed project's jewel in an inlaid star by its kicker", async () => {
    const wrapper = await visit('/projects')
    const star = () =>
      wrapper.find('[data-projects-preview] [data-inlaid-star]')
    expect(star().attributes('aria-hidden')).toBe('true')
    expect(star().find('[data-jewel]').classes()).toContain('fill-gold-hi')
    await wrapper.findAll('[data-projects-list] a')[1]!.trigger('mouseenter')
    expect(star().find('[data-jewel]').classes()).toContain('fill-red')
  })

  it('previews a project when the pointer moves onto it', async () => {
    const wrapper = await visit('/projects')
    await wrapper.findAll('[data-projects-list] a')[1]!.trigger('mouseenter')
    const preview = wrapper.find('[data-projects-preview]')
    expect(preview.find('h3').text()).toBe('Client Portfolio Website')
    expect(preview.find('a').attributes('href')).toBe(
      '/projects/client-portfolio'
    )
  })

  it('previews a project when it takes keyboard focus', async () => {
    const wrapper = await visit('/projects')
    await wrapper.findAll('[data-projects-list] a')[1]!.trigger('focus')
    expect(wrapper.find('[data-projects-preview] h3').text()).toBe(
      'Client Portfolio Website'
    )
  })

  it('marks the previewed project in the list', async () => {
    const wrapper = await visit('/projects')
    const links = wrapper.findAll('[data-projects-list] a')
    await links[1]!.trigger('mouseenter')
    expect(links.map((a) => a.attributes('data-previewed'))).toEqual([
      undefined,
      ''
    ])
  })

  it("shows the index alone on phones and short screens, where the preview doesn't fit", async () => {
    const wrapper = await visit('/projects')
    expect(wrapper.find('[data-projects-index]').classes()).toEqual(
      expect.arrayContaining(['max-[720px]:grid-cols-1', 'short:grid-cols-1'])
    )
    expect(wrapper.find('[data-projects-preview]').classes()).toEqual(
      expect.arrayContaining(['max-[720px]:hidden', 'short:hidden'])
    )
  })

  it('turns the lattice two steps, labels the breadcrumb and sinks the lattice to the horizon', async () => {
    const wrapper = await visit('/projects')
    expect(stage(wrapper)).toEqual({
      turn: '45deg',
      crumb: '— PROJECTS —',
      layout: 'horizon'
    })
  })

  it('leaves the index open while no project is', async () => {
    const wrapper = await visit('/projects')
    expect(
      wrapper.find('[data-projects-index]').attributes('inert')
    ).toBeUndefined()
    expect(wrapper.find('section').exists()).toBe(false)
  })
})

describe('a project', () => {
  it('opens in a panel over the index, which stays mounted but inert', async () => {
    const wrapper = await visit('/projects/client-portfolio')
    const panel = wrapper.find('section')
    expect(panel.find('h2').text()).toBe('Client Portfolio Website')
    expect(panel.find('header').text()).toContain('02 · CLIENT PROJECT · 2022')
    expect(
      wrapper.find('[data-projects-index]').attributes('inert')
    ).toBeDefined()
  })

  it('tells the case study in fixed sections, then lists its stack', async () => {
    const wrapper = await visit('/projects/client-portfolio')
    const body = wrapper.find('[data-panel-body]')
    expect(body.findAll('h3').map((h) => h.text())).toEqual([
      'Context',
      'Problem',
      'What I did',
      'Outcome',
      'Stack',
      'Source'
    ])
    expect(body.text()).toContain('I built an MDX-based articles system')
    expect(body.findAll('[data-chip]').map((c) => c.text())).toEqual([
      'Next.js',
      'React',
      'TypeScript',
      'Tailwind CSS',
      'MDX',
      'Canvas'
    ])
  })

  it('links its source in a new tab', async () => {
    const wrapper = await visit('/projects/client-portfolio')
    const repo = wrapper.find('[data-repo]')
    expect(repo.attributes('href')).toBe(
      'https://github.com/AnasAzkoul/martin-portfolio'
    )
    expect(repo.attributes('target')).toBe('_blank')
    expect(repo.attributes('rel')).toBe('noopener')
    expect(repo.text()).toBe(
      'github.com/AnasAzkoul/martin-portfolio ↗, opens in a new tab'
    )
  })

  it('shows no source section for a project without a repo', async () => {
    const wrapper = await visit('/projects/learnflow')
    expect(wrapper.find('[data-repo]').exists()).toBe(false)
    expect(
      wrapper
        .find('[data-panel-body]')
        .findAll('h3')
        .map((h) => h.text())
    ).not.toContain('Source')
  })

  it('marks copy still to be written', async () => {
    const wrapper = await visit('/projects/client-portfolio')
    const notes = wrapper.findAll('[data-draft-note]').map((n) => n.text())
    expect(notes).toContain('[add: live site link]')
  })

  it('keeps the lattice and breadcrumb where Projects left them', async () => {
    const wrapper = await visit('/projects/learnflow')
    expect(stage(wrapper)).toEqual({
      turn: '45deg',
      crumb: '— PROJECTS —',
      layout: 'horizon'
    })
  })

  it('closes back to all projects', async () => {
    const wrapper = await visit('/projects/learnflow')
    const close = wrapper.find('section header a')
    expect(close.attributes('href')).toBe('/projects')
    expect(close.attributes('aria-label')).toBe('Back to all projects')
  })

  it('redirects an unknown project to all projects', async () => {
    const wrapper = await visit('/projects/no-such-project')
    expect(useRouter().currentRoute.value.fullPath).toBe('/projects')
    expect(wrapper.find('section').exists()).toBe(false)
    expect(
      wrapper.find('[data-projects-index]').attributes('inert')
    ).toBeUndefined()
  })
})

describe.each([
  ['/stack', 'Stack', '03 · TOOLS OF THE CRAFT', '67.5deg', '— STACK —'],
  ['/story', 'Story', '04 · DRAFT COPY', '90deg', '— STORY —'],
  [
    '/contact',
    'Contact',
    '05 · OPEN TO FRONTEND ROLES IN NL',
    '112.5deg',
    '— CONTACT —'
  ]
])('%s', (route, title, kicker, angle, crumb) => {
  it('opens in a panel with no close link', async () => {
    const wrapper = await visit(route)
    const panel = wrapper.find('section')
    expect(panel.find('h2').text()).toBe(title)
    expect(panel.find('header').text()).toContain(kicker)
    expect(panel.find('header a').exists()).toBe(false)
  })

  it(`turns the lattice ${angle}, labels the breadcrumb and steps the lattice beside the view`, async () => {
    const wrapper = await visit(route)
    expect(stage(wrapper)).toEqual({ turn: angle, crumb, layout: 'beside' })
  })
})

describe('stack', () => {
  it('groups the tools by area', async () => {
    const wrapper = await visit('/stack')
    const body = wrapper.find('[data-panel-body]')
    expect(body.findAll('h3').map((h) => h.text())).toEqual([
      'Languages',
      'Frontend',
      'Backend',
      'Tooling & practices'
    ])
    expect(body.findAll('[data-chip]').map((c) => c.text())).toContain(
      'Drizzle ORM'
    )
  })
})

describe('story', () => {
  it('tells the story in four paragraphs', async () => {
    const wrapper = await visit('/story')
    const paragraphs = wrapper.findAll('[data-panel-body] p')
    expect(paragraphs).toHaveLength(4)
    expect(paragraphs[0]!.text()).toMatch(/^I grew up in Damascus/)
  })
})

describe('contact', () => {
  it('is the narrow panel', async () => {
    const wrapper = await visit('/contact')
    expect(wrapper.find('section').classes()).toContain('w-[min(560px,92vw)]')
  })

  it('links GitHub in a new tab', async () => {
    const wrapper = await visit('/contact')
    const github = wrapper.find('a[href="https://github.com/AnasAzkoul"]')
    expect(github.text()).toContain('GitHub')
    expect(github.attributes('target')).toBe('_blank')
    expect(github.attributes('rel')).toBe('noopener')
  })

  it('offers the CV as a PDF download, in the same tab', async () => {
    const wrapper = await visit('/contact')
    const cv = wrapper.find('a[href="/anas-azkoul-cv.pdf"]')
    expect(cv.text()).toBe('CV DOWNLOAD (PDF) ↓')
    expect(cv.attributes('download')).toBeDefined()
    expect(cv.attributes('target')).toBeUndefined()
  })

  it("marks the channels that aren't filled in yet, without linking them", async () => {
    const wrapper = await visit('/contact')
    const rows = wrapper.findAll('[data-contact]')
    expect(rows.map((r) => [r.element.tagName, r.text()])).toEqual([
      ['DIV', 'Email [add address]'],
      ['A', 'GitHub @ANASAZKOUL ↗, opens in a new tab'],
      ['DIV', 'LinkedIn [add profile]'],
      ['A', 'CV DOWNLOAD (PDF) ↓']
    ])
  })
})
