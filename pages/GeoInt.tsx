
import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Search, 
  Compass, 
  Shield, 
  Navigation, 
  ExternalLink, 
  Activity, 
  Info, 
  AlertCircle,
  Crosshair,
  Satellite,
  Globe,
  Terminal,
  Zap
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { UserRole } from '../types';

interface GeoIntProps {
  role: UserRole;
}

const GeoInt: React.FC<GeoIntProps> = ({ role }) => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [status, setStatus] = useState<'IDLE' | 'ACQUIRING' | 'SEARCHING' | 'DONE'>('IDLE');
  const [results, setResults] = useState<{ text: string; chunks: any[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 5));
  };

  const acquireLocation = () => {
    setStatus('ACQUIRING');
    setError(null);
    addLog("INITIATING GPS HANDSHAKE...");
    
    if (!navigator.geolocation) {
      setError("GEOLOCATION PROTOCOL NOT SUPPORTED BY BROWSER.");
      setStatus('IDLE');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setStatus('IDLE');
        addLog("COORDINATES ACQUIRED: " + pos.coords.latitude.toFixed(4) + ", " + pos.coords.longitude.toFixed(4));
      },
      (err) => {
        addLog("GPS DENIED. REQUESTING MANUAL OVERRIDE...");
        setError(`COORDINATE ACQUISITION FAILED: ${err.message}`);
        setStatus('IDLE');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  const useDefaultCoords = () => {
    addLog("ENGAGING MANUAL OVERRIDE: VCL LAB NODE 1...");
    setLocation({ lat: 37.422, lng: -122.084 }); // Mountain View
    setError(null);
  };

  const findSecureNodes = async () => {
    if (!location) return;
    setStatus('SEARCHING');
    setError(null);
    setLogs([]);
    addLog("QUERYING ORBITAL GROUNDING LAYERS...");

    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey) throw new Error("API AUTHENTICATION TOKEN MISSING");

      const ai = new GoogleGenAI({ apiKey });
      
      addLog("ESTABLISHING GEMINI-2.5 SECURE UPLINK...");
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{
          role: 'user',
          parts: [{ text: `Identify exactly 3 safe, quiet public locations (parks, libraries, or cafes) suitable for a "visual handshake" near these coordinates: ${location.lat}, ${location.lng}. Focus on places with clear lines of sight. Use Google Maps grounding.` }]
        }],
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: {
              latLng: {
                latitude: location.lat,
                longitude: location.lng
              }
            }
          }
        },
      });

      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      addLog(`FOUND ${groundingChunks.length} TACTICAL NODES.`);

      setResults({
        text: response.text || "No intelligence retrieved.",
        chunks: groundingChunks
      });
      setStatus('DONE');
    } catch (err: any) {
      console.error("GeoInt Error:", err);
      setError(`ORBITAL SYNC FAILED: ${err.message || 'UNKNOWN ERROR'}`);
      setStatus('IDLE');
      addLog("FATAL ERROR: DATA STREAM INTERRUPTED.");
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn px-4">
      {/* Module Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end border-b border-white/5 pb-6 gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <Satellite className="w-4 h-4 text-cyan-500" />
            <span className="text-[10px] text-cyan-900 font-bold tracking-[0.4em] uppercase">Satellite Intelligence Module</span>
          </div>
          <h2 className="orbitron text-2xl md:text-3xl font-black tracking-widest text-white uppercase">GEOSPATIAL <span className="text-cyan-400">INTEL</span></h2>
          <p className="text-gray-500 text-[10px] uppercase tracking-widest flex items-center gap-2">
             <Terminal className="w-3 h-3" /> V-GEO-SIG-04 // LATENCY: 0.12ms
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {!location ? (
            <>
              <button 
                onClick={acquireLocation}
                disabled={status === 'ACQUIRING'}
                className="flex-1 lg:flex-none px-6 py-3 bg-white/5 border border-white/10 hover:border-cyan-500/50 text-[10px] font-bold tracking-widest transition-all flex items-center justify-center gap-2 group rounded-sm"
              >
                <Compass className={`w-4 h-4 ${status === 'ACQUIRING' ? 'animate-spin' : 'group-hover:rotate-45 transition-transform'}`} /> 
                {status === 'ACQUIRING' ? 'SEARCHING GPS...' : 'ACQUIRE COORDINATES'}
              </button>
              <button 
                onClick={useDefaultCoords}
                className="flex-1 lg:flex-none px-6 py-3 bg-cyan-950/20 border border-cyan-500/20 text-cyan-400 text-[10px] font-bold tracking-widest hover:bg-cyan-500/10 transition-all rounded-sm"
              >
                LAB DEFAULT
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3 w-full lg:w-auto">
              <div className="px-4 py-3 bg-cyan-500/5 border border-cyan-500/30 rounded-sm">
                <span className="text-[10px] text-cyan-400 font-mono font-bold tracking-widest">
                  LOC: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </span>
              </div>
              <button 
                disabled={status === 'SEARCHING'}
                onClick={findSecureNodes}
                className="flex-1 lg:flex-none px-6 py-3 bg-cyan-500 text-black text-[10px] font-bold orbitron tracking-[0.2em] flex items-center justify-center gap-2 transition-all hover:bg-cyan-400 active:scale-95 shadow-[0_0_20px_rgba(0,245,255,0.2)]"
              >
                {status === 'SEARCHING' ? <Activity className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                {status === 'SEARCHING' ? 'IDENTIFYING...' : 'SCAN SECURE NODES'}
              </button>
              <button onClick={() => setLocation(null)} className="p-3 bg-white/5 border border-white/10 text-gray-500 hover:text-white rounded-sm">
                <RefreshCcwIcon />
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Radar and Logs */}
        <div className="lg:col-span-4 space-y-6">
          <div className="aspect-square bg-black border border-cyan-500/20 rounded-sm relative overflow-hidden flex items-center justify-center shadow-2xl">
            {/* Grid Lines */}
            <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 pointer-events-none opacity-5">
              {Array.from({ length: 36 }).map((_, i) => <div key={i} className="border-[0.5px] border-cyan-500" />)}
            </div>

            {/* Radar Sweep Animation */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className={`w-full h-full border border-cyan-500/20 rounded-full ${status === 'SEARCHING' ? 'animate-ping' : ''}`} />
              <div className={`w-3/4 h-3/4 border border-cyan-500/15 rounded-full ${status === 'SEARCHING' ? 'animate-ping [animation-delay:0.5s]' : ''}`} />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-cyan-500/5 to-transparent animate-[spin_4s_linear_infinite]" />
            </div>
            
            <div className="relative z-10 text-center space-y-4">
              <MapPin className={`w-14 h-14 ${location ? 'text-cyan-400 animate-pulse drop-shadow-[0_0_10px_#00f5ff]' : 'text-gray-900'}`} />
              <div className="orbitron text-[9px] tracking-[0.5em] text-gray-500 uppercase">
                {status === 'ACQUIRING' ? 'CALIBRATING GPS...' : status === 'SEARCHING' ? 'SWEEPING SECTORS...' : location ? 'FIX ESTABLISHED' : 'AWAITING GPS FIX'}
              </div>
            </div>

            {/* Corner Indicators */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-black/80 border border-cyan-500/30 px-2 py-0.5 text-[8px] font-bold text-cyan-400 orbitron">SIG-INT</span>
            </div>
            <div className="absolute bottom-4 left-4">
               <span className="text-[8px] font-mono text-cyan-900 font-bold">AZIMUTH: 042° // ELEV: 11°</span>
            </div>
          </div>
          
          {/* Logs Terminal */}
          <div className="bg-[#080808] border border-white/5 p-4 rounded-sm font-mono text-[9px] h-32 flex flex-col justify-end">
            <div className="flex items-center gap-2 mb-2 text-cyan-900 border-b border-white/5 pb-1">
              <Terminal className="w-3 h-3" /> <span>SYSTEM_OUTPUT</span>
            </div>
            <div className="space-y-1">
              {logs.map((log, i) => (
                <div key={i} className={`truncate ${i === 0 ? 'text-cyan-400' : 'text-gray-700'}`}>{log}</div>
              ))}
              {logs.length === 0 && <div className="text-gray-800 italic">STANDBY...</div>}
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-950/20 border border-red-500/30 flex items-center gap-3 animate-shake">
              <AlertCircle className="w-4 h-4 text-red-500" />
              <span className="text-[9px] font-bold text-red-400 uppercase tracking-widest leading-none">{error}</span>
            </div>
          )}
        </div>

        {/* Right Col: Tactical Readout */}
        <div className="lg:col-span-8 space-y-6">
          <div className={`h-full bg-white/[0.01] border rounded-sm p-8 min-h-[400px] transition-all duration-700 ${results ? 'border-cyan-500/20' : 'border-white/5'}`}>
            {!results && status !== 'SEARCHING' && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 max-w-md mx-auto">
                <Globe className="w-16 h-16 text-gray-900" />
                <div className="space-y-2">
                  <p className="orbitron text-gray-500 text-xs font-bold tracking-widest uppercase">Target Area Scan Required</p>
                  <p className="text-gray-700 text-[10px] tracking-widest uppercase leading-loose">
                    Establishing coordinates is the first step in identifying secure environmental nodes for visual cipher exchange.
                  </p>
                </div>
              </div>
            )}

            {status === 'SEARCHING' && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-8">
                <div className="relative">
                   <Satellite className="w-20 h-20 text-cyan-500/20 animate-spin" />
                   <Crosshair className="absolute inset-0 m-auto w-10 h-10 text-cyan-400 animate-pulse" />
                </div>
                <div className="space-y-3">
                   <p className="orbitron text-white text-sm font-bold tracking-[0.6em] uppercase">Cross-Referencing POIs</p>
                   <p className="text-cyan-900 text-[9px] font-mono animate-pulse uppercase tracking-[0.2em]">Querying Grounding Metadata via Google Maps API...</p>
                </div>
              </div>
            )}

            {results && (
              <div className="space-y-8 animate-fadeIn">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                  <div className="flex items-center gap-3">
                    <Zap className="w-4 h-4 text-cyan-500" />
                    <h3 className="orbitron text-sm font-black text-white tracking-[0.2em] uppercase">Verified Tactical Nodes</h3>
                  </div>
                  <span className="text-[10px] text-cyan-900 font-mono font-bold">NODES DETECTED: {results.chunks.length}</span>
                </div>
                
                <div className="prose prose-invert max-w-none">
                  <p className="text-xs md:text-sm text-gray-400 leading-relaxed font-mono whitespace-pre-wrap italic">
                    {results.text}
                  </p>
                </div>

                <div className="space-y-4 pt-6 border-t border-white/5">
                  <div className="flex items-center gap-2">
                    <Navigation className="w-3 h-3 text-cyan-500" />
                    <h4 className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Grounding Assets & Directives</h4>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.chunks.map((chunk: any, i: number) => {
                      if (chunk.maps) {
                        return (
                          <a 
                            key={i}
                            href={chunk.maps.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group p-5 bg-black border border-white/5 hover:border-cyan-500/40 rounded-sm flex flex-col gap-4 transition-all hover:shadow-[0_0_20px_rgba(0,245,255,0.05)]"
                          >
                            <div className="flex justify-between items-start">
                              <span className="text-xs text-white font-black orbitron tracking-widest truncate group-hover:text-cyan-400 transition-colors">
                                {chunk.maps.title || `Node ${i + 1}`}
                              </span>
                              <ExternalLink className="w-3 h-3 text-gray-800 group-hover:text-cyan-400" />
                            </div>
                            <div className="flex items-center justify-between mt-2 pt-3 border-t border-white/5">
                               <span className="text-[8px] text-cyan-900 font-bold uppercase tracking-widest">Maps URI Verified</span>
                               <span className="text-[9px] text-cyan-400 font-bold group-hover:underline">OPEN COORDINATES</span>
                            </div>
                          </a>
                        );
                      }
                      return null;
                    })}

                    {results.chunks.length === 0 && (
                      <div className="col-span-full p-6 border border-dashed border-white/10 text-center">
                         <span className="text-[10px] text-gray-800 font-bold uppercase tracking-widest">No Direct Grounding Links Returned</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const RefreshCcwIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

export default GeoInt;
