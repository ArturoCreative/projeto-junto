import React, { useState } from 'react';
import { Heart, DollarSign, Users, Bell, Settings, Plus, Search, Clock, MoreHorizontal, X, ChevronRight } from 'lucide-react';

export default function Dashboard({ idoso, familia, onNavigate }: any) {
  const [modal, setModal] = useState<{open: boolean, title: string}>({ open: false, title: '' });

  // Fallbacks de segurança para evitar quebra de renderização
  const nomeExibicao = idoso?.apelido || idoso?.nome || "Carregando...";
  const iniciais = idoso?.nome ? idoso.nome.substring(0, 2).toUpperCase() : "JD";

  return (
    <div className="min-h-screen bg-[#FAF8F4] pb-40 animate-in fade-in duration-500">
      {modal.open && (
        <div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-xs rounded-[3rem] p-10 shadow-2xl animate-in zoom-in">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-black text-[#2D3142] uppercase text-[10px] tracking-widest italic">{modal.title}</h3>
              <button onClick={() => setModal({open: false, title: ''})} className="p-2 bg-slate-100 rounded-full"><X size={18}/></button>
            </div>
            <p className="text-slate-400 font-bold text-sm italic py-4 text-center">Módulo em integração.</p>
            <button onClick={() => setModal({open: false, title: ''})} className="w-full py-4 bg-[#2D3142] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg">Fechar</button>
          </div>
        </div>
      )}

      <header className="p-8 pb-4 flex justify-between items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/><span className="text-[#4A7FA5] text-[10px] font-black uppercase tracking-[0.3em]">Online</span></div>
          <h1 className="text-3xl font-black text-[#2D3142] tracking-tighter italic">Painel <span className="text-[#E8A87C]">Junto</span></h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setModal({open: true, title: 'Busca'})} className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center"><Search size={20}/></button>
          <button onClick={() => setModal({open: true, title: 'Notificações'})} className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center relative"><Bell size={20}/><span className="absolute top-3 right-3 w-2.5 h-2.5 bg-[#E8A87C] rounded-full" /></button>
        </div>
      </header>

      <div className="px-8 py-6">
        <div className="bg-white p-8 rounded-[3.5rem] shadow-2xl border border-white relative overflow-hidden">
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-20 h-20 rounded-[2rem] bg-slate-100 flex items-center justify-center text-[#4A7FA5] font-black text-xl italic border-4 border-[#FAF8F4] overflow-hidden shadow-inner">
              {idoso?.foto ? <img src={idoso.foto} alt="Perfil" className="w-full h-full object-cover" /> : iniciais}
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#2D3142] tracking-tight">{nomeExibicao}</h2>
              <div className="flex gap-2 mt-1">
                <span className="bg-[#4A7FA5]/10 text-[#4A7FA5] px-3 py-1 rounded-full text-[9px] font-black uppercase">{idoso?.sangue || 'O'}{idoso?.rh || '+'}</span>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-slate-50 flex justify-between items-center">
            <div className="space-y-1"><p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Observação</p><p className="text-[11px] font-bold text-[#2D3142] italic">{idoso?.obs || "Nenhum alerta crítico."}</p></div>
            <button onClick={() => setModal({open: true, title: 'Editar Obs.'})} className="w-10 h-10 bg-[#FAF8F4] rounded-xl flex items-center justify-center text-slate-400"><MoreHorizontal size={18}/></button>
          </div>
        </div>
      </div>

      <div className="px-8 space-y-10 mt-4">
        <section className="grid grid-cols-2 gap-6">
          <div onClick={() => onNavigate('health')} className="bg-[#4A7FA5] p-8 rounded-[3rem] text-white shadow-2xl cursor-pointer active:scale-95 transition-all"><Heart size={24} className="mb-8 fill-white"/><p className="font-black italic">Saúde</p></div>
          <div onClick={() => onNavigate('finance')} className="bg-white p-8 rounded-[3rem] text-[#2D3142] shadow-xl border border-white cursor-pointer active:scale-95 transition-all"><DollarSign size={24} className="mb-8 text-[#E8A87C]"/><p className="font-black italic">Finanças</p></div>
        </section>

        <section className="space-y-6">
          <div className="flex justify-between items-end px-2"><h3 className="text-lg font-black text-[#2D3142]">Rotina Hoje</h3><button onClick={() => setModal({open: true, title: 'Nova Atividade'})} className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-[#4A7FA5]"><Plus size={18}/></button></div>
          <div onClick={() => onNavigate('timeline')} className="bg-white p-6 rounded-[2.5rem] shadow-xl border border-white flex items-center gap-5 cursor-pointer hover:border-[#4A7FA5]/20 transition-all">
            <div className="w-14 h-14 bg-[#FAF8F4] rounded-2xl flex flex-col items-center justify-center font-black text-[#4A7FA5] text-[10px]"><Clock size={18} className="mb-1"/>15:30</div>
            <div className="flex-1 font-black text-[#2D3142] text-sm italic">Consulta Cardiologista</div>
            <ChevronRight size={18} className="text-slate-200" />
          </div>
        </section>
      </div>

      <nav className="fixed bottom-8 left-8 right-8 z-50">
        <div className="bg-[#2D3142] h-24 rounded-[3rem] shadow-2xl flex items-center justify-around px-6">
          <button onClick={() => setModal({open: true, title: 'Settings'})} className="p-4 text-white/40"><Settings size={22}/></button>
          <button onClick={() => setModal({open: true, title: 'Adicionar'})} className="p-6 bg-[#E8A87C] text-white rounded-[2.2rem] -translate-y-10 border-[6px] border-[#FAF8F4] active:scale-90 shadow-xl"><Plus size={28}/></button>
          <button onClick={() => onNavigate('family')} className="p-4 text-white/40"><Users size={22}/></button>
        </div>
      </nav>
    </div>
  );
}