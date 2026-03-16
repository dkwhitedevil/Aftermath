"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward,
  AlertTriangle,
  AlertOctagon,
  Info,
  ShieldCheck,
  TrendingDown,
  TrendingUp,
  ChevronDown,
  Plus,
  Clock,
  MapPin,
  Zap
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceDot
} from 'recharts';

// --- SIMULATION DATA ---

const scenarios = [
  'Camp Overload',
  'Flood Response',
  'Cyclone Relief',
  'Supply Delay'
];

const simulationSteps = [
  { time: '9:00 AM', Food: 20, Water: 500, Medicines: 120, Shelter: 70 },
  { time: '10:00 AM', Food: 19, Water: 480, Medicines: 115, Shelter: 74 },
  { time: '11:00 AM', Food: 18, Water: 460, Medicines: 110, Shelter: 78 }, // Food Warning
  { time: '12:00 PM', Food: 16, Water: 425, Medicines: 105, Shelter: 81 },
  { time: '1:00 PM', Food: 14, Water: 390, Medicines: 100, Shelter: 85 }, // Water Warning
  { time: '1:30 PM', Food: 11, Water: 355, Medicines: 95, Shelter: 88 }, // Food accelerating
  { time: '2:00 PM', Food: 8, Water: 320, Medicines: 90, Shelter: 92 }, // Food Critical, Shelter Critical
  { time: '2:20 PM', Food: 5, Water: 290, Medicines: 85, Shelter: 95 }, // Camp Critical
];

const alertsSequence = [
  { step: 2, text: 'Food entered warning threshold', severity: 'warning' },
  { step: 4, text: 'Water reserve instability detected', severity: 'warning' },
  { step: 5, text: 'Food depletion accelerating', severity: 'critical' },
  { step: 6, text: 'Shelter nearing overload', severity: 'critical' },
  { step: 7, text: 'Camp A entering critical operational risk', severity: 'critical' },
];

const timelineSequence = [
  { step: 0, time: '9:00 AM', text: 'Food stable', status: 'stable' },
  { step: 2, time: '11:00 AM', text: 'Food warning', status: 'warning' },
  { step: 4, time: '1:00 PM', text: 'Water decline accelerated', status: 'warning' },
  { step: 6, time: '2:00 PM', text: 'Food critical', status: 'critical' },
  { step: 7, time: '2:20 PM', text: 'Shelter pressure critical', status: 'critical' },
];

// --- HELPERS ---

const getSeverity = (resource: string, value: number) => {
  if (resource === 'Food') {
    if (value >= 19) return 'stable';
    if (value >= 14) return 'warning';
    return 'critical';
  }
  if (resource === 'Water') {
    if (value >= 460) return 'stable';
    if (value >= 390) return 'warning';
    return 'critical';
  }
  if (resource === 'Medicines') {
    return 'stable'; // Stable decline
  }
  if (resource === 'Shelter') {
    if (value <= 78) return 'stable';
    if (value <= 85) return 'warning';
    return 'critical';
  }
  return 'stable';
};

