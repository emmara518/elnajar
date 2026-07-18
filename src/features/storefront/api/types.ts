export interface ProductDTO {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: number;
  old_price: number | null;
  currency: string;
  images: ProductImageDTO[];
  category_id: string;
  category_name: string;
  brand: string;
  rating: number;
  reviews_count: number;
  variants: ProductVariantDTO[];
  status: string;
  stock_status: string;
  stock: number;
  tags: string[];
  is_new: boolean;
  is_featured: boolean;
  is_best_seller: boolean;
  discount: number;
  created_at: string;
  updated_at: string;
}

export interface ProductImageDTO {
  id: string;
  url: string;
  alt: string;
  width: number;
  height: number;
  is_primary: boolean;
}

export interface ProductVariantDTO {
  id: string;
  name: string;
  sku: string;
  price: number;
  old_price: number | null;
  stock: number;
  image: string | null;
  attributes: Record<string, string>;
}

export interface ProductListResponseDTO {
  items: ProductDTO[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  has_more: boolean;
}

export interface CategoryDTO {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  icon: string | null;
  parent_id: string | null;
  children: CategoryDTO[];
  product_count: number;
  sort_order: number;
  is_active: boolean;
}
