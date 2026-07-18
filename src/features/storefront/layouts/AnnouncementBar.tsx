import { Link } from 'react-router-dom';
import { STOREFRONT_NAV } from '../constants';

export function AnnouncementBar() {
  return (
    <div className="bg-gray-900 text-white text-center text-sm py-2 px-4" role="banner" aria-label="إعلان">
      <Link to={STOREFRONT_NAV.ANNOUNCEMENT_LINK} className="hover:underline" dir="rtl">
        {STOREFRONT_NAV.ANNOUNCEMENT_TEXT}
      </Link>
    </div>
  );
}
