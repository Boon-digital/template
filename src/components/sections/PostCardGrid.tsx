import { type PortableTextBlock } from 'next-sanity';
import PortableText from '../modules/PortableText';
import { PostCardGridSection } from './types';
import { format } from 'date-fns';
import Link from 'next/link';
import { urlForImage } from '@/lib/sanity/client/utils';

export default function PostCardGrid({ section }: { section: PostCardGridSection }) {
  const { posts } = section;
  if (!posts?.length) {
    return null;
  }

  const numberOfPosts = section.numberOfPosts ?? 3;
  const displayPosts = posts.slice(0, numberOfPosts);

  return (
    <section className="card-grid">
      <div className="card-grid__container">
        <div className="card-grid__header">
          <h2 className="card-grid__heading">{section?.heading}</h2>
          <div className="card-grid__content">
            <p>Latest updates and insights from our team</p>
          </div>
        </div>
        <div className="card-grid__grid">
          {displayPosts.map((post) => (
            <div key={post._id} className="card-grid__item">
              <Link href={`/blog/${post.slug}`} className="card-link">
                <article className="card">
                  {post.image && (
                    <img
                      src={urlForImage(post.image)?.width(400).height(200).url() as string}
                      alt={post.image.alt || post.title}
                      className="card__image"
                    />
                  )}
                  <h3 className="card__heading">{post.title}</h3>
                  <div className="card__content">{post.excerpt && <p>{post.excerpt}</p>}</div>
                  <div className="card__meta">
                    {post.date && (
                      <time className="card__date" dateTime={post.date}>
                        {format(new Date(post.date), 'MMM d, yyyy')}
                      </time>
                    )}
                    {post.author && (
                      <div className="card__author">
                        {post.author.image && (
                          <img
                            src={
                              urlForImage(post.author.image)?.width(40).height(40).url() as string
                            }
                            alt={`${post.author.firstName} ${post.author.lastName}`}
                            className="card__author-avatar"
                          />
                        )}
                        <span className="card__author-name">
                          {post.author.firstName} {post.author.lastName}
                        </span>
                      </div>
                    )}
                  </div>
                </article>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
