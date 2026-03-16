'use client';

import { useStore, ResourceType, Severity } from '@/lib/store';
import { format, parseISO } from 'date-fns';
import { ArrowRight, Filter, Search, User, MapPin } from 'lucide-react';
import { useState } from 'react';

export default function FeedPage() {
  const { updates } = useStore();
  const [filter, setFilter] = useState<ResourceType | 'All'>('All');

  const resources: (ResourceType | 'All')[] = ['All', 'Food Kits', 'Water (L)', 'Medicines', 'Shelter Capacity (%)', 'Fuel (L)', 'Blankets'];

  const filteredUpdates = updates
    .filter(u => filter === 'All' || u.resource === filter)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const getSeverityBadge = (severity: Severity) => {
    switch (severity) {
      case 'critical': return <span className="px-2 py-1 text-xs font-bold uppercase tracking-wider rounded-md bg-red-500/10 text-red-500 border border-red-500/20">Critical Drop</span>;
      case 'warning': return <span className="px-2 py-1 text-xs font-bold uppercase tracking-wider rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/20">Warning</span>;
      case 'recovering': return <span className="px-2 py-1 text-xs font-bold uppercase tracking-wider rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">Recovering</span>;
      default: return <span className="px-2 py-1 text-xs font-bold uppercase tracking-wider rounded-md bg-blue-500/10 text-blue-500 border border-blue-500/20">Stable</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Resource Change Feed</h1>
          <p className="text-slate-400 mt-1">Real-time intelligence feed of all operational updates.</p>
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          <Filter className="w-4 h-4 text-slate-500" />
          {resources.map(res => (
            <button
              key={res}
              onClick={() => setFilter(res)}
              className={`px-3 py-1.5 text-sm rounded-full whitespace-nowrap transition-colors border ${
                filter === res 
                  ? 'bg-blue-600 text-white border-blue-500' 
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
              }`}
            >
              {res}
            </button>
          ))}
        </div>
      </header>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="divide-y divide-slate-800/50">
          {filteredUpdates.map((update) => {
            const isIncrease = update.newValue > update.oldValue;
            const delta = Math.abs(update.newValue - update.oldValue);
            const deltaPercent = update.oldValue > 0 ? Math.round((delta / update.oldValue) * 100) : 0;

            return (
              <div key={update.id} className="p-6 hover:bg-slate-800/30 transition-colors flex flex-col sm:flex-row sm:items-center gap-6">
                <div className="flex-shrink-0 w-24 text-sm text-slate-500 font-mono">
                  {format(parseISO(update.timestamp), 'HH:mm')}
                </div>
                
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-white font-medium text-lg mb-1">{update.resource}</h3>
                    <div className="flex items-center gap-3 text-sm text-slate-400">
                      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {update.camp}</span>
                      <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {update.updatedBy}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center sm:justify-end gap-4">
                    <div className="flex items-baseline gap-3 bg-slate-950 px-4 py-2 rounded-lg border border-slate-800">
                      <span className="text-slate-500 line-through text-lg">{update.oldValue}</span>
                      <ArrowRight className="w-4 h-4 text-slate-600" />
                      <span className="text-2xl font-bold text-white">{update.newValue}</span>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2 min-w-[100px]">
                      {getSeverityBadge(update.severity)}
                      {deltaPercent > 0 && (
                        <span className={`text-xs font-mono ${isIncrease ? 'text-emerald-500' : 'text-red-500'}`}>
                          {isIncrease ? '+' : '-'}{deltaPercent}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {update.note && (
                  <div className="w-full sm:w-auto mt-4 sm:mt-0 p-3 bg-slate-950 rounded-lg border border-slate-800 text-sm text-slate-400 italic max-w-xs">
                    "{update.note}"
                  </div>
                )}
              </div>
            );
          })}
          
          {filteredUpdates.length === 0 && (
            <div className="p-12 text-center text-slate-500">
              No updates found for the selected filter.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
