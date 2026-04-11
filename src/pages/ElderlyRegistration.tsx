import React, { useState } from 'react';
import { 
  ArrowLeft, 
  User, 
  Calendar, 
  Droplets, 
  Activity, 
  FileText, 
  ChevronRight,
  Heart,
  ShieldAlert
} from 'lucide-react';

interface ElderlyRegistrationProps {
  onBack: () => void;
  onNext: (data: any) => void;
  dadosIniciais: any;
}

export default function ElderlyRegistration({ onBack, onNext, dadosIniciais }: ElderlyRegistrationProps) {
  // Mantendo o estado para salvar o que já foi feito
  const [nome, setNome] = useState(dadosIniciais?.nome || '');
  const [genero, setGenero] = useState(dadosIniciais?.genero || 'masculino');
  const [dataNascimento, setDataNascimento] = useState(dadosIniciais?.dataNascimento || '');
  const [sangue, setSangue] = useState(dadosIniciais?.sangue || '');
  const [rh, setRh] = useState(dadosIniciais?.rh || '+');
  const [obs, setObs] = useState(dadosIniciais?.obs || '');

  return (
    <div className="min-h-screen bg-[#FAF8F4] font-sans pb-12 overflow-x-hidden animate-in fade-in duration-500">
      {/* HEADER ESTILIZADO ORIGINAL */}
      <header className="p-8 pb-4">
        <button 
          onClick={onBack}
          className="mb-8 flex items-center text-[#4A7FA5] font-black uppercase text-[10px] tracking-[0.3em] group active:scale-95 transition-all"
        >
          <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center mr-3 group-hover:bg-[#4A7FA5] group-hover:text-white transition-colors">
            <ArrowLeft size={14} />
          </div>
          Voltar
        </button>

        <div className="space-y-1">
          <p className="text-[#4A7FA5] text-[10px] font-black uppercase tracking-[0.2em] opacity-70">
            Passo 01 de 03
          </p>
          <h1 className="text-4xl font-black text-[#2D3142] tracking-tighter italic leading-none">
            Perfil do <span className="text-[#E8A87C]">Idoso</span>
          </h1>
          <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-[280px] pt-2">
            Insira as informações básicas para personalizarmos o cuidado.
          </p>
        </div>
      </header>

      <div className="px-8 mt-6 space-y-8">
        {/* SEÇÃO: IDENTIFICAÇÃO BÁSICA */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2 ml-2">
            <User size={14} className="text-[#4A7FA5]" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Identificação</span>
          </div>
          
          <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50 space-y-4 border border-white">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-[#4A7FA5] uppercase ml-2 tracking-widest">Nome Completo</label>
              <input 
                type="text"
                placeholder="Ex: Albert Einstein"
                className="w-full p-5 rounded-2xl bg-[#FAF8F4] border-2 border-transparent focus:border-[#4A7FA5] focus:bg-white outline-none font-bold text-[#2D3142] transition-all placeholder:text-slate-300 shadow-inner"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setGenero('masculino')}
                className={`p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                  genero === 'masculino' 
                  ? 'bg-[#4A7FA5] text-white shadow-lg shadow-[#4A7FA5]/30 scale-[1.02]' 
                  : 'bg-[#FAF8F4] text-slate-400 grayscale opacity-60'
                }`}
              >
                Masculino
              </button>
              <button 
                onClick={() => setGenero('feminino')}
                className={`p-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
                  genero === 'feminino' 
                  ? 'bg-[#4A7FA5] text-white shadow-lg shadow-[#4A7FA5]/30 scale-[1.02]' 
                  : 'bg-[#FAF8F4] text-slate-400 grayscale opacity-60'
                }`}
              >
                Feminino
              </button>
            </div>
          </div>
        </section>

        {/* SEÇÃO: DADOS MÉDICOS CRÍTICOS */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2 ml-2">
            <Heart size={14} className="text-[#E8A87C]" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Saúde Crítica</span>
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] shadow-xl shadow-slate-200/50 space-y-6 border border-white">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-[#E8A87C] uppercase ml-2 tracking-widest flex items-center gap-1">
                  <Droplets size={10} /> Tipo Sanguíneo
                </label>
                <select 
                  className="w-full p-4 rounded-2xl bg-[#FAF8F4] border-2 border-transparent focus:border-[#E8A87C] outline-none font-bold text-[#2D3142] appearance-none"
                  value={sangue}
                  onChange={(e) => setSangue(e.target.value)}
                >
                  <option value="">Selecione</option>
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="AB">AB</option>
                  <option value="O">O</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-[#E8A87C] uppercase ml-2 tracking-widest">Fator RH</label>
                <div className="flex gap-2">
                  {['+', '-'].map((item) => (
                    <button
                      key={item}
                      onClick={() => setRh(item)}
                      className={`flex-1 p-4 rounded-xl font-black transition-all ${
                        rh === item 
                        ? 'bg-[#E8A87C] text-white shadow-md' 
                        : 'bg-[#FAF8F4] text-slate-400'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest flex items-center gap-1">
                <ShieldAlert size={10} /> Observações de Alerta
              </label>
              <textarea 
                placeholder="Alergias, doenças crônicas ou restrições de mobilidade..."
                className="w-full p-5 rounded-2xl bg-[#FAF8F4] border-2 border-transparent focus:border-[#E8A87C] focus:bg-white outline-none font-bold text-[#2D3142] transition-all placeholder:text-slate-300 shadow-inner h-32 resize-none text-sm"
                value={obs}
                onChange={(e) => setObs(e.target.value)}
              />
            </div>
          </div>
        </section>

        {/* BOTÃO DE AÇÃO FINAL */}
        <div className="pt-4">
          <button 
            onClick={() => onNext({ nome, genero, sangue, rh, obs })}
            className="w-full py-7 bg-[#2D3142] text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-2xl shadow-[#2D3142]/40 active:scale-95 transition-all group"
          >
            Configurar Rede de Apoio
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <p className="text-center mt-6 text-[9px] font-bold text-slate-300 uppercase tracking-widest">
            Seus dados são criptografados e seguros
          </p>
        </div>
      </div>
    </div>
  );
}