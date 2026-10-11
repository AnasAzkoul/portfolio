// What each page tells the default layout through definePageMeta.
import type { LatticeTurn } from '~/utils/lattice'
import type { Stage } from '~/utils/stage'

declare module '#app' {
  interface PageMeta {
    /** Which section the page is (0–5): how far the lattice turns. Defaults to 0. */
    turn?: LatticeTurn
    /** Footer breadcrumb label, e.g. "PROJECTS". Without one, no breadcrumb shows. */
    crumb?: string
    /** How the view and the lattice share the screen from 1280px. Defaults to `centre`. */
    stage?: Stage
  }
}
