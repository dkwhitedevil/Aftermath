'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowDownRight, ArrowUpRight, AlertTriangle, Activity, MapPin, Clock, TrendingDown, TrendingUp, ShieldAlert, Shield, ShieldCheck, User, ArrowRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'motion/react';
import { formatDistanceToNow, format } from 'date-fns';
import { useStore, ResourceType, Camp, Severity } from '@/lib/store';

function RelativeTime({ timestamp, fallback }: { timestamp: string, fallback: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <span>{fallback}</span>;
  return <span>{formatDistanceToNow(new Date(timestamp), { addSuffix: true })}</span>;
}

function FormattedTime({ timestamp, fallback }: { timestamp: string, fallback: string }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <span>{fallback}</span>;
  return <span>{format(new Date(timestamp), 'h:mm a')}</span>;
}

function CampCard({ camp, updates }: { camp: Camp, updates: any[] }) {
  const getLatestUpdate = (resource: ResourceType) => {
    const resourceUpdates = updates.filter(u => u.camp === camp && u.resource === resource);
    return resourceUpdates.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
  };

  const campUpdates = updates.filter(u => u.camp === camp);
  const latestCampUpdate = campUpdates.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
  
  const hasCritical = campUpdates.some(u => u.severity === 'critical');
  const hasWarning = campUpdates.some(u => u.severity === 'warning');
  const riskLevel = hasCritical ? 'critical' : hasWarning ? 'warning' : 'stable';

  const getStatus = (resource: ResourceType) => {
    const update = getLatestUpdate(resource);
    if (!update) return { text: 'Stable', color: 'text-blue-400' };
    if (update.severity === 'critical') return { text: 'Low', color: 'text-red-400' };
    if (update.severity === 'warning') return { text: 'Warning', color: 'text-amber-400' };
    if (update.severity === 'recovering') return { text: 'Recovering', color: 'text-emerald-400' };
    return { text: 'Stable', color: 'text-blue-400' };
  };

  const foodStatus = getStatus('Food Kits');
  const waterStatus = getStatus('Water (L)');
  const medStatus = getStatus('Medicines');

  const borderClass = riskLevel === 'critical' ? 'border-red-900/40' : riskLevel === 'warning' ? 'border-amber-900/40' : 'border-blue-900/40';
  const dotClass = riskLevel === 'critical' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]' : riskLevel === 'warning' ? 'bg-amber-500' : 'bg-blue-500';
  const riskTextClass = riskLevel === 'critical' ? 'text-red-500' : riskLevel === 'warning' ? 'text-amber-500' : 'text-blue-500';
  const riskText = riskLevel === 'critical' ? 'Critical' : riskLevel === 'warning' ? 'Moderate' : 'Low';

  return (
    <Link href={`/dashboard/camps?camp=${camp}`}>
      <motion.div whileHover={{ y: -2 }} className={`bg-[#0a0f1c] border ${borderClass} rounded-xl p-5 shadow-lg cursor-pointer group h-full`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-bold text-lg">{camp}</h3>
          <span className={`w-2 h-2 rounded-full ${dotClass}`} />
        </div>
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm"><span className="text-slate-400">Food</span><span className={`${foodStatus.color} font-medium`}>{foodStatus.text}</span></div>
          <div className="flex justify-between text-sm"><span className="text-slate-400">Water</span><span className={`${waterStatus.color} font-medium`}>{waterStatus.text}</span></div>
          <div className="flex justify-between text-sm"><span className="text-slate-400">Medicine</span><span className={`${medStatus.color} font-medium`}>{medStatus.text}</span></div>
        </div>
        <div className="pt-4 border-t border-slate-800/60">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-slate-500">Risk Level</span>
            <span className={`text-xs font-bold uppercase ${riskTextClass}`}>{riskText}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-slate-500">Updated <RelativeTime timestamp={latestCampUpdate?.timestamp || new Date().toISOString()} fallback="just now" /></span>
            {riskLevel === 'critical' && <span className="text-[10px] text-red-400 flex items-center gap-1"><TrendingDown className="w-3 h-3" /> Declining rapidly</span>}
            {riskLevel === 'warning' && <span className="text-[10px] text-amber-400 flex items-center gap-1"><Activity className="w-3 h-3" /> Needs attention</span>}
            {riskLevel === 'stable' && <span className="text-[10px] text-blue-400 flex items-center gap-1"><Activity className="w-3 h-3" /> Normal</span>}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

const chartData = [
  { time: '10:00', food: 20, water: 500, medicine: 120, shelter: 70 },
  { time: '11:00', food: 18, water: 460, medicine: 110, shelter: 78 },
  { time: '12:00', food: 14, water: 390, medicine: 100, shelter: 85 },
  { time: '13:00', food: 8, water: 320, medicine: 90, shelter: 92 },
];

export default function DashboardPage() {
  const { updates, alerts, getCurrentResourceValue, getPreviousResourceValue } = useStore();

  const getLatestUpdate = (camp: Camp, resource: ResourceType) => {
    const resourceUpdates = updates.filter(u => u.camp === camp && u.resource === resource);
    return resourceUpdates[resourceUpdates.length - 1];
  };

  const foodUpdate = getLatestUpdate('Camp A', 'Food Kits');
  const waterUpdate = getLatestUpdate('Camp B', 'Water (L)');
  const medUpdate = getLatestUpdate('Camp C', 'Medicines');
  const shelterUpdate = getLatestUpdate('Camp A', 'Shelter Capacity (%)');

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Intelligence Dashboard</h1>
          <p className="text-slate-400 mt-1">Live operational resource monitoring.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-400 bg-[#0a0f1c] px-4 py-2 rounded-full border border-slate-800/60 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          SYSTEM ACTIVE &bull; SYNCED JUST NOW
        </div>
      </header>

      {/* TOP SECTION: KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Food Kits */}
        <Link href="/dashboard/alerts">
          <motion.div whileHover={{ y: -2 }} className="bg-[#0a0f1c] border border-red-900/30 rounded-xl p-5 relative overflow-hidden group shadow-lg cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-100" />
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-slate-300 font-medium text-sm">Food Kits</h3>
                <span className="text-[10px] px-2 py-1 rounded border font-bold uppercase tracking-wider text-red-400 bg-red-500/10 border-red-500/20">
                  Critical Drop
                </span>
              </div>
              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-slate-500 line-through text-lg">{foodUpdate?.oldValue || 20}</span>
                <span className="text-4xl font-bold text-white flex items-center gap-1">
                  {foodUpdate?.newValue || 8} {(foodUpdate?.newValue || 8) < (foodUpdate?.oldValue || 20) ? <ArrowDownRight className="w-6 h-6 text-red-500" /> : <ArrowUpRight className="w-6 h-6 text-red-500" />}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" /> <RelativeTime timestamp={foodUpdate?.timestamp || new Date().toISOString()} fallback="2 mins ago" /></span>
                <span className="text-red-400 font-medium flex items-center gap-1"><TrendingDown className="w-3 h-3" /> Rapid depletion detected</span>
              </div>
            </div>
          </motion.div>
        </Link>

        {/* Card 2: Water Supply */}
        <motion.div whileHover={{ y: -2 }} className="bg-[#0a0f1c] border border-amber-900/30 rounded-xl p-5 relative overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-100" />
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-slate-300 font-medium text-sm">Water</h3>
              <span className="text-[10px] px-2 py-1 rounded border font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border-amber-500/20">
                Warning
              </span>
            </div>
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-slate-500 line-through text-lg">{waterUpdate?.oldValue || 500}L</span>
              <span className="text-4xl font-bold text-white flex items-center gap-1">
                {waterUpdate?.newValue || 320}L {(waterUpdate?.newValue || 320) < (waterUpdate?.oldValue || 500) ? <ArrowDownRight className="w-6 h-6 text-amber-500" /> : <ArrowUpRight className="w-6 h-6 text-amber-500" />}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" /> <RelativeTime timestamp={waterUpdate?.timestamp || new Date().toISOString()} fallback="4 mins ago" /></span>
              <span className="text-amber-400 font-medium flex items-center gap-1"><TrendingDown className="w-3 h-3" /> Consumption rising</span>
            </div>
          </div>
        </motion.div>

        {/* Card 3: Medicines */}
        <motion.div whileHover={{ y: -2 }} className="bg-[#0a0f1c] border border-blue-900/30 rounded-xl p-5 relative overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-100" />
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-slate-300 font-medium text-sm">Medicines</h3>
              <span className="text-[10px] px-2 py-1 rounded border font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 border-blue-500/20">
                Stable Decline
              </span>
            </div>
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-slate-500 line-through text-lg">{medUpdate?.oldValue || 120}</span>
              <span className="text-4xl font-bold text-white flex items-center gap-1">
                {medUpdate?.newValue || 90} {(medUpdate?.newValue || 90) < (medUpdate?.oldValue || 120) ? <ArrowDownRight className="w-6 h-6 text-blue-500" /> : <ArrowUpRight className="w-6 h-6 text-blue-500" />}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" /> <RelativeTime timestamp={medUpdate?.timestamp || new Date().toISOString()} fallback="7 mins ago" /></span>
              <span className="text-blue-400 font-medium flex items-center gap-1"><TrendingDown className="w-3 h-3" /> Expected usage</span>
            </div>
          </div>
        </motion.div>

        {/* Card 4: Shelter Occupancy */}
        <motion.div whileHover={{ y: -2 }} className="bg-[#0a0f1c] border border-orange-900/30 rounded-xl p-5 relative overflow-hidden shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-100" />
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-slate-300 font-medium text-sm">Shelter Capacity</h3>
              <span className="text-[10px] px-2 py-1 rounded border font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 border-orange-500/20">
                Critical Pressure
              </span>
            </div>
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-slate-500 line-through text-lg">{shelterUpdate?.oldValue || 70}%</span>
              <span className="text-4xl font-bold text-white flex items-center gap-1">
                {shelterUpdate?.newValue || 92}% {(shelterUpdate?.newValue || 92) > (shelterUpdate?.oldValue || 70) ? <ArrowUpRight className="w-6 h-6 text-orange-500" /> : <ArrowDownRight className="w-6 h-6 text-orange-500" />}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" /> <RelativeTime timestamp={shelterUpdate?.timestamp || new Date().toISOString()} fallback="1 min ago" /></span>
              <span className="text-orange-400 font-medium flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Near overload</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* MIDDLE SECTION: Chart + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart */}
        <div className="lg:col-span-2 bg-[#0a0f1c] border border-slate-800/60 rounded-xl p-6 shadow-lg flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-white">Resource Change Over Time</h2>
            <div className="flex gap-4 text-xs font-medium">
              <span className="flex items-center gap-1 text-slate-400"><div className="w-2 h-2 rounded-full bg-red-500" /> Food</span>
              <span className="flex items-center gap-1 text-slate-400"><div className="w-2 h-2 rounded-full bg-amber-500" /> Water</span>
              <span className="flex items-center gap-1 text-slate-400"><div className="w-2 h-2 rounded-full bg-blue-500" /> Meds</span>
              <span className="flex items-center gap-1 text-slate-400"><div className="w-2 h-2 rounded-full bg-orange-500" /> Shelter</span>
            </div>
          </div>
          
          <div className="h-[280px] w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#f8fafc' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Line type="monotone" dataKey="food" stroke="#ef4444" strokeWidth={2} dot={{ r: 3, fill: '#ef4444', strokeWidth: 2, stroke: '#0f172a' }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="water" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3, fill: '#f59e0b', strokeWidth: 2, stroke: '#0f172a' }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="medicine" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3, fill: '#3b82f6', strokeWidth: 2, stroke: '#0f172a' }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="shelter" stroke="#f97316" strokeWidth={2} dot={{ r: 3, fill: '#f97316', strokeWidth: 2, stroke: '#0f172a' }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-start gap-3">
            <div className="mt-0.5 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
            <p className="text-sm text-slate-300 font-medium leading-relaxed">
              <span className="text-white">Generated Insight:</span> Food depletion accelerating faster than expected.
            </p>
          </div>
        </div>

        {/* Priority Alerts */}
        <div className="bg-[#0a0f1c] border border-slate-800/60 rounded-xl p-6 shadow-lg flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" /> Priority Alerts
            </h2>
          </div>
          
          <div className="flex-1 flex flex-col gap-3">
            {[...alerts].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 4).map((alert, index) => {
              const isCritical = alert.severity === 'critical';
              const isWarning = alert.severity === 'warning';
              const isRecovering = alert.severity === 'recovering';
              
              const bgClass = isCritical ? 'bg-red-500/10 hover:bg-red-500/15' : isWarning ? 'bg-amber-500/10 hover:bg-amber-500/15' : isRecovering ? 'bg-emerald-500/10 hover:bg-emerald-500/15' : 'bg-blue-500/10 hover:bg-blue-500/15';
              const borderClass = isCritical ? 'border-red-500/20' : isWarning ? 'border-amber-500/20' : isRecovering ? 'border-emerald-500/20' : 'border-blue-500/20';
              const stripClass = isCritical ? 'bg-red-500' : isWarning ? 'bg-amber-500' : isRecovering ? 'bg-emerald-500' : 'bg-blue-500';
              const textClass = isCritical ? 'text-red-400' : isWarning ? 'text-amber-400' : isRecovering ? 'text-emerald-400' : 'text-blue-400';
              const titleClass = isCritical ? 'text-red-100' : isWarning ? 'text-amber-100' : isRecovering ? 'text-emerald-100' : 'text-blue-100';
              
              return (
                <Link key={alert.id} href="/dashboard/alerts">
                  <motion.div 
                    animate={isCritical ? { opacity: [0.8, 1, 0.8] } : {}} 
                    transition={isCritical ? { duration: 2, repeat: Infinity, delay: index * 0.5 } : {}} 
                    className={`${bgClass} border ${borderClass} rounded-lg p-4 relative overflow-hidden cursor-pointer transition-colors`}
                  >
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${stripClass}`} />
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${textClass}`}>{alert.severity === 'warning' ? 'High' : alert.severity === 'stable' ? 'Moderate' : alert.severity}</span>
                      <span className="text-[10px] text-slate-400"><RelativeTime timestamp={alert.timestamp} fallback="Just now" /></span>
                    </div>
                    <p className={`text-sm ${titleClass} font-medium`}>{alert.message}</p>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: Locations + Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Locations */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-white mb-2">Multi-Location Intelligence</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CampCard camp="Camp A" updates={updates} />
            <CampCard camp="Camp B" updates={updates} />
            <CampCard camp="Camp C" updates={updates} />
          </div>
        </div>

        {/* Live Feed */}
        <div className="bg-[#0a0f1c] border border-slate-800/60 rounded-xl p-6 shadow-lg flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" /> Live Resource Feed
            </h2>
          </div>
          
          <div className="flex-1 space-y-4">
            {[...updates].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5).map(update => {
              const severityColors = {
                'critical': 'bg-red-500/10 text-red-400 border-red-500/20',
                'warning': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                'stable': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                'recovering': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
              };
              
              const colorClass = severityColors[update.severity] || severityColors['stable'];
              
              return (
                <div key={update.id} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-slate-500"><FormattedTime timestamp={update.timestamp} fallback="0:00" /></span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border font-bold uppercase ${colorClass}`}>{update.severity}</span>
                    </div>
                    <p className="text-sm text-white font-medium mb-0.5">{update.resource}: <span className="text-slate-500 line-through mx-1">{update.oldValue}</span> <ArrowRight className="w-3 h-3 inline text-slate-600" /> <span className={update.severity === 'critical' ? 'text-red-400 ml-1' : update.severity === 'warning' ? 'text-amber-400 ml-1' : update.severity === 'recovering' ? 'text-emerald-400 ml-1' : 'text-blue-400 ml-1'}>{update.newValue}</span></p>
                    <p className="text-xs text-slate-500">Updated by {update.updatedBy}{update.note ? ` - ${update.note}` : ''}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
