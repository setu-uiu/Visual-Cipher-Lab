
import React from 'react';
import { BookOpen, Shield, Cpu, Zap, Binary, Layers } from 'lucide-react';

const Concepts: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-16">
      <div className="text-center space-y-4">
        <h2 className="orbitron text-2xl font-bold tracking-widest text-white uppercase">Foundational Concepts</h2>
        <p className="text-gray-500 text-xs uppercase tracking-widest">Theoretical Framework // Visual Cipher Methodology</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ConceptSection 
          icon={<Shield className="w-6 h-6" />}
          title="Steganography"
          desc="The art of hiding messages in plain sight. In Visual Cipher Lab, we explore how data can be embedded within the pixel noise and structural patterns of mundane images, making the presence of the message itself undetectable."
        />
        <ConceptSection 
          icon={<Binary className="w-6 h-6" />}
          title="Visual Cryptography"
          desc="A cryptographic technique which allows visual information (pictures, text, etc.) to be encrypted in such a way that decryption becomes a mechanical operation that does not require a computer."
        />
        <ConceptSection 
          icon={<Layers className="w-6 h-6" />}
          title="Layered Obfuscation"
          desc="Applying multiple transformations—color shifts, grid warping, and noise injection—sequentially. Each layer increases the cognitive threshold required for an untrained eye to perceive the underlying structure."
        />
        <ConceptSection 
          icon={<Cpu className="w-6 h-6" />}
          title="Machine vs Human"
          desc="AI models are exceptional at pattern recognition but can be misled by adversarial noise. Our research focuses on symbols that humans can easily learn to decode while remaining unparseable for standard OCR algorithms."
        />
      </div>

      <div className="p-8 bg-cyan-950/10 border border-cyan-500/20 rounded-lg">
        <div className="flex gap-4 items-center mb-4">
          <Zap className="w-6 h-6 text-cyan-400" />
          <h3 className="orbitron text-lg font-bold text-white tracking-widest uppercase">THE SIGNAL CYCLE</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
          <CycleStep number="01" label="ORIGIN" detail="RAW INTEL" />
          <CycleStep number="02" label="ENCODE" detail="GLYPH MAPPING" />
          <CycleStep number="03" label="MASK" detail="VISUAL DECAY" />
          <CycleStep number="04" label="DECODE" detail="LAYER STRIPPING" />
        </div>
      </div>
    </div>
  );
};

const ConceptSection: React.FC<{ icon: React.ReactNode, title: string, desc: string }> = ({ icon, title, desc }) => (
  <div className="p-6 bg-black/40 border border-white/5 rounded hover:border-cyan-500/30 transition-all">
    <div className="text-cyan-500 mb-4">{icon}</div>
    <h4 className="orbitron text-sm font-bold tracking-widest mb-3 text-white uppercase">{title}</h4>
    <p className="text-xs text-gray-500 leading-relaxed font-light">{desc}</p>
  </div>
);

const CycleStep: React.FC<{ number: string, label: string, detail: string }> = ({ number, label, detail }) => (
  <div className="space-y-1">
    <div className="text-[10px] font-bold text-cyan-800">{number}</div>
    <div className="text-xs font-bold text-white tracking-widest">{label}</div>
    <div className="text-[9px] text-gray-600 uppercase">{detail}</div>
  </div>
);

export default Concepts;
