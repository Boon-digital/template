import { Image } from 'next-sanity/image';
import { urlForImage } from '@/lib/sanity/client/utils';
import { type PortableTextBlock } from 'next-sanity';
import PortableText from '@/components/modules/PortableText';
import type { MediaTextSection } from './types';
import Link from 'next/link';

export default function MediaTextSection({ section }: { section: MediaTextSection }) {
  return (
    <div
      className={`media-text ${section?.imagePosition === 'right' ? 'media-text--image-right' : ''}`}
    >
      <div className="media-text__media">
        {section.image?.asset && (
          <Image
            alt={section.image?.alt || ''}
            className="media-text__image"
            width="1000"
            height="667"
            src={urlForImage(section.image)?.width(1000).height(667).url() as string}
          />
        )}
      </div>
      <div className="media-text__content">
        <h2 className="media-text__heading">{section?.heading}</h2>
        <div className="media-text__text">
          <PortableText value={section.content as PortableTextBlock[]} />
        </div>
        {section.cta && (
          <div className="media-text__cta">
            <Link href={section.cta.url || '#'} className="media-text__button">
              {section.cta.label}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
