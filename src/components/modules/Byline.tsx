import { Image } from 'next-sanity/image';

import { urlForImage } from '@/lib/sanity/client/utils';
import DateComponent from '@/components/ui/Date';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import ReadTime from '@/components/ReadTime';
import { PostCardFragmentType } from '@/lib/sanity/queries/fragments/fragment.types';

export default function Byline({ post }: { post: PostCardFragmentType }) {
  return (
    <div className="byline">
      <div className="byline__author">
        {post.author?.image?.asset?._ref ? (
          <div className="byline__avatar-container">
            <Image
              alt={post.author?.image?.alt || ''}
              className="byline__avatar"
              height={48}
              width={48}
              src={
                urlForImage(post.author?.image)?.height(96).width(96).fit('crop').url() as string
              }
            />
          </div>
        ) : (
          <div className="byline__author-text">By </div>
        )}
        <div className="byline__author-info">
          {post.author?.firstName && post.author?.lastName && post.author?.slug ? (
            <Link className="byline__author-link" href={`/author/${post.author.slug}`}>
              {post.author.firstName} {post.author.lastName}
            </Link>
          ) : null}
          <div className="byline__date">
            <DateComponent dateString={post.date} />
          </div>
        </div>
      </div>
      <div className="byline__meta">
        {post.categories && post.categories?.length > 0 && (
          <div className="byline__categories">
            {post.categories.map((category) => (
              <Link
                href={`/category/${category.slug}`}
                key={category._id}
                className="byline__category"
              >
                {category.title}
              </Link>
            ))}
          </div>
        )}
        <ReadTime wordCount={post.wordCount} className="byline__read-time" />
      </div>
    </div>
  );
}
