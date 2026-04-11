import React, { useState } from 'react';
import { 
  ArrowLeft, 
  User, 
  Camera, 
  Star, 
  Droplets, 
  Heart, 
  ShieldAlert, 
  ChevronRight,
  Sparkles,
  Calendar,
  Info
} from 'lucide-react';

interface ElderlyRegistrationProps {
  onBack: () => void;
  onNext: (data: any) => void;
  dadosIniciais: any;
}

export default function ElderlyRegistration({ onBack, onNext, dadosIniciais }: ElderlyRegistrationProps) {
  const [nome, setNome] = useState(dadosIniciais?.nome || '');
  const [apelido, setApelido] = useState(dadosIniciais?.apelido || '');
  const [genero, setGenero] = useState(dadosIniciais?.genero || 'masculino');
  const [sangue, setSangue] = useState(dadosIniciais?.sangue || '');
  const [rh, setRh] = useState(dadosIniciais?.rh || '+');
  const [obs, setObs] = useState(dadosIniciais?.obs || '');

  return (
    <div className="min-h-screen bg-[#FAF8F4] font-sans pb-16 overflow-x-hidden animate-in fade-in duration-700">
      {/* BACKGROUND DECORATION */}
      <div className="fixed -top-24 -right-24 w-64 h-64 bg-[#4A7FA5]/5 rounded-full blur-3xl" />
      <div className="fixed top-1/2 -left-32 w-80 h-80 bg-[#E8A87C]/5 rounded-full blur-3xl" />

      <header className="relative p-8 pb-4 z-10">
        <button 
          onClick={onBack}
          className="mb-8 flex items-center text-[#4A7FA5] font-black uppercase text-[10px] tracking-[0.3em] group active:scale-95 transition-all"
        >
          <div className="w-10 h-10 rounded-full bg-white shadow-md shadow-slate-200/50 flex items-center justify-center mr-4 group-hover:bg-[#4A7FA5] group-hover:text-white transition-all">
            <ArrowLeft size={16} />
          </div>
          Voltar
        </button>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-[#4A7FA5]/10 text-[#4A7FA5] px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em]">
              Passo 01 de 03
            </span>
          </div>
          <h1 className="text-4xl font-black text-[#2D3142] tracking-tighter italic leading-[0.9]">
            Perfil do <span className="text-[#E8A87C]">Idoso</span>
          </h1>
          <p className="text-slate-400 text-sm font-bold leading-relaxed max-w-[260px] pt-3 flex items-center gap-2">
            <Info size={14} className="text-[#4A7FA5] shrink-0" />
            Personalize as informações para um cuidado exclusivo.
          </p>
        </div>
      </header>

      <div className="relative px-8 mt-8 space-y-10 z-10">
        {/* SEÇÃO 01: FOTO E IDENTIDADE VISUAL */}
        <section className="flex flex-col items-center">
          <div className="relative group">
            <div className="w-40 h-40 bg-white rounded-[3.5rem] shadow-2xl shadow-slate-200 flex items-center justify-center border-8 border-white overflow-hidden transition-transform group-hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-50 to-white opacity-50" />
              <User size={80} className="text-slate-200 relative z-10" />
              
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors" />
            </div>
            <button className="absolute -bottom-2 -right-2 bg-[#4A7FA5] p-4 rounded-3xl text-white shadow-xl shadow-[#4A7FA5]/30 hover:bg-[#3d6a8a] active:scale-90 transition-all border-4 border-[#FAF8F4]">
              <Camera size={22} />
            </button>
          </div>

          <div className="mt-10 w-full space-y-3">
            <label className="text-[10px] font-black text-[#4A7FA5] uppercase ml-4 tracking-[0.2em] flex items-center gap-2">
              <Star size={12} className="fill-[#4A7FA5]" /> 
              Como deseja ser chamado?
            </label>
            <input 
              type="text"
              placeholder="Ex: Vovô Albert" 
              className="w-full p-6 rounded-[2rem] bg-white shadow-xl shadow-slate-200/30 border-2 border-transparent focus:border-[#4A7FA5] outline-none font-bold text-[#2D3142] text-lg transition-all placeholder:text-slate-200"
              value={apelido}
              onChange={(e) => setApelido(e.target.value)}
            />
          </div>
        </section>

        {/* SEÇÃO 02: DADOS CADASTRAIS */}
        <section className="space-y-5">
          <div className="flex items-center gap-3 ml-4">
            <Sparkles size={14} className="text-[#E8A87C]" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-slate-400">Dados Gerais</span>
          </div>

          <div className="bg-white p-8 rounded-[3rem] shadow-2xl shadow-slate-200/50 space-y-6 border border-white/50">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Nome Completo</label>
              <input 
                type="text"
                placeholder="Insira o nome completo" 
                className="w-full p-5 rounded-2xl bg-[#FAF8F4] border-2 border-transparent focus:border-[#4A7FA5] focus:bg-white outline-none font-bold text-[#2D3142] transition-all"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={() => setGenero('masculino')}
                className={`p-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all ${
                  genero === 'masculino' 
                  ? 'bg-[#2D3142] text-white shadow-lg scale-[1.02]' 
                  : 'bg-[#FAF8F4] text-slate-400 hover:bg-slate-100'
                }`}
              >
                Masculino
              </button>
              <button 
                type="button"
                onClick={() => setGenero('feminino')}
                className={`p-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all ${
                  genero === 'feminino' 
                  ? 'bg-[#2D3142] text-white shadow-lg scale-[1.02]' 
                  : 'bg-[#FAF8F4] text-slate-400 hover:bg-slate-100'
                }`}
              >
                Feminino
              </button>
            </div>
          </div>
        </section>

        {/* SEÇÃO 03: DADOS MÉDICOS VITAIS */}
        <section className="space-y-5">
          <div className="flex items-center gap-3 ml-4">
            <Heart size={14} className="text-red-400" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-slate-400">Saúde & Alerta</span>
          </div>

          <div className="bg-white p-8 rounded-[3rem] shadow-2xl shadow-slate-200/50 space-y-8 border border-white/50">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[9px] font-black text-[#E8A87C] uppercase ml-2 tracking-widest flex items-center gap-2">
                  <Droplets size={12} /> Sangue
                </label>
                <div className="relative">
                  <select 
                    className="w-full p-5 rounded-2xl bg-[#FAF8F4] border-2 border-transparent focus:border-[#E8A87C] outline-none font-black text-[#2D3142] appearance-none cursor-pointer"
                    value={sangue}
                    onChange={(e) => setSangue(e.target.value)}
                  >
                    <option value="">--</option>
                    {['A', 'B', 'AB', 'O'].map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                    <ChevronRight size={16} className="rotate-90" />
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[9px] font-black text-[#E8A87C] uppercase ml-2 tracking-widest">Fator RH</label>
                <div className="flex gap-2 p-1 bg-[#FAF8F4] rounded-[1.2rem]">
                  {['+', '-'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setRh(type)}
                      className={`flex-1 py-4 rounded-xl font-black text-lg transition-all ${
                        rh === type 
                        ? 'bg-white text-[#E8A87C] shadow-sm' 
                        : 'text-slate-300 hover:text-slate-400'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest flex items-center gap-2">
                <ShieldAlert size={12} className="text-red-400" /> Observações Médicas Críticas
              </label>
              <textarea 
                placeholder="Ex: Alergia a Dipirona, Hipertenso, usa marcapasso..."
                className="w-full p-6 rounded-[2rem] bg-[#FAF8F4] border-2 border-transparent focus:border-[#E8A87C] focus:bg-white outline-none font-bold text-[#2D3142] text-sm leading-relaxed h-40 resize-none transition-all placeholder:text-slate-300"
                value={obs}
                onChange={(e) => setObs(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* AÇÃO FINAL */}
        <div className="pt-8 space-y-6">
          <button 
            onClick={() => onNext({ nome, apelido, genero, sangue, rh, obs })}
            className="w-full py-8 bg-[#2D3142] text-white rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.4em] flex items-center justify-center gap-4 shadow-2xl shadow-[#2D3142]/40 active:scale-95 transition-all group"
          >
            Próximo Passo
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <div className="flex flex-col items-center gap-2 opacity-30">
            <ShieldAlert size={16} className="text-[#2D3142]" />
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#2D3142]">
              Dados Protegidos pela Agência Inovare
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}