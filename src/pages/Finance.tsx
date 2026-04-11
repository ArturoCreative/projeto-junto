import React from 'react';
import { ArrowLeft, DollarSign } from 'lucide-react';

export default function Finance({ onNavigate }: any) {
  return (
    <div className="p-8 bg-[#FAF8F4] min-h-screen font-sans">
      <button onClick={() => onNavigate('dashboard')} className="mb-6 flex items-center text-[#E8A87C] font-black uppercase text-[10px] tracking-widest">
        <ArrowLeft size={16} className="mr-2" /> VOLTAR
      </button>
      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm">
        <div className="w-12 h-12 bg-[#E8A87C]/10 rounded-2xl flex items-center justify-center text-[#E8A87C] mb-4">
          <DollarSign size={24} />
        </div>
        <h2 className="text-2xl font-black text-[#2D3142] mb-2">Finanças</h2>
        <p className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-6">Gestão de Gastos Mensais</p>
        <div className="p-4 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-center text-slate-400 font-bold text-xs">
          Nenhuma despesa lançada hoje.
        </div>
      </div>
    </div>
  );
}