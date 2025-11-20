'use client';

import { cn } from '@/lib/utils';

export function Navbar() {
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
        </div>
      </div>
    </nav>
  );
}