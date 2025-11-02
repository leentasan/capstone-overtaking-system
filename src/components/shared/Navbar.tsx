'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { BarChart3, Activity } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    {
      href: '/dashboard/monitoring',
      label: 'Monitoring',
      icon: Activity,
    },
    {
      href: '/dashboard/analytics',
      label: 'Analytics',
      icon: BarChart3,
    },
  ];

  return (
    <nav className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">O</span>
            </div>
            <div>
              <h1 className="font-bold text-lg">Overtaking Monitor</h1>
              <p className="text-xs text-gray-500">Real-time Detection System</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
                    isActive
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}