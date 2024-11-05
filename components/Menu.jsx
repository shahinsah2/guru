// @/components/Menu.jsx

'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

const menuItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
  },
  {
    label: 'Product Library',
    href: '/product-library',
  },
  {
    label: 'Inventory',
    href: '/inventory',
  },
  {
    label: 'CRM',
    href: '/crm',
  },
];

export default function Menu({ isOpen }) {
  const router = useRouter();

  return (
    <>
      {/* Desktop Menu */}
      <div className="hidden sm:flex sm:space-x-8">
        {menuItems.map((menuItem, index) => (
          <a
            key={index}
            onClick={() => router.push(menuItem.href)}
            className="text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer"
          >
            {menuItem.label}
          </a>
        ))}
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {menuItems.map((menuItem, index) => (
              <Link
                key={index}
                href={menuItem.href}
                className="bg-indigo-50 border-indigo-500 text-indigo-700 block pl-3 pr-4 py-2 border-l-4 text-base font-medium cursor-pointer"
              >
                {menuItem.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
