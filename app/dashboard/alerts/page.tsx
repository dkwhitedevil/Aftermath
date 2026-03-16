"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { format, formatDistanceToNow } from 'date-fns';
import { 
  Activity, 
  AlertTriangle, 
  AlertOctagon, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  ArrowRight,
  Plus,
  CheckCircle2,
  Info,
  TrendingDown,
  Zap
} from 'lucide-react';
import { useStore, Alert, Severity } from '@/lib/store';

export default function AlertsCenter() {
  const { alerts, getCurrentResourceValue } = useStore();
  
  // Sort alerts: critical first, then warning, then others, then by timestamp
  const sortedAlerts = [...alerts].sort((a, b) => {
    const severityWeight = { critical: 3, warning: 2, stable: 1, recovering: 0 };
    if (severityWeight[a.severity] !== severityWeight[b.severity]) {
      return severityWeight[b.severity] - severityWeight[a.severity];
    }
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(sortedAlerts.length > 0 ? sortedAlerts[0].id : null);

  const selectedAlert = sortedAlerts.find(a => a.id === selectedAlertId) || sortedAlerts[0];

  const criticalCount = alerts.filter(a => a.severity === 'critical').length || 4;
  const highCount = alerts.filter(a => a.severity === 'warning').length || 6;
  const moderateCount = alerts.filter(a => a.severity === 'stable').length || 3;
  const recoveryCount = alerts.filter(a => a.severity === 'recovering').length || 2;

  const getSeverityColor = (sev: Severity) => {
    switch (sev) {
      case 'critical': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'warning': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'recovering': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    }
  };

  const getSeverityIcon = (sev: Severity, className: string = "w-5 h-5") => {
    switch (sev) {
      case 'critical': return <AlertOctagon className={`${className} text-red-400`} />;
      case 'warning': return <AlertTriangle className={`${className} text-amber-400`} />;
      case 'recovering': return <CheckCircle2 className={`${className} text-emerald-400`} />;
      default: return <Info className={`${className} text-blue-400`} />;
    }
  };

  const getSeverityLabel = (sev: Severity) => {
    switch (sev) {
      case 'critical': return 'Critical';
      case 'warning': return 'High';
      case 'recovering': return 'Recovery';
      default: return 'Moderate';
    }
  };

  const getExplanation = (alert: Alert) => {
    if (alert.message.toLowerCase().includes('water')) return 'Consumption exceeds projected reserve stability.';
    if (alert.message.toLowerCase().includes('food')) return 'Resource decline faster than expected.';
    if (alert.message.toLowerCase().includes('shelter')) return 'Occupancy above safety threshold.';
    return 'Expected decline but needs monitoring.';
  };

  const getImpactIntelligence = (alert: Alert) => {
    if (!alert) return null;
    
    const currentValue = getCurrentResourceValue(alert.camp, alert.resource);
    
    let failureWindow = 'Unknown';
    let linkedRisk = 'System instability';
    let suggestedAction = 'Monitor closely';

    if (alert.resource.includes('Water')) {
      failureWindow = '3 hours';
      linkedRisk = 'Shelter instability';
      suggestedAction = 'Transfer supply from Camp B';
    } else if (alert.resource.includes('Food')) {
      failureWindow = '5 hours';
      linkedRisk = 'Malnutrition risk rising';
      suggestedAction = 'Expedite incoming convoy';
    } else if (alert.resource.includes('Shelter')) {
      failureWindow = 'Immediate';
      linkedRisk = 'Overcrowding hazards';
      suggestedAction = 'Open overflow sector';
    } else {
      failureWindow = '12 hours';
      linkedRisk = 'General supply strain';
      suggestedAction = 'Review distribution rate';
    }

    return { currentValue, failureWindow, linkedRisk, suggestedAction };
  };

  const impact = getImpactIntelligence(selectedAlert);

  // Mock history for the bottom section
  const historyTimeline = [
    { time: '2:10 PM', message: 'Water warning triggered', type: 'warning' },
    { time: '2:24 PM', message: 'Food decline entered warning', type: 'warning' },
    { time: '2:40 PM', message: 'Food escalated critical', type: 'critical' },
    { time: '2:52 PM', message: 'Shelter pressure increased', type: 'high' },
  ];

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 font-sans selection:bg-blue-500/30 flex flex-col">
      
      {/* Navigation */}
      

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 lg:px-8 py-8 space-y-8">
        
        {/* TOP SECTION — Alert Summary */}
        <section>
          <h1 className="text-2xl font-bold text-white tracking-tight mb-6">Operational Intelligence Center</h1>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Critical */}
            <div className="bg-[#0a0f1c] border border-red-500/20 rounded-xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3" />
              <div className="flex items-center gap-3 mb-2">
                <AlertOctagon className="w-5 h-5 text-red-400" />
                <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wider">Critical Alerts</h3>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">{criticalCount}</span>
                <span className="text-sm text-red-400 font-medium">active</span>
              </div>
            </div>

            {/* High */}
            <div className="bg-[#0a0f1c] border border-amber-500/20 rounded-xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3" />
              <div className="flex items-center gap-3 mb-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wider">High Alerts</h3>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">{highCount}</span>
                <span className="text-sm text-amber-400 font-medium">active</span>
              </div>
            </div>

            {/* Moderate */}
            <div className="bg-[#0a0f1c] border border-blue-500/20 rounded-xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3" />
              <div className="flex items-center gap-3 mb-2">
                <Info className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wider">Moderate Alerts</h3>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">{moderateCount}</span>
                <span className="text-sm text-blue-400 font-medium">active</span>
              </div>
            </div>

            {/* Recovery */}
            <div className="bg-[#0a0f1c] border border-emerald-500/20 rounded-xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3" />
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-medium text-slate-300 uppercase tracking-wider">Recovery Alerts</h3>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">{recoveryCount}</span>
                <span className="text-sm text-emerald-400 font-medium">active</span>
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* MIDDLE SECTION — Priority Alert List */}
          <section className="lg:col-span-2 space-y-4">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Priority Alert List</h2>
            
            <div className="space-y-3">
              {sortedAlerts.map((alert) => {
                const isSelected = selectedAlertId === alert.id;
                const isCritical = alert.severity === 'critical';
                
                return (
                  <Link href={`/dashboard/camps?camp=${alert.camp}`}>
                    <motion.div 
                      key={alert.id}
                      onClick={() => setSelectedAlertId(alert.id)}
                      whileHover={{ scale: 1.01 }}
                      className={`cursor-pointer rounded-xl p-5 border transition-all relative overflow-hidden ${
                        isSelected 
                          ? 'bg-slate-800/50 border-slate-600 shadow-lg' 
                          : 'bg-[#0a0f1c] border-slate-800/60 hover:bg-slate-800/30'
                      }`}
                    >
                    {/* Left accent border */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                      alert.severity === 'critical' ? 'bg-red-500' :
                      alert.severity === 'warning' ? 'bg-amber-500' :
                      alert.severity === 'recovering' ? 'bg-emerald-500' : 'bg-blue-500'
                    }`} />
                    
                    {/* Pulse effect for critical */}
                    {isCritical && !isSelected && (
                      <motion.div 
                        animate={{ opacity: [0, 0.1, 0] }} 
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-red-500 pointer-events-none"
                      />
                    )}

                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`mt-1 p-2 rounded-lg ${getSeverityColor(alert.severity)}`}>
                          {getSeverityIcon(alert.severity)}
                        </div>
                        
                        <div>
                          <h3 className="text-lg font-bold text-white mb-1">{alert.message}</h3>
                          <p className="text-sm text-slate-400 mb-3">{getExplanation(alert)}</p>
                          
                          <div className="flex items-center gap-4 text-xs font-medium">
                            <span className={`px-2 py-1 rounded uppercase tracking-wider ${getSeverityColor(alert.severity)}`}>
                              {getSeverityLabel(alert.severity)}
                            </span>
                            <span className="flex items-center gap-1 text-slate-400">
                              <MapPin className="w-3 h-3" />
                              {alert.camp}
                            </span>
                            <span className="flex items-center gap-1 text-slate-500 font-mono">
                              <Clock className="w-3 h-3" />
                              {formatDistanceToNow(new Date(alert.timestamp), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-slate-500">
                        <ArrowRight className={`w-5 h-5 transition-transform ${isSelected ? 'translate-x-1 text-white' : ''}`} />
                      </div>
                    </div>
                  </motion.div>
                  </Link>
                );
              })}
            </div>

            {/* BOTTOM SECTION — Alert History Timeline */}
            <div className="pt-8">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6">Recent Alert Sequence</h2>
              <div className="bg-[#0a0f1c] border border-slate-800/60 rounded-xl p-6">
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-800 before:to-transparent">
                  {historyTimeline.map((item, i) => (
                    <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-[#030712] bg-slate-800 text-slate-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                        {item.type === 'critical' ? <AlertOctagon className="w-4 h-4 text-red-400" /> : <AlertTriangle className="w-4 h-4 text-amber-400" />}
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-800/30 border border-slate-700/50 p-4 rounded-lg shadow">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-slate-200 text-sm">{item.message}</span>
                          <span className="font-mono text-xs text-slate-500">{item.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* RIGHT SIDE — Alert Impact Intelligence */}
          <section className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Operational Impact</h2>
              
              <AnimatePresence mode="wait">
                {selectedAlert && impact && (
                  <motion.div
                    key={selectedAlert.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-[#0a0f1c] border border-slate-800/60 rounded-2xl overflow-hidden"
                  >
                    {/* Header */}
                    <div className={`p-6 border-b ${
                      selectedAlert.severity === 'critical' ? 'bg-red-500/10 border-red-500/20' :
                      selectedAlert.severity === 'warning' ? 'bg-amber-500/10 border-amber-500/20' :
                      selectedAlert.severity === 'recovering' ? 'bg-emerald-500/10 border-emerald-500/20' :
                      'bg-blue-500/10 border-blue-500/20'
                    }`}>
                      <div className="flex items-center gap-3 mb-4">
                        {getSeverityIcon(selectedAlert.severity, "w-6 h-6")}
                        <h3 className="text-xl font-bold text-white">{selectedAlert.message}</h3>
                      </div>
                      <div className="flex items-center gap-4 text-sm font-medium">
                        <span className="flex items-center gap-1 text-slate-300">
                          <MapPin className="w-4 h-4 text-slate-500" />
                          {selectedAlert.camp}
                        </span>
                        <span className="flex items-center gap-1 text-slate-300">
                          <Clock className="w-4 h-4 text-slate-500" />
                          {formatDistanceToNow(new Date(selectedAlert.timestamp), { addSuffix: true })}
                        </span>
                      </div>
                    </div>

                    {/* Impact Details */}
                    <div className="p-6 space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Affected Resource</p>
                          <p className="text-lg font-bold text-white">{selectedAlert.resource.split(' ')[0]}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Current Level</p>
                          <p className="text-lg font-bold text-white">{impact.currentValue}</p>
                        </div>
                      </div>

                      <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4 space-y-4">
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Estimated Failure Window</p>
                          <p className="text-lg font-bold text-red-400 flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            {impact.failureWindow}
                          </p>
                        </div>
                        <div className="h-px bg-slate-700/50 w-full" />
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Linked Risk</p>
                          <p className="text-base font-medium text-amber-400 flex items-center gap-2">
                            <TrendingDown className="w-4 h-4" />
                            {impact.linkedRisk}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Suggested Action</p>
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 flex items-start gap-3">
                          <Zap className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                          <p className="text-sm font-medium text-blue-100">{impact.suggestedAction}</p>
                        </div>
                      </div>

                      <div className="border-l-2 border-slate-600 pl-4 py-1">
                        <p className="text-sm text-slate-400 italic">
                          This alert indicates emerging operational failure if no intervention occurs.
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="p-6 bg-slate-900/50 border-t border-slate-800/60 space-y-3">
                      <button className="w-full bg-red-600 hover:bg-red-500 text-white py-3 px-4 rounded-lg font-bold transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(220,38,38,0.2)]">
                        <AlertOctagon className="w-5 h-5" />
                        Escalate Alert
                      </button>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <Link href={`/dashboard/camps?camp=${selectedAlert?.camp || 'Camp A'}`} className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-2.5 px-4 rounded-lg font-medium transition-colors border border-slate-700">
                          <MapPin className="w-4 h-4" />
                          View Camp
                        </Link>
                        <button className="flex items-center justify-center gap-2 bg-transparent hover:bg-slate-800/50 text-slate-300 py-2.5 px-4 rounded-lg font-medium transition-colors border border-slate-800">
                          <CheckCircle2 className="w-4 h-4" />
                          Mark Reviewed
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
}
