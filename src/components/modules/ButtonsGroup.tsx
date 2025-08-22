import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { ButtonFragmentType } from '@/lib/sanity/queries/fragments/fragment.types';
import { getLinkByLinkObject } from '@/lib/links';
import Link from 'next/link';

export default function ButtonsGroup({
  buttons,
  size = 'xl',
  className,
}: {
  buttons: ButtonFragmentType[];
  size?: 'xl' | 'lg' | 'sm' | 'primary' | 'icon';
  className?: string;
}) {
  return (
    <div className={cn('buttons-group', className)}>
      {buttons.map((button) => {
        // Map the variant to match Button component expectations
        const variant = button.variant === 'default' ? 'primary' : button.variant || 'primary';

        return (
          <Button asChild variant={variant} size={size} key={button._key}>
            <Link
              href={button.link ? getLinkByLinkObject(button.link) || '' : ''}
              target={button.link?.openInNewTab ? '_blank' : '_self'}
            >
              {button.text}
            </Link>
          </Button>
        );
      })}
    </div>
  );
}
