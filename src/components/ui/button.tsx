import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black/50",
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg shadow-gray-500/25 hover:from-gray-500 hover:to-gray-600 hover:shadow-xl hover:shadow-gray-500/40 hover:scale-105 active:scale-95 border border-gray-400/30',
        destructive:
          'bg-gradient-to-r from-gray-700 to-gray-800 text-white shadow-lg shadow-gray-600/25 hover:from-gray-600 hover:to-gray-700 hover:shadow-xl hover:shadow-gray-600/40 hover:scale-105 active:scale-95 border border-gray-500/30',
        outline:
          'border border-gray-600/20 bg-gray-800/5 text-gray-200 backdrop-blur-sm shadow-lg shadow-black/20 hover:bg-gray-700/10 hover:border-gray-500/30 hover:shadow-xl hover:shadow-black/30 hover:scale-105 active:scale-95',
        secondary:
          'bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg shadow-gray-500/25 hover:from-gray-500 hover:to-gray-600 hover:shadow-xl hover:shadow-gray-500/40 hover:scale-105 active:scale-95 border border-gray-400/30',
        ghost:
          'text-gray-300/90 hover:text-gray-200 hover:bg-gray-800/5 backdrop-blur-sm rounded-xl hover:scale-105 active:scale-95',
        link: 'text-gray-400 underline-offset-4 hover:text-gray-300 hover:underline',
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
