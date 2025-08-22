import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

type BadgeProps = {
  variant?: BadgeVariant;
  asChild?: boolean;
  className?: string;
};

function Badge({
  className,
  variant = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'span'> & BadgeProps) {
  const Comp = asChild ? Slot : 'span';

  return (
    <Comp data-slot="badge" className={cn('badge', `badge--${variant}`, className)} {...props} />
  );
}

export { Badge };
