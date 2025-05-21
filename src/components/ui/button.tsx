import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

type ButtonProps = {
  variant?: 'primary' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'gradient';
  size?: 'primary' | 'sm' | 'lg' | 'xl' | 'icon';
  asChild?: boolean;
  className?: string;
};

function Button({
  className,
  variant = 'primary',
  size = 'primary',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> & ButtonProps) {
  const Comp = asChild ? Slot : 'button';

  const buttonClasses = cn('button', `button--${variant}`, `button--${size}`, className);

  return <Comp className={buttonClasses} {...props} />;
}

export { Button };
