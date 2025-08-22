/**
 * This component uses Portable Text to render a post body.
 *
 * You can learn more about Portable Text on:
 * https://www.sanity.io/docs/block-content
 * https://github.com/portabletext/react-portabletext
 * https://portabletext.org/
 *
 */

import { PortableText, type PortableTextComponents, type PortableTextBlock } from 'next-sanity';

import Link from '@/components/modules/Link';
import Image from 'next/image';
import { urlForImage } from '@/lib/sanity/client/utils';
import { PropsWithChildren, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { parseChildrenToSlug } from '@/utils/strings';
import { LinkFragmentType } from '@/lib/sanity/queries/fragments/fragment.types';

type HeadingProps = PropsWithChildren<{
  as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  id: string;
  className?: string;
}>;

function Heading({ as, id, children, className = '' }: HeadingProps) {
  const Element = as;
  return (
    <Element className={cn('portable-text__heading', className)}>
      {children}
      <a href={`#${id}`} className="portable-text__heading-link">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="portable-text__heading-icon"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>
      </a>
    </Element>
  );
}

export default function CustomPortableText({
  className,
  value,
}: {
  className?: string;
  value: PortableTextBlock[];
}) {
  const components: PortableTextComponents = {
    block: {
      normal: ({ children }) => <p className="portable-text__paragraph">{children}</p>,
      h1: ({ children, value }) => (
        <Heading as="h1" id={parseChildrenToSlug(value.children)} className="portable-text__h1">
          {children}
        </Heading>
      ),
      h2: ({ children, value }) => (
        <Heading as="h2" id={parseChildrenToSlug(value.children)} className="portable-text__h2">
          {children}
        </Heading>
      ),
      h3: ({ children, value }) => (
        <Heading as="h3" id={parseChildrenToSlug(value.children)} className="portable-text__h3">
          {children}
        </Heading>
      ),
      h4: ({ children, value }) => (
        <Heading as="h4" id={parseChildrenToSlug(value.children)} className="portable-text__h4">
          {children}
        </Heading>
      ),
      h5: ({ children, value }) => (
        <Heading as="h5" id={parseChildrenToSlug(value.children)} className="portable-text__h5">
          {children}
        </Heading>
      ),
      h6: ({ children, value }) => (
        <Heading as="h6" id={parseChildrenToSlug(value.children)} className="portable-text__h6">
          {children}
        </Heading>
      ),
      blockquote: ({ children }) => (
        <blockquote className="portable-text__blockquote">{children}</blockquote>
      ),
    },
    list: {
      bullet: ({ children }) => <ul className="portable-text__ul">{children}</ul>,
      number: ({ children }) => <ol className="portable-text__ol">{children}</ol>,
    },
    listItem: {
      bullet: ({ children }) => <li className="portable-text__li">{children}</li>,
      number: ({ children }) => <li className="portable-text__li">{children}</li>,
    },
    marks: {
      code: ({ children }) => <code className="portable-text__code">{children}</code>,
      em: ({ children }) => <em className="portable-text__em">{children}</em>,
      link: ({
        children,
        value,
      }: {
        children: ReactNode;
        value?: { customLink: LinkFragmentType };
      }) => {
        const customLink = value?.customLink;

        if (!customLink) {
          return <>{children}</>;
        }

        return (
          <Link link={customLink} className="portable-text__link">
            {children}
          </Link>
        );
      },
      strong: ({ children }) => <strong className="portable-text__strong">{children}</strong>,
      'strike-through': ({ children }) => <del className="portable-text__del">{children}</del>,
      underline: ({ children }) => <u className="portable-text__u">{children}</u>,
      sup: ({ children }) => <sup className="portable-text__sup">{children}</sup>,
      sub: ({ children }) => <sub className="portable-text__sub">{children}</sub>,
    },
    types: {
      image: (props) => {
        const { value } = props;
        if (!value) {
          return null;
        }

        return (
          <div className="portable-text__image">
            <Image
              width="1000"
              height="667"
              src={urlForImage(value)?.width(1000).height(667).url() as string}
              alt={value?.alt || ''}
              className="portable-text__image-img"
            />
          </div>
        );
      },
    },
  };

  return (
    <div className={cn('portable-text', className)}>
      <PortableText components={components} value={value} />
    </div>
  );
}
