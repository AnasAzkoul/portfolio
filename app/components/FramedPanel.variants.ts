import { cva, type VariantProps } from 'class-variance-authority'

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
      }
    },
    defaultVariants: { variant: 'default' }
  }
)

export type FramedPanelVariants = VariantProps<typeof framedPanel>
