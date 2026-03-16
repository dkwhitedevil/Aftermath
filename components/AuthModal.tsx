"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  User, 
  Activity, 
  MapPin, 
  ChevronRight,
  X,
  Lock
} from 'lucide-react';
import { useStore, Role } from '@/lib/store';
import { useRouter } from 'next/navigation';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [step, setStep] = useState<'role' | 'coordinator' | 'volunteer'>('role');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [volId, setVolId] = useState('');
  const [camp, setCamp] = useState('Camp A');
  
  const { login } = useStore();
  const router = useRouter();

  const handleCoordinatorLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    login('coordinator', email || 'Emergency Coordinator');
    onClose();
    router.push('/dashboard');
  };

  const handleVolunteerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login
    login('volunteer', volId || 'Field Volunteer', camp);
    onClose();
    router.push('/volunteer');
  };

  const resetState = () => {
    setStep('role');
    setEmail('');
    setPassword('');
    setVolId('');
    setCamp('Camp A');
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-[#030712]/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-[#0a0f1c] border border-slate-800/60 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-800/60 flex items-center justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                  <Lock className="w-5 h-5 text-blue-500" />
                  Access AFTERMATH
                </h2>
                <p className="text-sm text-slate-400 mt-1">Select operational access level to continue.</p>
              </div>
              <button 
                onClick={handleClose}
                className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors relative z-10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <AnimatePresence mode="wait">
                {step === 'role' && (
                  <motion.div
                    key="role"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    {/* Coordinator Card */}
                    <button
                      onClick={() => setStep('coordinator')}
                      className="text-left group bg-[#030712] border border-slate-800 hover:border-blue-500/50 rounded-xl p-6 transition-all hover:bg-slate-900 flex flex-col h-full relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl -translate-y-1/2 translate-x-1/3 group-hover:bg-blue-500/10 transition-colors" />
                      
                      <div className="w-12 h-12 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center mb-4">
                        <Activity className="w-6 h-6 text-blue-400" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">Emergency Coordinator</h3>
                      <p className="text-sm text-slate-400 mb-6 flex-1">
                        Full crisis intelligence access. Monitor all camps, alerts, timeline, and simulation.
                      </p>
                      <div className="flex items-center text-sm font-bold text-blue-400 group-hover:text-blue-300 transition-colors">
                        Continue as Coordinator
                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>

                    {/* Volunteer Card */}
                    <button
                      onClick={() => setStep('volunteer')}
                      className="text-left group bg-[#030712] border border-slate-800 hover:border-emerald-500/50 rounded-xl p-6 transition-all hover:bg-slate-900 flex flex-col h-full relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl -translate-y-1/2 translate-x-1/3 group-hover:bg-emerald-500/10 transition-colors" />
                      
                      <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center mb-4">
                        <User className="w-6 h-6 text-emerald-400" />
                      </div>
                      <h3 className="text-lg font-bold text-white mb-2">Field Volunteer</h3>
                      <p className="text-sm text-slate-400 mb-6 flex-1">
                        Submit live resource updates from assigned location. Access local alerts and recent submissions.
                      </p>
                      <div className="flex items-center text-sm font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors">
                        Continue as Volunteer
                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                  </motion.div>
                )}

                {step === 'coordinator' && (
                  <motion.div
                    key="coordinator"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <button 
                      onClick={() => setStep('role')}
                      className="text-sm text-slate-400 hover:text-white flex items-center gap-1 mb-6 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 rotate-180" />
                      Back to roles
                    </button>
                    
                    <form onSubmit={handleCoordinatorLogin} className="space-y-4 max-w-md mx-auto">
                      <div className="flex items-center gap-3 mb-6 justify-center">
                        <div className="w-10 h-10 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center">
                          <Activity className="w-5 h-5 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Coordinator Access</h3>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Email / ID</label>
                        <input 
                          type="text" 
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-[#030712] border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                          placeholder="coordinator@aftermath.org"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Password</label>
                        <input 
                          type="password" 
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full bg-[#030712] border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                          placeholder="••••••••"
                        />
                      </div>
                      <button 
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-bold transition-colors mt-6 shadow-[0_0_15px_rgba(37,99,235,0.2)]"
                      >
                        Enter Command Dashboard
                      </button>
                    </form>
                  </motion.div>
                )}

                {step === 'volunteer' && (
                  <motion.div
                    key="volunteer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <button 
                      onClick={() => setStep('role')}
                      className="text-sm text-slate-400 hover:text-white flex items-center gap-1 mb-6 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4 rotate-180" />
                      Back to roles
                    </button>
                    
                    <form onSubmit={handleVolunteerLogin} className="space-y-4 max-w-md mx-auto">
                      <div className="flex items-center gap-3 mb-6 justify-center">
                        <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-lg flex items-center justify-center">
                          <User className="w-5 h-5 text-emerald-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Field Volunteer Access</h3>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Volunteer ID</label>
                        <input 
                          type="text" 
                          required
                          value={volId}
                          onChange={(e) => setVolId(e.target.value)}
                          className="w-full bg-[#030712] border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                          placeholder="VOL-8492"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Assigned Camp</label>
                        <select 
                          value={camp}
                          onChange={(e) => setCamp(e.target.value)}
                          className="w-full bg-[#030712] border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors appearance-none"
                        >
                          <option value="Camp A">Camp A</option>
                          <option value="Camp B">Camp B</option>
                          <option value="Camp C">Camp C</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Mobile Number (Optional)</label>
                        <input 
                          type="tel" 
                          className="w-full bg-[#030712] border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors"
                          placeholder="+1 (555) 000-0000"
                        />
                      </div>
                      <button 
                        type="submit"
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-lg font-bold transition-colors mt-6 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                      >
                        Enter Field Interface
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
