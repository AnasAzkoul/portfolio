import { cva, type VariantProps } from 'class-variance-authority'

// From 1280px, in a stage layout with no frame, the panel stands on the bare
// ground: the lattice is beside it or gone, so there's nothing to set it off
// from.
const unframed =
  'min-[1280px]:border-transparent min-[1280px]:bg-transparent min-[1280px]:shadow-none min-[1280px]:backdrop-blur-none'

// ...and fills the view area's height, its body scrolling within.
const fullHeight = 'min-[1280px]:h-(--view-height) min-[1280px]:max-h-none'

// With no frame to cut it off, an unframed body's text fades out at its
// scroll edges, and starts where the header's does.
const unframedBody = `min-[1280px]:px-0 min-[1280px]:[mask-image:linear-gradient(to_bottom,transparent,black_20px,black_calc(100%_-_56px),transparent)]`

export const framedPanel = cva(
  [
    // No taller than the room the stage's view area leaves (--view-height).
    'relative flex max-h-[min(74vh,720px,var(--view-height,100dvh))] flex-col bg-panel backdrop-blur-[3px]',
    // Double gold border: the outer 1px line, then a fine inner line 5px inside it.
    'border border-gold/45',
    'shadow-[inset_0_0_0_5px_var(--color-panel),inset_0_0_0_6px_--alpha(var(--color-gold)/22%),0_20px_60px_rgb(0_0_0/0.5)]'
  ],
  {
    variants: {
      variant: {
        default: 'w-[min(760px,92vw)]',
        narrow: 'w-[min(560px,92vw)]',
        fluid: 'w-full'
      },
      // The page's stage layout (see utils/stage.ts); it changes nothing
      // below 1280px.
      stage: {
        centre: '',
        // One centred column, as wide as the reading measure, so the text
        // sits square under the title.
        focus: [
          unframed,
          fullHeight,
          'min-[1280px]:w-[min(var(--container-measure),100%_-_88px)]'
        ],
        // On the left, lined up with the mark (the view area's 24px padding
        // and 20px more make 44px), leaving a 64px gap before the lattice.
        beside: [
          unframed,
          fullHeight,
          'min-[1280px]:ml-5 min-[1280px]:w-[min(640px,100%_-_var(--lattice-size)_-_104px)] min-[1280px]:self-start'
        ],
        // From the top of the view area to 60px down into the arch, about
        // where its ring begins.
        horizon:
          'min-[1280px]:h-[calc(100dvh_-_var(--lattice-rise)_-_30px)] min-[1280px]:max-h-none'
      }
    },
    defaultVariants: { variant: 'default', stage: 'centre' }
  }
)

/** The header's look in each stage layout, from 1280px. */
export const framedPanelHeader = cva('', {
  variants: {
    stage: {
      centre: '',
      // The kicker and title centred over the column, between the star and
      // the rule; no line under them.
      focus:
        'min-[1280px]:flex-col min-[1280px]:items-center min-[1280px]:gap-0 min-[1280px]:border-b-0 min-[1280px]:px-0 min-[1280px]:pt-0 min-[1280px]:pb-1.5 min-[1280px]:text-center',
      // Its text starts where the mark does.
      beside: 'min-[1280px]:px-0',
      horizon: ''
    }
  },
  defaultVariants: { stage: 'centre' }
})

/** The body's look in each stage layout, from 1280px. */
export const framedPanelBody = cva('', {
  variants: {
    stage: {
      centre: '',
      focus: unframedBody,
      beside: unframedBody,
      horizon: ''
    }
  },
  defaultVariants: { stage: 'centre' }
})

/** The diamond on each corner of the frame, gone with the frame. */
export const framedPanelCorner = cva(
  'absolute size-2.5 rotate-45 border border-gold bg-panel',
  {
    variants: {
      stage: {
        centre: '',
        focus: 'min-[1280px]:hidden',
        beside: 'min-[1280px]:hidden',
        horizon: ''
      }
    },
    defaultVariants: { stage: 'centre' }
  }
)

export type FramedPanelVariants = VariantProps<typeof framedPanel>
