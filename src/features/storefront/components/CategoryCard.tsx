import { Link } from 'react-router-dom';
import { Card, CardBody, AspectRatio } from '@/design-system';
import { getImageUrl } from '../utils';
import type { Category } from '../types';

interface CategoryCardProps {
  category: Pick<Category, 'id' | 'name' | 'slug' | 'image' | 'productCount' | 'description'>;
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link to={`/categories/${category.slug}`} className="group block">
      <Card className="overflow-hidden transition-shadow hover:shadow-lg">
        <AspectRatio ratio={1}>
          <img
            src={getImageUrl(category.image)}
            alt={category.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </AspectRatio>
        <CardBody className="text-center">
          <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
            {category.name}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {category.productCount} {category.productCount === 1 ? 'منتج' : 'منتجات'}
          </p>
        </CardBody>
      </Card>
    </Link>
  );
}
