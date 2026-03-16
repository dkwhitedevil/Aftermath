'use client';

import Link from 'next/link';
import { 
  ArrowRight, Activity, Play, ShieldAlert, TrendingDown, 
  ArrowDownRight, ArrowUpRight, Database, Globe, Layers, 
  Crosshair, Network, Lock, AlertTriangle, Clock, MapPin,
  BarChart3, Zap, Radio, Cpu, Siren, MonitorSmartphone, LayoutDashboard, History, Users
} from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { useStore } from '@/lib/store';
import AuthModal from '@/components/AuthModal';

const mockChartData = [
  { value: 25 }, { value: 24 }, { value: 22 }, { value: 20 }, 
  { value: 18 }, { value: 15 }, { value: 14 }, { value: 10 }, { value: 8 }
];

export default function LandingPage() {
  const [foodValue, setFoodValue] = useState(20);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { role } = useStore();

  const handleLaunchDashboard = () => {
    if (role) {
      // User is already logged in, redirect to dashboard
      window.location.href = '/dashboard';
    } else {
      // User not logged in, open auth modal
      setIsAuthModalOpen(true);
    }
  };

  useEffect(() => {
    const sequence = [20, 18, 14, 8];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % sequence.length;
      setFoodValue(sequence[i]);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 font-sans selection:bg-blue-500/30 overflow-x-hidden">
      
      {/* Navigation */}
      <nav className="border-b border-slate-800/60 bg-[#0a0f1c]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-6 h-6 text-blue-500" />
            <span className="text-lg font-bold text-white tracking-widest">AFTERMATH</span>
          </div>
          
          <button 
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-slate-800/50 border border-transparent hover:border-slate-700"
          >
            <Lock className="w-4 h-4" />
            Login
          </button>
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-screen flex items-center pt-20 pb-12 lg:py-0">
        {/* Cinematic Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-20" />
          <div className="absolute top-0 left-1/4 w-[1000px] h-[600px] bg-blue-900/20 rounded-full blur-[120px] opacity-40 mix-blend-screen pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[800px] h-[600px] bg-red-900/10 rounded-full blur-[120px] opacity-30 mix-blend-screen pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020617]/80 to-[#020617] pointer-events-none" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Side: Product Messaging */}
            <div className="max-w-2xl">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-medium text-slate-400 mb-8 tracking-widest uppercase backdrop-blur-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  Inventory shows what exists. Change reveals what is about to fail.
                </div>
                
                <h1 className="text-5xl lg:text-7xl font-bold text-white tracking-tighter mb-6 leading-[1.1]">
                  AFTERMATH
                </h1>
                
                <h2 className="text-2xl lg:text-3xl text-slate-300 mb-6 font-light tracking-tight leading-snug">
                  Track what changed before shortages become failures.
                </h2>
                
                <p className="text-lg text-slate-400 mb-10 leading-relaxed max-w-xl">
                  AFTERMATH transforms disaster resource updates into operational intelligence by detecting hidden decline before collapse becomes visible.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
                  <button 
                    onClick={handleLaunchDashboard}
                    className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_-5px_rgba(37,99,235,0.4)] hover:shadow-[0_0_40px_-5px_rgba(37,99,235,0.6)]"
                  >
                    Launch Dashboard <ArrowRight className="w-5 h-5" />
                  </button>
                  <Link href="/dashboard/simulation" className="w-full sm:w-auto px-8 py-4 bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-800 rounded-lg font-medium transition-all flex items-center justify-center gap-2 backdrop-blur-sm">
                    <Play className="w-4 h-4" /> Watch Simulation
                  </Link>
                </div>
                
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-slate-600" />
                  Built for crisis intelligence, resource monitoring, and early response systems.
                </p>
              </motion.div>
            </div>

            {/* Right Side: Premium Dashboard Preview */}
            <motion.div 
              initial={{ opacity: 0, x: 40, rotateY: -10 }}
              animate={{ opacity: 1, x: 0, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="relative perspective-[2000px] hidden md:block"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-transparent blur-2xl -z-10 rounded-3xl" />
              
              <div className="bg-[#0a0f1c]/90 backdrop-blur-xl border border-slate-800/60 rounded-2xl shadow-2xl overflow-hidden flex flex-col transform-gpu rotate-y-[-5deg] rotate-x-[2deg] scale-[0.95] hover:scale-100 hover:rotate-y-0 hover:rotate-x-0 transition-all duration-700 ease-out">
                
                {/* Dashboard Header */}
                <div className="h-12 border-b border-slate-800/60 flex items-center px-4 gap-2 bg-[#050814]/50">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-slate-800" />
                    <div className="w-3 h-3 rounded-full bg-slate-800" />
                    <div className="w-3 h-3 rounded-full bg-slate-800" />
                  </div>
                  <div className="mx-auto px-4 py-1 rounded-md bg-slate-900/50 border border-slate-800/50 text-[10px] text-slate-500 font-mono flex items-center gap-2">
                    <Activity className="w-3 h-3 text-blue-500" /> AFTERMATH / LIVE OPS
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* KPI Row */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Food Kits */}
                    <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-4 relative overflow-hidden group">
                      <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-slate-400 text-xs font-medium uppercase tracking-wider">Food Kits</h3>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 font-bold uppercase tracking-wider">Critical Drop</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-600 line-through text-sm">20</span>
                        <motion.span 
                          key={foodValue}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-2xl font-bold text-white flex items-center gap-1"
                        >
                          {foodValue} <ArrowDownRight className="w-4 h-4 text-red-500" />
                        </motion.span>
                      </div>
                    </div>

                    {/* Water */}
                    <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-slate-400 text-xs font-medium uppercase tracking-wider">Water</h3>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold uppercase tracking-wider">Warning</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-600 line-through text-sm">500L</span>
                        <span className="text-2xl font-bold text-white flex items-center gap-1">
                          320L <ArrowDownRight className="w-4 h-4 text-amber-500" />
                        </span>
                      </div>
                    </div>

                    {/* Medicine */}
                    <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-slate-400 text-xs font-medium uppercase tracking-wider">Medicine</h3>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold uppercase tracking-wider">Stable Decline</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-600 line-through text-sm">120</span>
                        <span className="text-2xl font-bold text-white flex items-center gap-1">
                          90 <ArrowDownRight className="w-4 h-4 text-blue-500" />
                        </span>
                      </div>
                    </div>

                    {/* Shelter */}
                    <div className="bg-slate-900/50 border border-slate-800/50 rounded-xl p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-slate-400 text-xs font-medium uppercase tracking-wider">Shelter</h3>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 font-bold uppercase tracking-wider">Critical Pressure</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-slate-600 line-through text-sm">70%</span>
                        <span className="text-2xl font-bold text-white flex items-center gap-1">
                          92% <ArrowUpRight className="w-4 h-4 text-red-500" />
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {/* Center Chart */}
                    <div className="col-span-2 bg-slate-900/50 border border-slate-800/50 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider">Resource Decline Trend</h3>
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      </div>
                      <div className="h-24 w-full opacity-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={mockChartData}>
                            <Line 
                              type="monotone" 
                              dataKey="value" 
                              stroke="#ef4444" 
                              strokeWidth={2} 
                              dot={false}
                              isAnimationActive={true}
                              animationDuration={2000}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Right Alert Panel */}
                    <div className="col-span-1 bg-slate-900/50 border border-slate-800/50 rounded-xl p-4 flex flex-col gap-2">
                      <h3 className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Active Alerts</h3>
                      
                      <motion.div 
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="bg-red-500/10 border border-red-500/20 rounded p-2"
                      >
                        <p className="text-[10px] text-red-200 font-medium leading-tight">Water likely exhausted in 3 hours</p>
                      </motion.div>
                      
                      <div className="bg-red-500/5 border border-red-500/10 rounded p-2">
                        <p className="text-[10px] text-red-200/70 font-medium leading-tight">Food depletion accelerating</p>
                      </div>
                      
                      <div className="bg-amber-500/5 border border-amber-500/10 rounded p-2">
                        <p className="text-[10px] text-amber-200/70 font-medium leading-tight">Shelter nearing overload</p>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Location Cards */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-slate-900/50 border border-slate-800/50 rounded-lg p-3 flex items-center justify-between">
                      <span className="text-xs text-slate-300 font-medium">Camp A</span>
                      <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800/50 rounded-lg p-3 flex items-center justify-between">
                      <span className="text-xs text-slate-300 font-medium">Camp B</span>
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800/50 rounded-lg p-3 flex items-center justify-between">
                      <span className="text-xs text-slate-300 font-medium">Camp C</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>
                  </div>

                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ================= PROBLEM SECTION ================= */}
      <section className="py-32 border-t border-slate-800/50 bg-[#050814] relative">
        <div className="container mx-auto px-6 max-w-6xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-sm font-bold text-red-500 tracking-widest uppercase mb-4">The Invisible Failure</h2>
            <h3 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Disaster systems fail gradually.</h3>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto font-light leading-relaxed">
              Most disaster operations depend on static spreadsheets and scattered updates. They show what resources exist, but they fail to highlight what is changing, how fast it changed, and where danger is emerging.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <TrendingDown className="w-8 h-8 text-amber-500" />,
                title: "Silent Depletion",
                desc: "Food and water supplies drop gradually, but no system highlights the urgency of the trend. The pattern is missed until it's too late."
              },
              {
                icon: <Clock className="w-8 h-8 text-red-500" />,
                title: "Delayed Escalation",
                desc: "By the time a shortage is noticed and reported up the chain of command, the critical point has already passed."
              },
              {
                icon: <MapPin className="w-8 h-8 text-blue-500" />,
                title: "Multi-Location Blindness",
                desc: "Camp A may be collapsing while Camp B has a surplus, but disconnected dashboards prevent rapid cross-camp transfers."
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-[#0a0f1c] p-8 rounded-2xl border border-slate-800/60 hover:border-slate-700 transition-colors"
              >
                <div className="w-14 h-14 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h4 className="text-xl font-bold text-white mb-3">{item.title}</h4>
                <p className="text-slate-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SOLUTION SECTION ================= */}
      <section className="py-32 border-t border-slate-800/50 bg-[#020617] relative overflow-hidden">
        <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-sm font-bold text-blue-500 tracking-widest uppercase mb-4">Operational Change Visibility</h2>
              <h3 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">Delta Intelligence.</h3>
              <p className="text-lg text-slate-400 mb-8 leading-relaxed">
                AFTERMATH does not attempt to replace large disaster systems. Instead, it focuses on one powerful missing layer: <strong className="text-white font-medium">operational change visibility</strong>.
              </p>
              
              <ul className="space-y-6">
                {[
                  "Previous state vs. Current state",
                  "Change magnitude & acceleration",
                  "Urgency level classification",
                  "Time distance between updates",
                  "Trust source & accountability"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-4 text-slate-300">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <Crosshair className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="text-lg">{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-[#0a0f1c] border border-slate-800/60 rounded-2xl p-8 shadow-2xl relative"
            >
              <div className="absolute -top-4 -right-4 bg-red-500 text-white text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                <Zap className="w-4 h-4" /> Intelligence Engine Active
              </div>
              
              <h4 className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-6 border-b border-slate-800 pb-4">Traditional vs AFTERMATH</h4>
              
              <div className="space-y-8">
                <div>
                  <p className="text-slate-500 text-sm mb-2">Traditional System Output:</p>
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 font-mono text-sm text-slate-300">
                    {`{ "resource": "Food", "qty": 8, "time": "14:00" }`}
                  </div>
                </div>
                
                <div>
                  <p className="text-blue-400 text-sm mb-2 font-medium">AFTERMATH Intelligence Output:</p>
                  <div className="bg-blue-950/30 border border-blue-900/50 rounded-lg p-4 font-mono text-sm text-blue-200">
                    <span className="text-blue-400">WARNING:</span> Critical Depletion Detected<br/>
                    <span className="text-slate-400">Delta:</span> 20 → 8 (-60% drop)<br/>
                    <span className="text-slate-400">Velocity:</span> Accelerating<br/>
                    <span className="text-slate-400">Forecast:</span> Exhaustion in 2h 15m<br/>
                    <span className="text-slate-400">Action:</span> Reroute Camp B surplus
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS SECTION ================= */}
      <section className="py-32 border-t border-slate-800/50 bg-[#020617] relative">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-24">
            <h2 className="text-sm font-bold text-amber-500 tracking-widest uppercase mb-4">The Pipeline</h2>
            <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tight">How AFTERMATH processes chaos.</h3>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connecting line for desktop */}
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-slate-800 via-blue-900/50 to-slate-800 z-0" />
            
            {[
              { 
                step: "01", 
                title: "Field Ingestion", 
                desc: "Volunteers and sensors submit raw resource counts via low-bandwidth entry points.", 
                icon: <Radio className="w-6 h-6 text-slate-400" /> 
              },
              { 
                step: "02", 
                title: "Delta Calculation", 
                desc: "The engine compares new data against historical baselines to determine velocity and magnitude.", 
                icon: <Cpu className="w-6 h-6 text-blue-400" /> 
              },
              { 
                step: "03", 
                title: "Risk Classification", 
                desc: "Changes are instantly graded: Stable, Warning, or Critical Drop based on depletion rates.", 
                icon: <Siren className="w-6 h-6 text-amber-400" /> 
              },
              { 
                step: "04", 
                title: "Global Distribution", 
                desc: "Alerts hit the command center dashboard for immediate operational response and rerouting.", 
                icon: <MonitorSmartphone className="w-6 h-6 text-emerald-400" /> 
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="relative z-10 flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 rounded-full bg-[#0a0f1c] border-4 border-[#020617] shadow-[0_0_0_1px_rgba(30,41,59,1)] flex items-center justify-center mb-6 relative group hover:border-blue-500/30 transition-colors">
                  <div className="absolute inset-0 bg-blue-500/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                  {item.icon}
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-slate-800 border-2 border-[#020617] flex items-center justify-center text-xs font-bold text-white">
                    {item.step}
                  </div>
                </div>
                <h4 className="text-xl font-bold text-white mb-3">{item.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= CAPABILITIES SECTION ================= */}
      <section className="py-32 border-t border-slate-800/50 bg-[#050814] relative overflow-hidden">
        <div className="absolute left-0 top-1/4 w-[500px] h-[500px] bg-red-900/10 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-sm font-bold text-emerald-500 tracking-widest uppercase mb-4">Command Center</h2>
              <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Everything you need to see the unseen.</h3>
            </div>
            <Link href="/dashboard" className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-2 transition-colors">
              Explore full dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Live Intelligence Feed",
                desc: "A real-time stream of every resource change across all camps, instantly color-coded by severity.",
                icon: <Activity className="w-6 h-6 text-blue-500" />
              },
              {
                title: "Multi-Camp Comparison",
                desc: "View all locations side-by-side to identify which camps have surpluses and which are nearing collapse.",
                icon: <MapPin className="w-6 h-6 text-emerald-500" />
              },
              {
                title: "Automated Alert Engine",
                desc: "Stop manually checking numbers. The engine automatically generates critical alerts when depletion accelerates.",
                icon: <AlertTriangle className="w-6 h-6 text-amber-500" />
              },
              {
                title: "Historical Timeline",
                desc: "Rewind time to see exactly when a resource started failing. Perfect for post-incident analysis.",
                icon: <History className="w-6 h-6 text-purple-500" />
              },
              {
                title: "Volunteer Trust Scoring",
                desc: "Track who is updating what. The system builds trust scores based on update frequency and consistency.",
                icon: <Users className="w-6 h-6 text-indigo-500" />
              },
              {
                title: "Executive KPI Dashboard",
                desc: "A high-level view for directors to instantly understand the global operational status at a glance.",
                icon: <LayoutDashboard className="w-6 h-6 text-red-500" />
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-[#020617] border border-slate-800/60 p-8 rounded-2xl hover:bg-slate-900/50 transition-colors group"
              >
                <div className="w-12 h-12 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{feature.title}</h4>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= ARCHITECTURE SECTION ================= */}
      <section className="py-32 border-t border-slate-800/50 bg-[#050814]">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="text-sm font-bold text-slate-500 tracking-widest uppercase mb-4">Enterprise Grade</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Built for Zero-Trust Environments</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-[#0a0f1c] border border-slate-800/60 p-8 rounded-2xl">
              <Network className="w-8 h-8 text-slate-400 mb-6" />
              <h4 className="text-lg font-bold text-white mb-2">Offline-First Architecture</h4>
              <p className="text-slate-400 text-sm leading-relaxed">Designed for low-network disaster zones. Updates queue locally and sync automatically when connectivity is restored.</p>
            </div>
            <div className="bg-[#0a0f1c] border border-slate-800/60 p-8 rounded-2xl">
              <Database className="w-8 h-8 text-slate-400 mb-6" />
              <h4 className="text-lg font-bold text-white mb-2">Immutable Update Log</h4>
              <p className="text-slate-400 text-sm leading-relaxed">Every change is permanently recorded with timestamp, user ID, and location data to ensure absolute accountability.</p>
            </div>
            <div className="bg-[#0a0f1c] border border-slate-800/60 p-8 rounded-2xl">
              <Lock className="w-8 h-8 text-slate-400 mb-6" />
              <h4 className="text-lg font-bold text-white mb-2">Confidence Engine</h4>
              <p className="text-slate-400 text-sm leading-relaxed">Automatically scores update reliability based on volunteer history, source quality, and statistical anomalies.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FUTURE IMPACT SECTION ================= */}
      <section className="py-32 border-y border-slate-800/50 bg-[#020617] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-5" />
        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
            <div className="max-w-xl">
              <h2 className="text-sm font-bold text-emerald-500 tracking-widest uppercase mb-4">Future Expansion</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Beyond Disaster Relief</h3>
            </div>
            <p className="text-slate-400 max-w-md text-lg">
              Because global systems still lack lightweight delta intelligence, AFTERMATH is built to scale across critical infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Hospitals & Triage', 'Refugee Camps', 'Food Systems', 'Global Aid Logistics'].map((domain, i) => (
              <div key={i} className="bg-[#0a0f1c] border border-slate-800/60 p-6 rounded-xl text-center hover:bg-slate-900 transition-colors">
                <Globe className="w-6 h-6 text-slate-500 mx-auto mb-4" />
                <h4 className="text-white font-medium">{domain}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= FOOTER CTA ================= */}
      <footer className="py-24 bg-[#050814] text-center">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-white mb-8 tracking-tight">Ready to deploy operational intelligence?</h2>
          <Link href="/dashboard" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black hover:bg-slate-200 rounded-lg font-bold transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">
            Launch AFTERMATH Dashboard <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-slate-600 mt-12 text-sm font-mono">
            AFTERMATH &copy; {new Date().getFullYear()} &bull; Change Intelligence Platform
          </p>
        </div>
      </footer>

    </div>
  );
}
