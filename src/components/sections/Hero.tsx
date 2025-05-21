import { Image } from 'next-sanity/image';
import { urlForImage } from '@/lib/sanity/client/utils';
import { type PortableTextBlock } from 'next-sanity';
import PortableText from '@/components/modules/PortableText';
import { Button } from '../ui/button';
import Link from 'next/link';
import { getLinkByLinkObject } from '@/lib/links';
import type { HeroSection } from './types';

export default function HeroSection({ section }: { section: HeroSection }) {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero__grid">
          <div className="hero__content">
            <h1 className="hero__content-title">{section?.heading}</h1>
            <div className="hero__content-text">
              <PortableText value={section.text as PortableTextBlock[]} />
            </div>

            {section?.buttons && section?.buttons.length > 0 && (
              <div className="hero__buttons">
                {section.buttons.map((button) => (
                  <Button asChild variant={button.variant} size="xl" key={button._key}>
                    <Link
                      href={button.link ? getLinkByLinkObject(button.link) || '' : ''}
                      target={button.link?.openInNewTab ? '_blank' : '_self'}
                    >
                      {button.text}
                    </Link>
                  </Button>
                ))}
              </div>
            )}
          </div>

          <div className="hero__media">
            {section.image?.asset && (
              <Image
                src={urlForImage(section.image)?.width(1000).height(667).url() as string}
                alt={section?.image?.alt || ''}
                width={600}
                height={400}
                className="hero__media-image"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
