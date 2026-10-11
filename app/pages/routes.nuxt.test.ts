import { describe, expect, it, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import App from '~/app.vue'

// Every route is mounted through the app itself, so each page renders inside
// the default layout exactly as a visitor gets it.
function visit(route: string) {
  return mountSuspended(App, { route })
}

type Wrapper = Awaited<ReturnType<typeof visit>>

// What the layout shows for the page: how far the lattice turned, and the
// breadcrumb.
function stage(wrapper: Wrapper) {
  const style = wrapper.find('[data-lattice] svg').attributes('style') ?? ''
  return {
    turn: style.match(/--turn: ([^;]+)/)?.[1],
    crumb: wrapper.find('[data-crumb]').text()
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

  it('leaves the lattice unturned and invites a choice', async () => {
    const wrapper = await visit('/')
    expect(stage(wrapper)).toEqual({
      turn: '0deg',
      crumb: '— SELECT A SECTION —'
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
    expect(bullets[0]![0]!.text()).toMatch(
      /^Contributed production frontend code to Quintet/
    )
    expect(body.find('[data-certifications]').text()).toContain(
      'Certified Vue.js Developer (Level I)'
    )
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

  it('opens in a panel that closes back home', async () => {
    const wrapper = await visit('/experience')
    const panel = wrapper.find('section')
    expect(panel.find('h2').text()).toBe('Experience')
    expect(panel.find('header').text()).toContain('01 · WORK EXPERIENCE')
    expect(panel.find('header a').attributes('href')).toBe('/')
  })

  it('turns the lattice one step and labels the breadcrumb', async () => {
    const wrapper = await visit('/experience')
    expect(stage(wrapper)).toEqual({
      turn: '22.5deg',
      crumb: '— EXPERIENCE —'
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

  it('turns the lattice two steps and labels the breadcrumb', async () => {
    const wrapper = await visit('/projects')
    expect(stage(wrapper)).toEqual({ turn: '45deg', crumb: '— PROJECTS —' })
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
    expect(stage(wrapper)).toEqual({ turn: '45deg', crumb: '— PROJECTS —' })
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
  it('opens in a panel that closes back home', async () => {
    const wrapper = await visit(route)
    const panel = wrapper.find('section')
    expect(panel.find('h2').text()).toBe(title)
    expect(panel.find('header').text()).toContain(kicker)
    expect(panel.find('header a').attributes('href')).toBe('/')
  })

  it(`turns the lattice ${angle} and labels the breadcrumb`, async () => {
    const wrapper = await visit(route)
    expect(stage(wrapper)).toEqual({ turn: angle, crumb })
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

  it("marks the channels that aren't filled in yet, without linking them", async () => {
    const wrapper = await visit('/contact')
    const rows = wrapper.findAll('[data-contact]')
    expect(rows.map((r) => [r.element.tagName, r.text()])).toEqual([
      ['DIV', 'Email [add address]'],
      ['A', 'GitHub @ANASAZKOUL ↗, opens in a new tab'],
      ['DIV', 'LinkedIn [add profile]']
    ])
  })
})
