"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { 
  AlertTriangle, 
  ArrowRight, 
  Activity, 
  TrendingDown, 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  Clock, 
  ChevronLeft,
  Plus,
  AlertOctagon,
  BarChart3,
  User,
  Droplets,
  Package,
  Crosshair,
  Home
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
  { time: '08:00', food: 20, water: 320, medicines: 90, shelter: 85 },
  { time: '09:00', food: 16, water: 310, medicines: 84, shelter: 88 },
  { time: '10:00', food: 12, water: 300, medicines: 78, shelter: 90 },
  { time: '11:00', food: 8, water: 290, medicines: 70, shelter: 92 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0a0f1c] border border-slate-800 p-3 rounded-lg shadow-xl">
        <p className="text-slate-400 text-xs mb-2 font-mono">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-300">{entry.name}:</span>
            <span className="text-white font-medium">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function CampDetail() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 p-4 md:p-6 lg:p-8 font-sans selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Navigation */}
        <Link href="/dashboard" className="inline-flex items-center text-sm text-slate-400 hover:text-white transition-colors">
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to Global Dashboard
        </Link>

        {/* TOP SECTION — Camp Header */}
        <div className="bg-[#0a0f1c] border border-red-900/30 rounded-2xl p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
            <div>
              <div className="flex items-center gap-4 mb-3">
                <h1 className="text-4xl font-bold text-white tracking-tight">Camp A</h1>
                <div className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs font-bold text-red-400 uppercase tracking-wider">Critical Risk</span>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-6">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-slate-500" />
                  <span>Population: <strong className="text-slate-200">420 people</strong></span>
                </div>
                <div className="w-1 h-1 rounded-full bg-slate-700" />
                <div className="flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-slate-500" />
                  <span>Active Volunteers: <strong className="text-slate-200">12</strong></span>
                </div>
                <div className="w-1 h-1 rounded-full bg-slate-700" />
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span>Last Verified Update: <strong className="text-slate-200">2 mins ago</strong></span>
                </div>
                <div className="w-1 h-1 rounded-full bg-slate-700" />
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Trust Score: <strong className="text-emerald-400">High</strong></span>
                </div>
              </div>

              <div className="bg-red-500/5 border-l-2 border-red-500/50 p-4 rounded-r-lg max-w-2xl">
                <p className="text-red-200/80 text-sm leading-relaxed">
                  <strong className="text-red-400 font-semibold">Intelligence Note:</strong> Rapid resource decline detected across food and shelter. Current trajectory indicates critical shortages within 12 hours if unmitigated.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT/MIDDLE COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* MIDDLE SECTION — Resource Intelligence Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Card 1 — Food Kits */}
              <motion.div whileHover={{ y: -2 }} className="bg-[#0a0f1c] border border-red-900/40 rounded-xl p-5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Package className="w-16 h-16 text-red-500" />
                </div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div>
                    <h3 className="text-slate-400 text-sm font-medium mb-1">Food Kits</h3>
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-bold text-white">8</span>
                      <div className="flex items-center text-slate-500 text-sm line-through">
                        20
                      </div>
                    </div>
                  </div>
                  <div className="px-2 py-1 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold uppercase tracking-wider">
                    Critical Drop
                  </div>
                </div>
                <div className="space-y-2 relative z-10">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Trend</span>
                    <span className="text-red-400 flex items-center gap-1"><TrendingDown className="w-3 h-3" /> Rapid depletion</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Timestamp</span>
                    <span className="text-slate-300">Updated 2 mins ago</span>
                  </div>
                </div>
              </motion.div>

              {/* Card 2 — Water Supply */}
              <motion.div whileHover={{ y: -2 }} className="bg-[#0a0f1c] border border-amber-900/40 rounded-xl p-5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Droplets className="w-16 h-16 text-amber-500" />
                </div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div>
                    <h3 className="text-slate-400 text-sm font-medium mb-1">Water Supply</h3>
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-bold text-white">290<span className="text-lg text-slate-500 font-normal">L</span></span>
                      <div className="flex items-center text-slate-500 text-sm line-through">
                        320L
                      </div>
                    </div>
                  </div>
                  <div className="px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-bold uppercase tracking-wider">
                    Warning
                  </div>
                </div>
                <div className="space-y-2 relative z-10">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Trend</span>
                    <span className="text-amber-400 flex items-center gap-1"><TrendingDown className="w-3 h-3" /> High usage</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Timestamp</span>
                    <span className="text-slate-300">Updated 4 mins ago</span>
                  </div>
                </div>
              </motion.div>

              {/* Card 3 — Medicines */}
              <motion.div whileHover={{ y: -2 }} className="bg-[#0a0f1c] border border-blue-900/40 rounded-xl p-5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Crosshair className="w-16 h-16 text-blue-500" />
                </div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div>
                    <h3 className="text-slate-400 text-sm font-medium mb-1">Medicines</h3>
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-bold text-white">70</span>
                      <div className="flex items-center text-slate-500 text-sm line-through">
                        90
                      </div>
                    </div>
                  </div>
                  <div className="px-2 py-1 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wider">
                    Moderate Decline
                  </div>
                </div>
                <div className="space-y-2 relative z-10">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Trend</span>
                    <span className="text-blue-400 flex items-center gap-1"><TrendingDown className="w-3 h-3" /> Expected usage</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Timestamp</span>
                    <span className="text-slate-300">Updated 6 mins ago</span>
                  </div>
                </div>
              </motion.div>

              {/* Card 4 — Shelter Occupancy */}
              <motion.div whileHover={{ y: -2 }} className="bg-[#0a0f1c] border border-orange-900/40 rounded-xl p-5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Home className="w-16 h-16 text-orange-500" />
                </div>
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div>
                    <h3 className="text-slate-400 text-sm font-medium mb-1">Shelter Occupancy</h3>
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-bold text-white">92<span className="text-lg text-slate-500 font-normal">%</span></span>
                      <div className="flex items-center text-slate-500 text-sm line-through">
                        85%
                      </div>
                    </div>
                  </div>
                  <div className="px-2 py-1 rounded bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-bold uppercase tracking-wider">
                    Critical Pressure
                  </div>
                </div>
                <div className="space-y-2 relative z-10">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Trend</span>
                    <span className="text-orange-400 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Near overload</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500">Timestamp</span>
                    <span className="text-slate-300">Updated 1 min ago</span>
                  </div>
                </div>
              </motion.div>

            </div>

            {/* Large Timeline Chart */}
            <div className="bg-[#0a0f1c] border border-slate-800/60 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-white">Camp Resource Timeline</h2>
                <div className="flex items-center gap-4 text-xs">
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500" /> <span className="text-slate-400">Food</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500" /> <span className="text-slate-400">Water</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-500" /> <span className="text-slate-400">Medicines</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-orange-500" /> <span className="text-slate-400">Shelter</span></div>
                </div>
              </div>
              
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis 
                      dataKey="time" 
                      stroke="#475569" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false}
                      dy={10}
                    />
                    <YAxis 
                      stroke="#475569" 
                      fontSize={12} 
                      tickLine={false} 
                      axisLine={false}
                      dx={-10}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#334155', strokeWidth: 1, strokeDasharray: '4 4' }} />
                    <Line type="monotone" dataKey="food" stroke="#ef4444" strokeWidth={2} dot={{ r: 4, fill: '#ef4444', strokeWidth: 0 }} activeDot={{ r: 6, fill: '#ef4444', stroke: '#0a0f1c', strokeWidth: 2 }} />
                    <Line type="monotone" dataKey="water" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4, fill: '#f59e0b', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="medicines" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                    <Line type="monotone" dataKey="shelter" stroke="#f97316" strokeWidth={2} dot={{ r: 4, fill: '#f97316', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-start gap-3">
                <div className="mt-0.5 p-1.5 rounded bg-slate-800/50 text-slate-400">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-slate-300 mb-1">Generated Insight</h4>
                  <p className="text-sm text-slate-500">Food depletion accelerating beyond normal camp consumption. Shelter occupancy approaching absolute maximum capacity.</p>
                </div>
              </div>
            </div>

            {/* BOTTOM SECTION — Volunteer Activity */}
            <div className="bg-[#0a0f1c] border border-slate-800/60 rounded-xl p-6">
              <h2 className="text-lg font-semibold text-white mb-6">Recent Field Updates</h2>
              
              <div className="space-y-6">
                {/* Update 1 */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">Volunteer A</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      </div>
                      <span className="text-xs text-slate-500 font-mono">2m ago</span>
                    </div>
                    <p className="text-sm text-slate-300">Food updated from <span className="text-slate-500 line-through">12</span> <ArrowRight className="w-3 h-3 inline text-slate-600" /> <span className="text-red-400 font-medium">8</span></p>
                  </div>
                </div>

                {/* Update 2 */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">Volunteer B</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      </div>
                      <span className="text-xs text-slate-500 font-mono">4m ago</span>
                    </div>
                    <p className="text-sm text-slate-300">Water updated from <span className="text-slate-500 line-through">300L</span> <ArrowRight className="w-3 h-3 inline text-slate-600" /> <span className="text-amber-400 font-medium">290L</span></p>
                  </div>
                </div>

                {/* Update 3 */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">Volunteer C</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      </div>
                      <span className="text-xs text-slate-500 font-mono">1m ago</span>
                    </div>
                    <p className="text-sm text-slate-300">Shelter occupancy verified at <span className="text-orange-400 font-medium">92%</span></p>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            
            {/* RIGHT PANEL — Local Alert Engine */}
            <div className="bg-[#0a0f1c] border border-slate-800/60 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Camp Alerts</h2>
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              </div>

              <div className="space-y-3">
                {/* Alert 1 */}
                <Link href="/dashboard/alerts" className="block">
                  <motion.div 
                    animate={{ opacity: [0.8, 1, 0.8] }} 
                    transition={{ duration: 2, repeat: Infinity }} 
                    className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 relative overflow-hidden cursor-pointer hover:bg-red-500/15 transition-colors"
                  >
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500" />
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-red-400">Critical</span>
                      <span className="text-[10px] text-slate-400 font-mono">Just now</span>
                    </div>
                    <p className="text-sm text-red-100 font-medium">Food may exhaust within 2 hours</p>
                  </motion.div>
                </Link>

                {/* Alert 2 */}
                <Link href="/dashboard/alerts" className="block">
                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 relative overflow-hidden cursor-pointer hover:bg-orange-500/15 transition-colors">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500" />
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400">High</span>
                      <span className="text-[10px] text-slate-400 font-mono">1m ago</span>
                    </div>
                    <p className="text-sm text-orange-100 font-medium">Shelter pressure rising rapidly</p>
                  </div>
                </Link>

                {/* Alert 3 */}
                <Link href="/dashboard/alerts" className="block">
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 relative overflow-hidden cursor-pointer hover:bg-blue-500/15 transition-colors">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Moderate</span>
                      <span className="text-[10px] text-slate-400 font-mono">4m ago</span>
                    </div>
                    <p className="text-sm text-blue-100 font-medium">Water stable but declining</p>
                  </div>
                </Link>

                {/* Alert 4 */}
                <Link href="/dashboard/alerts" className="block">
                  <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 relative overflow-hidden cursor-pointer hover:bg-amber-500/15 transition-colors">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Warning</span>
                      <span className="text-[10px] text-slate-400 font-mono">6m ago</span>
                    </div>
                    <p className="text-sm text-amber-100 font-medium">No medicine recovery update in last 6 mins</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* ACTION PANEL */}
            <div className="bg-[#0a0f1c] border border-slate-800/60 rounded-xl p-6">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Command Actions</h2>
              
              <div className="space-y-3">
                <Link href="/dashboard/update" className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-3 px-4 rounded-lg font-medium transition-colors">
                  <Plus className="w-4 h-4" />
                  Update Resource
                </Link>
                
                <Link href="/dashboard/alerts" className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-3 px-4 rounded-lg font-medium transition-colors border border-slate-700">
                  <AlertOctagon className="w-4 h-4 text-red-400" />
                  Escalate Alert
                </Link>
                
                <button className="w-full flex items-center justify-center gap-2 bg-transparent hover:bg-slate-800/50 text-slate-300 py-3 px-4 rounded-lg font-medium transition-colors border border-slate-800">
                  <BarChart3 className="w-4 h-4" />
                  View Full Timeline
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
