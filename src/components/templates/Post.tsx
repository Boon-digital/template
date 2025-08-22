import Byline from '@/components/modules/Byline';
import CoverImage from '@/components/modules/CoverImage';
import CustomPortableText from '@/components/modules/PortableText';
import { PostQueryResult } from '@/sanity.types';
import type { PortableTextBlock } from 'next-sanity';
import React from 'react';

type Props = {
  post: NonNullable<PostQueryResult>;
};

const Post = ({ post }: Props) => {
  return (
    <div className="post-template">
      {post.image?.asset?._ref ? (
        <div className="post-template__image">
          <CoverImage image={post.image} priority />
        </div>
      ) : null}
      <h1 className="post-template__title">{post.title}</h1>
      {post.author ? (
        <div className="post-template__byline">
          <Byline post={post} />
        </div>
      ) : null}

      <div className="post-template__content">
        <CustomPortableText value={post.content as PortableTextBlock[]} />
      </div>
    </div>
  );
};

export default Post;
