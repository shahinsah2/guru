'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Menu from './Menu';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center h-16">
          {/* Left Side: Logo + Company Name */}
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
            <Image src="/logo.png" alt="Guru Goutam Logo" width={200} height={60} />
              {/* <span className="text-2xl font-semibold text-orange-600">
                Guru Goutam
              </span> */}
            </Link>          
          
          <div className="hidden md:flex space-x-6">
            <Menu isOpen={isOpen} />
          </div>

          </div>

          {/* Right Side: Settings and Profile */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/settings">
              <Image
                className="h-8 w-8 cursor-pointer"
                src="/setting.png"
                alt="Settings"
                width={36}
                height={36}
              />
            </Link>
            <div className="flex items-center space-x-2">
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
              <span className="text-sm font-medium text-gray-800">Ajay Kumar</span>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden">
            <button
              onClick={handleNavToggle}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden">
            <div className="pt-2 pb-3 space-y-1">
              <Menu isOpen={isOpen} />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
