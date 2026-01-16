
import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Eye, Scan, Play, AlertCircle, FileKey, Database, Radio, Cpu, Activity, Info, CheckCircle } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { UserRole } from '../types';

interface DecoderProps {
  role: UserRole;
}

interface EncodedSource {
  id: string;
  tag: string;
  type: string;
  thumbnail: string;
  preview: string;
  decodedMessage: string;
  clearance: string;
  quality: string;
}

const SOURCES: EncodedSource[] = [
  {
    id: 'SRC-01-THM',
    tag: 'RAW_01',
    type: 'THERMAL',
    thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=200&h=200',
    preview: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800&h=800',
    decodedMessage: '"THERMAL ANOMALY DETECTED AT NODE-9. UNDERSEA CABLE INTEGRITY COMPROMISED. REDIRECTING ENCRYPTED FLOW."',
    clearance: 'CLEARANCE ALPHA',
    quality: '99.4%'
  },
  {
    id: 'SRC-02-URB',
    tag: 'GRID_B',
    type: 'INFRARED',
    thumbnail: 'https://images.unsplash.com/photo-1449156001935-d2861575b600?auto=format&fit=crop&q=80&w=200&h=200',
    preview: 'https://images.unsplash.com/photo-1449156001935-d2861575b600?auto=format&fit=crop&q=80&w=800&h=800',
    decodedMessage: '"URBAN TRAFFIC FLOW INVERSION DETECTED IN SECTOR-B. SIGNAL OVERRIDE SUCCESSFUL. TARGET TRACKING INITIALIZED."',
    clearance: 'CLEARANCE OMEGA',
    quality: '92.1%'
  },
  {
    id: 'SRC-03-SAT',
    tag: 'SAT_X4',
    type: 'STATIC',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=200&h=200',
    preview: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800&h=800',
    decodedMessage: '"SATELLITE X-4 RE-SYNCHRONIZED. ORBITAL DRIFT WITHIN TOLERANCE. SECURE UPLINK ESTABLISHED AT 0.02ms."',
    clearance: 'CLEARANCE GAMMA',
    quality: '88.7%'
  },
  {
    id: 'SRC-04-BIO',
    tag: 'LAT_SY',
    type: 'BIOMETRIC',
    thumbnail: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=200&h=200',
    preview: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&q=80&w=800&h=800',
    decodedMessage: '"SYNTHETIC DNA SEQUENCE VERIFIED. PROTOCOL CHIMERA ACTIVE. BIOLOGICAL ENCRYPTION LAYER STABLE."',
    clearance: 'CLEARANCE DELTA',
    quality: '96.5%'
  }
];

