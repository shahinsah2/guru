// app/(admin)/settings/components/Sidebar.jsx

'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  FaUser,
  FaRegBuilding,
  FaRegAddressCard,
  FaMapMarkerAlt,
  FaClipboardList,
  FaListAlt,
  FaTasks,
  FaClipboardCheck,
  FaFlag,
  FaDollarSign,
  FaGavel,
  FaCogs,
  FaMapSigns,
  FaCity,
  FaGlobe,
} from 'react-icons/fa';

const sidebarLinks = [
  { name: 'User', href: '/settings/user', icon: <FaUser /> },
  { name: 'Roles', href: '/settings/roles', icon: <FaRegAddressCard /> },
  { name: 'Department', href: '/settings/departments', icon: <FaRegBuilding /> },
  { name: 'Branch', href: '/settings/branches', icon: <FaRegBuilding /> },
  { name: 'Cities', href: '/settings/cities', icon: <FaCity /> },
  { name: 'Countries', href: '/settings/countries', icon: <FaGlobe /> },
  { name: 'Lead Checklists', href: '/settings/lead-checklist', icon: <FaClipboardCheck /> },
  { name: 'Lead Statuses', href: '/settings/lead-status', icon: <FaListAlt /> },
  { name: 'Order Checklists', href: '/settings/order-checklist', icon: <FaClipboardList /> },
  { name: 'Service Priority Levels', href: '/settings/service-priority-level', icon: <FaTasks /> },
  { name: 'Service Status', href: '/settings/service-status', icon: <FaFlag /> },
  { name: 'State', href: '/settings/states', icon: <FaMapSigns /> },
  { name: 'Taxes', href: '/settings/tax-list', icon: <FaDollarSign /> },
  { name: 'Terms', href: '/settings/terms', icon: <FaGavel /> },
];

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState('');

  return (
    <aside className="w-64 bg-gray-100 border-r h-full">
      <div className="bg-orange-700 text-white text-center p-4">
        <h1 className="text-lg font-bold">Admin Settings</h1>
      </div>
      <nav className="flex flex-col py-4 space-y-2">
        {/* Loop through the sidebarLinks array to render each link */}
        {sidebarLinks.map((link) => (
          <Link key={link.name} href={link.href}>
            <span
              className={`flex items-center gap-2 cursor-pointer px-4 py-2 text-lg font-medium ${
                activeTab === link.name ? 'bg-indigo-100' : 'hover:bg-gray-200'
              }`}
              onClick={() => setActiveTab(link.name)}
            >
              {link.icon}
              {link.name}
            </span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
