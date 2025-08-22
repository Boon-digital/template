import { ArchivePagination } from '@/components/modules/ArchivePagination';
import { PostsArchiveQueryResult } from '@/sanity.types';
import React from 'react';
import PostCard from '../modules/PostCard';

type Props = {
  listingData: NonNullable<PostsArchiveQueryResult>;
  currentPage?: number;
  totalPages?: number;
  title?: string;
  paginationBase?: string;
};

const PostRiver = ({
  listingData,
  currentPage = 1,
  paginationBase = '/blog',
  totalPages = 1,
}: Props) => {
  const { results } = listingData;

  return (
    <div className="post-river">
      <div className="post-river__posts">
        {results.map((post) => {
          return <PostCard key={post._id} post={post} />;
        })}
      </div>
      <div className="post-river__pagination">
        <ArchivePagination
          currentPage={currentPage}
          linkBase={paginationBase}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
};

export default PostRiver;
