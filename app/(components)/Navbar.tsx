'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [user, setUser] = useState<{ username: string; email: string } | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/me', {
          credentials: 'include',
        });

        const data = await res.json();
        if (data.success && data.user) {
          setUser({ username: data.user.username, email: data.user.email });
        }
      } catch (error) {
        console.error('Failed to fetch user data',error);
      }
    }

    fetchUser();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/');
  };

  return (
    <nav className="w-full border-b border-neutral-800 bg-black text-white px-6 py-4 flex justify-end items-center relative">
      <div className="flex items-center gap-4 relative">
        {/* Create Button */}
        <button
          onClick={() => router.push('/create')}
          className="px-4 py-2 rounded-md text-sm font-medium bg-white text-black hover:bg-neutral-100 transition"
        >
          Create
        </button>

        {/* Profile Button */}
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="h-9 w-9 flex items-center justify-center rounded-full border border-white text-sm font-bold hover:bg-white hover:text-black transition"
        >
          {user ? user.username[0].toUpperCase() : '👤'}
        </button>

        {/* Dropdown Card */}
        {showDropdown && user && (
          <div
            ref={dropdownRef}
            className="absolute right-0 top-14 mt-2 w-64 rounded-xl bg-black border border-neutral-800 text-white shadow-xl z-50 p-4"
          >
            <div className="mb-3">
              <p className="text-xs text-neutral-400 mb-1">Signed in as</p>
              <p className="font-medium text-white truncate">{user.username}</p>
              <p className="text-xs text-neutral-500 truncate">{user.email}</p>
            </div>

            <div className="h-px bg-neutral-800 my-3" />

            <button
              onClick={handleLogout}
              className="w-full text-left text-sm text-red-500 hover:text-red-400 font-medium transition"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
