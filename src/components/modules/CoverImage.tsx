import { stegaClean } from '@sanity/client/stega';
import { Image } from 'next-sanity/image';

import { urlForImage } from '@/lib/sanity/client/utils';

interface CoverImageProps {
  image: { asset?: { _ref?: string }; alt?: string };
  priority?: boolean;
}

export default function CoverImage(props: CoverImageProps) {
  const { image: source, priority } = props;

  const image = source?.asset?._ref ? (
    <Image
      className="cover-image__img"
      fill={true}
      alt={stegaClean(source?.alt) || ''}
      src={urlForImage(source)?.height(720).width(1280).auto('format').url() as string}
      sizes="100vw"
      priority={priority}
    />
  ) : (
    <div className="cover-image__placeholder" />
  );

  return <div className="cover-image">{image}</div>;
}
