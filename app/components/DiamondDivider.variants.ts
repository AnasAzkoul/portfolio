import { cva, type VariantProps } from 'class-variance-authority'

export const diamondDivider = cva('block', {
  variants: {
    size: {
      default: 'size-11 stroke-1',
      // A heavier line, so it stays as visible as the large one once scaled to 26px.
      small: 'size-[26px] stroke-[1.4]'
    }
  },
  defaultVariants: { size: 'default' }
})

export type DiamondDividerVariants = VariantProps<typeof diamondDivider>
