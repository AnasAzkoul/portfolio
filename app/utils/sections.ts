/** One of the site's top-level sections. */
export interface Section {
  /** Label in the nav, e.g. "WORK". */
  label: string
  /** Name in the section menu, e.g. "Work". */
  name: string
  /** Mono line under the name in the section menu. */
  subtitle: string
  /** The section's route. */
  to: string
}

/**
 * The sections in nav order. The nav and the section menu both list these;
 * the menu numbers each one by its place here.
 */
export const sections: readonly Section[] = [
  { label: 'WORK', name: 'Work', subtitle: 'SELECTED WORK', to: '/work' },
  {
    label: 'STACK',
    name: 'Stack',
    subtitle: 'TOOLS OF THE CRAFT',
    to: '/stack'
  },
  {
    label: 'STORY',
    name: 'Story',
    subtitle: 'HOW I CAME TO THE FRONTEND',
    to: '/story'
  },
  {
    label: 'CONTACT',
    name: 'Contact',
    subtitle: 'OPEN TO FRONTEND ROLES IN NL',
    to: '/contact'
  }
]
