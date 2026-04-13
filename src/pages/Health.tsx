import React, { useState } from 'react';
import { ArrowLeft, Heart, Pill, Thermometer, ChevronRight, Plus, X } from 'lucide-react';

export default function Health({ onNavigate, idoso }: any) {
  const [modal, setModal] = useState<string | null>(null);
  const nomeExibicao = idoso?.apelido || idoso?.nome || "Idoso";

  return (
    <div className="min-h-screen bg-[#FAF8F4] pb-32 animate-in fade-in duration-700">
      {modal && (
        <div className="fixed inset-0 z-[150] bg-black/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-xs rounded-[3rem] p-10 space-y-6 animate-in slide-in-from-bottom duration-500">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-black text-xl text-[#2D3142] italic">{modal}</h2>
              <button onClick={() => setModal(null)} className="p-2 bg-slate-100 rounded-full"><X size={18}/></button>
            </div>
            {modal.includes('Relatório') ? (
              <p className="text-slate-400 font-bold text-sm italic py-4">Sincronizando prontuário Inovare para PDF...</p>
            ) : (
              <input type="text" placeholder="Nome do Medicamento" className="w-full p-6 bg-slate-50 rounded-2xl outline-none font-bold text-[#2D3142]" />
            )}
            <button onClick={() => setModal(null)} className="w-full py-6 bg-[#4A7FA5] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl">Confirmar</button>
          </div>
        </div>
      )}

      <header className="p-8">
        <button onClick={() => onNavigate('dashboard')} className="flex items-center text-[#4A7FA5] font-black uppercase text-[10px] tracking-[0.3em] mb-8 active:scale-95 transition-all">
          <div className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center mr-4"><ArrowLeft size={16}/></div>
          Painel
        </button>
        <h1 className="text-4xl font-black text-[#2D3142] italic tracking-tighter">Saúde de <span className="text-[#E8A87C]">{nomeExibicao}</span></h1>
      </header>

      <div className="px-8 space-y-8">
        <div className="bg-[#2D3142] p-10 rounded-[3.5rem] shadow-2xl flex justify-around text-white">
          <div className="text-center"><Heart size={20} className="text-red-400 mb-2 mx-auto animate-pulse"/><p className="text-3xl font-black italic">12/8</p></div>
          <div className="w-px h-10 bg-white/10" />
          <div className="text-center"><Thermometer size={20} className="text-orange-400 mb-2 mx-auto"/><p className="text-3xl font-black italic">36.5°</p></div>
        </div>

        <section className="space-y-4">
          <div className="flex justify-between items-center px-2"><span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Medicamentos</span><button onClick={() => setModal('Novo Medicamento')} className="bg-white p-3 rounded-2xl shadow-md text-[#4A7FA5]"><Plus size={18}/></button></div>
          <div onClick={() => setModal('Editar Medicamento')} className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-white flex justify-between items-center cursor-pointer active:scale-95 transition-all">
            <div className="flex items-center gap-4"><div className="w-14 h-14 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center"><Pill size={24}/></div><div><p className="font-black text-[#2D3142] text-sm leading-none">Losartana 50mg</p><p className="text-[9px] font-bold text-slate-300 uppercase mt-1">08:00 • Próxima Dose</p></div></div>
            <ChevronRight size={18} className="text-slate-200"/>
          </div>
        </section>

        <button onClick={() => setModal('Gerando Relatório')} className="w-full py-8 bg-[#2D3142] text-white rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.4em] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-4">Relatório Completo <ChevronRight size={20}/></button>
      </div>
    </div>
  );
}