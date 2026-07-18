import { Link } from 'react-router-dom';
import { useUIStore } from '../stores/ui.store';

const MEGA_MENU_ITEMS = [
  {
    category: 'ملابس',
    items: [
      { label: 'ملابس رجالية', href: '/products?category=mens-clothing' },
      { label: 'ملابس نسائية', href: '/products?category=womens-clothing' },
      { label: 'ملابس أطفال', href: '/products?category=kids-clothing' },
      { label: 'رياضي', href: '/products?category=sportswear' },
    ],
  },
  {
    category: 'إكسسوارات',
    items: [
      { label: 'ساعات', href: '/products?category=watches' },
      { label: 'نظارات', href: '/products?category=glasses' },
      { label: 'مجوهرات', href: '/products?category=jewelry' },
      { label: 'حقائب', href: '/products?category=bags' },
    ],
  },
  {
    category: 'أحذية',
    items: [
      { label: 'أحذية رياضية', href: '/products?category=sneakers' },
      { label: 'أحذية رسمية', href: '/products?category=formal-shoes' },
      { label: 'صنادل', href: '/products?category=sandals' },
    ],
  },
];

export function MegaMenu() {
  const isOpen = useUIStore((s) => s.isMegaMenuOpen);
  const closeMegaMenu = useUIStore((s) => s.closeMegaMenu);

  if (!isOpen) return null;

  return (
    <div
      className="absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-40"
      onMouseLeave={closeMegaMenu}
      role="menu"
      aria-label="القائمة الرئيسية"
    >
      <div className="max-w-7xl mx-auto px-4 py-8" dir="rtl">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {MEGA_MENU_ITEMS.map((section) => (
            <div key={section.category}>
              <h3 className="font-semibold text-gray-900 mb-4 text-sm">{section.category}</h3>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.href}
                      className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                      onClick={closeMegaMenu}
                      role="menuitem"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="bg-gray-50 rounded-lg p-6 flex flex-col items-center justify-center text-center">
            <p className="text-sm font-semibold text-gray-900 mb-2">عروض الصيف</p>
            <p className="text-xs text-gray-600 mb-4">خصم يصل إلى ٤٠٪</p>
            <Link
              to="/products?offer=summer-sale"
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              onClick={closeMegaMenu}
            >
              تسوق الآن
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
