
import React, { useState, useEffect } from 'react';
import { MapPin, Search, Compass, Shield, Navigation, ExternalLink, Activity, Info } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { UserRole } from '../types';

interface GeoIntProps {
  role: UserRole;
}

const GeoInt: React.FC<GeoIntProps> = ({ role }) => {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [status, setStatus] = useState<'IDLE' | 'ACQUIRING' | 'SEARCHING' | 'DONE'>('IDLE');
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const acquireLocation = () => {
    setStatus('ACQUIRING');
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      setStatus('IDLE');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setStatus('IDLE');
      },
      (err) => {
        setError("Location access denied.");
        setStatus('IDLE');
      }
    );
  };

  const findSecureNodes = async () => {
    if (!location) return;
    setStatus('SEARCHING');
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Identify 3 secure communication drop points (masked as public venues like libraries, cafes, or parks) near my current coordinates: ${location.lat}, ${location.lng}. For each, explain why it's suitable for a clandestine visual handshake.`,
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

      setResults({
        text: response.text,
        chunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
      });
      setStatus('DONE');
    } catch (err: any) {
      console.error(err);
      setError("Failed to interface with orbital mapping services.");
      setStatus('IDLE');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-6">
        <div>
          <h2 className="orbitron text-2xl font-bold tracking-widest text-white uppercase">Geospatial Intel (GEO-INT)</h2>
          <p className="text-gray-500 text-xs mt-1 uppercase tracking-tighter">Module: V-GEO-SIG // Satellite Interface: ACTIVE</p>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
          <button 
            onClick={acquireLocation}
            className="px-4 py-2 bg-white/5 border border-white/10 hover:border-cyan-500/50 text-[10px] font-bold tracking-widest transition-all flex items-center gap-2 group"
          >
            <Compass className={`w-3 h-3 ${status === 'ACQUIRING' ? 'animate-spin' : 'group-hover:rotate-45'}`} /> 
            {location ? `LOC: ${location.lat.toFixed(2)}, ${location.lng.toFixed(2)}` : 'ACQUIRE COORDINATES'}
          </button>
          <button 
            disabled={!location || status === 'SEARCHING'}
            onClick={findSecureNodes}
            className="px-4 py-2 bg-cyan-500 disabled:bg-gray-800 disabled:text-gray-500 text-black text-[10px] font-bold tracking-widest flex items-center gap-2 transition-all hover:bg-cyan-400 active:scale-95"
          >
            <Search className={`w-3 h-3 ${status === 'SEARCHING' ? 'animate-pulse' : ''}`} />
            {status === 'SEARCHING' ? 'SCANNING...' : 'IDENTIFY SECURE NODES'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Radar View */}
        <div className="lg:col-span-1">
          <div className="aspect-square bg-black border border-cyan-500/20 rounded relative overflow-hidden flex items-center justify-center group shadow-2xl">
            {/* Radar Animation */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
               <div className="w-full h-full border border-cyan-500/40 rounded-full animate-ping" />
               <div className="w-3/4 h-3/4 border border-cyan-500/30 rounded-full animate-ping delay-100" />
               <div className="w-1/2 h-1/2 border border-cyan-500/20 rounded-full animate-ping delay-200" />
            </div>
            
            <div className="relative z-10 text-center space-y-4">
              <MapPin className={`w-12 h-12 ${location ? 'text-cyan-400 animate-pulse' : 'text-gray-800'}`} />
              <div className="orbitron text-[10px] tracking-[0.4em] text-gray-500 uppercase">
                {status === 'ACQUIRING' ? 'CALIBRATING...' : status === 'SEARCHING' ? 'SWEEPING...' : location ? 'FIX ACQUIRED' : 'AWAITING GPS FIX'}
              </div>
            </div>

            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-black/80 border border-cyan-500/30 px-2 py-0.5 text-[8px] font-bold text-cyan-400 orbitron">SIG-INT</span>
              <span className="bg-black/80 border border-white/10 px-2 py-0.5 text-[8px] font-bold text-gray-400">SAT-LINK: {location ? '98%' : 'OFF'}</span>
            </div>
          </div>
          
          {error && (
            <div className="mt-4 p-4 bg-red-950/20 border border-red-500/30 flex items-center gap-3 animate-shake">
              <Activity className="w-4 h-4 text-red-500" />
              <span className="text-[9px] font-bold text-red-400 uppercase tracking-widest leading-none">{error}</span>
            </div>
          )}
        </div>

        {/* Results View */}
        <div className="lg:col-span-2 space-y-6">
          <div className="h-full bg-white/[0.02] border border-white/5 rounded p-6 min-h-[400px]">
            {status === 'IDLE' && !results && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <Shield className="w-12 h-12 text-gray-800" />
                <p className="text-gray-600 text-[10px] tracking-[0.2em] uppercase max-w-xs">
                  Initiate geospatial scan to identify environmental drop points for visual cipher exchange.
                </p>
              </div>
            )}

            {status === 'SEARCHING' && (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-8">
                <div className="relative">
                   <Activity className="w-16 h-16 text-cyan-500 animate-spin" />
                   <Navigation className="absolute inset-0 m-auto w-6 h-6 text-cyan-400 animate-pulse" />
                </div>
                <div className="space-y-2">
                   <p className="orbitron text-white text-[10px] font-bold tracking-[0.5em] uppercase">Cross-Referencing POIs</p>
                   <p className="text-cyan-900 text-[8px] font-mono animate-pulse uppercase">Querying Google Maps Grounding Layers...</p>
                </div>
              </div>
            )}

            {results && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center gap-2 border-b border-white/5 pb-4">
                  <Shield className="w-4 h-4 text-cyan-500" />
                  <h3 className="orbitron text-xs font-bold text-white tracking-widest uppercase">Verified Secure Nodes</h3>
                </div>
                
                <div className="prose prose-invert max-w-none">
                  <p className="text-xs text-gray-400 leading-relaxed font-mono whitespace-pre-wrap">
                    {results.text}
                  </p>
                </div>

                <div className="space-y-3 pt-6 border-t border-white/5">
                  <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <ExternalLink className="w-3 h-3" /> External Directives (Maps)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {results.chunks.map((chunk: any, i: number) => {
                      if (chunk.maps) {
                        return (
                          <a 
                            key={i}
                            href={chunk.maps.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-3 bg-black/40 border border-white/5 hover:border-cyan-500/30 rounded flex items-center justify-between group transition-all"
                          >
                            <span className="text-[10px] text-cyan-400 font-bold uppercase truncate max-w-[150px]">
                              {chunk.maps.title || 'Target Location'}
                            </span>
                            <Navigation className="w-3 h-3 text-gray-700 group-hover:text-cyan-400" />
                          </a>
                        );
                      }
                      return null;
                    })}
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

export default GeoInt;
