
import React, { useState, useRef, useEffect } from 'react';
import { Upload, Download, RefreshCcw, Layers, Sliders, Hash, Image as ImageIcon, Activity } from 'lucide-react';
import { UserRole, TransformationState } from '../types';

interface SimulatorProps {
  role: UserRole;
}

const Simulator: React.FC<SimulatorProps> = ({ role }) => {
  const [image, setImage] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [config, setConfig] = useState<TransformationState>({
    symbolOverlay: false,
    colorShift: 0,
    gridDistortion: 0,
    noiseMask: 0,
    bitGlitch: 0,
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imgData = event.target?.result as string;
        setImage(imgData);
        const img = new Image();
        img.onload = () => {
          imageRef.current = img;
          renderCanvas();
        };
        img.src = imgData;
      };
      reader.readAsDataURL(file);
    }
  };

  const renderCanvas = () => {
    if (!imageRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const img = imageRef.current;
    
    // Set internal resolution
    canvas.width = 1280;
    canvas.height = 720;

    // 1. Draw base image with filters
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const blurAmount = config.gridDistortion / 20;
    const grayscale = config.noiseMask;
    const contrast = 100 + (config.noiseMask / 2);
    
    ctx.filter = `hue-rotate(${config.colorShift}deg) grayscale(${grayscale}%) blur(${blurAmount}px) contrast(${contrast}%)`;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    ctx.filter = 'none';

    // 2. Apply Bit-Shift Glitch (Horizontal Line Tearing)
    if (config.bitGlitch > 0) {
      const glitchCount = Math.floor(config.bitGlitch / 4);
      for (let i = 0; i < glitchCount; i++) {
        const x = 0;
        const y = Math.random() * canvas.height;
        const w = canvas.width;
        const h = Math.random() * (config.bitGlitch / 2) + 2;
        const offset = (Math.random() - 0.5) * (config.bitGlitch * 2);
        
        // Grab a slice and redraw it offset
        ctx.drawImage(canvas, x, y, w, h, offset, y, w, h);
      }
    }

    // 3. Apply Grid Overlay for Researchers
    if (role === UserRole.RESEARCHER) {
      ctx.strokeStyle = 'rgba(0, 245, 255, 0.15)';
      ctx.lineWidth = 0.5;
      const step = 40;
      for (let i = 0; i < canvas.width; i += step) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += step) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }
    }

    // 4. Symbol Overlays
    if (config.symbolOverlay) {
      const symbols = ['Σ', 'λ', 'Δ', 'Φ', 'Ω', '▚'];
      ctx.fillStyle = 'rgba(0, 245, 255, 0.7)';
      ctx.font = 'bold 24px Orbitron';
      for (let i = 0; i < 12; i++) {
        const sym = symbols[Math.floor(Math.random() * symbols.length)];
        const x = Math.random() * (canvas.width - 50) + 25;
        const y = Math.random() * (canvas.height - 50) + 25;
        ctx.fillText(sym, x, y);
      }
    }

    // 5. Digital Noise Grain
    if (config.noiseMask > 10) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const noiseStrength = config.noiseMask / 3;
      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * noiseStrength;
        data[i] += noise;     // R
        data[i + 1] += noise; // G
        data[i + 2] += noise; // B
      }
      ctx.putImageData(imageData, 0, 0);
    }
  };

  useEffect(() => {
    if (imageRef.current) {
      renderCanvas();
    }
  }, [config, role]);

  const exportCipher = () => {
    if (!canvasRef.current || !image) return;
    setIsExporting(true);
    
    setTimeout(() => {
      const canvas = canvasRef.current!;
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `VCL-CIPHER-${Math.floor(Date.now() / 1000)}.png`;
      link.href = dataUrl;
      link.click();
      setIsExporting(false);
    }, 800);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col md:flex-row justify-between items-end border-b border-white/5 pb-6">
        <div>
          <h2 className="orbitron text-2xl font-bold tracking-widest text-white uppercase">Encoding Simulator</h2>
          <p className="text-gray-500 text-xs mt-1 uppercase tracking-tighter">Module: V-ENC-ALPHA // Status: Operational</p>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
          <label className="cursor-pointer px-4 py-2 bg-white/5 border border-white/10 hover:border-cyan-500/50 text-[10px] font-bold tracking-widest transition-all flex items-center gap-2 group">
            <Upload className="w-3 h-3 group-hover:animate-bounce" /> UPLOAD PATTERN
            <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
          </label>
          <button 
            onClick={exportCipher}
            disabled={!image || isExporting}
            className="px-4 py-2 bg-cyan-500 disabled:bg-gray-800 disabled:text-gray-500 text-black text-[10px] font-bold tracking-widest flex items-center gap-2 transition-all hover:bg-cyan-400 active:scale-95"
          >
            {isExporting ? <Activity className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
            {isExporting ? 'PROCESS...' : 'EXPORT CIPHER'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls Panel */}
        <div className="lg:col-span-1 space-y-6">
          <ControlSection title="Layered Transformations" icon={<Layers className="w-4 h-4" />}>
            <div className="space-y-4 pt-4">
              <ToggleControl 
                label="SYMBOL OVERLAYS" 
                active={config.symbolOverlay} 
                onClick={() => setConfig(prev => ({ ...prev, symbolOverlay: !prev.symbolOverlay }))} 
              />
              <SliderControl 
                label="COLOR-SHIFT ENCODING" 
                value={config.colorShift} 
                max={360} 
                onChange={(val) => setConfig(prev => ({ ...prev, colorShift: val }))} 
              />
              <SliderControl 
                label="GRID DISTORTION" 
                value={config.gridDistortion} 
                max={100} 
                onChange={(val) => setConfig(prev => ({ ...prev, gridDistortion: val }))} 
              />
              <SliderControl 
                label="NOISE MASKING" 
                value={config.noiseMask} 
                max={100} 
                onChange={(val) => setConfig(prev => ({ ...prev, noiseMask: val }))} 
              />
              <SliderControl 
                label="BIT-SHIFT GLITCH" 
                value={config.bitGlitch} 
                max={100} 
                onChange={(val) => setConfig(prev => ({ ...prev, bitGlitch: val }))} 
              />
            </div>
          </ControlSection>

          <ControlSection title="Signal Data" icon={<Hash className="w-4 h-4" />}>
            <div className="p-4 bg-black/40 border border-white/5 text-[10px] font-mono space-y-1">
              <div className="flex justify-between">
                <span className="text-gray-500 uppercase tracking-tighter">Entropy:</span> 
                <span className="text-cyan-400">{(config.noiseMask * 1.42 + (config.bitGlitch * 0.5)).toFixed(2)} dB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 uppercase tracking-tighter">Cognitive Load:</span> 
                <span className="text-cyan-400">{((config.gridDistortion * 0.8 + config.bitGlitch * 1.2) / 2).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 uppercase tracking-tighter">Signal Integrity:</span> 
                <span className="text-cyan-400">{(100 - (config.noiseMask * 0.3 + config.bitGlitch * 0.4)).toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 uppercase tracking-tighter">Auth Key:</span> 
                <span className="text-cyan-400">VCL-X-{Math.floor(config.colorShift + 100).toString(16).toUpperCase()}</span>
              </div>
            </div>
          </ControlSection>
        </div>

        {/* Viewport */}
        <div className="lg:col-span-2">
          <div className="relative aspect-video bg-black border border-cyan-500/20 rounded overflow-hidden flex items-center justify-center group shadow-2xl">
            {image ? (
              <div className="w-full h-full flex items-center justify-center p-4">
                <canvas 
                  ref={canvasRef} 
                  className="max-w-full max-h-full shadow-[0_0_30px_rgba(0,245,255,0.1)] object-contain" 
                />
                <div className="absolute inset-0 crt-scanline pointer-events-none opacity-20" />
                {role === UserRole.RESEARCHER && <div className="scanner-line opacity-40" />}
              </div>
            ) : (
              <div className="text-center space-y-4 animate-pulse">
                <ImageIcon className="w-12 h-12 text-gray-800 mx-auto" />
                <p className="text-gray-600 text-[10px] tracking-[0.4em] uppercase">Waiting for input signal...</p>
              </div>
            )}
            
            {/* HUD Overlays */}
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="bg-black/80 border border-cyan-500/30 px-2 py-0.5 text-[8px] font-bold text-cyan-400 orbitron">LIVE FEED</span>
              <span className="bg-black/80 border border-white/10 px-2 py-0.5 text-[8px] font-bold text-gray-400">REC [●]</span>
            </div>

            {image && (
              <div className="absolute bottom-4 right-4 text-[8px] font-mono text-cyan-900 uppercase tracking-widest hidden group-hover:block transition-all">
                Resolution: 1280x720 // VCL-ENC-ALPHA
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ControlSection: React.FC<{ title: string, icon: React.ReactNode, children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="border border-white/5 rounded p-4 bg-white/[0.02]">
    <div className="flex items-center gap-2 border-b border-white/5 pb-2 mb-2">
      <span className="text-cyan-400">{icon}</span>
      <h3 className="text-[10px] font-bold tracking-[0.2em] text-gray-400 uppercase">{title}</h3>
    </div>
    {children}
  </div>
);

const SliderControl: React.FC<{ label: string, value: number, max: number, onChange: (v: number) => void }> = ({ label, value, max, onChange }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center text-[9px] font-bold tracking-widest text-gray-500">
      <span className="uppercase">{label}</span>
      <span className="text-cyan-400 font-mono">{value}</span>
    </div>
    <input 
      type="range" 
      min="0" 
      max={max} 
      value={value} 
      onChange={(e) => onChange(parseInt(e.target.value))} 
      className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400 transition-all"
    />
  </div>
);

const ToggleControl: React.FC<{ label: string, active: boolean, onClick: () => void }> = ({ label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`w-full flex justify-between items-center p-3 border transition-all duration-300 rounded-sm ${
      active ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400 shadow-[0_0_15px_rgba(0,245,255,0.05)]' : 'bg-transparent border-white/10 text-gray-500 hover:border-white/30'
    }`}
  >
    <span className="text-[9px] font-bold tracking-[0.2em] uppercase">{label}</span>
    <div className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${active ? 'bg-cyan-500 shadow-[0_0_10px_#00f5ff] animate-pulse' : 'bg-gray-800'}`} />
  </button>
);

export default Simulator;
