import React from 'react';
import { ArrowLeft, Activity, Heart, Droplets, Plus } from 'lucide-react';

export default function Health({ onNavigate, idoso }: any) {
  const nomeIdoso = idoso?.nome || "Einstein";

  return (
    <div className="min-h-screen bg-[#FAF8F4] font-sans pb-10">
      <div className="p-8 pb-4">
        <button onClick={() => onNavigate('dashboard')} className="mb-6 flex items-center text-[#4A7FA5] font-black uppercase text-[10px] tracking-[0.2em]">
          <ArrowLeft size={16} className="mr-2" /> VOLTAR
        </button>
        <p className="text-[#4A7FA5] text-[10px] font-black uppercase tracking-[0.2em] mb-1">Saúde & Bem-estar</p>
        <h1 className="text-3xl font-black text-[#2D3142] tracking-tighter italic">Monitoramento</h1>
      </div>

      <div className="px-8 space-y-6">
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-[#4A7FA5] rounded-2xl flex items-center justify-center text-white">
              <Activity size={24} />
            </div>
            <div>
              <p className="font-black text-[#2D3142]">{nomeIdoso}</p>
              <p className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Sinais Estáveis</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-2xl">
              <Heart size={16} className="text-red-400 mb-2" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pressão</p>
              <p className="font-black text-[#2D3142]">12/8</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl">
              <Droplets size={16} className="text-blue-400 mb-2" />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Glicemia</p>
              <p className="font-black text-[#2D3142]">98</p>
            </div>
          </div>
        </div>
        <button className="w-full py-6 bg-[#4A7FA5] text-white rounded-[2rem] font-black flex items-center justify-center gap-3 shadow-xl">
          <Plus size={20} /> NOVO REGISTRO
        </button>
      </div>
    </div>
  );
}