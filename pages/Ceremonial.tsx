
import React, { useState } from 'react';
import { 
  Scan, 
  Activity, 
  Search, 
  X, 
  Terminal, 
  Cpu, 
  Info,
  Flower2,
  Grid3X3,
  Layers2,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Key,
  CheckCircle,
  Eye,
  Zap
} from 'lucide-react';
import { UserRole } from '../types';

interface CeremonialProps {
  role: UserRole;
}

interface ArtifactData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  glyph: React.ReactNode;
  publicMeaning: string;
  agentMeaning: string;
}

const ARTIFACTS: ArtifactData[] = [
  {
    id: 1,
    title: "PETAL INDEX PROTOCOL 🌸",
    subtitle: "V-FLORAL-01",
    description: "Traditional floral arrangement where petal counts and spacing hide alphabetical offsets.",
    glyph: <Flower2 className="w-12 h-12 stroke-[1.5]" />,
    publicMeaning: "A beautiful arrangement signifying growth and natural harmony between families.",
    agentMeaning: "SAVE YOUR COUNTRY"
  },
  {
    id: 2,
    title: "SYMMETRY BREAK SIGNAL 💎",
    subtitle: "V-GRID-02",
    description: "Geometric patterns where intentional micro-asymmetry signals operational status.",
    glyph: <Grid3X3 className="w-12 h-12 stroke-[1.5]" />,
    publicMeaning: "A delicate artistic variation symbolizing balance, elegance, and intentional imperfection.",
    agentMeaning: "ASYMMETRY CONFIRMED — STATUS CHANGE IMMINENT."
  },
  {
    id: 3,
    title: "CHROMATIC RATIO 🎨",
    subtitle: "V-HUE-03",
    description: "Spectral analysis of ceremonial colors to hide binary status codes.",
    glyph: <Layers2 className="w-12 h-12 stroke-[1.5]" />,
    publicMeaning: "Soft pastel tones reflecting warmth, harmony, and emotional unity.",
    agentMeaning: "CHROMATIC SHIFT DETECTED — NEGATIVE STATE ACTIVE."
  }
];

