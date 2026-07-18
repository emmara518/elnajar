export const STOREFRONT_PAGE_SIZE = 24;

export const STOREFRONT_PRICE_FORMAT: Intl.NumberFormatOptions = {
  style: 'currency',
  currency: 'SAR',
  minimumFractionDigits: 2,
};

export const STOREFRONT_DATE_FORMAT: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

export const STOREFRONT_SORT_OPTIONS = [
  { value: 'newest', label: 'الأحدث' },
  { value: 'best_selling', label: 'الأكثر مبيعاً' },
  { value: 'price_asc', label: 'السعر: من الأقل إلى الأعلى' },
  { value: 'price_desc', label: 'السعر: من الأعلى إلى الأقل' },
  { value: 'rating_desc', label: 'الأعلى تقييماً' },
  { value: 'reviews_desc', label: 'الأكثر مراجعة' },
  { value: 'featured', label: 'مميز' },
] as const;

export const STOREFRONT_STORAGE_KEYS = {
  CART: 'storefront_cart',
  WISHLIST: 'storefront_wishlist',
  RECENT_SEARCHES: 'storefront_recent_searches',
  SEARCH_HISTORY: 'storefront_search_history',
} as const;

export const STOREFRONT_SEO = {
  TITLE_SUFFIX: ' | TOKYO Store',
  DEFAULT_TITLE: 'TOKYO Store - تسوق أحدث المنتجات',
  DEFAULT_DESCRIPTION: 'تسوق أحدث المنتجات والعروض الحصرية في TOKYO Store. تشكيلة واسعة من المنتجات بأفضل الأسعار.',
  DEFAULT_IMAGE: '/og-image.png',
  SITE_NAME: 'TOKYO Store',
  SITE_URL: 'https://tokyostore.com',
  TWITTER_HANDLE: '@tokyostore',
} as const;

export const STOREFRONT_NAV = {
  ANNOUNCEMENT_TEXT: 'توصيل مجاني للطلبات فوق ٢٠٠ ريال | خصم ١٠٪ للعميل الجديد',
  ANNOUNCEMENT_LINK: '/products?offer=new-customer',
  HEADER_HEIGHT: 64,
  HEADER_HEIGHT_MOBILE: 56,
  MEGA_MENU_DELAY: 200,
  MOBILE_NAV_HEIGHT: 64,
} as const;

export const STOREFRONT_HERO = {
  AUTOPLAY_INTERVAL: 5000,
  SLIDES: [
    {
      id: 'hero-1',
      title: 'تسوق أحدث الصيحات',
      subtitle: 'تشكيلة ربيع 2026',
      description: 'اكتشف أحدث المنتجات والعروض الحصرية',
      ctaText: 'تسوق الآن',
      ctaLink: '/products',
      image: '/images/hero-1.jpg',
    },
    {
      id: 'hero-2',
      title: 'عروض لا تفوت',
      subtitle: 'خصومات تصل إلى ٥٠٪',
      description: 'على مجموعة مختارة من المنتجات',
      ctaText: 'استعرض العروض',
      ctaLink: '/products?offer=sale',
      image: '/images/hero-2.jpg',
    },
  ],
} as const;
