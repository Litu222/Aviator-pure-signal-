/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plane, 
  TrendingUp, 
  History, 
  Settings, 
  ShieldCheck, 
  Zap, 
  Globe, 
  Bell,
  ChevronRight,
  Activity,
  Cpu,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

type Platform = '1xbet' | 'melbet';

interface Signal {
  id: string;
  multiplier: number;
  timestamp: Date;
  accuracy: number;
}

export default function App() {
  const [platform, setPlatform] = useState<Platform>('1xbet');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentSignal, setCurrentSignal] = useState<Signal | null>(null);
  const [history, setHistory] = useState<Signal[]>([]);
  const [countdown, setCountdown] = useState(0);
  const [progress, setProgress] = useState(0);

  // Generate a mock signal
  const generateSignal = useCallback(() => {
    setIsAnalyzing(true);
    setProgress(0);
    
    // Simulate analysis progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    setTimeout(() => {
      const newSignal: Signal = {
        id: Math.random().toString(36).substr(2, 9),
        multiplier: Number((Math.random() * (5.5 - 1.2) + 1.2).toFixed(2)),
        timestamp: new Date(),
        accuracy: Math.floor(Math.random() * (99 - 85) + 85)
      };
      
      setCurrentSignal(newSignal);
      setHistory(prev => [newSignal, ...prev].slice(0, 10));
      setIsAnalyzing(false);
      setCountdown(30); // 30 seconds cooldown
    }, 3000);
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [countdown]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-aviator-red/30">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-slate-800 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-aviator-red rounded-xl flex items-center justify-center glow-red">
              <Plane className="text-white w-6 h-6 -rotate-45" />
            </div>
            <div>
              <h1 className="font-bold text-xl tracking-tight">AVIATOR <span className="text-aviator-red">SIGNAL</span></h1>
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Connect Pro v4.2</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-full text-xs font-medium">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              SERVER ONLINE
            </div>
            <button className="p-2 hover:bg-slate-900 rounded-full transition-colors relative">
              <Bell className="w-5 h-5 text-slate-400" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-aviator-red rounded-full" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar - Controls */}
        <div className="lg:col-span-4 space-y-6">
          <section className="glass-card p-6 space-y-6">
            <div className="flex items-center gap-2 text-aviator-gold">
              <Globe className="w-5 h-5" />
              <h2 className="font-semibold uppercase tracking-wider text-sm">Select Platform</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {(['1xbet', 'melbet'] as Platform[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatform(p)}
                  className={cn(
                    "relative overflow-hidden px-4 py-3 rounded-xl border transition-all duration-300 flex flex-col items-center gap-2",
                    platform === p 
                      ? "bg-aviator-red/10 border-aviator-red text-white glow-red" 
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                  )}
                >
                  <span className="text-sm font-bold uppercase tracking-widest">{p}</span>
                  {platform === p && (
                    <motion.div 
                      layoutId="active-platform"
                      className="absolute inset-0 bg-aviator-red/5"
                    />
                  )}
                </button>
              ))}
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                <span>ENCRYPTION</span>
                <span className="text-green-500 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> AES-256
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                <span>LATENCY</span>
                <span className="text-aviator-gold">14ms</span>
              </div>
            </div>
          </section>

          <section className="glass-card p-6 space-y-4">
            <div className="flex items-center gap-2 text-aviator-red">
              <ShieldCheck className="w-5 h-5" />
              <h2 className="font-semibold uppercase tracking-wider text-sm">Security Status</h2>
            </div>
            <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                </div>
                <div>
                  <p className="text-xs font-bold">Anti-Ban Active</p>
                  <p className="text-[10px] text-slate-500">Proxy rotation enabled</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-blue-500" />
                </div>
                <div>
                  <p className="text-xs font-bold">Fast Connect</p>
                  <p className="text-[10px] text-slate-500">Direct API integration</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Center - Main Signal Display */}
        <div className="lg:col-span-8 space-y-8">
          <section className="glass-card p-8 relative overflow-hidden min-h-[400px] flex flex-col items-center justify-center">
            {/* Background Decoration */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-aviator-red rounded-full blur-[120px]" />
            </div>

            <AnimatePresence mode="wait">
              {isAnalyzing ? (
                <motion.div 
                  key="analyzing"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  className="text-center space-y-8 z-10"
                >
                  <div className="relative">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-32 h-32 border-4 border-aviator-red/20 border-t-aviator-red rounded-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Cpu className="w-10 h-10 text-aviator-red animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold tracking-tight">ANALYZING ALGORITHM</h3>
                    <div className="w-64 h-2 bg-slate-800 rounded-full overflow-hidden mx-auto">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-aviator-red glow-red"
                      />
                    </div>
                    <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">Scanning {platform} hash patterns...</p>
                  </div>
                </motion.div>
              ) : currentSignal ? (
                <motion.div 
                  key="signal"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center space-y-8 z-10"
                >
                  <div className="space-y-1">
                    <p className="text-xs font-mono text-aviator-gold uppercase tracking-[0.3em]">Predicted Multiplier</p>
                    <motion.h2 
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      className="text-8xl font-black text-white tracking-tighter drop-shadow-2xl"
                    >
                      {currentSignal.multiplier}x
                    </motion.h2>
                  </div>

                  <div className="flex items-center justify-center gap-8">
                    <div className="text-center">
                      <p className="text-[10px] text-slate-500 uppercase font-mono mb-1">Accuracy</p>
                      <p className="text-xl font-bold text-green-500">{currentSignal.accuracy}%</p>
                    </div>
                    <div className="w-px h-10 bg-slate-800" />
                    <div className="text-center">
                      <p className="text-[10px] text-slate-500 uppercase font-mono mb-1">Status</p>
                      <p className="text-xl font-bold text-aviator-red">CONFIRMED</p>
                    </div>
                  </div>

                  <button 
                    disabled={countdown > 0}
                    onClick={generateSignal}
                    className={cn(
                      "group relative px-12 py-4 rounded-2xl font-bold text-lg transition-all duration-300",
                      countdown > 0 
                        ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
                        : "bg-aviator-red text-white hover:scale-105 active:scale-95 glow-red"
                    )}
                  >
                    {countdown > 0 ? `NEXT SIGNAL IN ${countdown}s` : "GET NEW SIGNAL"}
                  </button>
                </motion.div>
              ) : (
                <motion.div 
                  key="initial"
                  className="text-center space-y-8 z-10"
                >
                  <div className="w-24 h-24 bg-slate-900 rounded-3xl border border-slate-800 flex items-center justify-center mx-auto">
                    <Activity className="w-12 h-12 text-slate-700" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">READY TO CONNECT</h3>
                    <p className="text-slate-500 max-w-xs mx-auto text-sm">Our AI algorithm is synchronized with {platform} servers. Click below to start prediction.</p>
                  </div>
                  <button 
                    onClick={generateSignal}
                    className="bg-aviator-red text-white px-12 py-4 rounded-2xl font-bold text-lg hover:scale-105 active:scale-95 transition-all glow-red"
                  >
                    CONNECT & START
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* History Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-400">
                <History className="w-5 h-5" />
                <h2 className="font-semibold uppercase tracking-wider text-sm">Recent Signals</h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-aviator-red rounded-full animate-ping" />
                <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Live Feed</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {history.length > 0 ? (
                history.map((sig, idx) => (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={sig.id}
                    className="glass-card p-4 text-center space-y-1 relative group overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-aviator-red/20 group-hover:bg-aviator-red transition-colors" />
                    <p className="text-lg font-black text-white">{sig.multiplier}x</p>
                    <p className="text-[10px] font-mono text-slate-500">{sig.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </motion.div>
                ))
              ) : (
                Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="glass-card p-4 border-dashed border-slate-800 flex items-center justify-center opacity-30">
                    <span className="text-xs font-mono">WAITING...</span>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Footer / Disclaimer */}
      <footer className="max-w-7xl mx-auto px-4 py-12 border-t border-slate-900 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Plane className="text-aviator-red w-5 h-5 -rotate-45" />
              <span className="font-bold tracking-tight">AVIATOR SIGNAL</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Advanced predictive analytics for crash-style games. Our system uses historical data patterns to provide high-probability exit points.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Quick Links</h4>
            <ul className="text-xs text-slate-500 space-y-2">
              <li className="hover:text-aviator-red cursor-pointer transition-colors flex items-center gap-1">
                <ChevronRight className="w-3 h-3" /> How it works
              </li>
              <li className="hover:text-aviator-red cursor-pointer transition-colors flex items-center gap-1">
                <ChevronRight className="w-3 h-3" /> API Documentation
              </li>
              <li className="hover:text-aviator-red cursor-pointer transition-colors flex items-center gap-1">
                <ChevronRight className="w-3 h-3" /> Support Center
              </li>
            </ul>
          </div>

          <div className="space-y-4 bg-slate-900/30 p-4 rounded-xl border border-slate-800">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-aviator-gold">Disclaimer</h4>
            <p className="text-[10px] text-slate-500 leading-relaxed italic">
              This application is for educational and entertainment purposes only. Gambling involves significant risk. Signals are based on probability models and do not guarantee success. Play responsibly.
            </p>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-900 flex flex-col md:row items-center justify-between gap-4">
          <p className="text-[10px] font-mono text-slate-600">© 2026 AVIATOR SIGNAL CONNECT. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-6">
            <TrendingUp className="w-4 h-4 text-slate-700" />
            <Settings className="w-4 h-4 text-slate-700" />
            <ShieldCheck className="w-4 h-4 text-slate-700" />
          </div>
        </div>
      </footer>
    </div>
  );
}
