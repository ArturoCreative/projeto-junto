import React from 'react';
import { ArrowLeft, Activity } from 'lucide-react';

export default function Health({ onNavigate, idoso }: any) {
  return (
    <div className="p-8 bg-[#FAF8F4] min-h-screen font-sans">
      <button onClick={() => onNavigate('dashboard')} className="mb-6 flex items-center text-[#4A7FA5] font-black uppercase text-[10px] tracking-widest">
        <ArrowLeft size={16} className="mr-2" /> VOLTAR
      </button>
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm">
        <div className="w-12 h-12 bg-[#4A7FA5]/10 rounded-2xl flex items-center justify-center text-[#4A7FA5] mb-4">
          <Activity size={24} />
        </div>
        <h2 className="text-2xl font-black text-[#2D3142] mb-2">Saúde e Bem-estar</h2>
        <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-6">Controle de Sinais Vitais</p>
        <div className="p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-center text-slate-400 font-bold text-xs">
          Nenhum sinal vital registrado para {idoso?.nome || 'Einstein'} hoje.
        </div>
      </div>
    </div>
  );
}