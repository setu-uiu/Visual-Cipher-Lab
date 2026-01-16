
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  Binary, 
  Lock, 
  Library, 
  Image as ImageIcon, 
  Info, 
  Scale, 
  Terminal,
  ChevronRight,
  Eye,
  EyeOff,
  Cpu,
  LogOut,
  Flower,
  MapPin,
  ShieldCheck,
  Menu,
  X,
  Activity
} from 'lucide-react';

import Home from './pages/Home';
import Simulator from './pages/Simulator';
import Decoder from './pages/Decoder';
import Symbols from './pages/Symbols';
import Concepts from './pages/Concepts';
import Ethics from './pages/Ethics';
import Login from './pages/Login';
import Ceremonial from './pages/Ceremonial';
import GeoInt from './pages/GeoInt';
import { UserRole, AuthState } from './types';

const ProtectedRoute = ({ isAuthenticated, children }: { isAuthenticated: boolean; children?: React.ReactNode }) => {
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

const CommandOverlay = ({ onClose }: { onClose: () => void }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 2;
      });
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center p-8 font-mono animate-fadeIn overflow-hidden">
      <div className="absolute inset-0 pointer-events-none crt-scanline opacity-30" />
      <div className="absolute inset-0 bg-cyan-500/5 mix-blend-overlay" />
      
      <div className="max-w-3xl w-full space-y-12 relative">
        <div className="space-y-4 border-l-2 border-cyan-500 pl-8 py-2">
          <div className="flex items-center gap-4 text-cyan-500 animate-pulse">
            <ShieldCheck className="w-8 h-8" />
            <h2 className="orbitron text-2xl md:text-4xl font-black tracking-[0.3em] uppercase">
              Military Cyber Operations
            </h2>
          </div>
          <p className="text-cyan-900 text-xs tracking-widest uppercase font-bold">
            (Command-Oriented Interface) // STATUS: ACTIVE_NODE
          </p>
        </div>

        <div className="space-y-8 bg-cyan-950/10 border border-cyan-500/20 p-10 rounded shadow-[0_0_50px_rgba(0,245,255,0.05)]">
          <div className="flex items-center gap-4 mb-6">
             <div className="w-12 h-1 bg-cyan-500" />
             <h3 className="orbitron text-cyan-400 text-xl font-bold tracking-[0.5em] animate-pulse uppercase">
               AUTHORIZED ACCESS CONFIRMED
             </h3>
             <div className="w-12 h-1 bg-cyan-500" />
          </div>

          <div className="space-y-6 text-sm md:text-lg leading-relaxed text-cyan-100/80 font-mono tracking-wider">
             <p className="animate-slideInLeft delay-100">
              Engaging hardened cipher stack and restricted transformation protocols.
             </p>
             <p className="animate-slideInLeft delay-300">
              Unauthorized observation will yield indistinguishable noise signatures.
             </p>
             <p className="text-cyan-400 font-bold border-t border-cyan-500/10 pt-6 animate-pulse delay-500">
              Proceed under active counter-analysis conditions.
             </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
          <div className="space-y-2">
             <div className="flex justify-between text-[9px] text-cyan-700 font-bold uppercase tracking-widest">
               <span>ENCRYPTION_STRENGTH</span>
               <span>99.9%</span>
             </div>
             <div className="h-1 bg-cyan-950 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-500" style={{ width: `${Math.min(progress * 2, 100)}%` }} />
             </div>
          </div>
          <div className="space-y-2">
             <div className="flex justify-between text-[9px] text-cyan-700 font-bold uppercase tracking-widest">
               <span>CIPHER_SYNC</span>
               <span>ACTIVE</span>
             </div>
             <div className="h-1 bg-cyan-950 rounded-full overflow-hidden">
                <div className="h-full bg-cyan-400" style={{ width: `${progress}%` }} />
             </div>
          </div>
        </div>

        <div className="flex justify-center pt-8">
          <button 
            onClick={onClose}
            className="px-8 py-3 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all text-xs font-bold orbitron tracking-widest uppercase"
          >
            DISMISS OVERLAY
          </button>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>(() => {
    const saved = localStorage.getItem('vcl_auth');
    return saved ? JSON.parse(saved) : {
      isAuthenticated: false,
      role: UserRole.GUEST,
      identityId: null,
      lastLogin: null
    };
  });

  const [showCommandOverlay, setShowCommandOverlay] = useState(false);

  useEffect(() => {
    localStorage.setItem('vcl_auth', JSON.stringify(auth));
  }, [auth]);

  const login = (role: UserRole, id: string) => {
    setAuth({
      isAuthenticated: true,
      role,
      identityId: id,
      lastLogin: new Date().toISOString()
    });
  };

  const logout = () => {
    setAuth({
      isAuthenticated: false,
      role: UserRole.GUEST,
      identityId: null,
      lastLogin: null
    });
  };

  const toggleRole = () => {
    if (!auth.isAuthenticated) return;
    setAuth(prev => ({
      ...prev,
      role: prev.role === UserRole.OBSERVER ? UserRole.RESEARCHER : UserRole.OBSERVER
    }));
  };

  return (
    <Router>
      <div className="min-h-screen grid-bg relative">
        <Navbar 
          auth={auth} 
          logout={logout} 
          triggerCommand={() => setShowCommandOverlay(true)} 
        />
        
        {showCommandOverlay && <CommandOverlay onClose={() => setShowCommandOverlay(false)} />}

        <main className="pt-20 pb-12 px-4 md:px-8 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login onLogin={login} isAuthenticated={auth.isAuthenticated} />} />
            <Route path="/ceremonial" element={
              <ProtectedRoute isAuthenticated={auth.isAuthenticated}>
                <Ceremonial role={auth.role} />
              </ProtectedRoute>
            } />
            <Route path="/simulator" element={
              <ProtectedRoute isAuthenticated={auth.isAuthenticated}>
                <Simulator role={auth.role} />
              </ProtectedRoute>
            } />
            <Route path="/decoder" element={
              <ProtectedRoute isAuthenticated={auth.isAuthenticated}>
                <Decoder role={auth.role} />
              </ProtectedRoute>
            } />
            <Route path="/geoint" element={
              <ProtectedRoute isAuthenticated={auth.isAuthenticated}>
                <GeoInt role={auth.role} />
              </ProtectedRoute>
            } />
            <Route path="/symbols" element={
              <ProtectedRoute isAuthenticated={auth.isAuthenticated}>
                <Symbols role={auth.role} />
              </ProtectedRoute>
            } />
            <Route path="/concepts" element={<Concepts />} />
            <Route path="/ethics" element={<Ethics />} />
          </Routes>
        </main>

        <Footer />
        
        {auth.isAuthenticated && (
          <div className="fixed bottom-4 right-4 z-50 flex items-center gap-4 bg-black/80 border border-cyan-500/30 p-2 rounded-lg backdrop-blur-md">
            <div className="flex items-center gap-2">
              <Cpu className={`w-4 h-4 ${auth.role === UserRole.RESEARCHER ? 'text-cyan-400' : 'text-gray-500'}`} />
              <div className="flex flex-col">
                <span className="text-[8px] text-gray-500 font-bold uppercase leading-none">ID: {auth.identityId}</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                  Level: {auth.role}
                </span>
              </div>
            </div>
            <button 
              onClick={toggleRole}
              className="px-3 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded text-[10px] font-bold transition-all"
            >
              ELEVATE
            </button>
            <button 
              onClick={logout}
              className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 rounded transition-all"
              title="Logout"
            >
              <LogOut className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    </Router>
  );
};

const Navbar: React.FC<{ auth: AuthState, logout: () => void, triggerCommand: () => void }> = ({ auth, logout, triggerCommand }) => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: '/ceremonial', label: 'CEREMONIAL', icon: Flower },
    { path: '/simulator', label: 'SIMULATOR', icon: ImageIcon },
    { path: '/decoder', label: 'DECODER', icon: Lock },
    { path: '/geoint', label: 'GEO-INT', icon: MapPin },
    { path: '/symbols', label: 'LIBRARY', icon: Library },
    { path: '/concepts', label: 'CONCEPTS', icon: Info },
    { path: '/ethics', label: 'ETHICS', icon: Scale },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 border-b border-cyan-500/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link to="/" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-cyan-500 flex items-center justify-center rounded-sm">
              <ShieldAlert className="text-black w-5 h-5" />
            </div>
            <span className="orbitron font-bold tracking-tighter text-lg md:text-xl text-cyan-400">
              VISUAL <span className="text-white">CIPHER</span> LAB
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path}
                className={`text-xs font-bold tracking-widest transition-colors flex items-center gap-1.5 ${
                  location.pathname === item.path ? 'text-cyan-400' : 'text-gray-400 hover:text-white'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {!auth.isAuthenticated ? (
              <Link 
                to="/login" 
                className="px-4 py-1.5 bg-cyan-500 text-black text-[10px] font-bold tracking-widest orbitron hover:bg-cyan-400 transition-colors"
              >
                AUTHORIZE
              </Link>
            ) : (
              <button 
                onClick={triggerCommand}
                className="hidden sm:flex items-center gap-1 bg-red-900/20 border border-red-500/30 px-2 py-1 rounded hover:bg-red-900/40 transition-all"
              >
                 <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                 <span className="text-[10px] text-red-400 font-bold uppercase tracking-tighter">SECURE CHANNEL</span>
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-cyan-400 hover:bg-cyan-500/10 rounded transition-all"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[45] bg-black flex flex-col pt-20 px-4 md:hidden animate-fadeIn overflow-y-auto pb-8">
          <div className="absolute inset-0 pointer-events-none crt-scanline opacity-10" />
          
          <div className="flex flex-col gap-2 mt-4">
            <div className="px-4 py-2 border-b border-cyan-500/10 mb-2">
              <span className="text-[10px] text-cyan-900 font-bold tracking-[0.3em] uppercase flex items-center gap-2">
                <Activity className="w-3 h-3" /> System Navigation
              </span>
            </div>
            
            {navItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-4 px-6 py-5 rounded border transition-all ${
                  location.pathname === item.path 
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 shadow-[0_0_15px_rgba(0,245,255,0.05)]' 
                  : 'bg-white/[0.02] border-white/5 text-gray-400 active:bg-white/5'
                }`}
              >
                <div className={`p-2 rounded-sm ${location.pathname === item.path ? 'bg-cyan-500/20' : 'bg-black/50 border border-white/5'}`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="orbitron text-[13px] font-bold tracking-widest uppercase">{item.label}</span>
                  <span className="text-[8px] text-gray-600 uppercase tracking-tighter">Access Module V.0.4</span>
                </div>
                <ChevronRight className={`ml-auto w-4 h-4 ${location.pathname === item.path ? 'text-cyan-400' : 'text-gray-800'}`} />
              </Link>
            ))}

            {auth.isAuthenticated && (
              <button 
                onClick={() => {
                  triggerCommand();
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-4 px-6 py-5 mt-4 rounded border bg-red-950/20 border-red-500/30 text-red-400"
              >
                <div className="p-2 bg-red-500/20 rounded-sm">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="orbitron text-[13px] font-bold tracking-widest uppercase">Secure Channel</span>
                  <span className="text-[8px] text-red-900 uppercase tracking-tighter">Active Monitoring Level 1</span>
                </div>
              </button>
            )}
          </div>
          
          <div className="mt-auto pt-10 text-center">
            <p className="text-[9px] text-cyan-900 font-bold tracking-[0.4em] uppercase">Visual Cipher Lab // mobile_interface_01</p>
          </div>
        </div>
      )}
    </>
  );
};

const Footer: React.FC = () => (
  <footer className="border-t border-white/5 py-8 mt-12 bg-black/40">
    <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
      <div className="text-[10px] text-gray-500 tracking-widest uppercase">
        © 2024 Visual Cipher Lab // Academic Simulation Environment
      </div>
      <div className="flex gap-6">
        <span className="text-[10px] text-cyan-900 font-bold hover:text-cyan-400 cursor-help transition-colors">EST: VCL-88-B</span>
        <span className="text-[10px] text-cyan-900 font-bold hover:text-cyan-400 cursor-help transition-colors">NODE: 0x7F2</span>
      </div>
    </div>
  </footer>
);

export default App;