const Decoder: React.FC<DecoderProps> = ({ role }) => {
  const [isDecoding, setIsDecoding] = useState(false);
  const [decodedState, setDecodedState] = useState<Record<string, { message: string, clearance: string }>>({});
  const [activeSourceIndex, setActiveSourceIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const activeSource = SOURCES[activeSourceIndex];
  const currentDecodedData = decodedState[activeSource.id];

  const startDecoding = async () => {
    setIsDecoding(true);
    setError(null);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze this cybersecurity intelligence intelligence source (${activeSource.tag}) and reconstruct the hidden symbolic message. The context is ${activeSource.type} data. Provide a short 1-sentence classified message and a security level name like "ALPHA", "OMEGA", etc.`
      });

      const text = response.text || "NO DATA RETRIEVED";
      const clearanceMatch = text.match(/[A-Z]{4,}/);
      const clearance = clearanceMatch ? `CLEARANCE ${clearanceMatch[0]}` : activeSource.clearance;

      setDecodedState(prev => ({ 
        ...prev, 
        [activeSource.id]: { 
            message: text,
            clearance: clearance
        } 
      }));
    } catch (err) {
      setError("AI Inference Error: Deep Layer Reconstruction Failed.");
      console.error(err);
    } finally {
      setIsDecoding(false);
    }
  };

  const handleSourceChange = (index: number) => {
    if (isDecoding) return;
    setActiveSourceIndex(index);
    setError(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
      <div className="flex justify-between items-end border-b border-white/5 pb-6">
        <div>
          <h2 className="orbitron text-2xl font-bold tracking-widest text-white uppercase">Signal Intelligence Hub</h2>
          <p className="text-gray-500 text-xs mt-1 uppercase tracking-tighter">Multi-Layer Visual Reconstruction Terminal</p>
        </div>
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-cyan-950/20 px-3 py-1 border border-cyan-500/20 rounded">
                <Activity className="w-3 h-3 text-cyan-500 animate-pulse" />
                <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">Live Uplink Active</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 px-3 py-1 border border-white/10 rounded">
                <FileKey className="w-3 h-3 text-gray-500" />
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Auth: {role}</span>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Source Selection Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-[10px] font-bold text-gray-600 tracking-widest uppercase flex items-center gap-2 mb-4">
            <Radio className="w-3 h-3" /> Select Signal Source
          </h3>
          <div className="space-y-3">
            {SOURCES.map((source, index) => (
              <button
                key={source.id}
                onClick={() => handleSourceChange(index)}
                className={`w-full group relative flex items-center gap-4 p-3 border transition-all duration-300 rounded-sm ${
                  activeSourceIndex === index 
                  ? 'bg-cyan-500/10 border-cyan-500/50 shadow-[0_0_15px_rgba(0,245,255,0.05)]' 
                  : 'bg-black/40 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="w-12 h-12 flex-shrink-0 bg-gray-900 overflow-hidden border border-white/10">
                  <img src={source.thumbnail} alt={source.tag} className={`w-full h-full object-cover grayscale transition-all ${activeSourceIndex === index ? 'opacity-100' : 'opacity-40'}`} />
                </div>
                <div className="text-left">
                  <div className={`text-[10px] font-bold tracking-widest uppercase ${activeSourceIndex === index ? 'text-cyan-400' : 'text-gray-500'}`}>
                    {source.tag}
                  </div>
                  <div className="text-[8px] text-gray-700 font-mono uppercase">{source.type}</div>
                </div>
                {decodedState[source.id] && (
                  <div className="absolute right-3 top-3">
                    <Unlock className="w-3 h-3 text-cyan-500 opacity-50" />
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="p-4 bg-black/40 border border-white/5 rounded mt-6 space-y-3">
             <div className="flex items-center gap-2 text-gray-500">
               <Info className="w-3 h-3" />
               <span className="text-[8px] font-bold uppercase tracking-widest">Metadata</span>
             </div>
             <div className="space-y-1 font-mono text-[9px]">
                <div className="flex justify-between"><span className="text-gray-700">Source:</span> <span className="text-cyan-900">{activeSource.id}</span></div>
                <div className="flex justify-between"><span className="text-gray-700">Enc:</span> <span className="text-cyan-900">VISUAL-HEX</span></div>
                <div className="flex justify-between"><span className="text-gray-700">Status:</span> <span className="text-green-900">Operational</span></div>
             </div>
          </div>
        </div>

        {/* Decoder Workspace */}
        <div className="lg:col-span-3 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Encoded Preview */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold text-gray-500 tracking-widest uppercase flex items-center gap-2">
                <Scan className="w-3 h-3" /> Encoded Signal Feed
              </h3>
              <div className="aspect-square bg-black border border-cyan-500/20 relative group overflow-hidden rounded-sm">
                <img 
                  src={activeSource.preview} 
                  className={`w-full h-full object-cover transition-all duration-700 grayscale ${isDecoding ? 'blur-sm brightness-150' : 'opacity-60'}`}
                  alt="Encoded source"
                />
                <div className="absolute inset-0 bg-cyan-500/10 mix-blend-overlay" />
                
                {isDecoding && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40">
                      <div className="scanner-line" />
                      <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 pointer-events-none opacity-20">
                        {Array.from({ length: 64 }).map((_, i) => <div key={i} className="border border-cyan-500/30" />)}
                      </div>
                  </div>
                )}

                <div className="absolute bottom-4 left-4 flex gap-2">
                  <span className="text-[8px] font-bold px-1.5 py-0.5 bg-black/80 text-cyan-400 border border-cyan-500/30">{activeSource.tag}</span>
                  <span className="text-[8px] font-bold px-1.5 py-0.5 bg-black/80 text-gray-400 border border-white/10">32-BIT SEC</span>
                </div>
              </div>
            </div>

            {/* Decoded Reconstruction */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold text-gray-500 tracking-widest uppercase flex items-center gap-2">
                <Unlock className="w-3 h-3" /> Data Reconstruction
              </h3>
              <div className={`aspect-square bg-black border relative flex items-center justify-center p-8 rounded-sm transition-all duration-500 ${currentDecodedData ? 'border-cyan-500/40 shadow-[0_0_20px_rgba(0,245,255,0.05)]' : 'border-white/5'}`}>
                {isDecoding ? (
                  <div className="space-y-6 w-full">
                    <div className="flex flex-col items-center gap-2">
                       <Cpu className="w-8 h-8 text-cyan-500 animate-spin" />
                       <p className="text-[9px] font-mono text-cyan-400 text-center animate-pulse tracking-[0.3em]">STRIPPING ENTROPY LAYERS via Gemini-3...</p>
                    </div>
                    <div className="space-y-2">
                        {Array.from({ length: 8 }).map((_, i) => (
                          <div key={i} className="h-1 bg-white/5 overflow-hidden relative rounded-full">
                              <div 
                                className="absolute inset-0 bg-cyan-500/40" 
                                style={{ 
                                  width: `${Math.random() * 100}%`, 
                                  transition: 'width 0.4s ease-in-out',
                                  left: `${Math.random() * 20}%` 
                                }} 
                              />
                          </div>
                        ))}
                    </div>
                  </div>
                ) : currentDecodedData ? (
                  <div className="text-center space-y-6 animate-fadeIn">
                    <div className="relative">
                       <p className="text-sm text-gray-200 font-mono italic leading-loose tracking-wide">
                        {currentDecodedData.message}
                       </p>
                       <div className="absolute -inset-2 bg-cyan-500/5 blur-lg -z-10" />
                    </div>
                    
                    <div className="inline-block p-6 border border-cyan-500/30 rounded bg-cyan-500/5 relative group overflow-hidden">
                        <div className="absolute inset-0 bg-cyan-400/5 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                        <span className="orbitron text-cyan-400 text-xl font-black tracking-[0.2em]">{currentDecodedData.clearance}</span>
                    </div>

                    <div className="flex justify-between items-center text-[9px] text-cyan-900 font-bold uppercase tracking-[0.3em] pt-4 border-t border-white/5">
                      <span>Sync Confidence: {activeSource.quality}</span>
                      <span>Bitrate: 4.2 MB/s</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-6 flex flex-col items-center">
                     <div className="w-16 h-16 rounded-full border border-white/10 flex items-center justify-center bg-white/[0.02]">
                        <Lock className="w-6 h-6 text-gray-800" />
                     </div>
                     <div className="space-y-1">
                        <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">Awaiting Decryption Protocol</p>
                        <p className="text-[8px] text-gray-800 uppercase tracking-tighter">Authorized access required for AI analysis</p>
                     </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-6 pt-4">
            <button 
              onClick={startDecoding}
              disabled={isDecoding || !!currentDecodedData}
              className={`px-10 py-4 border text-xs font-bold orbitron tracking-[0.3em] transition-all flex items-center gap-3 rounded-sm ${
                currentDecodedData 
                ? 'bg-green-500/10 border-green-500/30 text-green-500 cursor-not-allowed' 
                : 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/20 active:scale-95'
              }`}
            >
              {currentDecodedData ? <CheckCircle className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {currentDecodedData ? 'ANALYZED' : 'RUN LAYERED SCAN'}
            </button>
            <button 
              onClick={() => setDecodedState(prev => {
                const newState = { ...prev };
                delete newState[activeSource.id];
                return newState;
              })}
              className="px-10 py-4 bg-white/5 border border-white/20 text-gray-500 text-xs font-bold orbitron tracking-[0.3em] hover:bg-white/10 transition-all rounded-sm uppercase"
            >
              Flush Cache
            </button>
          </div>
          
          {error && (
            <div className="p-4 bg-red-950/20 border border-red-500/30 flex items-center gap-3 animate-shake justify-center">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-[9px] font-bold text-red-400 uppercase tracking-widest">{error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Decoder;
