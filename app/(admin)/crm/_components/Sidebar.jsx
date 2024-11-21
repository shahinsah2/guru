"use client";

import Link from "next/link";
import { useState } from "react";
import {
  FaRegAddressCard,
  FaClipboardList,
  FaListAlt,
  FaTasks,
  FaClipboardCheck,
  FaFlag,
} from "react-icons/fa";

// Define the sidebar links with their respective icons
const sidebarLinks = [
  { name: "Contacts", href: "/crm/contacts", icon: <FaRegAddressCard /> },
  { name: "Leads", href: "/crm/leads", icon: <FaClipboardList /> },
  { name: "Quotation", href: "/crm/quotation", icon: <FaListAlt /> },
  { name: "Orders", href: "/crm/orders", icon: <FaTasks /> },
  {
    name: "Contacts Type",
    href: "/crm/contacts-type",
    icon: <FaClipboardCheck />,
  },
];

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState("");

  return (
    <aside className="w-20 bg-gray-100 border-r h-full flex flex-col justify-start">
      {" "}
      {/* Sidebar with reduced width */}
      <nav className="flex flex-col items-center py-2 space-y-2">
        {" "}
        {/* Centered icons */}
        {sidebarLinks.map((link) => (
          <Link key={link.name} href={link.href}>
            <div
              className={`flex flex-col h-15 w-8 items-center cursor-pointer transition-all duration-400 ${
                activeTab === link.name
                  ? "bg-black text-white"
                  : "hover:bg-gray-200"
              } rounded-md p-1 min-w-[90px]`}
              onClick={() => setActiveTab(link.name)}
            >
              <div
                className="text-lg"
                style={{ fontSize: "1.1rem", marginTop: "0.2rem" }}
              >
                {link.icon} {/* Render the icon */}
              </div>
              <span
                className={`text-xs text-center ${
                  activeTab === link.name ? "font-bold" : ""
                }`}
                style={{ marginTop: "0.2rem" }}
              >
                {link.name.split(" ").map((word, index) => (
                  <span key={index} className={`${index > 0 ? "block" : ""}`}>
                    {word}
                  </span>
                ))}
              </span>
            </div>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
