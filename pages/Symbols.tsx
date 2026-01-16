
import React, { useState, useMemo } from 'react';
import { Eye, EyeOff, Search, Tag, AlertTriangle, Plus, X, Share2, Clipboard, ShieldCheck } from 'lucide-react';
import { UserRole, CipherSymbol } from '../types';

const MOCK_SYMBOLS: CipherSymbol[] = [
  { id: '1', name: 'SIG-VECTOR-NORTH', glyph: '↑', meaning: 'Primary communication channel active', category: 'DIRECTION' },
  { id: '2', name: 'SIG-VECTOR-SOUTH', glyph: '↓', meaning: 'Channel redundancy failure', category: 'DIRECTION' },
  { id: '3', name: 'STAT-ALPHA-1', glyph: 'Δ', meaning: 'System ready for data injection', category: 'STATUS' },
  { id: '4', name: 'STAT-OMEGA-9', glyph: 'Ω', meaning: 'Process termination imminent', category: 'STATUS' },
  { id: '5', name: 'TIME-SHIFT-P', glyph: 'Φ', meaning: 'Phase shift detected in signal loop', category: 'TIME' },
  { id: '6', name: 'TIME-SYNC-L', glyph: 'λ', meaning: 'Latency synchronization completed', category: 'TIME' },
  { id: '7', name: 'RISK-CRITICAL', glyph: '⚠', meaning: 'Unauthorized visual interception detected', category: 'RISK' },
  { id: '8', name: 'RISK-SHIELD', glyph: '🛡', meaning: 'Layer 2 encryption active', category: 'RISK' },
  { id: '9', name: 'GEO-LATTICE', glyph: '▚', meaning: 'Spatial grid distortion detected', category: 'STATUS' },
  { id: '10', name: 'NULL-NODE', glyph: '∅', meaning: 'Empty signal packet encountered', category: 'STATUS' },
];

interface SymbolsProps {
  role: UserRole;
}

