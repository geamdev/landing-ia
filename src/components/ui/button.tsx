import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 ease-out disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black/50",
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-blue-700/90 to-purple-700/90 text-white shadow-lg shadow-blue-900/20 hover:shadow-xl hover:shadow-blue-900/30 hover:scale-102 active:scale-98 backdrop-blur-sm transition-all duration-200 ease-out hover:bg-red-400/80',
        destructive:
          'bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg shadow-red-500/25 hover:from-red-500 hover:to-pink-500 hover:shadow-xl hover:shadow-red-500/40 hover:scale-105 active:scale-95 border border-red-400/30',
        outline:
          'border border-blue-500/25 bg-blue-900/5 text-blue-100 backdrop-blur-sm shadow-md shadow-blue-900/10 hover:bg-blue-800/15 hover:border-blue-400/40 hover:shadow-lg hover:shadow-blue-900/20 hover:scale-102 active:scale-98 transition-all duration-200 ease-out',
        secondary:
          'bg-gradient-to-r from-blue-600/80 to-purple-600/80 text-white shadow-md shadow-blue-900/15 hover:shadow-lg hover:shadow-blue-900/25 hover:scale-102 active:scale-98 border border-blue-500/20 backdrop-blur-sm transition-all duration-200 ease-out',
        ghost:
          'text-blue-200/90 hover:text-blue-100 hover:bg-blue-900/8 backdrop-blur-sm rounded-xl hover:scale-102 active:scale-98 transition-all duration-200 ease-out',
        link: 'text-blue-400 underline-offset-4 hover:text-blue-300 hover:underline transition-all duration-300 ease-out',
      },
      size: {
        default: 'h-12 px-6 py-3 has-[>svg]:px-4',
        sm: 'h-10 rounded-lg gap-1.5 px-4 py-2 has-[>svg]:px-3',
        lg: 'h-14 rounded-xl px-8 py-4 has-[>svg]:px-6 text-base',
        icon: 'size-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot='button'
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button };
