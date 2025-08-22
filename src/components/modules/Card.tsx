import PortableText from './PortableText';
import { type PortableTextBlock } from 'next-sanity';
import { CardGridSection } from '../sections/types';

export default function Card({
  card: { heading, content },
}: {
  card: NonNullable<CardGridSection['cards']>[number];
}) {
  return (
    <div className="card">
      <h3 className="card__heading">{heading}</h3>
      <div className="card__content">
        <PortableText value={content as PortableTextBlock[]} />
      </div>
    </div>
  );
}