const getSeverityStyles = (severity: string) => {
  switch (severity) {
    case 'critical': return { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', glow: 'bg-red-500/10', icon: AlertOctagon };
    case 'warning': return { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', glow: 'bg-amber-500/10', icon: AlertTriangle };
    case 'recovering': return { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', glow: 'bg-emerald-500/10', icon: ShieldCheck };
    default: return { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', glow: 'bg-blue-500/10', icon: Info };
  }
};

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

export default function SimulationCenter() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<1 | 2 | 4>(1);
  const [currentStep, setCurrentStep] = useState(0);
  const [scenario, setScenario] = useState(scenarios[0]);
  const [showScenarioMenu, setShowScenarioMenu] = useState(false);

  // Simulation Loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentStep < simulationSteps.length - 1) {
      const delay = 2000 / speed; // 2s at 1x, 1s at 2x, 0.5s at 4x
      interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= simulationSteps.length - 2) {
            setIsPlaying(false); // Auto-pause at the end
            return simulationSteps.length - 1;
          }
          return prev + 1;
        });
      }, delay);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed, currentStep]);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const currentData = simulationSteps[currentStep];
  
  // Prepare chart data: fill future steps with null to keep X-axis stable
  const chartData = simulationSteps.map((step, index) => {
    if (index <= currentStep) return step;
    return { time: step.time }; // Only time, no values
  });

  const visibleAlerts = alertsSequence.filter(a => a.step <= currentStep).reverse();
  const visibleTimeline = timelineSequence.filter(t => t.step <= currentStep).reverse();

  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 font-sans selection:bg-blue-500/30 flex flex-col">
      
      {/* Navigation */}
      
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-6 lg:px-8 py-8 space-y-8">
        
        {/* TOP SECTION — Simulation Control Bar */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-[#0a0f1c] border border-slate-800/60 rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-slate-800/50">
            <motion.div 
              className="h-full bg-blue-500"
              initial={{ width: '0%' }}
              animate={{ width: `${(currentStep / (simulationSteps.length - 1)) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          <div>
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-5 h-5 text-blue-400" />
              <h1 className="text-2xl font-bold text-white tracking-tight">Live Resource Simulation</h1>
            </div>
            <p className="text-sm text-slate-400 font-medium">Observe how small resource changes trigger operational intelligence.</p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Scenario Selector */}
            <div className="relative">
              <button 
                onClick={() => setShowScenarioMenu(!showScenarioMenu)}
                className="flex items-center gap-2 bg-[#030712] border border-slate-700 hover:border-slate-500 text-slate-300 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
              >
                {scenario}
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </button>
              <AnimatePresence>
                {showScenarioMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 mt-2 w-48 bg-[#0a0f1c] border border-slate-700 rounded-lg shadow-xl overflow-hidden z-50"
                  >
                    {scenarios.map(s => (
                      <button
                        key={s}
                        onClick={() => { setScenario(s); setShowScenarioMenu(false); handleReset(); }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${scenario === s ? 'bg-blue-500/10 text-blue-400' : 'text-slate-300 hover:bg-slate-800'}`}
                      >
                        {s}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="h-8 w-px bg-slate-800 hidden md:block" />

            {/* Controls */}
            <div className="flex items-center gap-2 bg-[#030712] border border-slate-800 rounded-lg p-1">
              <button 
                onClick={() => setIsPlaying(!isPlaying)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-bold transition-colors ${isPlaying ? 'bg-amber-500/20 text-amber-400' : 'bg-blue-600 text-white hover:bg-blue-500'}`}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? 'Pause' : 'Start'}
              </button>
              <button 
                onClick={handleReset}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                title="Reset Simulation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Speed Selector */}
            <div className="flex items-center bg-[#030712] border border-slate-800 rounded-lg p-1">
              <FastForward className="w-4 h-4 text-slate-500 ml-2 mr-1" />
              {[1, 2, 4].map(s => (
                <button
                  key={s}
                  onClick={() => setSpeed(s as 1|2|4)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${speed === s ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* MIDDLE SECTION — Live Resource Intelligence */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { key: 'Food', label: 'Food Kits', unit: '', icon: TrendingDown },
            { key: 'Water', label: 'Water Supply', unit: 'L', icon: TrendingDown },
            { key: 'Medicines', label: 'Medicines', unit: '', icon: TrendingDown },
            { key: 'Shelter', label: 'Shelter Capacity', unit: '%', icon: TrendingUp },
          ].map((res) => {
            const val = currentData[res.key as keyof typeof currentData] as number;
            const severity = getSeverity(res.key, val);
            const styles = getSeverityStyles(severity);
            const Icon = styles.icon;

            return (
              <motion.div 
                key={res.key}
                layout
                className={`bg-[#0a0f1c] border ${styles.border} rounded-xl p-5 relative overflow-hidden transition-colors duration-500`}
              >
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 transition-colors duration-1000 ${styles.glow}`} />
                
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">{res.label}</h3>
                  <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border transition-colors duration-500 ${styles.bg} ${styles.border} ${styles.color}`}>
                    {severity}
                  </div>
                </div>

                <div className="flex items-end justify-between relative z-10">
                  <div className="flex items-baseline gap-1">
                    <motion.span 
                      key={val}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-4xl font-bold text-white"
                    >
                      {val}
                    </motion.span>
                    <span className="text-lg font-medium text-slate-500">{res.unit}</span>
                  </div>
                  <Icon className={`w-6 h-6 opacity-50 ${styles.color}`} />
                </div>
              </motion.div>
            );
          })}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* CENTER — Live Trend Chart & Bottom Timeline */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Chart Panel */}
            <section className="bg-[#0a0f1c] border border-slate-800/60 rounded-2xl p-6 relative overflow-hidden h-[450px] flex flex-col">
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">Simulated Resource Change</h2>
                  <p className="text-sm text-slate-400">Live forecasting of resource depletion and pressure.</p>
                </div>
                <div className="flex items-center gap-2 bg-slate-900/50 px-3 py-1.5 rounded-md border border-slate-800">
                  <Clock className="w-4 h-4 text-slate-500" />
                  <span className="text-sm font-mono text-slate-300">{currentData.time}</span>
                </div>
              </div>

              <div className="flex-1 w-full relative z-10">
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
                    
                    <Line type="monotone" dataKey="Food" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, fill: '#0a0f1c', strokeWidth: 2 }} isAnimationActive={false} />
                    <Line type="monotone" dataKey="Water" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#0a0f1c', strokeWidth: 2 }} isAnimationActive={false} />
                    <Line type="monotone" dataKey="Medicines" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#0a0f1c', strokeWidth: 2 }} isAnimationActive={false} />
                    <Line type="monotone" dataKey="Shelter" stroke="#f97316" strokeWidth={3} dot={{ r: 4, fill: '#0a0f1c', strokeWidth: 2 }} isAnimationActive={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </section>

            {/* Bottom Section — Event Playback Timeline */}
            <section>
              <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Event Playback Timeline</h2>
              <div className="bg-[#0a0f1c] border border-slate-800/60 rounded-xl p-6 overflow-x-auto">
                <div className="flex items-center min-w-max">
                  {timelineSequence.map((event, idx) => {
                    const isVisible = event.step <= currentStep;
                    const isCurrent = event.step === currentStep;
                    const styles = getSeverityStyles(event.status);
                    
                    return (
                      <div key={idx} className="flex items-center">
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: isVisible ? 1 : 0.2, scale: isCurrent ? 1.1 : 1 }}
                          className="flex flex-col items-center relative"
                        >
                          <div className="text-xs font-mono text-slate-500 mb-2">{event.time}</div>
                          <div className={`w-4 h-4 rounded-full border-2 z-10 transition-colors duration-500 ${
                            isVisible ? `${styles.bg} ${styles.border} ${styles.color}` : 'bg-slate-900 border-slate-700'
                          }`}>
                            {isCurrent && <div className={`absolute inset-0 rounded-full animate-ping opacity-50 ${styles.bg}`} />}
                          </div>
                          <div className={`mt-3 text-xs font-medium w-24 text-center transition-colors duration-500 ${
                            isVisible ? 'text-slate-300' : 'text-slate-600'
                          }`}>
                            {event.text}
                          </div>
                        </motion.div>
                        
                        {idx < timelineSequence.length - 1 && (
                          <div className="w-16 h-px bg-slate-800 mx-2 -mt-6 relative">
                            <motion.div 
                              className="absolute top-0 left-0 h-full bg-blue-500/50"
                              initial={{ width: '0%' }}
                              animate={{ width: currentStep >= timelineSequence[idx+1].step ? '100%' : '0%' }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

          </div>

          {/* RIGHT SIDE — Real-Time Alert Generation & Intelligence Summary */}
          <div className="lg:col-span-1 space-y-6">
            
            <section className="bg-[#0a0f1c] border border-slate-800/60 rounded-2xl flex flex-col h-[450px]">
              <div className="p-5 border-b border-slate-800/60 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Live Alerts</h2>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-red-500 animate-pulse' : 'bg-slate-600'}`} />
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
                    {isPlaying ? 'Receiving' : 'Standby'}
                  </span>
                </div>
              </div>
              
              <div className="flex-1 p-5 overflow-y-auto space-y-3">
                <AnimatePresence initial={false}>
                  {visibleAlerts.length === 0 ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="h-full flex flex-col items-center justify-center text-center text-slate-500 space-y-3"
                    >
                      <Activity className="w-8 h-8 opacity-20" />
                      <p className="text-sm">Awaiting critical deviations...</p>
                    </motion.div>
                  ) : (
                    visibleAlerts.map((alert, idx) => {
                      const isCritical = alert.severity === 'critical';
                      const styles = getSeverityStyles(alert.severity);
                      const Icon = styles.icon;
                      
                      return (
                        <motion.div
                          key={`${alert.step}-${idx}`}
                          initial={{ opacity: 0, x: 20, scale: 0.95 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          className={`p-4 rounded-xl border relative overflow-hidden ${styles.bg} ${styles.border}`}
                        >
                          {isCritical && (
                            <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
                          )}
                          <div className="flex items-start gap-3">
                            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${styles.color} ${isCritical ? 'animate-pulse' : ''}`} />
                            <div>
                              <p className={`text-sm font-bold mb-1 ${isCritical ? 'text-white' : 'text-slate-200'}`}>
                                {alert.text}
                              </p>
                              <p className="text-xs text-slate-400 font-mono">
                                Detected at {simulationSteps[alert.step].time}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </AnimatePresence>
              </div>
            </section>

            {/* Intelligence Summary */}
            <section className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
              <div className="flex items-start gap-3 relative z-10">
                <div className="p-2 bg-blue-500/20 rounded-lg shrink-0">
                  <Activity className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Generated Insight</h3>
                  <p className="text-sm font-medium text-slate-300 leading-relaxed mb-4">
                    This simulation shows how normal updates gradually become critical operational risk. 
                    <span className="text-white font-bold ml-1">Small changes become visible risk.</span>
                  </p>
                  <Link href="/dashboard" className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-colors">
                    <Zap className="w-4 h-4" />
                    Apply Simulation to Dashboard
                  </Link>
                </div>
              </div>
            </section>

          </div>

        </div>
      </main>
    </div>
  );
}
