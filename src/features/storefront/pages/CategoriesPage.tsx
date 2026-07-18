import { Container, Section, Grid, Stack } from '@/design-system';
import { CategoryCard } from '../components/CategoryCard';
import { Breadcrumbs } from '../layouts/Breadcrumbs';
import type { Category } from '../types';

const allCategories: Category[] = [
  { id: 'cat-1', name: 'إلكترونيات', slug: 'electronics', description: 'أحدث الأجهزة الإلكترونية والهواتف الذكية والأجهزة اللوحية', image: '/images/cat-electronics.jpg', icon: undefined, parentId: null, children: [], productCount: 120, sortOrder: 1, isActive: true },
  { id: 'cat-2', name: 'أزياء', slug: 'fashion', description: 'أحدث صيحات الموضة للرجال والنساء والأطفال', image: '/images/cat-fashion.jpg', icon: undefined, parentId: null, children: [], productCount: 240, sortOrder: 2, isActive: true },
  { id: 'cat-3', name: 'منزل ومطبخ', slug: 'home-kitchen', description: 'كل ما تحتاجه لمنزلك من أثاث وأجهزة وأدوات مطبخ', image: '/images/cat-home.jpg', icon: undefined, parentId: null, children: [], productCount: 180, sortOrder: 3, isActive: true },
  { id: 'cat-4', name: 'جمال وعناية', slug: 'beauty', description: 'منتجات العناية بالبشرة والشعر والمكياج', image: '/images/cat-beauty.jpg', icon: undefined, parentId: null, children: [], productCount: 90, sortOrder: 4, isActive: true },
  { id: 'cat-5', name: 'رياضة', slug: 'sports', description: 'مستلزمات الرياضة واللياقة البدنية', image: '/images/cat-sports.jpg', icon: undefined, parentId: null, children: [], productCount: 65, sortOrder: 5, isActive: true },
  { id: 'cat-6', name: 'ألعاب', slug: 'toys', description: 'ألعاب للأطفال والكبار وألعاب الفيديو', image: '/images/cat-toys.jpg', icon: undefined, parentId: null, children: [], productCount: 45, sortOrder: 6, isActive: true },
  { id: 'cat-7', name: 'كتب', slug: 'books', description: 'كتب عربية وعالمية في جميع المجالات', image: '/images/cat-books.jpg', icon: undefined, parentId: null, children: [], productCount: 200, sortOrder: 7, isActive: true },
  { id: 'cat-8', name: 'ساعات ومجوهرات', slug: 'watches-jewelry', description: 'ساعات فاخرة ومجوهرات أنيقة', image: '/images/cat-watches.jpg', icon: undefined, parentId: null, children: [], productCount: 35, sortOrder: 8, isActive: true },
  { id: 'cat-9', name: 'حاسبات ولابتوبات', slug: 'computers', description: 'أحدث أجهزة الكمبيوتر واللاب توب', image: '/images/cat-computers.jpg', icon: undefined, parentId: null, children: [], productCount: 55, sortOrder: 9, isActive: true },
  { id: 'cat-10', name: 'كاميرات', slug: 'cameras', description: 'كاميرات رقمية ومعدات التصوير', image: '/images/cat-cameras.jpg', icon: undefined, parentId: null, children: [], productCount: 28, sortOrder: 10, isActive: true },
  { id: 'cat-11', name: 'سيارات', slug: 'auto-accessories', description: 'إكسسوارات السيارات ومستلزماتها', image: '/images/cat-auto.jpg', icon: undefined, parentId: null, children: [], productCount: 48, sortOrder: 11, isActive: true },
  { id: 'cat-12', name: 'مستلزمات الحيوانات', slug: 'pet-supplies', description: 'طعام ومستلزمات الحيوانات الأليفة', image: '/images/cat-pets.jpg', icon: undefined, parentId: null, children: [], productCount: 32, sortOrder: 12, isActive: true },
];

export function CategoriesPage() {
  return (
    <>
      <Container>
        <Breadcrumbs />
      </Container>
      <Section padding="lg">
        <Container>
          <Stack gap="lg">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">التصنيفات</h1>
              <p className="text-gray-500 mt-1">تصفح المنتجات حسب التصنيف</p>
            </div>
            <Grid cols={{ mobile: 2, tablet: 3, desktop: 4 }} gap="md">
              {allCategories.map((cat) => (
                <CategoryCard key={cat.id} category={cat} />
              ))}
            </Grid>
          </Stack>
        </Container>
      </Section>
    </>
  );
}

export default CategoriesPage;
