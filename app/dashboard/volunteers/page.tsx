"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { format, formatDistanceToNow } from 'date-fns';
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
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  TrendingUp,
  History,
  CheckSquare,
  ChevronLeft
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { useStore } from '@/lib/store';

// Extended mock data for the specific UI requirements
const volunteerIntelligence = [
  { 
    id: 'v1', 
    name: 'Volunteer A', 
    camp: 'Camp A', 
    updatesToday: 5, 
    lastUpdateStr: '2 mins ago', 
    trust: 'High', 
    consistency: 'Reliable pattern',
    color: 'emerald',
    latestResource: 'Food Kits',
    lastDelta: '20 → 8',
    freq: 'High',
    confidence: '92%',
    note: 'Recent submissions align with camp trend.',
    chartData: [
      { time: '08:00', score: 85 }, { time: '10:00', score: 88 }, 
      { time: '12:00', score: 90 }, { time: '14:00', score: 92 }
    ]
  },
  { 
    id: 'v2', 
    name: 'Volunteer B', 
    camp: 'Camp B', 
    updatesToday: 3, 
    lastUpdateStr: '7 mins ago', 
    trust: 'Moderate', 
    consistency: 'Occasional delay',
    color: 'amber',
    latestResource: 'Water Supply',
    lastDelta: '320L → 290L',
    freq: 'Medium',
    confidence: '78%',
    note: 'Updates are accurate but slightly delayed from actual events.',
    chartData: [
      { time: '08:00', score: 80 }, { time: '10:00', score: 75 }, 
      { time: '12:00', score: 78 }, { time: '14:00', score: 78 }
    ]
  },
  { 
    id: 'v3', 
    name: 'Volunteer C', 
    camp: 'Camp C', 
    updatesToday: 6, 
    lastUpdateStr: '1 min ago', 
    trust: 'High', 
    consistency: 'Strong reporting',
    color: 'emerald',
    latestResource: 'Shelter Capacity',
    lastDelta: 'Verified 92%',
    freq: 'High',
    confidence: '96%',
    note: 'Highly consistent. Often first to report critical changes.',
    chartData: [
      { time: '08:00', score: 90 }, { time: '10:00', score: 94 }, 
      { time: '12:00', score: 95 }, { time: '14:00', score: 96 }
    ]
  },
  { 
    id: 'v4', 
    name: 'Volunteer D', 
    camp: 'Camp A', 
    updatesToday: 2, 
    lastUpdateStr: '15 mins ago', 
    trust: 'Low', 
    consistency: 'Missing intervals',
    color: 'red',
    latestResource: 'Medicines',
    lastDelta: '90 → 90',
    freq: 'Low',
    confidence: '45%',
    note: 'Irregular reporting intervals. Requires secondary verification.',
    chartData: [
      { time: '08:00', score: 60 }, { time: '10:00', score: 55 }, 
      { time: '12:00', score: 40 }, { time: '14:00', score: 45 }
    ]
  },
];

const MiniTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#030712] border border-slate-800 px-2 py-1 rounded text-xs font-mono text-slate-300 shadow-xl">
        {payload[0].value}%
      </div>
    );
  }
  return null;
};

