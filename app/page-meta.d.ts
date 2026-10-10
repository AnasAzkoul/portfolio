// What each page tells the default layout through definePageMeta.
import type { LatticeTurn } from '~/utils/lattice'

declare module '#app' {
  interface PageMeta {
    /** Which section the page is (0–4): how far the lattice turns. Defaults to 0. */
    turn?: LatticeTurn
    /** Footer breadcrumb label, e.g. "WORK". Defaults to "SELECT A SECTION". */
    crumb?: string
  }
}
