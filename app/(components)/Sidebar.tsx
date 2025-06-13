'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Plus, Home, Zap } from 'lucide-react';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { name: 'Create', path: '/create', icon: <Plus size={20} />, alwaysGreen: true },
    { name: 'Home', path: '/home', icon: <Home size={18} /> },
    { name: 'Zaps', path: '/zaps', icon: <Zap size={18} /> },
  ];

  return (
    <aside className="h-screen w-60 bg-black border-r border-neutral-800 text-white p-6 flex flex-col">
      <h1 className="text-2xl font-bold mb-8 tracking-tight">AlgoZap</h1>
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path;

          const commonClasses = `gap-2 px-4 py-2 rounded-md text-sm font-medium transition`;

          if (item.alwaysGreen) {
            return (
              <button
                key={item.name}
                onClick={() => router.push(item.path)}
                className={`flex justify-center items-center ${commonClasses} bg-green-600 text-white hover:bg-green-500`}
              >
                {item.icon}
                {item.name}
              </button>
            );
          }

          return (
            <button
              key={item.name}
              onClick={() => router.push(item.path)}
              className={`flex justify-start items-center ${commonClasses} ${
                isActive
                  ? 'bg-white text-black'
                  : 'hover:bg-neutral-900 text-white'
              }`}
            >
              {item.icon}
              {item.name}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
