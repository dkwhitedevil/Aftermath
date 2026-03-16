"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { 
  Activity, 
  MapPin, 
  Plus,
  ShieldCheck,
  ShieldAlert,
  Shield,
  Clock,
  User,
  ArrowRight,
  LogOut,
  TrendingDown,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

export default function VolunteerScreen() {
  const { userName, userCamp, updates, logout, getCurrentResourceValue } = useStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Filter updates for the current volunteer
  const myUpdates = updates
    .filter(u => u.updatedBy === userName)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 5);

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case 'critical': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'warning': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'recovering': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    }
  };

  const camp = userCamp || 'Camp A';

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 font-sans selection:bg-emerald-500/30 flex flex-col">
      
      {/* Navigation */}
     
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 md:px-6 py-8 space-y-8">
        
        {/* TOP SECTION — Volunteer Info */}
        <section className="bg-[#0a0f1c] border border-slate-800/60 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center shrink-0">
              <User className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">{userName || 'Field Volunteer'}</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-medium text-slate-400 flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Assigned to {camp}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                  Active
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* MIDDLE SECTION — Current Camp Resources */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Current {camp} Resources</h2>
            <Link href="/dashboard/update" className="text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1">
              Update Resource <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: 'Food Kits', label: 'Food Kits', unit: '', icon: TrendingDown },
              { key: 'Water (L)', label: 'Water Supply', unit: 'L', icon: TrendingDown },
              { key: 'Medicines', label: 'Medicines', unit: '', icon: TrendingDown },
              { key: 'Shelter Capacity (%)', label: 'Shelter Capacity', unit: '%', icon: TrendingUp },
            ].map((res) => {
              const val = getCurrentResourceValue(camp as any, res.key as any);
              return (
                <div key={res.key} className="bg-[#0a0f1c] border border-slate-800/60 rounded-xl p-4 relative overflow-hidden">
                  <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">{res.label}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-white">{val}</span>
                    <span className="text-sm font-medium text-slate-500">{res.unit}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Primary Action */}
        <section>
          <Link 
            href="/dashboard/update"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 text-lg"
          >
            <Plus className="w-6 h-6" />
            Submit Resource Update
          </Link>
        </section>

        {/* BOTTOM SECTION — Recent Submissions */}
        <section>
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Your Recent Submissions</h2>
          
          {myUpdates.length === 0 ? (
            <div className="bg-[#0a0f1c] border border-slate-800/60 rounded-xl p-8 text-center">
              <Activity className="w-8 h-8 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 text-sm">You haven't submitted any updates yet.</p>
            </div>
          ) : (
            <div className="bg-[#0a0f1c] border border-slate-800/60 rounded-xl overflow-hidden">
              <div className="divide-y divide-slate-800/60">
                {myUpdates.map((update) => (
                  <div key={update.id} className="p-4 flex items-center justify-between hover:bg-slate-800/20 transition-colors">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-slate-300 font-medium">{update.resource.split(' ')[0]}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getSeverityColor(update.severity)}`}>
                          {update.severity}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-slate-500 line-through">{update.oldValue}</span>
                        <ArrowRight className="w-3 h-3 text-slate-600" />
                        <span className="text-white font-medium">{update.newValue}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {format(new Date(update.timestamp), 'h:mm a')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Local Alerts Notice */}
        <section className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-amber-500 mb-1">Local Alert Notice</h3>
            <p className="text-xs text-amber-200/70 leading-relaxed">
              Ensure all updates are verified before submission. Command center relies on your accuracy for critical routing decisions.
            </p>
          </div>
        </section>

      </main>
    </div>
  );
}
