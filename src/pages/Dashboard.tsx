import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { 
  Search, 
  Bell, 
  AlertTriangle, 
  Phone, 
  CheckCircle2, 
  Clock, 
  ChevronRight,
  Camera,
  Upload,
  MapPin,
  Send,
  Heart,
  Sparkles,
  TrendingUp,
  MoreHorizontal,
  Loader2
} from 'lucide-react';

interface DashboardProps {
  user: any;
  elderly: any;
  onNavigate: (screen: string) => void;
}

export default function Dashboard({ user, elderly, onNavigate }: DashboardProps) {
  // --- ESTADOS DE DADOS ---
  const [summary, setSummary] = useState<any>(null);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [medicationStatus, setMedicationStatus] = useState({ taken: 0, total: 0, next: '--:--' });
  const [isLoading, setIsLoading] = useState(true);
  
  // --- ESTADOS DE UI ---
  const [searchQuery, setSearchQuery] = useState('');
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [sosMessage, setSosMessage] = useState('');
  const [isSendingSOS, setIsSendingSOS] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (elderly?.id) {
      fetchDashboardData();
    }
  }, [elderly]);

  /**
   * CARREGAMENTO MULTI-FONTE
   * Busca dados de 3 tabelas diferentes para compor o Dashboard
   */
  async function fetchDashboardData() {
    try {
      setIsLoading(true);
      
      // 1. Buscar último resumo da IA (Gerado na tela Daily)
      const { data: aiData } = await supabase
        .from('daily_records')
        .select('*')
        .eq('elderly_id', elderly.id)
        .eq('category', 'ai_summary')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      setSummary(aiData);

      // 2. Buscar Atividades Recentes (Últimos 5 registros)
      const { data: activities } = await supabase
        .from('daily_records')
        .select(`
          *,
          profiles:recorded_by (full_name)
        `)
        .eq('elderly_id', elderly.id)
        .neq('category', 'ai_summary')
        .order('created_at', { ascending: false })
        .limit(5);
      setRecentActivities(activities || []);

      // 3. Status de Medicamentos (Lógica de Saúde)
      const { data: meds } = await supabase
        .from('medications')
        .select('*')
        .eq('elderly_id', elderly.id)
        .eq('is_active', true);
      
      setMedicationStatus({ 
        taken: 0, // Aqui você pode somar logs de 'medication_taken' se tiver a tabela
        total: meds?.length || 0, 
        next: meds?.[0]?.schedule_times?.[0] || '--:--' 
      });

    } catch (error) {
      console.error("Erro Crítico no Dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * GESTÃO DE MARCA (BRANDING)
   * Permite que o dono da agência ou adm da família suba uma logo
   */
  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user?.family_id) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.family_id}-logo.${fileExt}`;
      const filePath = `logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('brand-assets')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('brand-assets')
        .getPublicUrl(filePath);

      await supabase
        .from('families')
        .update({ logo_url: publicUrl })
        .eq('id', user.family_id);

      setLogoUrl(publicUrl);
    } catch (error) {
      console.error("Erro no upload da logo:", error);
    }
  }

  /**
   * DISPARO DE EMERGÊNCIA (SOS)
   * Captura coordenadas e gera evento para o n8n/Telegram
   */
  async function handleSendSOS() {
    setIsSendingSOS(true);
    try {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        
        const { error } = await supabase.from('daily_records').insert({
          elderly_id: elderly.id,
          recorded_by: user.id,
          category: 'emergency',
          content: {
            text: `🚨 SOS: ${sosMessage || 'Chamada de emergência imediata!'}`,
            coords: { lat: latitude, lng: longitude },
            map_link: `https://www.google.com/maps?q=${latitude},${longitude}`
          }
        });

        if (!error) {
          setShowSOSModal(false);
          setSosMessage('');
          alert("Alerta enviado com sucesso!");
        }
      });
    } catch (err) {
      alert("Falha ao capturar localização. Verifique as permissões.");
    } finally {
      setIsSendingSOS(false);
    }
  }

  // --- RENDERIZAÇÃO ---

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F4] flex flex-col items-center justify-center p-10 text-center">
        <Loader2 className="animate-spin text-[#4A7FA5] mb-4" size={32} />
        <p className="text-[#2D3142] font-black text-[10px] uppercase tracking-widest">Organizando Painel...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full pb-32 bg-[#FAF8F4] animate-in fade-in duration-500">
      
      {/* HEADER DINÂMICO PREMIUM */}
      <header className="px-8 pt-16 pb-10 bg-white rounded-b-[3.5rem] shadow-sm relative z-20">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <label className="relative cursor-pointer group">
              <div className="w-14 h-14 bg-[#FAF8F4] rounded-2xl flex items-center justify-center overflow-hidden border-2 border-slate-50 shadow-inner">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <div className="bg-[#2D3142] w-full h-full flex items-center justify-center text-white font-black italic text-xl">
                    {elderly?.nickname?.charAt(0) || 'J'}
                  </div>
                )}
              </div>
              <input type="file" className="hidden" onChange={handleLogoUpload} accept="image/*" />
            </label>
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                Olá, {user?.full_name?.split(' ')[0]} 👋
              </p>
              <h1 className="text-[#2D3142] font-black text-2xl tracking-tighter">
                Rede de <span className="text-[#4A7FA5]">Cuidado</span>
              </h1>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="w-12 h-12 bg-[#FAF8F4] rounded-2xl flex items-center justify-center text-slate-300 relative">
              <Bell size={20} />
              <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
          </div>
        </div>

        {/* BUSCA COM INTEGRAÇÃO VISUAL */}
        <div className="relative mb-8 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#4A7FA5] transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="O que você procura hoje?"
            className="w-full h-16 bg-[#FAF8F4] rounded-[2rem] pl-14 pr-6 text-sm font-bold border-none focus:ring-4 focus:ring-[#4A7FA5]/5 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* ATALHOS DE NAVEGAÇÃO (BOTÕES MESTRES) */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Saúde', icon: <Heart size={20}/>, screen: 'health', color: 'bg-red-50 text-red-500' },
            { label: 'Timeline', icon: <Clock size={20}/>, screen: 'daily', color: 'bg-blue-50 text-[#4A7FA5]' },
            { label: 'Finanças', icon: <TrendingUp size={20}/>, screen: 'finance', color: 'bg-green-50 text-green-600' }
          ].map((btn) => (
            <button 
              key={btn.label}
              onClick={() => onNavigate(btn.screen)}
              className="flex flex-col items-center gap-3 p-5 bg-white rounded-[2rem] border border-slate-50 shadow-sm active:scale-90 transition-all"
            >
              <div className={`w-12 h-12 ${btn.color} rounded-2xl flex items-center justify-center`}>
                {btn.icon}
              </div>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{btn.label}</span>
            </button>
          ))}
        </div>
      </header>

      <div className="px-8 -mt-6 space-y-8 relative z-10">
        
        {/* CARD DE DESTAQUE IA */}
        <section 
          onClick={() => onNavigate('daily')}
          className="bg-white rounded-[3rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-50 relative overflow-hidden cursor-pointer active:scale-[0.98] transition-all"
        >
          <div className="absolute -top-10 -right-10 opacity-5">
            <Sparkles size={150} className="text-[#4A7FA5]" />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">
              <Sparkles size={16} />
            </div>
            <h3 className="text-[#2D3142] font-black text-[10px] uppercase tracking-widest">Insight do Dia</h3>
          </div>
          <p className="text-[#2D3142] text-sm leading-relaxed font-bold mb-6">
            {summary ? summary.content.text : `Clique para gerar o relatório de IA baseado nas atividades recentes de ${elderly?.nickname}.`}
          </p>
          <div className="flex justify-between items-center">
            <span className="text-slate-300 text-[9px] font-black uppercase tracking-widest italic">Análise Inteligente</span>
            <ChevronRight size={16} className="text-[#4A7FA5]" />
          </div>
        </section>

        {/* STATUS DE SAÚDE EM TEMPO REAL */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#2D3142] p-6 rounded-[2.5rem] text-white shadow-lg">
            <p className="text-white/40 text-[9px] font-black uppercase tracking-widest mb-1">Medicamentos</p>
            <h4 className="text-2xl font-black">{medicationStatus.taken} <span className="text-white/20 text-sm">/ {medicationStatus.total}</span></h4>
            <div className="w-full bg-white/10 h-1 rounded-full mt-4 overflow-hidden">
               <div className="bg-[#4A7FA5] h-full transition-all duration-1000" style={{ width: `${(medicationStatus.taken/medicationStatus.total)*100}%` }} />
            </div>
          </div>
          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
            <p className="text-slate-300 text-[9px] font-black uppercase tracking-widest mb-1">Próximo</p>
            <h4 className="text-[#2D3142] font-black text-2xl">{medicationStatus.next}</h4>
            <p className="text-[#4A7FA5] text-[9px] font-black uppercase mt-2">Agendado</p>
          </div>
        </div>

        {/* FEED DE ATIVIDADES RECENTES */}
        <section className="pb-10">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-[#2D3142] font-black text-xs uppercase tracking-[0.2em]">Últimos Registros</h3>
            <button onClick={() => onNavigate('daily')} className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-slate-300 shadow-sm">
              <MoreHorizontal size={16} />
            </button>
          </div>
          
          <div className="space-y-4">
            {recentActivities.length === 0 ? (
              <div className="bg-white/50 border-2 border-dashed border-slate-100 p-8 rounded-[2.5rem] text-center">
                <p className="text-slate-300 text-[10px] font-black uppercase">Nenhuma atividade hoje</p>
              </div>
            ) : (
              recentActivities.map((act) => (
                <div key={act.id} className="bg-white p-6 rounded-[2.5rem] flex items-center gap-5 shadow-sm border border-slate-50 transition-all active:bg-slate-50">
                  <div className="w-12 h-12 bg-[#FAF8F4] rounded-2xl flex items-center justify-center text-xl">
                    {act.category === 'health' ? '💊' : act.category === 'meal' ? '🍽️' : '📝'}
                  </div>
                  <div className="flex-1">
                    <p className="text-[#2D3142] text-[13px] font-black leading-tight mb-1">
                      {act.content?.text?.substring(0, 35)}...
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-[#4A7FA5] text-[9px] font-black uppercase tracking-tighter">
                        {act.profiles?.full_name?.split(' ')[0]}
                      </span>
                      <span className="w-1 h-1 bg-slate-200 rounded-full" />
                      <span className="text-slate-300 text-[9px] font-bold">
                        {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* BOTÃO SOS MESTRE (FIXO) */}
      <div className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-[#FAF8F4] via-[#FAF8F4] to-transparent z-40">
        <button 
          onClick={() => setShowSOSModal(true)}
          className="w-full bg-red-500 text-white h-20 rounded-[2rem] shadow-[0_20px_40px_rgba(239,68,68,0.3)] flex items-center justify-center gap-4 active:scale-95 transition-all"
        >
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Phone size={20} fill="currentColor" />
          </div>
          <span className="font-black uppercase text-xs tracking-[0.3em]">Emergência SOS</span>
        </button>
      </div>

      {/* MODAL SOS ROBUSTO */}
      {showSOSModal && (
        <div className="fixed inset-0 bg-[#2D3142]/95 backdrop-blur-xl z-[100] flex items-center justify-center p-8">
          <div className="bg-white w-full max-w-sm rounded-[4rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="w-24 h-24 bg-red-50 rounded-[3rem] flex items-center justify-center text-red-500 mb-8 mx-auto">
              <AlertTriangle size={48} />
            </div>
            <h2 className="text-[#2D3142] font-black text-3xl text-center mb-4 tracking-tighter italic">Alerta Geral</h2>
            <p className="text-slate-400 text-center text-xs mb-8 font-bold leading-relaxed uppercase tracking-widest">
              Toda a família será notificada instantaneamente com sua localização.
            </p>
            
            <textarea 
              className="w-full bg-[#FAF8F4] border-none rounded-[2rem] p-6 text-sm font-bold focus:ring-4 focus:ring-red-500/10 mb-8 h-32 resize-none"
              placeholder="O que está acontecendo?"
              value={sosMessage}
              onChange={(e) => setSosMessage(e.target.value)}
            />

            <div className="flex flex-col gap-4">
              <button 
                onClick={handleSendSOS}
                disabled={isSendingSOS}
                className="w-full py-7 bg-red-500 text-white rounded-[2.5rem] font-black uppercase text-[11px] tracking-[0.3em] shadow-2xl shadow-red-200 flex items-center justify-center gap-3"
              >
                {isSendingSOS ? <Loader2 className="animate-spin" /> : "Disparar Agora"}
              </button>
              <button 
                onClick={() => setShowSOSModal(false)}
                className="w-full py-4 text-slate-300 font-black uppercase text-[10px] tracking-widest"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}