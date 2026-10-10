import { cva, type VariantProps } from 'class-variance-authority'

/** The jewel accent set at the heart of the star. */
export const inlaidStarJewel = cva('opacity-80', {
  variants: {
    jewel: {
      red: 'fill-red',
      pearl: 'fill-pearl',
      green: 'fill-green',
      gold: 'fill-gold-hi'
    }
  }
})

export type Jewel = NonNullable<VariantProps<typeof inlaidStarJewel>['jewel']>
