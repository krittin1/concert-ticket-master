'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface SidebarProps {
  isAdmin?: boolean;
}

export default function Sidebar({ isAdmin = true }: SidebarProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    
    console.log('Logging out...');
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-lg"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 w-64 h-screen bg-white border-r border-gray-200 flex flex-col z-40 transform transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
      {/* Logo/Header */}
      <div className="p-6 border-b border-gray-200">
        <p className="text-xl font-bold text-black dark:text-white">{isAdmin ? 'Admin' : 'User'}</p>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {isAdmin ? (
            <>
              <li>
                <Link
                  href="/"
                  className={`block px-4 py-3 rounded-lg transition-colors ${
                    pathname === '/'
                      ? 'bg-gray-200 text-black'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                    </svg>
                    <span>Home</span>
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/history"
                  className={`block px-4 py-3 rounded-lg transition-colors ${
                    pathname === '/history'
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
                    </svg>
                    <span>History</span>
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/user"
                  className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    <span>Switch to user</span>
                  </span>
                </Link>
              </li>
            </>
          ) : (
            <li>
              <Link
                href="/"
                className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors"
              >
                <span className="flex items-center gap-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                  <span>Switch to admin</span>
                </span>
              </Link>
            </li>
          )}
        </ul>
      </nav>

      {/* Logout Button*/}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="w-full px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <span className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
            </svg>
            <span>Logout</span>
          </span>
        </button>
      </div>
    </div>
    </>
  );
}
