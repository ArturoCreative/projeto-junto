import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ArrowRight, 
  Shield, 
  Plus, 
  UserPlus, 
  Settings2,
  Mail,
  CheckCircle2,
  Lock,
  Smartphone,
  ChevronRight,
  MoreHorizontal,
  ShieldCheck,
  UserCheck
} from 'lucide-react';

interface Props {
  familyId: string;
  onNext: () => void;
}

export default function FamilyMembers({ onNext }: Props) {
  const [isReady, setIsReady] = useState(false);
  const [activeTab, setActiveTab] = useState('members');

  useEffect(() => {
    // Gatilho de animação padrão Inovare
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF8F4] flex flex-col font-sans relative overflow-hidden">
      {/* Camada de Profundidade Visual */}
      <div className="absolute top-[-50px] left-[-50px] w-96 h-96 bg-[#4A7FA5]/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-100px] right-[-50px] w-[500px] h-[500px] bg-[#E8A87C]/5 rounded-full blur-[150px] opacity-50" />

      <div className="flex-1 px-10 pt-24 pb-32 relative z-10">
        <header className={`mb-14 transition-all duration-1000 transform ${isReady ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex justify-between items-start mb-10">
            <div className="relative">
              <div className="w-20 h-20 bg-white text-[#4A7FA5] rounded-[2.2rem] flex items-center justify-center border border-slate-100 shadow-[0_15px_35px_rgba(0,0,0,0.05)]">
                <Users size={36} />
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#2D3142] rounded-full flex items-center justify-center text-white text-[10px] font-black border-4 border-[#FAF8F4] shadow-lg">
                1
              </div>
            </div>
            <button className="w-14 h-14 bg-white rounded-[1.8rem] flex items-center justify-center text-slate-300 shadow-sm border border-slate-50 active:scale-90 transition-all">
              <Settings2 size={24} />
            </button>
          </div>
          
          <div className="space-y-3">
            <h2 className="text-[#2D3142] font-black text-6xl tracking-[-0.07em] italic leading-[0.8] mb-6">
              Círculo de <br/>
              <span className="text-[#4A7FA5] not-italic">Confiança.</span>
            </h2>
            <div className="flex items-center gap-3">
              <div className="h-[2px] w-12 bg-[#E8A87C]" />
              <p className="text-[#4A7FA5] text-[10px] font-black uppercase tracking-[0.4em]">Protocolo Família Inovare</p>
            </div>
          </div>
        </header>

        {/* Seleção de Categoria */}
        <div className={`flex gap-8 mb-12 transition-all duration-1000 delay-200 ${isReady ? 'opacity-100' : 'opacity-0'}`}>
          <button 
            onClick={() => setActiveTab('members')}
            className={`text-[11px] font-black uppercase tracking-[0.2em] pb-3 transition-all relative ${activeTab === 'members' ? 'text-[#2D3142]' : 'text-slate-300'}`}
          >
            Membros Ativos
            {activeTab === 'members' && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#E8A87C] rounded-full" />}
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`text-[11px] font-black uppercase tracking-[0.2em] pb-3 transition-all relative ${activeTab === 'security' ? 'text-[#2D3142]' : 'text-slate-300'}`}
          >
            Segurança
            {activeTab === 'security' && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#E8A87C] rounded-full" />}
          </button>
        </div>

        {/* Lista de Cards Premium */}
        <div className={`space-y-6 transition-all duration-1000 delay-400 transform ${isReady ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#4A7FA5]/20 to-transparent rounded-[3.5rem] blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
            <div className="bg-white p-8 rounded-[3.5rem] border border-slate-50 shadow-[0_20px_45px_rgba(0,0,0,0.02)] flex items-center justify-between relative z-10">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-[#2D3142] rounded-[1.8rem] flex items-center justify-center text-white font-black italic text-3xl shadow-2xl relative z-10">
                    A
                  </div>
                  <div className="absolute -top-2 -left-2 w-8 h-8 bg-[#4A7FA5] rounded-full border-4 border-white flex items-center justify-center z-20 shadow-lg">
                    <ShieldCheck size={14} className="text-white" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[#2D3142] font-black text-xl tracking-tight mb-0.5 italic">Artur</p>
                  <div className="flex items-center gap-2">
                    <div className="bg-[#4A7FA5]/10 px-3 py-1 rounded-xl flex items-center gap-2 border border-[#4A7FA5]/10">
                      <UserCheck size={12} className="text-[#4A7FA5]" />
                      <span className="text-[#4A7FA5] text-[9px] font-black uppercase tracking-widest">Master Admin</span>
                    </div>
                  </div>
                </div>
              </div>
              <button className="w-12 h-12 flex items-center justify-center text-slate-200 hover:text-[#2D3142] transition-colors">
                <MoreHorizontal size={28} />
              </button>
            </div>
          </div>

          {/* Botão Convite Estilizado */}
          <button className="w-full py-14 border-4 border-dashed border-slate-100 rounded-[3.8rem] flex flex-col items-center justify-center gap-4 group hover:border-[#4A7FA5]/30 hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-700 relative overflow-hidden">
            <div className="w-18 h-18 bg-[#FAF8F4] rounded-[2rem] flex items-center justify-center text-slate-300 group-hover:text-[#4A7FA5] group-hover:scale-110 transition-all shadow-inner relative z-10">
              <UserPlus size={32} />
            </div>
            <div className="text-center space-y-2 relative z-10">
              <p className="text-[12px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-[#2D3142] transition-colors italic">Expandir Rede</p>
              <p className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.2em]">Adicionar Cuidador ou Familiar</p>
            </div>
            <div className="absolute bottom-0 left-0 w-0 h-1 bg-[#4A7FA5] group-hover:w-full transition-all duration-700" />
          </button>
        </div>
      </div>

      {/* Footer Mestre Consolidado */}
      <footer className={`px-10 pb-16 fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#FAF8F4] via-[#FAF8F4] to-transparent pt-12 transition-all duration-1000 delay-600 ${isReady ? 'opacity-100' : 'opacity-0'}`}>
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[2.8rem] mb-10 flex items-center justify-between border border-white shadow-xl shadow-slate-200/40">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-[#2D3142]/5 rounded-2xl flex items-center justify-center text-[#2D3142]">
              <Lock size={22} />
            </div>
            <div className="space-y-0.5">
              <p className="text-[#2D3142] text-[10px] font-black uppercase tracking-widest">Acesso Seguro</p>
              <p className="text-slate-400 text-[9px] font-bold uppercase tracking-tight">Criptografia Inovare v2.0</p>
            </div>
          </div>
          <Smartphone size={22} className="text-slate-200 animate-pulse" />
        </div>
        
        <button 
          onClick={onNext}
          className="group w-full bg-[#2D3142] text-white py-9 rounded-[3rem] font-black uppercase text-[12px] tracking-[0.5em] shadow-[0_35px_70px_rgba(45,49,66,0.3)] flex items-center justify-center gap-5 active:scale-95 transition-all overflow-hidden relative"
        >
          <span className="relative z-10">Consolidar Painel</span>
          <div className="bg-[#4A7FA5] p-2.5 rounded-[1.2rem] group-hover:translate-x-4 transition-transform relative z-10 shadow-2xl">
            <ChevronRight size={24} />
          </div>
          <div className="absolute top-0 left-[-100%] w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:left-[100%] transition-all duration-1000" />
        </button>
      </footer>
    </div>
  );
}