export default function VolunteersCenter() {
  const { updates } = useStore();
  const [selectedId, setSelectedId] = useState<string>(volunteerIntelligence[0].id);

  const selectedVol = volunteerIntelligence.find(v => v.id === selectedId) || volunteerIntelligence[0];

  // Get recent updates from store, or use fallbacks to match the prompt's exact feel
  const recentUpdates = [...updates]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 4);

  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case 'critical': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'warning': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'recovering': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 font-sans selection:bg-blue-500/30 flex flex-col">
      
      {/* Navigation */}
      <Link href="/dashboard" className="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors mb-8">
        <ChevronLeft className="w-4 h-4 mr-1" />
        Back to Global Dashboard
      </Link>
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 lg:px-8 py-8 space-y-8">
        
        {/* TOP SECTION — Trust Summary Cards */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white tracking-tight">Field Intelligence Sources</h1>
            <p className="text-sm text-slate-400 font-medium">Reliable updates create reliable intelligence.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Active Volunteers */}
            <div className="bg-[#0a0f1c] border border-blue-500/20 rounded-xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3" />
              <div className="flex items-center gap-3 mb-2">
                <User className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wider">Active Volunteers</h3>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">12</span>
              </div>
            </div>

            {/* High Trust */}
            <div className="bg-[#0a0f1c] border border-emerald-500/20 rounded-xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3" />
              <div className="flex items-center gap-3 mb-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wider">High Trust Sources</h3>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">8</span>
              </div>
            </div>

            {/* Moderate Trust */}
            <div className="bg-[#0a0f1c] border border-amber-500/20 rounded-xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3" />
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wider">Moderate Trust</h3>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">3</span>
              </div>
            </div>

            {/* Inconsistent */}
            <div className="bg-[#0a0f1c] border border-red-500/20 rounded-xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3" />
              <div className="flex items-center gap-3 mb-2">
                <ShieldAlert className="w-5 h-5 text-red-400" />
                <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wider">Inconsistent Sources</h3>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">1</span>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* MIDDLE & BOTTOM SECTION — Left Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* MIDDLE SECTION — Volunteer Activity Cards */}
            <section>
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Active Field Operatives</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {volunteerIntelligence.map((vol) => {
                  const isSelected = selectedId === vol.id;
                  const isHigh = vol.trust === 'High';
                  const isLow = vol.trust === 'Low';
                  const isMod = vol.trust === 'Moderate';
                  
                  return (
                    <motion.div 
                      key={vol.id}
                      onClick={() => setSelectedId(vol.id)}
                      whileHover={{ y: -2 }}
                      className={`cursor-pointer rounded-xl p-5 border transition-all relative overflow-hidden ${
                        isSelected 
                          ? 'bg-slate-800/50 border-slate-600 shadow-lg' 
                          : 'bg-[#0a0f1c] border-slate-800/60 hover:bg-slate-800/30'
                      }`}
                    >
                      {/* Left accent border */}
                      <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                        isHigh ? 'bg-emerald-500' : isMod ? 'bg-amber-500' : 'bg-red-500'
                      }`} />

                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            {vol.name}
                            {isHigh && <ShieldCheck className="w-4 h-4 text-emerald-500" />}
                            {isMod && <Shield className="w-4 h-4 text-amber-500" />}
                            {isLow && <ShieldAlert className="w-4 h-4 text-red-500" />}
                          </h3>
                          <div className="flex items-center gap-1 text-sm text-slate-400 mt-1">
                            <MapPin className="w-3.5 h-3.5" />
                            {vol.camp}
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${
                          isHigh ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                          isMod ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                          'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                          {vol.trust} Trust
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Updates</p>
                          <p className="text-sm font-medium text-slate-200">{vol.updatesToday} today</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Last Update</p>
                          <p className="text-sm font-medium text-slate-200 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {vol.lastUpdateStr}
                          </p>
                        </div>
                      </div>

                      <div className="bg-[#030712]/50 rounded-lg p-3 border border-slate-800/50">
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Consistency</p>
                        <p className={`text-sm font-medium flex items-center gap-1.5 ${
                          isHigh ? 'text-emerald-400' : isMod ? 'text-amber-400' : 'text-red-400'
                        }`}>
                          <Activity className="w-3.5 h-3.5" />
                          {vol.consistency}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>

            {/* BOTTOM SECTION — Recent Field Submissions */}
            <section>
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Recent Field Submissions</h2>
              <div className="bg-[#0a0f1c] border border-slate-800/60 rounded-xl overflow-hidden">
                <div className="divide-y divide-slate-800/60">
                  {recentUpdates.map((update, idx) => (
                    <div key={update.id || idx} className="p-4 flex items-center justify-between hover:bg-slate-800/20 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="hidden sm:flex flex-col items-center justify-center w-10 h-10 rounded-full bg-slate-900 border border-slate-800 shrink-0">
                          <User className="w-4 h-4 text-slate-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-white text-sm">{update.updatedBy}</span>
                            <span className="text-xs text-slate-500 font-mono flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {format(new Date(update.timestamp), 'h:mm a')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-slate-300">{update.resource.split(' ')[0]}</span>
                            <span className="text-slate-500 line-through">{update.oldValue}</span>
                            <ArrowRight className="w-3 h-3 text-slate-600" />
                            <span className="text-white font-medium">{update.newValue}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {update.camp}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getSeverityColor(update.severity)}`}>
                          {update.severity}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT SIDE — Reliability Intelligence Panel */}
          <section className="lg:col-span-1">
            <div className="sticky top-24">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Update Reliability</h2>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedVol.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-[#0a0f1c] border border-slate-800/60 rounded-2xl overflow-hidden"
                >
                  {/* Header */}
                  <div className={`p-6 border-b ${
                    selectedVol.trust === 'High' ? 'bg-emerald-500/10 border-emerald-500/20' :
                    selectedVol.trust === 'Moderate' ? 'bg-amber-500/10 border-amber-500/20' :
                    'bg-red-500/10 border-red-500/20'
                  }`}>
                    <div className="flex items-center gap-3 mb-1">
                      <User className={`w-6 h-6 ${
                        selectedVol.trust === 'High' ? 'text-emerald-400' :
                        selectedVol.trust === 'Moderate' ? 'text-amber-400' :
                        'text-red-400'
                      }`} />
                      <h3 className="text-xl font-bold text-white">{selectedVol.name}</h3>
                    </div>
                    <p className="text-sm text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      Assigned to {selectedVol.camp}
                    </p>
                  </div>

                  {/* Intelligence Details */}
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Latest Resource</p>
                        <p className="text-base font-bold text-white">{selectedVol.latestResource}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Last Delta</p>
                        <p className="text-base font-bold text-white">{selectedVol.lastDelta}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Update Frequency</p>
                        <p className="text-base font-bold text-white">{selectedVol.freq}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Verification</p>
                        <p className={`text-base font-bold ${
                          selectedVol.trust === 'High' ? 'text-emerald-400' :
                          selectedVol.trust === 'Moderate' ? 'text-amber-400' :
                          'text-red-400'
                        }`}>{selectedVol.confidence}</p>
                      </div>
                    </div>

                    <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Operational Note</p>
                      <p className="text-sm font-medium text-slate-300 leading-relaxed">
                        {selectedVol.note}
                      </p>
                    </div>

                    {/* Trust Trend Mini Chart */}
                    <div>
                      <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Trust Trend (Last 6h)</p>
                      <div className="h-24 w-full bg-[#030712]/50 rounded-lg p-2 border border-slate-800/50">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={selectedVol.chartData}>
                            <defs>
                              <linearGradient id={`colorScore-${selectedVol.id}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={
                                  selectedVol.trust === 'High' ? '#10b981' :
                                  selectedVol.trust === 'Moderate' ? '#f59e0b' : '#ef4444'
                                } stopOpacity={0.3}/>
                                <stop offset="95%" stopColor={
                                  selectedVol.trust === 'High' ? '#10b981' :
                                  selectedVol.trust === 'Moderate' ? '#f59e0b' : '#ef4444'
                                } stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <Tooltip content={<MiniTooltip />} cursor={{ stroke: '#334155', strokeWidth: 1, strokeDasharray: '2 2' }} />
                            <Area 
                              type="monotone" 
                              dataKey="score" 
                              stroke={
                                selectedVol.trust === 'High' ? '#10b981' :
                                selectedVol.trust === 'Moderate' ? '#f59e0b' : '#ef4444'
                              } 
                              fillOpacity={1} 
                              fill={`url(#colorScore-${selectedVol.id})`} 
                              strokeWidth={2}
                              isAnimationActive={true}
                              animationDuration={1000}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                  </div>

                  {/* Action Buttons */}
                  <div className="p-6 bg-slate-900/50 border-t border-slate-800/60 space-y-3">
                    <button className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 px-4 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(37,99,235,0.2)]">
                      <History className="w-5 h-5" />
                      View Volunteer History
                    </button>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <button className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors border border-slate-700">
                        <CheckSquare className="w-4 h-4" />
                        Verify Source
                      </button>
                      <Link href={`/dashboard/camps?camp=${selectedVol.camp}`} className="flex items-center justify-center gap-2 bg-transparent hover:bg-slate-800/50 text-slate-300 py-2.5 px-4 rounded-lg font-medium transition-colors border border-slate-800">
                        <MapPin className="w-4 h-4" />
                        Open Camp
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
