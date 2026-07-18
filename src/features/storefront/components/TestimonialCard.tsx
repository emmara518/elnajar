import { Avatar, Card, CardBody, Flex } from '@/design-system';
import { Star } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  avatar?: string;
  rating: number;
  content: string;
  date?: string;
}

export function TestimonialCard({ name, avatar, rating, content, date }: TestimonialCardProps) {
  return (
    <Card className="h-full">
      <CardBody>
        <Flex align="center" gap={3} className="mb-3">
          <Avatar src={avatar} alt={name} size="md" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
            {date && (
              <p className="text-xs text-gray-500">
                {new Date(date).toLocaleDateString('ar-SA')}
              </p>
            )}
          </div>
        </Flex>

        <div className="flex items-center gap-0.5 mb-3" dir="ltr">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`}
            />
          ))}
        </div>

        <p className="text-sm text-gray-600 leading-relaxed line-clamp-4">
          {content}
        </p>
      </CardBody>
    </Card>
  );
}
