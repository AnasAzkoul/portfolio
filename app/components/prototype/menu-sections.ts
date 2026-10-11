// PROTOTYPE, throw away once a phone menu is picked.
//
// The question: with five sections (ANA-93) the nav no longer fits on a
// phone. What should the nav be below 900px? Four variants in the default
// layout, switched by ?variant= or the ← → keys, dev only:
// A Index, B Dropdown, C Sheet, E Star index (B's star opening A's index).
// D (the bottom nav wrapped onto two rows) was dropped after a first look.
//
// The five sections ANA-93 plans. Projects still lives at /work until then,
// and /experience is a stub page.
export const prototypeSections = [
  {
    number: '01',
    label: 'EXPERIENCE',
    name: 'Experience',
    kicker: 'WORK EXPERIENCE',
    to: '/experience'
  },
  {
    number: '02',
    label: 'PROJECTS',
    name: 'Projects',
    kicker: 'SELECTED PROJECTS',
    to: '/work'
  },
  {
    number: '03',
    label: 'STACK',
    name: 'Stack',
    kicker: 'TOOLS OF THE CRAFT',
    to: '/stack'
  },
  {
    number: '04',
    label: 'STORY',
    name: 'Story',
    kicker: 'HOW I CAME TO THE FRONTEND',
    to: '/story'
  },
  {
    number: '05',
    label: 'CONTACT',
    name: 'Contact',
    kicker: 'OPEN TO FRONTEND ROLES IN NL',
    to: '/contact'
  }
] as const
