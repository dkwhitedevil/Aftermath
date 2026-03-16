"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { 
  ChevronLeft, 
  Activity, 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Package, 
  User,
  ShieldCheck,
  AlertOctagon,
  Info
} from 'lucide-react';
import { useStore, ResourceType, Camp, Severity, calculateSeverity } from '@/lib/store';

const resources: ResourceType[] = ['Food Kits', 'Water (L)', 'Medicines', 'Shelter Capacity (%)', 'Fuel (L)', 'Blankets'];
const camps: Camp[] = ['Camp A', 'Camp B', 'Camp C'];

export default function UpdateResource() {
  const { addUpdate, getCurrentResourceValue, updates } = useStore();
  
  const [resource, setResource] = useState<ResourceType>('Food Kits');
  const [camp, setCamp] = useState<Camp>('Camp A');
  const [quantity, setQuantity] = useState<string>('');
  const [updatedBy, setUpdatedBy] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const oldValue = getCurrentResourceValue(camp, resource);
  const newValue = quantity === '' ? oldValue : Number(quantity);
  const delta = newValue - oldValue;
  const severity = calculateSeverity(resource, oldValue, newValue);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quantity || !updatedBy) return;

    setIsSubmitting(true);
    
    // Simulate network delay for premium feel
    setTimeout(() => {
      addUpdate({
        resource,
        camp,
        newValue: Number(quantity),
        updatedBy,
        note
      });
      
      setIsSubmitting(false);
      setShowSuccess(true);
      setQuantity('');
      setNote('');
      
      setTimeout(() => setShowSuccess(false), 4000);
    }, 800);
  };

  const recentUpdates = [...updates].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 3);

  const getSeverityColor = (sev: Severity) => {
    switch (sev) {
      case 'critical': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'warning': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'recovering': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    }
  };

  const getSeverityLabel = (sev: Severity) => {
    switch (sev) {
      case 'critical': return 'Critical Drop';
      case 'warning': return 'Warning';
      case 'recovering': return 'Recovering';
      default: return 'Stable';
    }
  };

  const getGeneratedAlert = () => {
    if (quantity === '') return 'Awaiting input...';
    if (severity === 'critical') return `${resource.split(' ')[0]} depletion accelerating`;
    if (severity === 'warning') return `${resource.split(' ')[0]} levels dropping`;
    if (severity === 'recovering') return `${resource.split(' ')[0]} supply improving`;
    return `${resource.split(' ')[0]} levels stable`;
  };

  const getIntelligenceNote = () => {
    if (quantity === '') return 'Enter a new quantity to generate intelligence impact.';
    if (severity === 'critical') return 'This update indicates accelerated depletion beyond expected camp usage.';
    if (severity === 'warning') return 'Usage is higher than baseline. Monitor closely over the next 12 hours.';
    if (severity === 'recovering') return 'Recent resupply or reduced usage has improved the local resource buffer.';
    return 'Resource consumption is tracking within normal operational parameters.';
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
          
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
            <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <Link href="/dashboard/camps" className="hover:text-white transition-colors">Camps</Link>
            <Link href="/dashboard/alerts" className="hover:text-white transition-colors">Alerts</Link>
            <Link href="/dashboard/timeline" className="hover:text-white transition-colors">Timeline</Link>
          </div>

          <Link href="/dashboard" className="text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 lg:px-8 py-8">
        
        <AnimatePresence>
          {showSuccess && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 rounded-lg flex items-center gap-3"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span className="font-medium">Update successfully reflected in operational intelligence.</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* LEFT SIDE — Resource Update Form */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Update Resource</h1>
              <p className="text-slate-400">Submit live field data to refresh operational intelligence.</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-[#0a0f1c] border border-slate-800/60 rounded-2xl p-6 md:p-8 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Package className="w-4 h-4 text-blue-400" />
                    Resource Type
                  </label>
                  <select 
                    value={resource}
                    onChange={(e) => setResource(e.target.value as ResourceType)}
                    className="w-full bg-[#030712] border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all appearance-none"
                  >
                    {resources.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    Location
                  </label>
                  <select 
                    value={camp}
                    onChange={(e) => setCamp(e.target.value as Camp)}
                    className="w-full bg-[#030712] border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all appearance-none"
                  >
                    {camps.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-400" />
                  Current Quantity
                </label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    placeholder="Enter current quantity"
                    required
                    className="w-full bg-[#030712] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all text-lg font-medium"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium">
                    {resource.includes('(') ? resource.split('(')[1].replace(')', '') : ''}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-400" />
                    Updated By
                  </label>
                  <input 
                    type="text" 
                    value={updatedBy}
                    onChange={(e) => setUpdatedBy(e.target.value)}
                    placeholder="e.g. Volunteer A"
                    required
                    className="w-full bg-[#030712] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    Timestamp
                  </label>
                  <div className="w-full bg-[#030712]/50 border border-slate-800 rounded-lg px-4 py-3 text-slate-400 cursor-not-allowed flex items-center">
                    {format(currentTime, 'h:mm a')}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-400" />
                  Optional Note
                </label>
                <textarea 
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="High demand due to new arrivals..."
                  rows={3}
                  className="w-full bg-[#030712] border border-slate-700 rounded-lg px-4 py-3 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none"
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting || !quantity || !updatedBy}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] disabled:shadow-none"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Processing...
                  </span>
                ) : (
                  <>
                    Update Intelligence
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          </div>

          {/* RIGHT SIDE — Live Impact Preview */}
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              Immediate Impact Preview
            </h2>

            <div className="bg-[#0a0f1c] border border-slate-800/60 rounded-2xl p-6 md:p-8 relative overflow-hidden">
              {/* Subtle background glow based on severity */}
              <motion.div 
                className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none transition-colors duration-500 ${
                  quantity === '' ? 'bg-blue-500/5' :
                  severity === 'critical' ? 'bg-red-500/10' :
                  severity === 'warning' ? 'bg-amber-500/10' :
                  severity === 'recovering' ? 'bg-emerald-500/10' :
                  'bg-blue-500/10'
                }`}
              />

              <div className="relative z-10 space-y-8">
                
                {/* Main Delta Display */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Previous</p>
                    <p className="text-2xl font-bold text-slate-300">{oldValue}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Current</p>
                    <p className="text-2xl font-bold text-white">{quantity === '' ? '--' : newValue}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Delta</p>
                    <p className={`text-2xl font-bold ${quantity === '' ? 'text-slate-500' : delta < 0 ? 'text-red-400' : delta > 0 ? 'text-emerald-400' : 'text-slate-300'}`}>
                      {quantity === '' ? '--' : delta > 0 ? `+${delta}` : delta}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Severity</p>
                    <motion.div 
                      key={severity + quantity}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`inline-flex px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${quantity === '' ? 'text-slate-500 bg-slate-800/50 border-slate-700' : getSeverityColor(severity)}`}
                    >
                      {quantity === '' ? 'Pending' : getSeverityLabel(severity)}
                    </motion.div>
                  </div>
                </div>

                {/* Generated Alert & Risk */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#030712]/50 border border-slate-800/80 rounded-xl p-4">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Generated Alert</p>
                    <p className={`font-medium ${quantity === '' ? 'text-slate-600' : severity === 'critical' ? 'text-red-400' : severity === 'warning' ? 'text-amber-400' : 'text-slate-300'}`}>
                      {getGeneratedAlert()}
                    </p>
                  </div>
                  <div className="bg-[#030712]/50 border border-slate-800/80 rounded-xl p-4">
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Estimated Risk</p>
                    <div className="flex items-center gap-2">
                      {quantity !== '' && severity === 'critical' && <AlertOctagon className="w-4 h-4 text-red-500" />}
                      {quantity !== '' && severity === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                      {quantity !== '' && severity === 'stable' && <ShieldCheck className="w-4 h-4 text-blue-500" />}
                      <span className={`font-medium ${quantity === '' ? 'text-slate-600' : severity === 'critical' ? 'text-red-400' : severity === 'warning' ? 'text-amber-400' : 'text-slate-300'}`}>
                        {quantity === '' ? 'Unknown' : severity === 'critical' ? 'High' : severity === 'warning' ? 'Elevated' : 'Low'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Small Preview Cards */}
                <div className="flex flex-wrap gap-3">
                  <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg px-3 py-2 flex items-center gap-2 text-sm">
                    <Package className="w-4 h-4 text-slate-400" />
                    <span className="text-slate-300">{resource.split(' ')[0]}: <span className="text-slate-500 line-through">{oldValue}</span> <ArrowRight className="w-3 h-3 inline text-slate-600" /> <span className="text-white font-medium">{quantity === '' ? '?' : newValue}</span></span>
                  </div>
                  <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg px-3 py-2 flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-slate-400" />
                    <span className="text-white font-medium">{camp}</span>
                  </div>
                  <div className="bg-slate-800/30 border border-slate-700/50 rounded-lg px-3 py-2 flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="text-white font-medium">{updatedBy || 'Pending'}</span>
                  </div>
                </div>

                {/* Alert Preview Context */}
                <div className="bg-[#030712]/50 border border-slate-800/80 rounded-xl p-4">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Contextual Alert Preview</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <span className="text-slate-400">Water stable</span>
                    </div>
                    <motion.div 
                      key={severity + quantity}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-2"
                    >
                      <div className={`w-1.5 h-1.5 rounded-full ${quantity === '' ? 'bg-slate-600' : severity === 'critical' ? 'bg-red-500 animate-pulse' : severity === 'warning' ? 'bg-amber-500' : severity === 'recovering' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                      <span className={quantity === '' ? 'text-slate-600' : severity === 'critical' ? 'text-red-400 font-medium' : severity === 'warning' ? 'text-amber-400' : 'text-slate-300'}>
                        {resource.split(' ')[0]} {quantity === '' ? 'pending' : severity}
                      </span>
                    </motion.div>
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      <span className="text-slate-400">Shelter warning</span>
                    </div>
                  </div>
                </div>

                {/* Intelligence Note */}
                <div className="border-l-2 border-blue-500/50 pl-4 py-1">
                  <p className="text-sm text-slate-400 italic">
                    <motion.span 
                      key={quantity + severity}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {getIntelligenceNote()}
                    </motion.span>
                  </p>
                </div>

              </div>
            </div>

            {/* Bottom Strip — Recent Updates */}
            <div>
              <h3 className="text-sm font-medium text-slate-400 mb-3">Recent Submissions</h3>
              <div className="space-y-2">
                {recentUpdates.map(update => (
                  <div key={update.id} className="bg-[#0a0f1c] border border-slate-800/60 rounded-lg px-4 py-3 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <span className="text-slate-500 font-mono">{format(new Date(update.timestamp), 'h:mm a')}</span>
                      <span className="text-slate-300">
                        {update.resource.split(' ')[0]} <span className="text-slate-500 line-through">{update.oldValue}</span> <ArrowRight className="w-3 h-3 inline text-slate-600 mx-1" /> <span className="text-white font-medium">{update.newValue}</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 text-xs">{update.camp}</span>
                      <div className={`w-2 h-2 rounded-full ${update.severity === 'critical' ? 'bg-red-500' : update.severity === 'warning' ? 'bg-amber-500' : update.severity === 'recovering' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