const Symbols: React.FC<SymbolsProps> = ({ role }) => {
  const [authorized, setAuthorized] = useState(false);
  const [filter, setFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSequence, setSelectedSequence] = useState<CipherSymbol[]>([]);
  const [isExporting, setIsExporting] = useState(false);

  const categories = ['ALL', 'DIRECTION', 'STATUS', 'TIME', 'RISK'];

  const filteredSymbols = useMemo(() => {
    return MOCK_SYMBOLS.filter(symbol => {
      const matchesFilter = filter === 'ALL' || symbol.category === filter;
      const matchesSearch = symbol.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           symbol.glyph.includes(searchQuery) ||
                           (authorized && symbol.meaning.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesFilter && matchesSearch;
    });
  }, [filter, searchQuery, authorized]);

  const canSeeMeanings = role === UserRole.RESEARCHER || authorized;

  const toggleSymbol = (symbol: CipherSymbol) => {
    if (selectedSequence.find(s => s.id === symbol.id)) {
      setSelectedSequence(prev => prev.filter(s => s.id !== symbol.id));
    } else {
      if (selectedSequence.length < 8) {
        setSelectedSequence(prev => [...prev, symbol]);
      }
    }
  };

  const copySequence = () => {
    const sequenceStr = selectedSequence.map(s => s.glyph).join(' ');
    navigator.clipboard.writeText(sequenceStr);
    setIsExporting(true);
    setTimeout(() => setIsExporting(false), 2000);
  };

  return (
    <div className="space-y-12 animate-fadeIn">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-white/5 pb-8">
        <div className="space-y-1">
          <h2 className="orbitron text-2xl font-bold tracking-widest text-white uppercase">Symbolic Archive</h2>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Glyph Repository // V-LANG-01 // Total: {MOCK_SYMBOLS.length}</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-600" />
            <input 
              type="text"
              placeholder="SEARCH GLYPHS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-sm py-2 pl-9 pr-4 text-[10px] text-cyan-400 font-bold tracking-widest focus:outline-none focus:border-cyan-500/50 transition-all"
            />
          </div>

          {/* Category Filter */}
          <div className="flex bg-black/40 border border-white/10 rounded-sm overflow-hidden p-0.5">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-3 py-1 text-[8px] font-bold tracking-widest transition-all ${
                  filter === cat ? 'bg-cyan-500 text-black' : 'text-gray-500 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setAuthorized(!authorized)}
            className={`px-4 py-2 flex items-center gap-2 border text-[10px] font-bold tracking-widest transition-all rounded-sm ${
              authorized ? 'bg-red-500/10 border-red-500/50 text-red-500' : 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400'
            }`}
          >
            {authorized ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            {authorized ? 'LOCK ARCHIVE' : 'AUTHORIZE MODE'}
          </button>
        </div>
      </div>

      {/* Cipher Sequence Builder (Visible only when symbols are selected) */}
      {selectedSequence.length > 0 && (
        <div className="p-6 bg-cyan-950/10 border border-cyan-500/20 rounded-sm space-y-4 animate-slideDown">
          <div className="flex justify-between items-center border-b border-cyan-500/10 pb-3">
             <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <h3 className="orbitron text-[10px] font-bold text-white tracking-[0.2em] uppercase">Cipher Sequence Buffer</h3>
             </div>
             <div className="flex gap-4">
                <button onClick={copySequence} className="flex items-center gap-2 text-[10px] font-bold text-cyan-400 hover:text-white transition-all uppercase">
                  {isExporting ? <CheckIcon /> : <Clipboard className="w-3 h-3" />}
                  {isExporting ? 'COPIED' : 'COPY RAW'}
                </button>
                <button onClick={() => setSelectedSequence([])} className="flex items-center gap-2 text-[10px] font-bold text-red-900 hover:text-red-500 transition-all uppercase">
                  <X className="w-3 h-3" /> CLEAR
                </button>
             </div>
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            {selectedSequence.map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-1 group animate-fadeIn">
                <div className="w-12 h-12 bg-black border border-cyan-500/40 flex items-center justify-center text-2xl text-cyan-400 shadow-[0_0_15px_rgba(0,245,255,0.1)] relative">
                  {s.glyph}
                  <button 
                    onClick={() => setSelectedSequence(prev => prev.filter((_, idx) => idx !== i))}
                    className="absolute -top-1 -right-1 bg-red-500 text-black p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-2 h-2" />
                  </button>
                </div>
                <span className="text-[7px] text-gray-500 font-mono tracking-tighter uppercase">{s.name}</span>
              </div>
            ))}
            {selectedSequence.length < 8 && (
              <div className="w-12 h-12 border border-dashed border-gray-800 flex items-center justify-center text-gray-800 text-xs italic">
                {selectedSequence.length + 1}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Symbol Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {filteredSymbols.map(symbol => {
          const isSelected = selectedSequence.find(s => s.id === symbol.id);
          return (
            <div 
              key={symbol.id} 
              onClick={() => toggleSymbol(symbol)}
              className={`group aspect-square bg-black border transition-all duration-300 flex flex-col items-center justify-center p-6 relative cursor-pointer ${
                isSelected ? 'border-cyan-500 shadow-[0_0_20px_rgba(0,245,255,0.1)]' : 'border-white/5 hover:border-white/20'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
                </div>
              )}

              <span className={`text-5xl mb-4 transition-all duration-500 font-serif ${
                isSelected ? 'text-cyan-400 scale-110' : 'text-white/60 group-hover:text-white group-hover:scale-110'
              }`}>
                {symbol.glyph}
              </span>
              <div className="text-center space-y-1">
                <span className="text-[8px] font-mono text-gray-700 block uppercase tracking-tighter">{symbol.id.padStart(4, '0')}</span>
                <span className={`text-[10px] font-bold tracking-widest block transition-colors ${
                  isSelected ? 'text-cyan-400' : 'text-gray-500 group-hover:text-gray-300'
                }`}>
                  {symbol.name}
                </span>
              </div>

              {/* Hidden Overlay Meaning */}
              <div className={`absolute inset-0 bg-black/95 flex flex-col items-center justify-center p-6 text-center transition-all duration-500 rounded-sm ${canSeeMeanings ? 'opacity-0 hover:opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="absolute top-4 right-4 text-[8px] font-mono text-gray-800">SEC-VCL-{symbol.id}</div>
                <Tag className="w-4 h-4 text-cyan-500 mb-3" />
                <span className="text-[9px] text-cyan-400 font-bold uppercase mb-2 tracking-[0.2em] border-b border-cyan-500/20 pb-1">MEANING IDENTIFIED</span>
                <p className="text-[11px] text-white leading-relaxed font-light font-mono px-2">
                  {symbol.meaning}
                </p>
                <div className="mt-4 flex gap-2">
                  <span className="text-[7px] bg-white/5 px-1.5 py-0.5 text-gray-500 border border-white/10 uppercase tracking-widest">{symbol.category}</span>
                  <span className="text-[7px] bg-cyan-500/10 px-1.5 py-0.5 text-cyan-400 border border-cyan-500/20 uppercase tracking-widest">CLEARANCE: A</span>
                </div>
              </div>
            </div>
          );
        })}

        {filteredSymbols.length === 0 && (
          <div className="col-span-full py-20 text-center border border-dashed border-white/5 rounded-sm">
             <Search className="w-10 h-10 text-gray-800 mx-auto mb-4" />
             <p className="orbitron text-gray-700 text-[10px] font-bold tracking-[0.3em] uppercase">No matching glyphs in archive</p>
          </div>
        )}
      </div>

      {/* Warning Footer */}
      {!canSeeMeanings && (
        <div className="p-5 bg-red-950/10 border border-red-500/20 rounded-sm flex items-center gap-4 animate-pulse">
          <AlertTriangle className="text-red-500 w-5 h-5 flex-shrink-0" />
          <div className="space-y-1">
            <p className="text-[10px] text-red-400 uppercase tracking-widest font-bold">
              RESTRICTED ACCESS: SEMANTIC LAYERS MASKED
            </p>
            <p className="text-[8px] text-red-900 uppercase tracking-tighter">
              Authorized personnel must authenticate via RESEARCHER mode or access code v.2024.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const CheckIcon = () => (
  <svg className="w-3 h-3 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

export default Symbols;
