import React, { useState } from 'react';
import { ArrowLeft, DollarSign, ChevronRight, ArrowDownRight, Plus, X } from 'lucide-react';

export default function Finance({ onNavigate, idoso }: any) {
  const [showAdd, setShowAdd] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const nomeExibicao = idoso?.apelido || idoso?.nome || "Idoso";

  return (
    <div className="min-h-screen bg-[#FAF8F4] pb-32 animate-in fade-in duration-700">
      {(showAdd || generatingPDF) && (
        <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-md flex items-end">
          <div className="bg-white w-full rounded-t-[4rem] p-10 pb-20 space-y-8 animate-in slide-in-from-bottom duration-500 shadow-[0_-20px_50px_rgba(0,0,0,0.3)]">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-black italic text-[#2D3142] tracking-tighter uppercase text-[10px] tracking-widest">{showAdd ? 'Novo Lançamento' : 'Gerando Extrato'}</h2>
              <button onClick={() => { setShowAdd(false); setGeneratingPDF(false); }} className="p-3 bg-slate-100 rounded-full"><X size={20}/></button>
            </div>
            {showAdd ? (
              <div className="space-y-6">
                <input type="text" placeholder="R$ 0,00" className="w-full p-8 bg-[#FAF8F4] rounded-[2rem] text-5xl font-black text-center text-[#E8A87C] outline-none border-2 border-transparent focus:border-[#E8A87C]/10" />
                <input type="text" placeholder="Onde foi gasto?" className="w-full p-6 bg-[#FAF8F4] rounded-2xl font-bold outline-none border-2 border-transparent focus:border-[#4A7FA5]/10" />
              </div>
            ) : ( <p className="py-10 text-center text-slate-400 font-bold italic">Processando movimentações para exportação...</p> )}
            <button onClick={() => { setShowAdd(false); setGeneratingPDF(false); }} className="w-full py-8 bg-[#2D3142] text-white rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl">Confirmar</button>
          </div>
        </div>
      )}

      <header className="p-8">
        <button onClick={() => onNavigate('dashboard')} className="flex items-center text-[#4A7FA5] font-black uppercase text-[10px] tracking-[0.3em] mb-8 active:scale-95 transition-all">
          <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center mr-4"><ArrowLeft size={16}/></div>
          Painel
        </button>
        <h1 className="text-4xl font-black text-[#2D3142] italic tracking-tighter leading-none">Gastos de <span className="text-[#E8A87C]">{nomeExibicao}</span></h1>
      </header>

      <div className="px-8 space-y-8">
        <section className="bg-[#2D3142] p-10 rounded-[3.5rem] text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10"><p className="text-[10px] font-black uppercase opacity-50 mb-2">Saldo em Caixa</p><h2 className="text-5xl font-black italic leading-none mb-2">R$ 1.450,00</h2><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/><span className="text-[8px] font-black text-green-400 uppercase tracking-widest">Atualizado agora</span></div></div>
          <DollarSign className="absolute -right-12 -bottom-12 w-56 h-56 opacity-5 rotate-12" />
        </section>

        <section className="space-y-5">
          <div className="flex justify-between items-center px-2"><span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Extrato Recente</span><button onClick={() => setShowAdd(true)} className="bg-[#E8A87C] p-3 rounded-2xl text-white shadow-lg active:scale-90 transition-all"><Plus size={20}/></button></div>
          <div className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-white flex justify-between items-center group active:scale-95 transition-all">
            <div className="flex items-center gap-4"><div className="w-14 h-14 bg-red-50 text-red-400 rounded-2xl flex items-center justify-center"><ArrowDownRight size={24}/></div><div><p className="font-black text-[#2D3142] text-sm">Farmácia</p><p className="text-[10px] font-bold text-slate-300 uppercase mt-1">13 Abr • 10:30</p></div></div>
            <p className="font-black text-red-500 text-lg">- R$ 45,90</p>
          </div>
        </section>

        <button onClick={() => setGeneratingPDF(true)} className="w-full py-8 bg-[#2D3142] text-white rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4">Extrato Completo <ChevronRight size={20}/></button>
      </div>
    </div>
  );
}