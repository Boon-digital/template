import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Image } from 'next-sanity/image';
import { ArrowRight } from 'lucide-react';
import ReadTime from '@/components/ReadTime';
import { urlForImage } from '@/lib/sanity/client/utils';
import { PostCardFragmentType } from '@/lib/sanity/queries/fragments/fragment.types';
import { getDocumentLink } from '@/lib/links';

export default function PostCard({ post }: { post: PostCardFragmentType }) {
  const { title, excerpt, date, author, image, categories } = post;

  const featuredCategory = categories?.[0];

  return (
    <article className="post-card">
      <div className="post-card__grid">
        <div className="post-card__image-container">
          {image ? (
            <Image
              src={urlForImage(image)?.width(1000).height(667).url() as string}
              alt={image?.alt || 'Blog Post Image'}
              width={1000}
              height={667}
              className="post-card__image"
            />
          ) : null}
        </div>
        <div className="post-card__content">
          <div className="post-card__meta">
            {featuredCategory && (
              <Link href={getDocumentLink(featuredCategory)} className="post-card__category">
                {featuredCategory.title}
              </Link>
            )}
            <ReadTime wordCount={post.wordCount} className="post-card__read-time" />
          </div>
          {date ? (
            <time className="post-card__date" dateTime={date}>
              {new Date(date).toLocaleDateString()}
            </time>
          ) : null}
          <h3 className="post-card__title">
            <Link href={`/blog/${post.slug}`} className="post-card__title-link">
              {title}
            </Link>
          </h3>
          {excerpt ? <p className="post-card__excerpt">{excerpt}</p> : null}
          <div className="post-card__author">
            {author ? (
              <span>
                By {author?.firstName} {author?.lastName}
              </span>
            ) : null}
          </div>
          <Link href={`/blog/${post.slug}`} className="post-card__read-more">
            Read More
            <ArrowRight className="post-card__read-more-icon" />
          </Link>
        </div>
      </div>
    </article>
  );
}
