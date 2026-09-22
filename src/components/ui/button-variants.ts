import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Lives apart from button.tsx so that file only exports components — a
 * non-component export there breaks React Fast Refresh.
 */
export const buttonVariants = cva(
  'inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap font-medium no-underline transition-all duration-300 outline-none select-none focus-visible:ring-2 focus-visible:ring-whd-pink-soft focus-visible:ring-offset-2 focus-visible:ring-offset-whd-dark disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'rounded-full bg-whd-pink text-white hover:bg-whd-pink-deep hover:shadow-lg',
        solid: 'rounded-lg bg-white text-whd-pink hover:scale-105 hover:shadow-lg',
        outline:
          'rounded-full border border-whd-pink/60 text-white hover:border-whd-pink hover:bg-whd-pink/10',
        ghost: 'rounded-lg text-white/80 hover:bg-white/10 hover:text-white',
        link: 'text-whd-pink-soft hover:text-whd-pink-bright',
      },
      size: {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-5 py-2 text-base',
        lg: 'px-8 py-4 text-xl md:text-2xl',
        icon: 'h-10 w-10 rounded-lg p-0',
        none: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
