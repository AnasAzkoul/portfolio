/** One of the site's top-level sections. */
export interface Section {
  /** Name in the nav and the section menu, e.g. "Projects". */
  name: string
  /** Italic line under the name in the section menu. */
  subtitle: string
  /** The section's route. */
  to: string
}

/**
 * The sections in nav order. The nav and the section menu both list these;
 * the menu numbers each one by its place here.
 */
export const sections: readonly Section[] = [
  {
    name: 'Experience',
    subtitle: 'Work experience',
    to: '/experience'
  },
  {
    name: 'Projects',
    subtitle: 'Selected projects',
    to: '/projects'
  },
  {
    name: 'Stack',
    subtitle: 'Tools of the craft',
    to: '/stack'
  },
  {
    name: 'Story',
    subtitle: 'How I came to the frontend',
    to: '/story'
  },
  {
    name: 'Contact',
    subtitle: 'Open to frontend roles in NL',
    to: '/contact'
  }
]
