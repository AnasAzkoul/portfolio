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

describe('work', () => {
  it('lists each project under the title, linking to its case study', async () => {
    const wrapper = await visit('/work')
    expect(wrapper.find('[data-view-area] h2').text()).toBe('Selected Work')
    const links = wrapper.findAll('[data-work-list] a')
    expect(
      links.map((a) => [
        a.find('[data-project-name]').text(),
        a.attributes('href')
      ])
    ).toEqual([
      ['Variant System', '/work/variant-system'],
      ['Nuxt 3 → 4 Migration', '/work/nuxt-4-migration'],
      ['White-label Terminals', '/work/white-label-terminals'],
      ['LearnFlow', '/work/learnflow']
    ])
  })

  it('previews the first project until another is picked', async () => {
    const wrapper = await visit('/work')
    const preview = wrapper.find('[data-work-preview]')
    expect(preview.find('h3').text()).toBe('Variant System')
    expect(preview.text()).toContain('01 · QUINTET · SCALA')
    expect(preview.text()).toContain("Quintet is Scala's menu-board platform")
    expect(preview.findAll('[data-chip]').map((c) => c.text())).toEqual([
      'Vue 3',
      'Nuxt',
      'TypeScript',
      'CVA'
    ])
    expect(preview.find('a').attributes('href')).toBe('/work/variant-system')
  })

  it('previews a project when the pointer moves onto it', async () => {
    const wrapper = await visit('/work')
    await wrapper.findAll('[data-work-list] a')[3]!.trigger('mouseenter')
    const preview = wrapper.find('[data-work-preview]')
    expect(preview.find('h3').text()).toBe('LearnFlow')
    expect(preview.find('a').attributes('href')).toBe('/work/learnflow')
  })

  it('previews a project when it takes keyboard focus', async () => {
    const wrapper = await visit('/work')
    await wrapper.findAll('[data-work-list] a')[2]!.trigger('focus')
    expect(wrapper.find('[data-work-preview] h3').text()).toBe(
      'White-label Terminals'
    )
  })

  it('marks the previewed project in the list', async () => {
    const wrapper = await visit('/work')
    const links = wrapper.findAll('[data-work-list] a')
    await links[1]!.trigger('mouseenter')
    expect(links.map((a) => a.attributes('data-previewed'))).toEqual([
      undefined,
      '',
      undefined,
      undefined
    ])
  })

  it('turns the lattice one step and labels the breadcrumb', async () => {
    const wrapper = await visit('/work')
    expect(stage(wrapper)).toEqual({ turn: '22.5deg', crumb: '— WORK —' })
  })

  it('leaves the index open while no project is', async () => {
    const wrapper = await visit('/work')
    expect(
      wrapper.find('[data-work-index]').attributes('inert')
    ).toBeUndefined()
    expect(wrapper.find('section').exists()).toBe(false)
  })
})

describe('a project', () => {
  it('opens in a panel over the index, which stays mounted but inert', async () => {
    const wrapper = await visit('/work/variant-system')
    const panel = wrapper.find('section')
    expect(panel.find('h2').text()).toBe('Variant System')
    expect(panel.find('header').text()).toContain('01 · QUINTET · SCALA')
    expect(wrapper.find('[data-work-index]').attributes('inert')).toBeDefined()
  })

  it('tells the case study in fixed sections, then lists its stack', async () => {
    const wrapper = await visit('/work/variant-system')
    const body = wrapper.find('[data-panel-body]')
    expect(body.findAll('h3').map((h) => h.text())).toEqual([
      'Context',
      'Problem',
      'What I did',
      'Outcome',
      'Stack'
    ])
    expect(body.text()).toContain('I introduced class-variance-authority')
    expect(body.findAll('[data-chip]').map((c) => c.text())).toEqual([
      'Vue 3',
      'Nuxt',
      'TypeScript',
      'CVA'
    ])
  })

  it('marks copy still to be written', async () => {
    const wrapper = await visit('/work/nuxt-4-migration')
    const notes = wrapper.findAll('[data-draft-note]').map((n) => n.text())
    expect(notes).toContain('[add: result, issues found and fixed]')
  })

  it('keeps the lattice and breadcrumb where Work left them', async () => {
    const wrapper = await visit('/work/learnflow')
    expect(stage(wrapper)).toEqual({ turn: '22.5deg', crumb: '— WORK —' })
  })

  it('closes back to all work', async () => {
    const wrapper = await visit('/work/learnflow')
    const close = wrapper.find('section header a')
    expect(close.attributes('href')).toBe('/work')
    expect(close.attributes('aria-label')).toBe('Back to all work')
  })

  it('redirects an unknown project to all work', async () => {
    const wrapper = await visit('/work/no-such-project')
    expect(useRouter().currentRoute.value.fullPath).toBe('/work')
    expect(wrapper.find('section').exists()).toBe(false)
    expect(
      wrapper.find('[data-work-index]').attributes('inert')
    ).toBeUndefined()
  })
})

describe.each([
  ['/stack', 'Stack', '02 · TOOLS OF THE CRAFT', '45deg', '— STACK —'],
  ['/story', 'Story', '03 · DRAFT COPY', '67.5deg', '— STORY —'],
  [
    '/contact',
    'Contact',
    '04 · OPEN TO FRONTEND ROLES IN NL',
    '90deg',
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
