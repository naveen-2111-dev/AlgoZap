'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/app/(components)/Navbar';
import Sidebar from '@/app/(components)/Sidebar'; // 👈 Import Sidebar (fixed casing)

type User = {
  username: string;
  email: string;
  walletid: string;
};

export default function HomePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/me', {
          method: 'GET',
          credentials: 'include',
        });

        const data = await res.json();

        if (data.success) {
          setUser(data.user);
        } else {
          console.warn('User not found or not logged in');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  if (loading) {
    return <div className="text-center mt-20 text-xl">Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-white dark:bg-black text-black dark:text-white">
      <Sidebar /> {/* 👈 Sidebar on the left */}

      <div className="flex-1 flex flex-col">
        <Navbar /> {/* 👈 Navbar at the top */}

        <main className="flex-1 p-8 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold mb-4">Welcome back!</h1>
          {user ? (
            <div className="text-lg font-mono space-y-2 text-center">
              <p>
                <strong>Username:</strong>{' '}
                <span className="text-blue-600 dark:text-blue-400">{user.username}</span>
              </p>
              <p>
                <strong>Email:</strong>{' '}
                <span className="text-green-600 dark:text-green-400">{user.email}</span>
              </p>
              <p>
                <strong>Wallet:</strong>{' '}
                <span className="text-purple-600 dark:text-purple-400">{user.walletid}</span>
              </p>
            </div>
          ) : (
            <p className="text-gray-500">User not logged in.</p>
          )}
        </main>
      </div>
    </div>
  );
}
