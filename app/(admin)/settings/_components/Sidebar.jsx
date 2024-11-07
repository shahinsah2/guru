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
  { name: 'Locations', href: '/settings/cities', icon: <FaMapMarkerAlt /> },
  //change cities to locations
  { name: 'Order Checklists', href: '/settings/order-checklist', icon: <FaClipboardList /> },
  { name: 'Service Priority', href: '/settings/service-priority-level', icon: <FaTasks /> },
  { name: 'Service Status', href: '/settings/service-status', icon: <FaFlag /> },
  { name: 'State', href: '/settings/states', icon: <FaMapSigns /> },
  { name: 'Taxes', href: '/settings/tax-list', icon: <FaDollarSign /> },
  { name: 'Terms', href: '/settings/terms', icon: <FaGavel /> },
];

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState('');

  return (
    <aside className="w-20 bg-gray-100 border-r ml-2 h-full flex flex-col justify-start"> {/* Reduced width */}
      <nav className="flex flex-col items-center py-1 space-y-2"> {/* Adjusted spacing */}
        {sidebarLinks.map((link) => (
          <Link key={link.name} href={link.href}>
            <div
              className={`flex flex-col h-15 w-8 items-center cursor-pointer transition-all duration-400 ${
                activeTab === link.name ? 'bg-black text-white' : 'hover:bg-gray-200'
              } rounded-md p-1 min-w-[90px]`}
              onClick={() => setActiveTab(link.name)}
            >
              <div className="text-lg" style={{ fontSize: '1.0 rem', marginTop: '0.2rem' }}> {/* Added margin-top */}
                {link.icon}
              </div>
              <span className={`text-xs text-center ${activeTab === link.name ? 'font-bold' : ''}`} style={{ marginTop: '0.2rem' }}> {/* Added margin-top */}
                {link.name.split(' ').map((word, index) => (
                  <span key={index} className={`${index > 0 ? 'block' : ''}`}>{word}</span>
                ))}
              </span>
            </div>
          </Link>
        ))}
      </nav>
    </aside>
  );
}    
