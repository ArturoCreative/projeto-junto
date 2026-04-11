import React, { useState } from 'react';
import { ArrowLeft, DollarSign, TrendingUp, TrendingDown, Plus, CreditCard } from 'lucide-react';

export default function Finance({ onNavigate }: any) {
  return (
    <div className="min-h-screen bg-[#FAF8F4] font-sans pb-10">
      <div className="p-8 pb-4">
        <button onClick={() => onNavigate('dashboard')} className="mb-6 flex items-center text-[#E8A87C] font-black uppercase text-[10px] tracking-[0.2em]">
          <ArrowLeft size={16} className="mr-2" /> Painel Principal
        </button>
        
        <p className="text-[#E8A87C] text-[10px] font-black uppercase tracking-[0.2em] mb-1">Gestão Financeira</p>
        <h1 className="text-3xl font-black text-[#2D3142] tracking-tighter italic">Carteira</h1>
      </div>

      <div className="px-8 space-y-6">
        {/* CARD DE SALDO */}
        <div className="bg-[#2D3142] p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
          <p className="text-[10px] font-black uppercase opacity-60 tracking-[0.2em] mb-2">Saldo em Caixa</p>
          <h2 className="text-3xl font-black mb-6">R$ 1.240,50</h2>
          
          <div className="flex gap-4">
            <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl border border-white/10">
              <TrendingUp size={14} className="text-green-400" />
              <span className="text-[10px] font-black tracking-widest uppercase">Entradas</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-xl border border-white/10">
              <TrendingDown size={14} className="text-red-400" />
              <span className="text-[10px] font-black tracking-widest uppercase">Saídas</span>
            </div>
          </div>
        </div>

        {/* LISTA DE ÚLTIMOS GASTOS */}
        <div className="space-y-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Últimos Lançamentos</p>
          
          <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between border border-slate-50">
            <div className="flex items-center gap-4">
              <div className="bg-red-50 p-3 rounded-xl text-red-400"><CreditCard size={18} /></div>
              <div>
                <p className="font-bold text-[#2D3142] text-sm">Farmácia Droga Raia</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">11 Abr 2026 • Saúde</p>
              </div>
            </div>
            <p className="font-black text-red-500">- R$ 89,90</p>
          </div>
        </div>

        <button className="w-full py-6 bg-[#E8A87C] text-white rounded-[2rem] font-black flex items-center justify-center gap-3 shadow-xl shadow-[#E8A87C]/20 active:scale-95 transition-transform">
          <Plus size={20} /> ADICIONAR DESPESA
        </button>
      </div>
    </div>
  );
}