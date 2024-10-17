// app/(admin)/settings/components/Sidebar.jsx

'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState('User');

  return (
    <aside className="w-64 bg-gray-100 border-r">
      <nav className="flex flex-col py-4 space-y-4">
        <Link href="/settings/user">
          <span
            className={`cursor-pointer px-4 py-2 text-lg font-medium ${
              activeTab === 'User' ? 'bg-indigo-100' : 'hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('User')}
          >
            User
          </span>
        </Link>
        <Link href="/settings/roles">
          <span
            className={`cursor-pointer px-4 py-2 text-lg font-medium ${
              activeTab === 'Roles' ? 'bg-indigo-100' : 'hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('Roles')}
          >
            Roles
          </span>
        </Link>
        <Link href="/settings/department">
          <span
            className={`cursor-pointer px-4 py-2 text-lg font-medium ${
              activeTab === 'Department' ? 'bg-indigo-100' : 'hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('Department')}
          >
            Department
          </span>
        </Link>
        <Link href="/settings/branch">
          <span
            className={`cursor-pointer px-4 py-2 text-lg font-medium ${
              activeTab === 'Branch' ? 'bg-indigo-100' : 'hover:bg-gray-200'
            }`}
            onClick={() => setActiveTab('Branch')}
          >
            Branch
          </span>
        </Link>
      </nav>
    </aside>
  );
}
