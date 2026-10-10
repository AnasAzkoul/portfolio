import { cva, type VariantProps } from 'class-variance-authority'

/** The jewel dot set in the cartouche's star. */
export const cartoucheJewel = cva('opacity-80', {
  variants: {
    jewel: {
      red: 'fill-red',
      pearl: 'fill-pearl',
      green: 'fill-green',
      gold: 'fill-gold-hi'
    }
  }
})

export type CartoucheJewel = NonNullable<
  VariantProps<typeof cartoucheJewel>['jewel']
>
