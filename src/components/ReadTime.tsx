import { Clock } from 'lucide-react';
import { readTime } from '@/utils/strings';

export default function ReadTime({
  wordCount,
  className = '',
}: {
  wordCount: number;
  className?: string;
}) {
  return (
    <div className={`read-time ${className}`}>
      <Clock className="read-time__icon" />
      {readTime(wordCount)} minute
      {readTime(wordCount) > 1 ? 's' : ''}
    </div>
  );
}
