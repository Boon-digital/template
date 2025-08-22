import { PostsArchiveQueryResult } from '@/sanity.types';
import { Image } from 'next-sanity/image';
import { urlForImage } from '@/lib/sanity/client/utils';
import CustomPortableText from '@/components/modules/PortableText';
import type { PortableTextBlock } from 'next-sanity';
import { Badge } from '@/components/ui/badge';

export default function PersonArchiveByline({
  person,
}: {
  person: NonNullable<PostsArchiveQueryResult['results'][number]['author']>;
}) {
  return (
    <div className="person-archive-byline">
      <div className="person-archive-byline__content">
        <div className="person-archive-byline__image-container">
          {person.image ? (
            <Image
              src={urlForImage(person.image)?.width(800).height(800).url() as string}
              alt={`Photo of ${person.firstName} ${person.lastName}`}
              width={800}
              height={800}
              className="person-archive-byline__image"
            />
          ) : null}
        </div>

        <div className="person-archive-byline__info">
          <div className="person-archive-byline__header">
            <h1 className="person-archive-byline__title">
              {person.firstName} {person.lastName}
            </h1>
            {person.role ? <Badge>{person.role}</Badge> : null}
          </div>
          {person.biography ? (
            <CustomPortableText value={person.biography as PortableTextBlock[]} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
