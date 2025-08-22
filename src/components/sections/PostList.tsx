import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import PostCard from '../modules/PostCard';
import { Button } from '../ui/button';
import type { PostListSection } from './types';

export default function PostListSection({ section }: { section: PostListSection }) {
  const { posts } = section;
  if (!posts.length) {
    return null;
  }

  const numberOfPosts = section.numberOfPosts ?? 3;

  return (
    <section className="post-list">
      <div className="post-list__container">
        <div className="post-list__header">
          <h2 className="post-list__heading">{section?.heading}</h2>
          <p className="post-list__subtitle">Latest updates and insights from our team</p>
        </div>
        <div className="post-list__content">
          <div className="post-list__posts">
            {posts.slice(0, numberOfPosts).map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        </div>

        <div className="post-list__cta">
          <Button asChild variant="gradient" size={'xl'}>
            <Link href={'/blog'}>
              View All Posts <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