const Ceremonial: React.FC<CeremonialProps> = ({ role }) => {
  const [activeArtifact, setActiveArtifact] = useState<ArtifactData | null>(null);
  const [scanState, setScanState] = useState<'IDLE' | 'SCANNING' | 'COMPLETE'>('IDLE');
  const [accessCode, setAccessCode] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const startScan = () => {
    setScanState('SCANNING');
    setLogs([]);
    
    // Authorization logic strictly as requested: user-121
    const authorized = accessCode.trim() === 'user-121';
    
    const stepLogs = [
      "INITIALIZING KERNEL SYNC...",
      "STRIPPING SEMANTIC LAYERS...",
      authorized ? "VALIDATING AGENT TOKEN: user-121..." : "ACCESS CODE UNVERIFIED / ANONYMOUS...",
      "QUERYING SIGNAL SEEDS...",
      "RECONSTRUCTING INTEL..."
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < stepLogs.length) {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${stepLogs[i]}`]);
        i++;
      } else {
        clearInterval(interval);
        setIsAuthorized(authorized);
        setScanState('COMPLETE');
      }
    }, 400); // 2 second total scanning effect
  };

  const resetSession = () => {
    setActiveArtifact(null);
    setScanState('IDLE');
    setLogs([]);
    setAccessCode('');
    setIsAuthorized(false);
  };

  return (
    <div className="space-y-12 animate-fadeIn pb-24">
      <style>{`
        @keyframes subtle-glitch {
          0% { transform: translate(0); text-shadow: 0 0 5px rgba(0,245,255,0.5); }
          20% { transform: translate(-1px, 1px); text-shadow: 1px 0 0 rgba(255,0,255,0.3), -1px 0 0 rgba(0,255,255,0.3); }
          40% { transform: translate(-1px, -1px); }
          60% { transform: translate(1px, 1px); }
          80% { transform: translate(1px, -1px); }
          100% { transform: translate(0); text-shadow: 0 0 5px rgba(0,245,255,0.5); }
        }
        .agent-text {
          animation: subtle-glitch 2s infinite linear;
          color: #00f5ff;
          text-shadow: 0 0 10px rgba(0, 245, 255, 0.8);
        }
      `}</style>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-white/5 pb-8">
        <div className="text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-950/30 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold tracking-[0.2em] uppercase mb-2">
            <ShieldCheck className="w-3 h-3" /> SECURE CEREMONIAL ANALYTICS
          </div>
          <h2 className="orbitron text-4xl font-black tracking-tighter text-white">
            CIPHER <span className="text-cyan-400">ARCHIVE</span>
          </h2>
          <p className="text-gray-500 text-[10px] mt-2 uppercase tracking-[0.2em] font-bold">
            GLYPH REPOSITORY // V-LANG-01 // STATUS: OPERATIONAL
          </p>
        </div>
      </div>

      {/* Artifact Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {ARTIFACTS.map((art) => (
          <div 
            key={art.id} 
            onClick={() => setActiveArtifact(art)}
            className="group bg-[#0A0A0A] border border-white/5 p-4 rounded-sm cursor-pointer hover:border-cyan-500/30 transition-all duration-500"
          >
            <div className="aspect-square bg-white flex items-center justify-center mb-6 relative overflow-hidden group-hover:shadow-[0_0_30px_rgba(0,245,255,0.05)] transition-all">
               <div className="text-black group-hover:scale-110 transition-transform duration-700">{art.glyph}</div>
               <div className="absolute bottom-2 right-2 text-[8px] text-gray-400 font-mono uppercase tracking-tighter">ID: {art.subtitle}</div>
            </div>
            <div className="space-y-3 px-2">
              <h3 className="orbitron text-sm font-bold text-white tracking-widest uppercase">{art.title}</h3>
              <p className="text-[10px] text-gray-500 leading-relaxed font-light font-mono h-12 overflow-hidden">
                {art.description}
              </p>
              <div className="pt-2 flex items-center gap-2 text-[9px] font-bold text-cyan-500/70 uppercase tracking-widest group-hover:text-cyan-400 transition-colors">
                <Search className="w-3 h-3" /> CLICK TO ANALYZE SIGNAL
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Interface */}
      {activeArtifact && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/98 backdrop-blur-2xl animate-fadeIn">
          <div className="w-full max-w-4xl bg-[#050505] border border-white/10 rounded-sm overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b bg-white/5 border-white/5">
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full animate-pulse ${scanState === 'COMPLETE' ? (isAuthorized ? 'bg-cyan-500' : 'bg-red-500') : 'bg-cyan-500'}`} />
                <span className={`orbitron text-[10px] font-bold tracking-[0.3em] uppercase ${scanState === 'COMPLETE' ? (isAuthorized ? 'text-cyan-500' : 'text-red-500') : 'text-cyan-500'}`}>
                  {scanState === 'COMPLETE' 
                    ? (isAuthorized ? 'SIGNAL ANALYSIS : VERIFIED' : 'SIGNAL ANALYSIS : FAILURE') 
                    : scanState === 'SCANNING' ? 'STRIPPING LAYERS...' : 'AWAITING SCAN'}
                </span>
              </div>
              <button onClick={resetSession} className="text-gray-600 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col lg:flex-row h-full max-h-[85vh]">
              {/* Left: Visualization */}
              <div className="w-full lg:w-1/2 p-8 bg-black border-r border-white/5 flex flex-col items-center justify-center relative overflow-hidden">
                <div className="w-full aspect-square bg-white flex items-center justify-center relative shadow-[0_0_40px_rgba(255,255,255,0.05)] rounded-sm">
                   <div className={`text-black transition-all duration-1000 ${scanState === 'SCANNING' ? 'scale-75 opacity-50 blur-sm' : 'scale-150'}`}>
                      {activeArtifact.glyph}
                   </div>
                   {(scanState === 'SCANNING' || (scanState === 'COMPLETE' && isAuthorized)) && (
                      <div className="absolute inset-0 pointer-events-none">
                        <div className="scanner-line" />
                        {isAuthorized && (
                          <div className="absolute inset-0 bg-cyan-500/5 grid grid-cols-12 grid-rows-12 opacity-30">
                            {Array.from({ length: 144 }).map((_, i) => (
                              <div key={i} className="border-[0.5px] border-cyan-500/10" />
                            ))}
                          </div>
                        )}
                      </div>
                   )}
                </div>

                {/* Session Trace Log */}
                <div className="w-full mt-8 bg-[#080808] border border-white/5 p-4 rounded-sm font-mono text-[8px] text-gray-700 h-28 overflow-hidden flex flex-col justify-end">
                   <div className="flex items-center gap-2 mb-2 text-cyan-900 border-b border-cyan-900/10 pb-1">
                      <Terminal className="w-2.5 h-2.5" /> <span>SESSION_TRACE: {activeArtifact.id}</span>
                   </div>
                   <div className="space-y-0.5">
                      {logs.map((log, i) => <div key={i} className="animate-fadeIn opacity-40">{log}</div>)}
                      {scanState === 'IDLE' && <div className="animate-pulse">AWAITING HANDSHAKE...</div>}
                      {scanState === 'COMPLETE' && (
                        <div className={`font-bold ${isAuthorized ? 'text-cyan-400' : 'text-red-900'}`}>
                          {isAuthorized ? '[✓] PROCESS TERMINATED: STABLE' : '[!] AUTHENTICATION MISMATCH: PUBLIC FALLBACK'}
                        </div>
                      )}
                   </div>
                </div>
              </div>

              {/* Right: Results Panel */}
              <div className="w-full lg:w-1/2 p-10 flex flex-col justify-center overflow-y-auto">
                {scanState === 'IDLE' ? (
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <h3 className="orbitron text-xl font-black text-white tracking-widest uppercase">{activeArtifact.title}</h3>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">Archive Protocol: {activeArtifact.subtitle}</p>
                    </div>

                    <div className="space-y-4">
                      <label className="block text-[9px] font-bold text-gray-600 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                        <Key className="w-3 h-3" /> Access Code Input
                      </label>
                      <input 
                        type="text" 
                        value={accessCode}
                        onChange={(e) => setAccessCode(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-black/60 border border-white/10 p-4 text-sm text-cyan-400 focus:outline-none focus:border-cyan-500/50 tracking-[0.2em] font-mono rounded-sm"
                      />
                      <div className="mt-2 flex items-center gap-2 text-[8px] text-gray-600 uppercase tracking-widest bg-white/[0.02] p-2 border border-white/5 rounded">
                        <Zap className="w-3 h-3 text-cyan-500/50" />
                        <span>Security Advisory: Authorized agents utilize standard temporal bypass tokens.</span>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <button 
                        onClick={startScan}
                        className="w-full bg-cyan-500 hover:bg-cyan-400 text-black py-5 text-xs font-bold orbitron tracking-[0.4em] transition-all rounded-sm flex items-center justify-center gap-3 shadow-lg shadow-cyan-500/10"
                      >
                        <Scan className="w-4 h-4" /> RUN SEMANTIC SCAN
                      </button>
                      <div className="flex justify-between items-center text-[8px] text-gray-800 uppercase tracking-[0.2em] font-bold">
                        <span>Authorization: {role}</span>
                        <span className="flex items-center gap-1"><Info className="w-2.5 h-2.5" /> Public Access Default</span>
                      </div>
                    </div>
                  </div>
                ) : scanState === 'SCANNING' ? (
                  <div className="text-center space-y-8 py-12">
                     <div className="relative inline-block">
                        <Cpu className="w-16 h-16 text-cyan-900 animate-spin opacity-20" />
                        <Activity className="absolute inset-0 m-auto w-8 h-8 text-cyan-500 animate-pulse" />
                     </div>
                     <div className="space-y-2">
                        <p className="orbitron text-white text-xs font-bold tracking-[0.5em] uppercase animate-pulse">Scanning Signal Hierarchy</p>
                        <p className="text-gray-800 text-[9px] font-mono uppercase">Deciphering visual layers...</p>
                     </div>
                  </div>
                ) : (
                  <div className="space-y-8 animate-fadeIn">
                    <div className={`p-8 bg-white/[0.02] border rounded-sm relative overflow-hidden flex flex-col gap-6 transition-colors duration-500 ${isAuthorized ? 'border-cyan-500/30 shadow-[0_0_20px_rgba(0,245,255,0.05)]' : 'border-red-500/20'}`}>
                      <div className={`flex items-center justify-between border-b pb-4 ${isAuthorized ? 'border-cyan-500/10' : 'border-red-500/10'}`}>
                        <div className={`flex items-center gap-3 ${isAuthorized ? 'text-cyan-500' : 'text-red-500/70'}`}>
                           {isAuthorized ? <ShieldCheck className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                           <span className="orbitron text-[10px] font-bold tracking-[0.2em] uppercase">
                             {isAuthorized ? 'AGENT ACCESS DECODE' : 'PUBLIC ACCESS DECODE'}
                           </span>
                        </div>
                        <span className="text-[9px] text-gray-800 font-mono">REF: 0x{activeArtifact.id}F2</span>
                      </div>

                      <div className="space-y-4">
                        <p className={`text-sm md:text-base leading-loose font-mono italic transition-all duration-700 ${isAuthorized ? 'agent-text font-black tracking-widest' : 'text-gray-400'}`}>
                          "{isAuthorized ? activeArtifact.agentMeaning : activeArtifact.publicMeaning}"
                        </p>
                      </div>

                      {isAuthorized && (
                        <div className="absolute top-0 right-0 p-2 overflow-hidden pointer-events-none">
                           <Activity className="w-12 h-12 text-cyan-500/10 animate-pulse" />
                        </div>
                      )}
                    </div>

                    {/* Confidence / Status Meter */}
                    <div className="space-y-3">
                       <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-[0.3em]">
                          <span className="text-gray-700">SIGNAL_INTEGRITY</span>
                          <span className={isAuthorized ? 'text-cyan-400' : 'text-cyan-800'}>
                            {isAuthorized ? '99.8%' : '99.4%'}
                          </span>
                       </div>
                       <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className={`h-full transition-all duration-1000 ${isAuthorized ? 'bg-cyan-500 w-[99.8%]' : 'bg-cyan-900 w-[99.4%]'}`} />
                       </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <button 
                        onClick={() => {
                          setScanState('IDLE');
                          setAccessCode('');
                          setIsAuthorized(false);
                        }}
                        className="w-full bg-white/[0.03] border border-white/5 hover:border-cyan-500/20 text-gray-600 hover:text-cyan-400 py-4 text-[10px] font-bold orbitron tracking-[0.3em] transition-all uppercase rounded-sm flex items-center justify-center gap-2"
                      >
                        <RefreshCcwIcon /> RE-SCAN SIGNAL
                      </button>
                      <button 
                        onClick={resetSession}
                        className="w-full border border-white/5 text-gray-800 hover:text-white hover:border-white/10 py-4 text-[10px] font-bold orbitron tracking-[0.3em] transition-all uppercase rounded-sm"
                      >
                        TERMINATE SESSION
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Disclaimer */}
      <div className="p-8 bg-black/40 border border-white/5 rounded-sm flex flex-col md:flex-row items-center justify-between gap-6">
         <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-gray-800" />
            <div className="space-y-1">
               <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">RESEARCH CLASSIFICATION : LEVEL 1</p>
               <p className="text-[9px] text-gray-700 uppercase leading-relaxed font-mono max-w-2xl">
                  THIS PLATFORM IS A FICTIONAL EDUCATIONAL SIMULATION. AGENT-LEVEL DECODING IS ACCESSIBLE VIA AUTHORIZED BYPASS CODES FOR RESEARCH DEMONSTRATION.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};

const RefreshCcwIcon = () => (
  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

export default Ceremonial;
