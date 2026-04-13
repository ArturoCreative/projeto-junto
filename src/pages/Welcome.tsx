import React, { useEffect, useState } from 'react';
import { 
  Heart, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Globe, 
  ChevronRight 
} from 'lucide-react';

interface WelcomeProps {
  onNext: () => void;
}

export default function Welcome({ onNext }: WelcomeProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF8F4] flex flex-col justify-between relative overflow-hidden font-sans">
      {/* BACKGROUND LAYER: Design de Profundidade */}
      <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[40%] bg-gradient-to-br from-[#4A7FA5]/10 to-transparent rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-[-5%] left-[-10%] w-[60%] h-[30%] bg-[#E8A87C]/5 rounded-full blur-[80px]" />

      {/* HEADER: Branding de Impacto */}
      <header className={`px-10 pt-24 transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="relative inline-block mb-10">
          <div className="w-24 h-24 bg-[#2D3142] rounded-[3rem] flex items-center justify-center text-white shadow-[0_25px_50px_rgba(45,49,66,0.3)] relative z-10">
            <Heart size={44} fill="currentColor" className="text-[#4A7FA5]" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#E8A87C] rounded-full flex items-center justify-center text-white shadow-lg animate-bounce">
            <Sparkles size={16} />
          </div>
        </div>
        
        <div className="space-y-3">
          <h1 className="text-[#2D3142] font-black text-7xl tracking-[-0.06em] italic leading-[0.8]">
            JUNTO<span className="text-[#4A7FA5]">.</span>
          </h1>
          <div className="flex items-center gap-3">
            <div className="h-[2px] w-8 bg-[#E8A87C]" />
            <p className="text-[#4A7FA5] text-[10px] font-black uppercase tracking-[0.4em]">
              Rede de Cuidado Inteligente
            </p>
          </div>
        </div>
      </header>

      {/* BODY: Proposta de Valor Inovare */}
      <main className={`px-10 space-y-8 transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="space-y-5">
          <h2 className="text-[#2D3142] text-2xl font-black leading-[1.1] tracking-tight italic">
            Monitoramento humanizado com <br/>
            <span className="text-[#4A7FA5] not-italic">precisão digital.</span>
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-white/40 backdrop-blur-sm p-4 rounded-2xl border border-white/50 shadow-sm">
              <div className="w-8 h-8 bg-[#4A7FA5]/10 rounded-xl flex items-center justify-center text-[#4A7FA5]">
                <CheckCircle2 size={18} />
              </div>
              <p className="text-[#2D3142] text-xs font-bold opacity-80 uppercase tracking-tight">Gestão Financeira & Saúde</p>
            </div>
            
            <div className="flex items-center gap-4 bg-white/40 backdrop-blur-sm p-4 rounded-2xl border border-white/50 shadow-sm">
              <div className="w-8 h-8 bg-[#E8A87C]/10 rounded-xl flex items-center justify-center text-[#E8A87C]">
                <Globe size={18} />
              </div>
              <p className="text-[#2D3142] text-xs font-bold opacity-80 uppercase tracking-tight">Conexão Familiar Global</p>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER: Ação e Compliance */}
      <footer className={`px-10 pb-16 space-y-10 transition-all duration-1000 delay-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-slate-400">
            <ShieldCheck size={16} />
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Protocolo de Segurança Ativo</span>
          </div>
          
          <button 
            onClick={onNext}
            className="group w-full bg-[#2D3142] text-white py-8 rounded-[2.5rem] font-black uppercase text-[11px] tracking-[0.3em] shadow-[0_30px_60px_rgba(45,49,66,0.35)] flex items-center justify-center gap-4 active:scale-95 transition-all overflow-hidden relative"
          >
            <span className="relative z-10">Iniciar Jornada</span>
            <div className="bg-white/10 p-2 rounded-xl group-hover:bg-[#4A7FA5] transition-colors relative z-10">
              <ArrowRight size={20} />
            </div>
            <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/5 to-transparent group-hover:left-[100%] transition-all duration-1000" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-2">
          <p className="text-slate-300 text-[8px] font-black uppercase tracking-[0.6em]">Agência Inovare</p>
          <div className="w-10 h-[1px] bg-slate-200" />
        </div>
      </footer>
    </div>
  );
}