import { NavLink } from 'react-router-dom';
import type { NavItem } from '@/types';

interface BottomNavigationProps {
  items: NavItem[];
}

export function BottomNavigation({ items }: BottomNavigationProps) {
  return (
    <nav
      className={`safe-inset-bottom fixed bottom-0 left-0 right-0 z-(--z-sticky) flex h-16 items-center justify-around border-t border-gray-100 bg-white`}
      role="navigation"
      aria-label="التنقل الرئيسي"
    >
      {items.map(({ label, href, icon: Icon }) => (
        <NavLink
          key={href}
          to={href}
          end={href === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-3 py-1 text-xs transition-(--transition-default) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400 ${
              isActive
                ? 'font-medium text-black'
                : 'font-normal text-gray-400'
            }`
          }
          aria-label={label}
        >
          {({ isActive }) => (
            <>
              <Icon
                size={24}
                aria-hidden="true"
                className={isActive ? 'text-black' : 'text-gray-400'}
              />
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
