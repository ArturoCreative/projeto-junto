import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { 
  User, 
  Calendar, 
  Heart, 
  Loader2, 
  ChevronRight, 
  Info, 
  LayoutDashboard,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Activity,
  Plus
} from 'lucide-react';

interface Props {
  familyId: string;
  onNext: (elderly: any) => void;
}

export default function ElderlyRegistration({ familyId, onNext }: Props) {
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    nickname: '',
    birthDate: '',
    conditions: ''
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.name || !formData.nickname) {
      setError("Por favor, preencha os campos essenciais.");
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      const { data, error: insertError } = await supabase
        .from('elderly_profiles')
        .insert([{ 
          family_id: familyId, 
          full_name: formData.name, 
          nickname: formData.nickname, 
          birth_date: formData.birthDate,
          medical_notes: formData.conditions 
        }])
        .select()
        .single();

      if (insertError) throw insertError;
      setTimeout(() => onNext(data), 500);
      
    } catch (err: any) {
      console.error("Erro Crítico Cadastro Inovare:", err);
      setError("Falha na comunicação com a nuvem.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF8F4] flex flex-col font-sans relative overflow-hidden">
      {/* Camada de Design de Fundo - Agência Inovare */}
      <div className="absolute top-[-100px] right-[-50px] w-80 h-80 bg-[#4A7FA5]/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-100px] left-[-50px] w-80 h-80 bg-[#E8A87C]/5 rounded-full blur-[120px]" />

      {/* Cabeçalho de Identidade */}
      <header className={`px-10 pt-24 mb-10 transition-all duration-1000 transform ${isReady ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="relative inline-block mb-8">
          <div className="w-20 h-20 bg-white rounded-[2.2rem] flex items-center justify-center text-[#E8A87C] shadow-[0_20px_40px_rgba(0,0,0,0.05)] border border-slate-50 relative z-10">
            <Heart size={38} fill="currentColor" />
          </div>
          <div className="absolute -top-2 -right-2 w-7 h-7 bg-[#2D3142] rounded-full flex items-center justify-center text-white shadow-lg animate-pulse">
            <Plus size={14} />
          </div>
        </div>
        
        <h2 className="text-[#2D3142] font-black text-5xl tracking-[-0.05em] italic leading-[0.85] mb-5">
          Perfil de <br/>
          <span className="text-[#4A7FA5] not-italic">Assistência.</span>
        </h2>
        
        <div className="flex items-center gap-3">
          <div className="h-[2px] w-10 bg-[#E8A87C]" />
          <p className="text-[#4A7FA5] text-[10px] font-black uppercase tracking-[0.3em]">
            Passo 01: Identificação
          </p>
        </div>
      </header>

      {/* Área do Formulário */}
      <form onSubmit={handleSubmit} className={`flex-1 px-10 space-y-6 pb-40 transition-all duration-1000 delay-300 transform ${isReady ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="space-y-4">
          {/* Nome */}
          <div className="group bg-white p-7 rounded-[3rem] shadow-sm border border-slate-100 focus-within:ring-8 focus-within:ring-[#4A7FA5]/5 transition-all">
            <label className="block text-[9px] font-black uppercase tracking-[0.25em] text-slate-300 mb-3 ml-2 italic">Nome Civil Completo</label>
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-[#FAF8F4] rounded-2xl flex items-center justify-center text-[#4A7FA5] group-focus-within:bg-[#4A7FA5] group-focus-within:text-white transition-all shadow-inner">
                <User size={20} />
              </div>
              <input 
                className="bg-transparent border-none w-full text-[16px] font-black tracking-tight focus:ring-0 p-0 placeholder:text-slate-200 text-[#2D3142]"
                placeholder="Ex: Maria Helena da Silva"
                value={formData.name} 
                onChange={e => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>
          </div>

          {/* Apelido */}
          <div className="group bg-white p-7 rounded-[3rem] shadow-sm border border-slate-100 focus-within:ring-8 focus-within:ring-amber-500/5 transition-all">
            <label className="block text-[9px] font-black uppercase tracking-[0.25em] text-slate-300 mb-3 ml-2 italic">Como prefere ser chamado?</label>
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500 group-focus-within:bg-amber-500 group-focus-within:text-white transition-all shadow-inner">
                <Sparkles size={20} />
              </div>
              <input 
                className="bg-transparent border-none w-full text-[16px] font-black tracking-tight focus:ring-0 p-0 placeholder:text-slate-200 text-[#2D3142]"
                placeholder="Ex: Vovó Maria"
                value={formData.nickname} 
                onChange={e => setFormData({...formData, nickname: e.target.value})}
                required
              />
            </div>
          </div>

          {/* Data */}
          <div className="group bg-white p-7 rounded-[3rem] shadow-sm border border-slate-100 focus-within:ring-8 focus-within:ring-slate-100 transition-all">
            <label className="block text-[9px] font-black uppercase tracking-[0.25em] text-slate-300 mb-3 ml-2 italic">Data de Nascimento</label>
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-[#FAF8F4] rounded-2xl flex items-center justify-center text-slate-400 group-focus-within:bg-[#2D3142] group-focus-within:text-white transition-all">
                <Calendar size={20} />
              </div>
              <input 
                type="date"
                className="bg-transparent border-none w-full text-[16px] font-black tracking-tight focus:ring-0 p-0 text-[#2D3142]"
                value={formData.birthDate} 
                onChange={e => setFormData({...formData, birthDate: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Notificação de Segurança */}
        <div className="bg-[#2D3142] p-8 rounded-[3rem] shadow-2xl relative overflow-hidden">
          <Activity className="absolute right-[-20px] top-[-20px] text-white/5" size={120} />
          <div className="flex items-start gap-5 relative z-10">
            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-[#4A7FA5] shrink-0">
              <ShieldCheck size={22} />
            </div>
            <div className="space-y-2">
              <p className="text-white text-[11px] font-black uppercase tracking-widest italic">Análise Preditiva Ativa</p>
              <p className="text-white/60 text-[10px] font-medium leading-relaxed">
                Nossa rede monitora padrões de saúde 24h para antecipar necessidades do assistido.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-3 justify-center text-red-500 animate-bounce">
            <AlertCircle size={14} />
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">{error}</span>
          </div>
        )}
      </form>

      {/* Footer de Ação com tags revisadas */}
      <footer className={`p-10 fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#FAF8F4] via-[#FAF8F4] to-transparent pt-10 transition-all duration-1000 delay-500 ${isReady ? 'opacity-100' : 'opacity-0'}`}>
        <button 
          onClick={handleSubmit}
          disabled={loading || !formData.name}
          className="group w-full bg-[#2D3142] text-white py-8 rounded-[2.8rem] font-black uppercase text-[11px] tracking-[0.4em] shadow-[0_30px_60px_rgba(45,49,66,0.3)] flex items-center justify-center gap-4 active:scale-95 transition-all overflow-hidden relative"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <span className="relative z-10">Validar e Conectar</span>
              <div className="bg-[#4A7FA5] p-2 rounded-xl group-hover:translate-x-2 transition-transform relative z-10">
                <ChevronRight size={20} />
              </div>
            </>
          )}
        </button>
      </footer>
    </div>
  );
}