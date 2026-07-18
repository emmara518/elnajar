export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image?: string;
  icon?: string;
  parentId: string | null;
  children: Category[];
  productCount: number;
  sortOrder: number;
  isActive: boolean;
}

export interface CategoryListParams {
  parentId?: string;
  includeInactive?: boolean;
}
