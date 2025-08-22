import { type PortableTextBlock } from 'next-sanity';
import PortableText from '../modules/PortableText';
import Card from '../modules/Card';
import { CardGridSection } from './types';

export default function CardGrid({
  section: { heading, content, cards },
}: {
  section: CardGridSection;
}) {
  return (
    <section className="card-grid">
      <div className="card-grid__container">
        <div className="card-grid__header">
          <h2 className="card-grid__heading">{heading}</h2>
          <div className="card-grid__content">
            <PortableText value={content as PortableTextBlock[]} />
          </div>
        </div>
        <div className="card-grid__grid">
          {cards?.map((card, index) => (
            <div key={index} className="card-grid__item">
              <Card card={card} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
