
import React, { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  Terminal, 
  Fingerprint, 
  Cpu, 
  AlertCircle, 
  CheckCircle,
  Activity,
  Scan,
  Database,
  Key,
  User,
  Mail,
  ShieldCheck,
  Lock,
  ChevronRight,
  Bell
} from 'lucide-react';
import { UserRole } from '../types';

interface LoginProps {
  onLogin: (role: UserRole, id: string) => void;
  isAuthenticated: boolean;
}

const Login: React.FC<LoginProps> = ({ onLogin, isAuthenticated }) => {
  const [step, setStep] = useState(1);
  const [idInput, setIdInput] = useState('');
  const [passphrase, setPassphrase] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Success Sequence State
  const [showSuccess, setShowSuccess] = useState(false);
  const [successProgress, setSuccessProgress] = useState(0);

  // Emergency Bypass States
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [emergencyStep, setEmergencyStep] = useState(1);
  const [emergencyData, setEmergencyData] = useState({ name: '', email: '', code: '' });
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [showCodeNotification, setShowCodeNotification] = useState(false);

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const triggerSuccessSequence = (role: UserRole, id: string) => {
    setShowSuccess(true);
    let prog = 0;
    const interval = setInterval(() => {
      prog += 1;
      setSuccessProgress(prog);
      if (prog >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          onLogin(role, id);
        }, 2000);
      }
    }, 25);
  };

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (idInput.length < 4) {
      setError('INVALID IDENTITY FORMAT');
      return;
    }
    setError(null);
    addLog(`INITIATING HANDSHAKE FOR ID: ${idInput.toUpperCase()}`);
    setStep(2);
  };

  const startNeuralScan = () => {
    setIsScanning(true);
    setError(null);
    addLog('COMMENCING NEURAL SIGNATURE VERIFICATION...');
    let prog = 0;
    const interval = setInterval(() => {
      prog += Math.random() * 15;
      if (prog >= 100) {
        setScanProgress(100);
        clearInterval(interval);
        setTimeout(() => {
          setIsScanning(false);
          setStep(3);
          addLog('NEURAL SIGNATURE CONFIRMED. TEMPORAL SEED GENERATED.');
        }, 800);
      } else {
        setScanProgress(prog);
      }
    }, 150);
  };

  const handleStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    if (passphrase.toUpperCase().trim() === 'RESEARCH_2024') {
      addLog('ACCESS GRANTED. SYNCING WITH LAB ENVIRONMENT...');
      triggerSuccessSequence(UserRole.RESEARCHER, idInput || 'RESEARCHER-01');
    } else {
      setError('TEMPORAL MISMATCH // INVALID CREDENTIALS');
      addLog('FATAL: AUTHENTICATION FAILURE AT SEED LAYER');
    }
  };

  const quickAccess = () => {
    addLog('EMERGENCY OVERRIDE DETECTED...');
    setIsEmergencyMode(true);
    setEmergencyStep(1);
    setError(null);
    setShowCodeNotification(false);
  };

  const handleEmergencyStep = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (emergencyStep === 1) {
      if (!emergencyData.name) {
        setError("NAME FIELD REQUIRED");
        return;
      }
      addLog(`BYPASS USER IDENTIFIED: ${emergencyData.name.toUpperCase()}`);
      setEmergencyStep(2);
    } else if (emergencyStep === 2) {
      if (!emergencyData.email.includes('@')) {
        setError("VALID PROTOCOL EMAIL REQUIRED");
        return;
      }
      // Generate random 4-digit code
      const code = Math.floor(1000 + Math.random() * 9000).toString();
      setGeneratedCode(code);
      addLog(`BYPASS CODE DISPATCHED TO: ${emergencyData.email}`);
      setEmergencyStep(3);
      
      // Simulate toast notification
      setTimeout(() => {
        setShowCodeNotification(true);
      }, 800);
    } else if (emergencyStep === 3) {
      if (emergencyData.code !== generatedCode) {
        setError("INVALID 2FA TOKEN");
        addLog(`DENIED: INCORRECT VERIFICATION TOKEN`);
        return;
      }
      addLog('BYPASS VERIFIED. ELEVATING PRIVILEGES...');
      setShowCodeNotification(false);
      triggerSuccessSequence(UserRole.RESEARCHER, emergencyData.name || 'EMERGENCY-USER');
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-[200] bg-black flex flex-col items-center justify-center p-8 font-mono animate-fadeIn overflow-hidden">
        <div className="absolute inset-0 pointer-events-none crt-scanline opacity-30" />
        <div className="absolute inset-0 bg-cyan-500/5 mix-blend-overlay" />
        
        <div className="max-w-3xl w-full space-y-12 relative">
          {/* Success Header */}
          <div className="space-y-4 border-l-2 border-cyan-500 pl-8 py-2">
            <div className="flex items-center gap-4 text-cyan-500 animate-pulse">
              <ShieldCheck className="w-10 h-10" />
              <h2 className="orbitron text-2xl md:text-5xl font-black tracking-[0.3em] uppercase">
                Military Cyber Operations
              </h2>
            </div>
            <p className="text-cyan-900 text-xs tracking-widest uppercase font-bold">
              (Command-Oriented Interface) // Version: 0.9.1-K
            </p>
          </div>

          {/* Core Authorization Message */}
          <div className="space-y-8 bg-cyan-950/10 border border-cyan-500/20 p-10 rounded shadow-[0_0_60px_rgba(0,245,255,0.08)]">
            <div className="flex items-center gap-4 mb-6">
               <div className="w-16 h-1 bg-cyan-500" />
               <h3 className="orbitron text-cyan-400 text-xl md:text-2xl font-bold tracking-[0.5em] animate-pulse uppercase">
                 AUTHORIZED ACCESS CONFIRMED
               </h3>
               <div className="w-16 h-1 bg-cyan-500" />
            </div>

            <div className="space-y-6 text-sm md:text-xl leading-relaxed text-cyan-100 font-mono tracking-wider">
               <p className="opacity-0 animate-[slideInLeft_0.5s_forwards] delay-100">
                Engaging hardened cipher stack and restricted transformation protocols.
               </p>
               <p className="opacity-0 animate-[slideInLeft_0.5s_forwards] delay-300">
                Unauthorized observation will yield indistinguishable noise signatures.
               </p>
               <div className="h-px bg-cyan-500/20 my-4" />
               <p className="text-cyan-400 font-black uppercase tracking-[0.2em] opacity-0 animate-[slideInLeft_0.5s_forwards] delay-500">
                Proceed under active counter-analysis conditions.
               </p>
            </div>
          </div>

          {/* Telemetry Bars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-8">
            <div className="space-y-3">
               <div className="flex justify-between text-[10px] text-cyan-700 font-bold uppercase tracking-widest">
                 <span>ENCRYPTION_STRENGTH</span>
                 <span className="text-cyan-400">99.9%</span>
               </div>
               <div className="h-1 bg-cyan-950 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-500 shadow-[0_0_10px_#00f5ff]" style={{ width: `${Math.min(successProgress * 2, 100)}%` }} />
               </div>
            </div>
            <div className="space-y-3">
               <div className="flex justify-between text-[10px] text-cyan-700 font-bold uppercase tracking-widest">
                 <span>CIPHER_SYNC</span>
                 <span className="text-cyan-400">ESTABLISHED</span>
               </div>
               <div className="h-1 bg-cyan-950 rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]" style={{ width: `${successProgress}%` }} />
               </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 pt-12">
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-ping [animation-delay:0.2s]" />
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-ping [animation-delay:0.4s]" />
            </div>
            <span className="text-[10px] text-cyan-900 uppercase font-black tracking-[0.5em]">INITIALIZING SECURE LINK...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 relative">
      {/* Code Notification Toast (Simulation) */}
      {showCodeNotification && (
        <div className="fixed top-24 right-8 z-[300] bg-cyan-500 text-black p-5 rounded border-b-4 border-cyan-700 shadow-[0_20px_60px_rgba(0,0,0,0.4)] animate-slideInRight max-w-[300px]">
          <div className="flex items-start gap-4">
            <Bell className="w-6 h-6 flex-shrink-0 mt-1" />
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest mb-2 border-b border-black/20 pb-1">Incoming Verification</p>
              <p className="text-[12px] leading-tight font-mono">
                Your emergency protocol code is: <span className="font-black text-lg underline decoration-2">{generatedCode}</span>
              </p>
              <button 
                onClick={() => setShowCodeNotification(false)}
                className="mt-3 text-[9px] font-black uppercase bg-black text-cyan-400 px-2 py-1 hover:bg-black/80 transition-all"
              >
                ACKNOWLEDGE
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Terminal Logs (Visual Decoration) */}
        <div className="lg:col-span-2 hidden lg:flex flex-col h-[520px] bg-black/90 border border-cyan-500/20 rounded p-5 font-mono text-[9px] text-cyan-900 overflow-hidden shadow-2xl relative">
          <div className="absolute inset-0 bg-cyan-500/[0.02] pointer-events-none" />
          <div className="flex items-center gap-2 mb-4 text-cyan-700 border-b border-cyan-500/10 pb-3">
            <Terminal className="w-4 h-4" />
            <span className="tracking-[0.3em] uppercase font-black">AUTH_DAEMON.LOG</span>
          </div>
          <div className="flex-1 overflow-y-auto space-y-1.5 scrollbar-hide pr-2">
            {logs.map((log, i) => (
              <div key={i} className="animate-fadeIn opacity-40 hover:opacity-100 transition-opacity">
                {log}
              </div>
            ))}
            <div ref={logEndRef} />
          </div>
          <div className="mt-5 pt-3 border-t border-cyan-500/10">
            <button 
              onClick={quickAccess}
              className="w-full py-3 border border-cyan-500/20 text-cyan-800 hover:text-cyan-400 hover:border-cyan-400 hover:bg-cyan-500/5 transition-all text-[8px] font-black tracking-[0.4em] uppercase"
            >
              [ RUN EMERGENCY BYPASS ]
            </button>
          </div>
        </div>

        {/* Auth Interface */}
        <div className="lg:col-span-3 space-y-8">
          <div className="flex flex-col items-center text-center space-y-3 mb-10">
            <div className="w-14 h-14 bg-cyan-500/5 border border-cyan-500/30 flex items-center justify-center rounded shadow-[0_0_20px_rgba(0,245,255,0.1)]">
              {isEmergencyMode ? <ShieldAlert className="text-amber-500 w-7 h-7 animate-pulse" /> : <ShieldAlert className="text-cyan-400 w-7 h-7" />}
            </div>
            <h2 className="orbitron text-2xl font-black tracking-[0.2em] text-white uppercase">
              {isEmergencyMode ? 'Bypass Active' : 'Access Control'}
            </h2>
            <p className="text-[10px] text-gray-500 tracking-[0.3em] uppercase font-bold">
              {isEmergencyMode ? 'PROTOCOL V9.0 // UNRESTRICTED' : 'LAYERED SECURITY V4.2'}
            </p>
          </div>

          <div className="bg-black/80 border border-white/5 rounded-lg overflow-hidden backdrop-blur-3xl relative shadow-2xl">
            {/* Multi-step progress bar */}
            <div className="h-1.5 bg-white/5 w-full relative overflow-hidden">
              <div 
                className={`h-full transition-all duration-700 shadow-[0_0_15px_rgba(0,245,255,0.5)] ${isEmergencyMode ? 'bg-amber-500' : 'bg-cyan-500'}`} 
                style={{ width: `${isEmergencyMode ? (emergencyStep / 3) * 100 : (step / 3) * 100}%` }} 
              />
            </div>

            <div className="p-12">
              {isEmergencyMode ? (
                /* EMERGENCY BYPASS FLOW */
                <form onSubmit={handleEmergencyStep} className="space-y-8 animate-fadeIn">
                  {emergencyStep === 1 && (
                    <div className="space-y-4">
                      <label className="text-[10px] text-amber-700 font-black uppercase tracking-[0.3em] flex items-center gap-3">
                        <User className="w-4 h-4" /> 01. IDENTITY_NAME
                      </label>
                      <input 
                        autoFocus
                        type="text"
                        placeholder="NAME OF AUTHORIZING OFFICER"
                        value={emergencyData.name}
                        onChange={(e) => setEmergencyData({ ...emergencyData, name: e.target.value })}
                        className="w-full bg-black/60 border border-white/10 p-5 text-sm text-amber-400 focus:outline-none focus:border-amber-500/50 tracking-[0.2em] font-mono rounded shadow-inner"
                      />
                      <button className="w-full bg-amber-600 hover:bg-amber-500 text-black py-5 text-xs font-black orbitron tracking-[0.3em] transition-all rounded shadow-lg shadow-amber-600/20 mt-6 uppercase">
                        Confirm Operator
                      </button>
                    </div>
                  )}
                  
                  {emergencyStep === 2 && (
                    <div className="space-y-4">
                      <label className="text-[10px] text-amber-700 font-black uppercase tracking-[0.3em] flex items-center gap-3">
                        <Mail className="w-4 h-4" /> 02. COMM_CHANNEL
                      </label>
                      <input 
                        autoFocus
                        type="email"
                        placeholder="SECURE EMAIL PROTOCOL"
                        value={emergencyData.email}
                        onChange={(e) => setEmergencyData({ ...emergencyData, email: e.target.value })}
                        className="w-full bg-black/60 border border-white/10 p-5 text-sm text-amber-400 focus:outline-none focus:border-amber-500/50 tracking-[0.2em] font-mono rounded shadow-inner"
                      />
                      <button className="w-full bg-amber-600 hover:bg-amber-500 text-black py-5 text-xs font-black orbitron tracking-[0.3em] transition-all rounded shadow-lg shadow-amber-600/20 mt-6 uppercase">
                        Dispatch Token
                      </button>
                    </div>
                  )}

                  {emergencyStep === 3 && (
                    <div className="space-y-4">
                      <label className="text-[10px] text-amber-700 font-black uppercase tracking-[0.3em] flex items-center gap-3">
                        <ShieldCheck className="w-4 h-4" /> 03. VERIFICATION_SEED
                      </label>
                      <p className="text-[9px] text-gray-600 uppercase tracking-widest italic text-center mb-4">Verification code dispatched to simulated terminal.</p>
                      <input 
                        autoFocus
                        type="text"
                        placeholder="4-DIGIT BYPASS CODE"
                        value={emergencyData.code}
                        onChange={(e) => setEmergencyData({ ...emergencyData, code: e.target.value })}
                        className="w-full bg-black/60 border border-white/10 p-6 text-center text-3xl text-amber-400 focus:outline-none focus:border-amber-500/50 tracking-[1em] font-mono rounded shadow-inner font-black"
                        maxLength={4}
                      />
                      <button className="w-full bg-amber-600 hover:bg-amber-500 text-black py-5 text-xs font-black orbitron tracking-[0.3em] transition-all rounded shadow-lg shadow-amber-600/20 mt-6 uppercase">
                        Elevate & Access
                      </button>
                    </div>
                  )}

                  <div className="text-center">
                    <button 
                      type="button"
                      onClick={() => setIsEmergencyMode(false)}
                      className="text-[9px] text-gray-600 hover:text-white transition-colors tracking-[0.2em] uppercase font-bold"
                    >
                      Return to Standard Login
                    </button>
                  </div>
                </form>
              ) : (
                /* STANDARD LOGIN FLOW */
                <>
                  {step === 1 && (
                    <form onSubmit={handleStep1} className="space-y-8 animate-fadeIn">
                      <div className="space-y-4">
                        <label className="text-[10px] text-cyan-700 font-black uppercase tracking-[0.3em] flex items-center gap-3">
                          <Cpu className="w-4 h-4" /> Researcher UUID
                        </label>
                        <input 
                          autoFocus
                          type="text"
                          placeholder="USER-101 (OR SIMILAR)"
                          value={idInput}
                          onChange={(e) => setIdInput(e.target.value)}
                          className="w-full bg-black/60 border border-white/10 p-5 text-sm text-cyan-400 focus:outline-none focus:border-cyan-500/50 tracking-[0.2em] font-mono rounded"
                        />
                      </div>
                      <button className="w-full bg-cyan-500 hover:bg-cyan-400 text-black py-5 text-xs font-black orbitron tracking-[0.3em] transition-all rounded shadow-lg shadow-cyan-500/20 uppercase">
                        Proceed to Biometrics
                      </button>
                    </form>
                  )}

                  {step === 2 && (
                    <div className="space-y-10 animate-fadeIn text-center">
                      <label className="text-[10px] text-cyan-700 font-black uppercase tracking-[0.3em] flex items-center gap-3 justify-center">
                        <Fingerprint className="w-4 h-4" /> Neural Signature Fix
                      </label>

                      <div className="relative aspect-square max-w-[240px] mx-auto bg-cyan-950/5 rounded-full border-2 border-cyan-500/10 flex items-center justify-center overflow-hidden">
                        {isScanning ? (
                          <>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Activity className="w-28 h-28 text-cyan-500 opacity-20 animate-pulse" />
                            </div>
                            <div 
                              className="absolute bottom-0 left-0 w-full bg-cyan-500/10 transition-all duration-300"
                              style={{ height: `${scanProgress}%` }}
                            />
                            <Scan className="w-16 h-16 text-cyan-400 animate-pulse" />
                            <div className="absolute inset-0 scanner-line" />
                          </>
                        ) : (
                          <button 
                            onClick={startNeuralScan}
                            className="group relative flex flex-col items-center gap-4"
                          >
                            <div className="w-24 h-24 bg-cyan-500/5 group-hover:bg-cyan-500/10 rounded-full flex items-center justify-center border border-cyan-500/20 transition-all scale-100 hover:scale-110 active:scale-95 shadow-[0_0_30px_rgba(0,245,255,0.05)]">
                              <Fingerprint className="w-12 h-12 text-cyan-400" />
                            </div>
                            <span className="text-[10px] font-black text-cyan-700 tracking-[0.3em] uppercase group-hover:text-cyan-400 animate-pulse">Touch Terminal</span>
                          </button>
                        )}
                      </div>

                      <p className="text-[10px] text-gray-500 uppercase tracking-[0.4em] italic font-light">
                        {isScanning ? `MAPPING SYNC... ${Math.floor(scanProgress)}%` : 'STATIC NEURAL FIELD READY'}
                      </p>
                    </div>
                  )}

                  {step === 3 && (
                    <form onSubmit={handleStep3} className="space-y-8 animate-fadeIn">
                      <div className="space-y-5">
                        <label className="text-[10px] text-cyan-700 font-black uppercase tracking-[0.3em] flex items-center gap-3">
                          <Database className="w-4 h-4" /> Temporal Key Sequence
                        </label>
                        <div className="relative">
                          <input 
                            autoFocus
                            type="password"
                            placeholder="••••••••"
                            value={passphrase}
                            onChange={(e) => setPassphrase(e.target.value)}
                            className="w-full bg-black/60 border border-white/10 p-6 text-2xl text-cyan-400 focus:outline-none focus:border-cyan-500/50 tracking-[0.6em] font-mono text-center rounded shadow-inner font-black"
                          />
                          <Key className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-950 pointer-events-none" />
                        </div>
                      </div>
                      <button className="w-full bg-cyan-500 hover:bg-cyan-400 text-black py-5 text-xs font-black orbitron tracking-[0.3em] transition-all rounded shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-3 uppercase">
                        <CheckCircle className="w-5 h-5" /> Authorize Lab Access
                      </button>
                      <div className="p-5 bg-cyan-950/20 border border-cyan-500/10 rounded flex flex-col items-center gap-2">
                        <span className="text-[9px] text-cyan-700 uppercase tracking-[0.4em] font-black">SEED PROTOCOL</span>
                        <span className="text-[13px] text-white font-mono font-black tracking-[0.5em] animate-pulse">RESEARCH_2024</span>
                      </div>
                    </form>
                  )}
                </>
              )}
            </div>

            {error && (
              <div className="p-5 bg-red-950/40 border-t border-red-500/30 flex items-center gap-4 animate-shake">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-[10px] font-black text-red-400 uppercase tracking-[0.2em] leading-none">{error}</span>
              </div>
            )}
          </div>
          
          <div className="text-center pt-6">
             <button 
               onClick={quickAccess}
               className="text-[10px] text-gray-700 hover:text-cyan-900 transition-colors tracking-[0.3em] uppercase flex items-center gap-3 mx-auto font-bold"
             >
               <Terminal className="w-4 h-4" /> Restricted Bypass Module
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
