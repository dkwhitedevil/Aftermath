"use client";

import Link from 'next/link';
import { Activity, AlertTriangle, Clock, Map, PlusCircle, History, LogOut, Users, BarChart3 } from 'lucide-react';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { logout, userName } = useStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans flex flex-col">
      <nav className="border-b border-slate-800/60 bg-[#050814]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">AFTERMATH</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center gap-8">
            <Link href="/dashboard" className="text-sm font-medium text-white flex items-center gap-2">
              Dashboard
            </Link>
            <Link href="/dashboard/camps" className="text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-2">
              Camps
            </Link>
            <Link href="/dashboard/alerts" className="text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-2">
              Alerts
            </Link>
            <Link href="/dashboard/history" className="text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-2">
              Timeline
            </Link>
            <Link href="/dashboard/volunteers" className="text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-2">
              Volunteers
            </Link>
            <Link href="/dashboard/simulation" className="text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-2">
              Simulation
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/dashboard/update" className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-md transition-all shadow-[0_0_15px_-3px_rgba(37,99,235,0.4)]">
              <PlusCircle className="w-4 h-4" /> Update Resource
            </Link>
            {userName && (
              <span className="text-sm text-slate-400 hidden md:block">
                {userName}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-md transition-all border border-slate-700"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>
      <main className="flex-1 w-full max-w-7xl mx-auto p-6">
        {children}
      </main>
    </div>
  );
}
