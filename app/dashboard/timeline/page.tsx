"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { 
  Activity, 
  MapPin, 
  Plus,
  TrendingDown,
  TrendingUp,
  AlertOctagon,
  AlertTriangle,
  ShieldCheck,
  Clock,
  Info,
  ChevronRight
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

const chartData = [
  { time: '9:00 AM', Food: 20, Water: 500, Medicines: 120, Shelter: 70 },
  { time: '11:00 AM', Food: 16, Water: 460, Medicines: 110, Shelter: 78 },
  { time: '1:00 PM', Food: 12, Water: 390, Medicines: 100, Shelter: 85 },
  { time: '2:00 PM', Food: 8, Water: 320, Medicines: 90, Shelter: 92 },
];

const events = [
  { time: '9:00 AM', title: 'Normal resource state', explanation: 'All camps reporting baseline consumption.', severity: 'stable', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: ShieldCheck },
  { time: '11:00 AM', title: 'Food entered warning threshold', explanation: 'Consumption rate doubled in Camp A.', severity: 'warning', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: AlertTriangle },
  { time: '1:00 PM', title: 'Water decline accelerated', explanation: 'Reserve dropping faster than projected.', severity: 'warning', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: TrendingDown },
  { time: '2:00 PM', title: 'Food entered critical depletion', explanation: 'Reserves insufficient for next 12 hours.', severity: 'critical', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: AlertOctagon },
  { time: '2:20 PM', title: 'Shelter pressure exceeded safe threshold', explanation: 'Occupancy reached 92% capacity.', severity: 'critical', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20', icon: AlertOctagon },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0a0f1c]/95 border border-slate-700/50 p-4 rounded-xl shadow-2xl backdrop-blur-md">
        <p className="text-slate-300 font-mono text-xs mb-3 pb-2 border-b border-slate-800">{label}</p>
        <div className="space-y-2">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-6 text-sm font-medium">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="text-slate-300">{entry.name}</span>
              </div>
              <span className="text-white font-bold">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export default function TimelineCenter() {
  const [activeResource, setActiveResource] = useState<string | null>(null);

  const handleLegendClick = (e: any) => {
    if (activeResource === e.dataKey) {
      setActiveResource(null);
    } else {
      setActiveResource(e.dataKey);
    }
  };

  const getOpacity = (dataKey: string) => {
    if (!activeResource) return 1;
    return activeResource === dataKey ? 1 : 0.15;
  };

  const getStrokeWidth = (dataKey: string) => {
    if (!activeResource) return 2;
    return activeResource === dataKey ? 4 : 2;
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 font-sans selection:bg-blue-500/30 flex flex-col">
      
      {/* Navigation */}
      <nav className="border-b border-slate-800/60 bg-[#0a0f1c]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-500" />
            <span className="text-lg font-bold text-white tracking-widest">AFTERMATH</span>
          </div>
          
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <Link href="/dashboard" className="text-slate-400 hover:text-white transition-colors">Dashboard</Link>
            <Link href="/dashboard/camps" className="text-slate-400 hover:text-white transition-colors">Camps</Link>
            <Link href="/dashboard/alerts" className="text-slate-400 hover:text-white transition-colors">Alerts</Link>
            <Link href="/dashboard/timeline" className="text-white border-b-2 border-blue-500 py-5">Timeline</Link>
          </div>

          <Link href="/dashboard/update" className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" />
            Update Resource
          </Link>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 lg:px-8 py-8 space-y-8">
        
        {/* TOP SECTION — Timeline Summary Cards */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-white tracking-tight">Temporal Intelligence</h1>
            <p className="text-sm text-slate-400 font-medium">Change over time reveals hidden failure.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Food Timeline */}
            <div className="bg-[#0a0f1c] border border-red-500/20 rounded-xl p-5 relative overflow-hidden group hover:border-red-500/40 transition-colors cursor-pointer" onClick={() => setActiveResource(activeResource === 'Food' ? null : 'Food')}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 group-hover:bg-red-500/10 transition-colors" />
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">Food Timeline</h3>
              <div className="flex items-end justify-between mb-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Start</p>
                  <p className="text-lg font-medium text-slate-300">20</p>
                </div>
                <div className="flex flex-col items-center px-2">
                  <TrendingDown className="w-4 h-4 text-red-400 mb-1" />
                  <p className="text-sm font-bold text-red-400">-12</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 mb-1">Current</p>
                  <p className="text-2xl font-bold text-white">8</p>
                </div>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider">
                <AlertOctagon className="w-3 h-3" />
                Critical decline
              </div>
            </div>

            {/* Water Timeline */}
            <div className="bg-[#0a0f1c] border border-amber-500/20 rounded-xl p-5 relative overflow-hidden group hover:border-amber-500/40 transition-colors cursor-pointer" onClick={() => setActiveResource(activeResource === 'Water' ? null : 'Water')}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 group-hover:bg-amber-500/10 transition-colors" />
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">Water Timeline</h3>
              <div className="flex items-end justify-between mb-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Start</p>
                  <p className="text-lg font-medium text-slate-300">500L</p>
                </div>
                <div className="flex flex-col items-center px-2">
                  <TrendingDown className="w-4 h-4 text-amber-400 mb-1" />
                  <p className="text-sm font-bold text-amber-400">-180L</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 mb-1">Current</p>
                  <p className="text-2xl font-bold text-white">320L</p>
                </div>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
                <AlertTriangle className="w-3 h-3" />
                Warning
              </div>
            </div>

            {/* Medicines Timeline */}
            <div className="bg-[#0a0f1c] border border-blue-500/20 rounded-xl p-5 relative overflow-hidden group hover:border-blue-500/40 transition-colors cursor-pointer" onClick={() => setActiveResource(activeResource === 'Medicines' ? null : 'Medicines')}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 group-hover:bg-blue-500/10 transition-colors" />
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">Medicines Timeline</h3>
              <div className="flex items-end justify-between mb-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Start</p>
                  <p className="text-lg font-medium text-slate-300">120</p>
                </div>
                <div className="flex flex-col items-center px-2">
                  <TrendingDown className="w-4 h-4 text-blue-400 mb-1" />
                  <p className="text-sm font-bold text-blue-400">-30</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 mb-1">Current</p>
                  <p className="text-2xl font-bold text-white">90</p>
                </div>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
                <Info className="w-3 h-3" />
                Stable decline
              </div>
            </div>

            {/* Shelter Timeline */}
            <div className="bg-[#0a0f1c] border border-orange-500/20 rounded-xl p-5 relative overflow-hidden group hover:border-orange-500/40 transition-colors cursor-pointer" onClick={() => setActiveResource(activeResource === 'Shelter' ? null : 'Shelter')}>
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3 group-hover:bg-orange-500/10 transition-colors" />
              <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">Shelter Timeline</h3>
              <div className="flex items-end justify-between mb-4">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Start</p>
                  <p className="text-lg font-medium text-slate-300">70%</p>
                </div>
                <div className="flex flex-col items-center px-2">
                  <TrendingUp className="w-4 h-4 text-orange-400 mb-1" />
                  <p className="text-sm font-bold text-orange-400">+22%</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 mb-1">Current</p>
                  <p className="text-2xl font-bold text-white">92%</p>
                </div>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider">
                <AlertOctagon className="w-3 h-3" />
                Critical pressure
              </div>
            </div>

          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* MIDDLE SECTION — Historical Trend Chart & Bottom Comparison */}
          <section className="lg:col-span-2 space-y-8">
            
            {/* Chart Panel */}
            <div className="bg-[#0a0f1c] border border-slate-800/60 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-50 pointer-events-none" />
              
              <div className="flex items-center justify-between mb-8 relative z-10">
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">Resource History Over Time</h2>
                  <p className="text-sm text-slate-400">Click a resource line or legend to isolate its trend.</p>
                </div>
                {activeResource && (
                  <button 
                    onClick={() => setActiveResource(null)}
                    className="text-xs font-medium text-slate-400 hover:text-white bg-slate-800/50 px-3 py-1.5 rounded-md transition-colors"
                  >
                    Reset View
                  </button>
                )}
              </div>

              <div className="h-[400px] w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis 
                      dataKey="time" 
                      stroke="#64748b" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      dy={10}
                    />
                    <YAxis 
                      stroke="#64748b" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false} 
                      dx={-10}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#334155', strokeWidth: 1, strokeDasharray: '4 4' }} />
                    <Legend 
                      verticalAlign="top" 
                      height={36} 
                      iconType="circle" 
                      onClick={handleLegendClick}
                      wrapperStyle={{ fontSize: '12px', cursor: 'pointer' }}
                    />
                    
                    <Line 
                      type="monotone" 
                      dataKey="Food" 
                      stroke="#ef4444" 
                      strokeWidth={getStrokeWidth('Food')}
                      strokeOpacity={getOpacity('Food')}
                      dot={{ r: 4, strokeWidth: 2, fill: '#0a0f1c' }}
                      activeDot={{ r: 6, strokeWidth: 0, fill: '#ef4444' }}
                      animationDuration={1500}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Water" 
                      stroke="#f59e0b" 
                      strokeWidth={getStrokeWidth('Water')}
                      strokeOpacity={getOpacity('Water')}
                      dot={{ r: 4, strokeWidth: 2, fill: '#0a0f1c' }}
                      activeDot={{ r: 6, strokeWidth: 0, fill: '#f59e0b' }}
                      animationDuration={1500}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Medicines" 
                      stroke="#3b82f6" 
                      strokeWidth={getStrokeWidth('Medicines')}
                      strokeOpacity={getOpacity('Medicines')}
                      dot={{ r: 4, strokeWidth: 2, fill: '#0a0f1c' }}
                      activeDot={{ r: 6, strokeWidth: 0, fill: '#3b82f6' }}
                      animationDuration={1500}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="Shelter" 
                      stroke="#f97316" 
                      strokeWidth={getStrokeWidth('Shelter')}
                      strokeOpacity={getOpacity('Shelter')}
                      dot={{ r: 4, strokeWidth: 2, fill: '#0a0f1c' }}
                      activeDot={{ r: 6, strokeWidth: 0, fill: '#f97316' }}
                      animationDuration={1500}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Insight Below Chart */}
              <div className="mt-8 pt-6 border-t border-slate-800/60">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 p-1.5 bg-blue-500/10 rounded-md">
                    <Activity className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Generated Insight</p>
                    <p className="text-sm font-medium text-slate-300">
                      Food depletion accelerated sharply after 11:00 AM, correlating directly with the rapid increase in Shelter pressure. This indicates an unexpected influx of arrivals overwhelming baseline projections.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* BOTTOM SECTION — Resource Comparison Timeline */}
            <div>
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Location Behavior Comparison</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <Link href="/dashboard/camps" className="bg-[#0a0f1c] border border-slate-800/60 hover:border-slate-600 rounded-xl p-4 transition-colors group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-500" />
                      <span className="font-bold text-white">Camp A</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-sm font-medium text-red-400">Food decline severe</span>
                  </div>
                </Link>

                <Link href="/dashboard/camps" className="bg-[#0a0f1c] border border-slate-800/60 hover:border-slate-600 rounded-xl p-4 transition-colors group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-500" />
                      <span className="font-bold text-white">Camp B</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span className="text-sm font-medium text-blue-400">Stable pattern</span>
                  </div>
                </Link>

                <Link href="/dashboard/camps" className="bg-[#0a0f1c] border border-slate-800/60 hover:border-slate-600 rounded-xl p-4 transition-colors group">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-500" />
                      <span className="font-bold text-white">Camp C</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-sm font-medium text-emerald-400">Recovery beginning</span>
                  </div>
                </Link>

              </div>
            </div>

          </section>

          {/* RIGHT SIDE — Event Intelligence Timeline */}
          <section className="lg:col-span-1">
            <div className="sticky top-24">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6">Event Intelligence Timeline</h2>
              
              <div className="bg-[#0a0f1c] border border-slate-800/60 rounded-2xl p-6">
                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[1.1rem] before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-slate-800 before:to-transparent">
                  
                  {events.map((event, index) => {
                    const isCritical = event.severity === 'critical';
                    const Icon = event.icon;
                    
                    return (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                        className="relative flex items-start gap-4 group"
                      >
                        {/* Timeline Node */}
                        <div className={`relative z-10 flex items-center justify-center w-9 h-9 rounded-full border-4 border-[#0a0f1c] shrink-0 ${event.bg} ${event.color}`}>
                          <Icon className="w-4 h-4" />
                          {isCritical && (
                            <div className={`absolute inset-0 rounded-full border border-current animate-ping opacity-20`} />
                          )}
                        </div>

                        {/* Event Content */}
                        <div className="pt-1 pb-2">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-xs font-medium text-slate-500">{event.time}</span>
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${event.bg} ${event.border} ${event.color}`}>
                              {event.severity}
                            </span>
                          </div>
                          <h4 className={`text-sm font-bold mb-1 ${isCritical ? 'text-white' : 'text-slate-200'}`}>
                            {event.title}
                          </h4>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            {event.explanation}
                          </p>
                        </div>
                      </motion.div>
                    );
                  })}

                </div>
              </div>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
