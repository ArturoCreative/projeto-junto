import React, { useState } from 'react';
import {
  Bell,
  Settings,
  ChevronRight,
  Activity,
  Calendar,
  Users,
  Heart,
  DollarSign,
  Home as HomeIcon,
  Clock,
  ShieldCheck,
  Plus,
  ArrowUpRight,
  MoreVertical,
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (screen: any) => void;
  idoso: { nome: string; genero: string };
  membros: any[];
}

export default function Dashboard({
  onNavigate,
  idoso,
  membros,
}: DashboardProps) {
  const [showPlusMenu, setShowPlusMenu] = useState(false);

  // DATA CONFIGURADA PARA HOJE
  const dataHoje = '11 de Abril de 2026';

  // LÓGICA DE GÊNERO DINÂMICA
  const nomeExibicao = idoso.nome || 'Einstein';
  const adjetivoStatus =
    idoso.genero === 'masculino'
      ? 'animado e sorridente'
      : 'animada e sorridente';

  return (
    <div className="min-h-screen bg-[#FAF8F4] font-sans pb-32 overflow-x-hidden">
      {/* HEADER COMPLETO */}
      <header className="p-8 pb-4 flex justify-between items-start animate-in fade-in duration-700">
        <div>
          <p className="text-[#4A7FA5] text-[10px] font-black uppercase tracking-[0.2em] mb-1">
            {dataHoje}
          </p>
          <h1 className="text-3xl font-black text-[#2D3142] tracking-tighter italic">
            Olá, Artur!
          </h1>
        </div>
        <div className="flex gap-3">
          <button className="p-4 bg-white rounded-2xl shadow-sm text-[#4A7FA5] hover:bg-slate-50 transition-colors">
            <Bell size={20} />
          </button>
          <button className="p-4 bg-white rounded-2xl shadow-sm text-[#4A7FA5] hover:bg-slate-50 transition-colors">
            <Settings size={20} />
          </button>
        </div>
      </header>

      <div className="px-8 space-y-6">
        {/* CARD PRINCIPAL - STATUS DO IDOSO COM LÓGICA DE GÊNERO */}
        <div className="bg-[#4A7FA5] p-8 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/30">
                  <Heart size={24} className="text-white" fill="white" />
                </div>
                <span className="font-bold text-sm opacity-90">
                  {nomeExibicao} está bem
                </span>
              </div>
              <div className="bg-white/10 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10">
                IA Update
              </div>
            </div>

            <h2 className="text-2xl font-black leading-tight mb-6 italic text-[#E8A87C]">
              "{nomeExibicao} estava {adjetivoStatus} às 10:00 por João."
            </h2>

            <div className="flex items-center justify-between">
              <button className="bg-white text-[#4A7FA5] py-3 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg active:scale-95 transition-transform">
                Ver Relatório <ChevronRight size={14} />
              </button>
              <div className="flex -space-x-3">
                {membros.slice(0, 3).map((m, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-[#4A7FA5] bg-slate-200 flex items-center justify-center text-[10px] font-black text-[#4A7FA5]"
                  >
                    {m.nome.charAt(0)}
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Grafismo de fundo */}
          <Activity className="absolute -right-10 -bottom-10 w-48 h-48 text-white/5 rotate-12" />
        </div>

        {/* SEÇÃO DE AÇÕES RÁPIDAS */}
        <div className="grid grid-cols-2 gap-4">
          {/* DIÁRIO */}
          <button
            onClick={() => onNavigate('timeline')}
            className="bg-white p-6 rounded-[2.3rem] shadow-sm text-left group active:scale-95 transition-all border-2 border-transparent hover:border-[#E8A87C]"
          >
            <div className="w-12 h-12 bg-[#FAF8F4] rounded-2xl flex items-center justify-center text-[#E8A87C] mb-4 group-hover:scale-110 transition-transform">
              <Calendar size={22} />
            </div>
            <p className="font-black text-[#2D3142] text-sm tracking-tight">
              Diário
            </p>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
              Linha do tempo
            </p>
          </button>

          {/* SAÚDE */}
          <button
            onClick={() => onNavigate('health')}
            className="bg-white p-6 rounded-[2.3rem] shadow-sm text-left group active:scale-95 transition-all border-2 border-transparent hover:border-[#4A7FA5]"
          >
            <div className="w-12 h-12 bg-[#FAF8F4] rounded-2xl flex items-center justify-center text-[#4A7FA5] mb-4 group-hover:scale-110 transition-transform">
              <ShieldCheck size={22} />
            </div>
            <p className="font-black text-[#2D3142] text-sm tracking-tight">
              Saúde
            </p>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
              Sinais Vitais
            </p>
          </button>

          {/* FAMÍLIA */}
          <button
            onClick={() => onNavigate('family')}
            className="bg-white p-6 rounded-[2.3rem] shadow-sm text-left group active:scale-95 transition-all border-2 border-transparent hover:border-[#4A7FA5]"
          >
            <div className="w-12 h-12 bg-[#FAF8F4] rounded-2xl flex items-center justify-center text-[#4A7FA5] mb-4 group-hover:scale-110 transition-transform">
              <Users size={22} />
            </div>
            <p className="font-black text-[#2D3142] text-sm tracking-tight">
              Família
            </p>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
              {membros.length} Membros
            </p>
          </button>

          {/* FINANÇAS */}
          <button
            onClick={() => onNavigate('finance')}
            className="bg-white p-6 rounded-[2.3rem] shadow-sm text-left group active:scale-95 transition-all border-2 border-transparent hover:border-[#E8A87C]"
          >
            <div className="w-12 h-12 bg-[#FAF8F4] rounded-2xl flex items-center justify-center text-[#E8A87C] mb-4 group-hover:scale-110 transition-transform">
              <DollarSign size={22} />
            </div>
            <p className="font-black text-[#2D3142] text-sm tracking-tight">
              Finanças
            </p>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
              Gastos do mês
            </p>
          </button>
        </div>

        {/* CARD DE ÚLTIMO REGISTRO COM OPÇÃO DE EDITAR */}
        <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-4">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Última Atividade
            </span>
            <MoreVertical size={16} className="text-slate-300" />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-2 h-12 bg-[#E8A87C] rounded-full"></div>
            <div className="flex-1">
              <p className="font-bold text-[#2D3142] text-sm">
                Almoço realizado
              </p>
              <p className="text-xs text-slate-400 font-medium">
                Hoje, 12:30 • Por Ana (Cuidadora)
              </p>
            </div>
            <button className="text-[#4A7FA5] font-black text-[10px] uppercase tracking-widest hover:underline">
              Editar
            </button>
          </div>
        </div>
      </div>

      {/* MENU FLUTUANTE DO BOTÃO + */}
      {showPlusMenu && (
        <div
          className="fixed inset-0 bg-[#2D3142]/40 backdrop-blur-sm z-50 flex flex-col justify-end p-8 animate-in fade-in duration-300"
          onClick={() => setShowPlusMenu(false)}
        >
          <div
            className="bg-white rounded-[3rem] p-6 space-y-4 mb-24 animate-in slide-in-from-bottom-10"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-center text-[10px] font-black text-[#4A7FA5] uppercase tracking-[0.3em] mb-4">
              Novo Registro
            </p>
            <button
              onClick={() => onNavigate('timeline')}
              className="w-full p-5 bg-[#FAF8F4] rounded-2xl flex items-center justify-between font-bold text-[#2D3142]"
            >
              Registrar Rotina{' '}
              <ArrowUpRight size={18} className="text-[#E8A87C]" />
            </button>
            <button
              onClick={() => onNavigate('health')}
              className="w-full p-5 bg-[#FAF8F4] rounded-2xl flex items-center justify-between font-bold text-[#2D3142]"
            >
              Sinal Vital / Saúde{' '}
              <ArrowUpRight size={18} className="text-[#4A7FA5]" />
            </button>
            <button
              onClick={() => onNavigate('finance')}
              className="w-full p-5 bg-[#FAF8F4] rounded-2xl flex items-center justify-between font-bold text-[#2D3142]"
            >
              Gasto / Compra{' '}
              <ArrowUpRight size={18} className="text-[#E8A87C]" />
            </button>
          </div>
        </div>
      )}

      {/* TAB BAR INFERIOR ESTILIZADA */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-slate-100 px-8 py-6 flex justify-between items-center z-40">
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex flex-col items-center gap-1 text-[#4A7FA5]"
        >
          <HomeIcon size={24} fill="currentColor" />
          <span className="text-[9px] font-black uppercase tracking-widest">
            Home
          </span>
        </button>
        <button
          onClick={() => onNavigate('timeline')}
          className="flex flex-col items-center gap-1 text-slate-300 hover:text-[#4A7FA5]"
        >
          <Clock size={24} />
          <span className="text-[9px] font-black uppercase tracking-widest">
            Dia
          </span>
        </button>

        {/* BOTÃO CENTRAL ATIVO */}
        <div
          onClick={() => setShowPlusMenu(true)}
          className="bg-[#E8A87C] p-4 rounded-[2rem] shadow-lg shadow-[#E8A87C]/40 -mt-14 border-[6px] border-[#FAF8F4] active:scale-90 transition-transform cursor-pointer"
        >
          <Plus size={32} className="text-white" />
        </div>

        <button
          onClick={() => onNavigate('health')}
          className="flex flex-col items-center gap-1 text-slate-300 hover:text-[#4A7FA5]"
        >
          <Heart size={24} />
          <span className="text-[9px] font-black uppercase tracking-widest">
            Saúde
          </span>
        </button>
        <button
          onClick={() => onNavigate('finance')}
          className="flex flex-col items-center gap-1 text-slate-300 hover:text-[#4A7FA5]"
        >
          <DollarSign size={24} />
          <span className="text-[9px] font-black uppercase tracking-widest">
            Money
          </span>
        </button>
      </nav>
    </div>
  );
}
