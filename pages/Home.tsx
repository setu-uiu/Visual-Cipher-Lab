
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Terminal, Globe, ShieldCheck, Binary } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center text-center space-y-16">
      <section className="relative w-full max-w-4xl pt-12">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-cyan-500/5 blur-[120px] rounded-full -z-10" />
        
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/30 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold tracking-[0.2em] uppercase mb-4">
            <Terminal className="w-3 h-3" /> System Initialized: V.0.4.2-STABLE
          </div>
          
          <h1 className="orbitron text-5xl md:text-8xl font-black leading-tight tracking-tighter">
            VISUAL <span className="text-cyan-400">CIPHER</span><br />
            LAB
          </h1>
          
          <p className="max-w-2xl mx-auto text-gray-400 text-sm md:text-lg font-light leading-relaxed">
            Exploring the intersection of geometric logic, signal theory, and cognitive camouflage.
            Transforming intelligence into abstract visual noise.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 pt-8">
            <Link 
              to="/simulator" 
              className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold orbitron tracking-widest flex items-center gap-2 transition-all group"
            >
              ACCESS SIMULATOR <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/symbols" 
              className="px-8 py-3 border border-white/20 hover:border-cyan-500/50 hover:bg-white/5 font-bold orbitron tracking-widest transition-all"
            >
              BROWSE ARCHIVE
            </Link>
          </div>
        </div>
      </section>

      {/* Abstract Animated Pattern Section */}
      <section className="w-full h-64 border-y border-white/5 relative overflow-hidden bg-black/60">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
          <div className="grid grid-cols-12 gap-1 w-[120%] h-[120%] rotate-12">
            {Array.from({ length: 144 }).map((_, i) => (
              <div 
                key={i} 
                className={`h-12 border border-cyan-500/20 ${i % 7 === 0 ? 'bg-cyan-500/10 animate-pulse' : ''}`} 
              />
            ))}
          </div>
        </div>
        <div className="relative h-full flex items-center justify-center">
          <div className="px-6 py-2 bg-black border border-white/10 text-[10px] tracking-[0.4em] text-gray-400 uppercase">
            LIVE SIGNAL MONITORING : 0.04ms LATENCY
          </div>
        </div>
      </section>

      {/* Warning / Disclaimer Banner */}
      <section className="w-full max-w-3xl p-8 bg-red-950/10 border border-red-500/20 rounded-lg text-left">
        <div className="flex items-start gap-4">
          <ShieldCheck className="w-6 h-6 text-red-500 flex-shrink-0" />
          <div>
            <h3 className="text-red-400 font-bold uppercase tracking-widest text-sm mb-2">RESEARCH CLASSIFICATION : LEVEL 1</h3>
            <p className="text-gray-500 text-xs leading-relaxed">
              This platform is a fictional educational simulation. All encoding techniques and signal patterns 
              are for academic demonstration purposes only. It does not provide actual cryptographic security 
              for real-world sensitive data. Unauthorized interception of signals in this lab is strictly simulated.
            </p>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
        <FeatureCard 
          icon={<Globe className="w-6 h-6" />}
          title="SYMBOLIC LOGIC"
          desc="Encoding intent into geometric primitives that evade automated OCR detection."
        />
        <FeatureCard 
          icon={<Binary className="w-6 h-6" />}
          title="SIGNAL DECAY"
          desc="Simulating time-based message degradation and entropy-led encryption layers."
        />
        <FeatureCard 
          icon={<Terminal className="w-6 h-6" />}
          title="NEURAL MASKING"
          desc="Leveraging human perception limitations to hide patterns within structural noise."
        />
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, desc: string }> = ({ icon, title, desc }) => (
  <div className="p-6 bg-black/40 border border-white/5 hover:border-cyan-500/30 transition-all text-left group">
    <div className="text-cyan-500 mb-4 group-hover:scale-110 transition-transform origin-left">{icon}</div>
    <h4 className="orbitron text-sm font-bold tracking-widest mb-2 text-white">{title}</h4>
    <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
  </div>
);

export default Home;
