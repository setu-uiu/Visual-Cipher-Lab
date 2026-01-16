
import React from 'react';
import { Scale, ShieldAlert, FileText, CheckCircle } from 'lucide-react';

const Ethics: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-12 py-12">
      <div className="text-center space-y-4">
        <Scale className="w-12 h-12 text-cyan-500 mx-auto" />
        <h2 className="orbitron text-3xl font-bold tracking-widest text-white uppercase">ETHICS & LEGAL USE</h2>
        <p className="text-gray-500 text-xs tracking-widest uppercase">POLICY FRAMEWORK // VERSION 1.0.4</p>
      </div>

      <div className="prose prose-invert max-w-none space-y-8">
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-cyan-400 font-bold orbitron text-sm">
            <ShieldAlert className="w-4 h-4" /> 01. INTENDED PURPOSE
          </div>
          <p className="text-xs text-gray-400 leading-loose">
            Visual Cipher Lab is strictly for educational and simulation purposes. The platform aims to visualize the mechanics of information theory and visual obfuscation. It is designed to assist in cybersecurity training and academic research regarding human perception and symbolic communication.
          </p>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2 text-red-500 font-bold orbitron text-sm">
            <FileText className="w-4 h-4" /> 02. PROHIBITED USES
          </div>
          <ul className="text-xs text-gray-400 space-y-2 list-none p-0">
            <li className="flex gap-2">
              <span className="text-red-500">×</span> Using the platform for real-world clandestine communication.
            </li>
            <li className="flex gap-2">
              <span className="text-red-500">×</span> Attempting to hide illegal data within the simulation's visual layers.
            </li>
            <li className="flex gap-2">
              <span className="text-red-500">×</span> Distributing encoded patterns as actual cryptographic secrets.
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2 text-cyan-400 font-bold orbitron text-sm">
            <CheckCircle className="w-4 h-4" /> 03. COMPLIANCE
          </div>
          <p className="text-xs text-gray-400 leading-loose">
            The algorithms used in this lab do not meet FIPS or other international standards for data protection. Users are encouraged to view this as a creative sandbox rather than a security tool. By using this platform, you acknowledge its status as a fictional simulation.
          </p>
        </section>
      </div>

      <div className="mt-12 p-6 border border-white/5 bg-white/[0.02] text-center">
        <p className="text-[10px] text-gray-500 font-mono italic">
          "SECURITY IS NOT A PRODUCT, BUT A PROCESS OF CONSTANT VISUAL SCRUTINY."
        </p>
      </div>
    </div>
  );
};

export default Ethics;
