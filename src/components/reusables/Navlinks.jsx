'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NavLinks = ({ href, children }) => {
  const pathname = usePathname();

  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={clsx(
        'relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300',
        isActive
          ? 'bg-blue-100/80 text-blue-800'
          : 'text-slate-700/90 hover:bg-blue-50'
      )}
    >
      <span className="relative z-10">{children}</span>

      <span
        className={clsx(
          'absolute left-1/2 -translate-x-1/2 bottom-1 h-0.5 rounded-full bg-blue-600 transition-all duration-300',
          isActive ? 'w-6 opacity-100' : 'w-0 opacity-0'
        )}
      />
    </Link>
  );
};

export default NavLinks;