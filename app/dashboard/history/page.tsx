'use client';

import { useStore, Camp, ResourceType } from '@/lib/store';
import { useState } from 'react';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { format, parseISO } from 'date-fns';
import { History, TrendingDown, TrendingUp } from 'lucide-react';

export default function HistoryPage() {
  const { getResourceHistory } = useStore();
  
  const [camp, setCamp] = useState<Camp>('Camp A');
  const [resource, setResource] = useState<ResourceType>('Food Kits');

  const rawData = getResourceHistory(camp, resource);
  
  // Sort data chronologically
  const chartData = [...rawData].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()).map(d => ({
    time: format(parseISO(d.time), 'HH:mm'),
    fullTime: format(parseISO(d.time), 'MMM d, HH:mm'),
    value: d.value
  }));

  const isDeclining = chartData.length >= 2 && chartData[chartData.length - 1].value < chartData[0].value;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">History & Timeline</h1>
          <p className="text-slate-400 mt-1">Because Aftermath = change over time.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">Viewing:</span>
            <Link href={`/dashboard/camps?camp=${camp}`} className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors">
              {camp}
            </Link>
          </div>
          <select 
            value={camp}
            onChange={(e) => setCamp(e.target.value as Camp)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
          >
            <option value="Camp A">Camp A</option>
            <option value="Camp B">Camp B</option>
            <option value="Camp C">Camp C</option>
          </select>
          
          <select 
            value={resource}
            onChange={(e) => setResource(e.target.value as ResourceType)}
            className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-white outline-none focus:border-blue-500"
          >
            <option value="Food Kits">Food Kits</option>
            <option value="Water (L)">Water (L)</option>
            <option value="Medicines">Medicines</option>
            <option value="Shelter Capacity (%)">Shelter Capacity (%)</option>
            <option value="Fuel (L)">Fuel (L)</option>
            <option value="Blankets">Blankets</option>
          </select>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <History className="w-5 h-5 text-blue-500" /> Timeline Visual
            </h2>
            {isDeclining ? (
              <span className="flex items-center gap-1 text-red-400 bg-red-500/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-red-500/20">
                <TrendingDown className="w-4 h-4" /> Depletion Accelerating
              </span>
            ) : (
              <span className="flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-500/20">
                <TrendingUp className="w-4 h-4" /> Supply Recovering
              </span>
            )}
          </div>
          
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={isDeclining ? "#ef4444" : "#3b82f6"} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={isDeclining ? "#ef4444" : "#3b82f6"} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="time" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '8px', color: '#f8fafc' }}
                  itemStyle={{ color: '#f8fafc', fontWeight: 'bold' }}
                  labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke={isDeclining ? "#ef4444" : "#3b82f6"} 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                  activeDot={{ r: 8, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6">Event Log</h3>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-800 before:to-transparent">
            {chartData.slice().reverse().map((d, i) => (
              <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-slate-700 bg-slate-900 text-slate-500 group-[.is-active]:text-blue-500 group-[.is-active]:border-blue-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <div className="w-2 h-2 rounded-full bg-current" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-800 bg-slate-950/50">
                  <div className="flex items-center justify-between mb-1">
                    <time className="text-xs font-mono text-slate-500">{d.time}</time>
                  </div>
                  <div className="text-xl font-bold text-white">{d.value} <span className="text-sm font-normal text-slate-500">units</span></div>
                </div>
              </div>
            ))}
            {chartData.length === 0 && (
              <div className="text-center text-slate-500 py-8 relative z-10 bg-slate-900">No history available.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
