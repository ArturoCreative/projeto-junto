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
  Send
} from 'lucide-react';

interface DashboardProps {
  user: any;
  elderly: any;
  family: any;
  onNavigate: (screen: any) => void;
}

export default function Dashboard({ user, elderly, family, onNavigate }: DashboardProps) {
  // Estados de Dados
  const [summary, setSummary] = useState<any>(null);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [medicationStatus, setMedicationStatus] = useState({ taken: 0, total: 0, next: '' });
  const [isLoading, setIsLoading] = useState(true);
  
  // Estados de UI (Modais e Busca)
  const [searchQuery, setSearchQuery] = useState('');
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [sosMessage, setSosMessage] = useState('');
  const [isSendingSOS, setIsSendingSOS] = useState(false);
  const [logoUrl, setLogoUrl] = useState(family?.logo_url || null);

  // Carregamento de dados robusto
  useEffect(() => {
    if (elderly?.id) {
      fetchDashboardData();
    }
  }, [elderly]);

  async function fetchDashboardData() {
    try {
      setIsLoading(true);
      
      // 1. Buscar Resumo da IA (Último gerado)
      const { data: aiData } = await supabase
        .from('ai_summaries')
        .select('*')
        .eq('elderly_id', elderly.id)
        .order('generated_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      setSummary(aiData);

      // 2. Buscar Atividades Recentes (Timeline compacta)
      const { data: activities } = await supabase
        .from('daily_records')
        .select(`
          *,
          profiles:recorded_by (full_name)
        `)
        .eq('elderly_id', elderly.id)
        .order('created_at', { ascending: false })
        .limit(5);
      setRecentActivities(activities || []);

      // 3. Status de Medicamentos do Dia
      const { data: meds } = await supabase
        .from('medications')
        .select('*')
        .eq('elderly_id', elderly.id)
        .eq('is_active', true);
      
      // Aqui integraria com a tabela de logs para ver quem já tomou hoje
      setMedicationStatus({ 
        taken: 0, 
        total: meds?.length || 0, 
        next: meds?.[0]?.schedule_times?.[0] || '--:--' 
      });

    } catch (error) {
      console.error("Erro ao carregar Dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // Função de Upload de Logo Fixa
  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !family?.id) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${family.id}-logo.${fileExt}`;
      const filePath = `logos/${fileName}`;

      // Upload para o Bucket
      const { error: uploadError } = await supabase.storage
        .from('brand-assets')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Pegar URL Pública
      const { data: { publicUrl } } = supabase.storage
        .from('brand-assets')
        .getPublicUrl(filePath);

      // Salvar na tabela families para ficar FIXO
      const { error: updateError } = await supabase
        .from('families')
        .update({ logo_url: publicUrl })
        .eq('id', family.id);

      if (updateError) throw updateError;
      setLogoUrl(publicUrl);
      
    } catch (error) {
      alert("Erro ao salvar logo. Verifique as permissões do bucket.");
    }
  }

  // Função de SOS com Geolocalização
  async function handleSendSOS() {
    setIsSendingSOS(true);
    try {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        
        const { error } = await supabase.from('daily_records').insert({
          elderly_id: elderly.id,
          family_id: family.id,
          recorded_by: user.id,
          record_type: 'sos',
          content: {
            message: sosMessage,
            location: { lat: latitude, lng: longitude },
            google_maps_url: `https://www.google.com/maps?q=${latitude},${longitude}`
          }
        });

        if (!error) {
          alert("Alerta SOS enviado para toda a família!");
          setShowSOSModal(false);
          setSosMessage('');
        }
      });
    } catch (err) {
      alert("Erro ao disparar SOS.");
    } finally {
      setIsSendingSOS(false);
    }
  }

  return (
    <div className="flex flex-col min-h-full pb-10">
      {/* HEADER DINÂMICO */}
      <header className="px-6 pt-12 pb-6 bg-white">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            {/* Logo com persistência */}
            <label className="relative cursor-pointer group">
              <div className="w-12 h-12 bg-[#FAF8F4] rounded-xl flex items-center justify-center overflow-hidden border border-slate-100">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <Upload size={18} className="text-slate-300 group-hover:text-[#4A7FA5]" />
                )}
              </div>
              <input type="file" className="hidden" onChange={handleLogoUpload} accept="image/*" />
            </label>
            <div>
              <h1 className="text-[#2D3142] font-black text-xl tracking-tighter">
                {new Date().getHours() < 12 ? 'Bom dia' : 'Boa tarde'}, {user?.full_name?.split(' ')[0]} ☀️
              </h1>
              <p className="text-[#4A7FA5] text-[11px] font-bold uppercase tracking-widest flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                {elderly?.nickname || elderly?.full_name} está {elderly?.current_mood || 'bem'} hoje
              </p>
            </div>
          </div>
          <button className="w-10 h-10 bg-[#FAF8F4] rounded-full flex items-center justify-center text-slate-400 relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[#E8A87C] rounded-full border-2 border-white" />
          </button>
        </div>

        {/* BARRA DE BUSCA FUNCIONAL */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#4A7FA5] transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Buscar remédio, gasto ou nota..."
            className="w-full h-14 bg-[#FAF8F4] rounded-2xl pl-12 pr-4 text-sm font-medium border-none focus:ring-2 focus:ring-[#4A7FA5]/20 transition-all shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      <div className="px-6 space-y-6">
        {/* CARD PRINCIPAL - RESUMO IA */}
        <section className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-[#E8A87C]/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <CheckCircle2 size={80} className="text-[#E8A87C]" />
          </div>
          <h3 className="text-[#E8A87C] font-black uppercase text-[10px] tracking-widest mb-3 flex items-center gap-2">
            <span className="w-4 h-[1px] bg-[#E8A87C]" /> Resumo do Dia de {elderly?.nickname || 'Mãe'}
          </h3>
          <p className="text-[#2D3142] text-sm leading-relaxed font-medium mb-4 relative z-10">
            {summary ? summary.content : "O resumo inteligente está sendo processado. Estará pronto às 21:30 ✨"}
          </p>
          <span className="text-slate-400 text-[10px] font-bold">
            {summary ? `Gerado às ${new Date(summary.generated_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` : '--:--'}
          </span>
        </section>

        {/* GRID DE STATUS RÁPIDO */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-50">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600 mb-3">
              <Heart size={20} />
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-tighter">Medicamentos</p>
            <h4 className="text-[#2D3142] font-black text-lg">{medicationStatus.taken} de {medicationStatus.total}</h4>
            <p className="text-green-600 text-[10px] font-bold mt-1">✓ Todos em dia</p>
          </div>
          <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-50">
            <div className="w-10 h-10 bg-[#4A7FA5]/10 rounded-xl flex items-center justify-center text-[#4A7FA5] mb-3">
              <Clock size={20} />
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-tighter">Próximo</p>
            <h4 className="text-[#2D3142] font-black text-lg">{medicationStatus.next}</h4>
            <p className="text-[#4A7FA5] text-[10px] font-bold mt-1 italic">Agendado</p>
          </div>
        </div>

        {/* FEED DE ATIVIDADE */}
        <section>
          <div className="flex justify-between items-center mb-4 px-2">
            <h3 className="text-[#2D3142] font-black text-sm uppercase tracking-wider">Atividade Recente</h3>
            <button onClick={() => onNavigate('timeline')} className="text-[#4A7FA5] text-xs font-black uppercase flex items-center gap-1">
              Ver tudo <ChevronRight size={14} />
            </button>
          </div>
          <div className="space-y-3">
            {recentActivities.map((act) => (
              <div key={act.id} className="bg-white p-4 rounded-2xl flex items-center gap-4 border border-slate-50 shadow-sm">
                <div className="w-10 h-10 bg-[#FAF8F4] rounded-full flex items-center justify-center text-lg">
                  {act.record_type === 'meal' ? '🍽️' : act.record_type === 'mood' ? '😊' : '📝'}
                </div>
                <div className="flex-1">
                  <p className="text-[#2D3142] text-[13px] font-bold leading-tight">
                    {act.profiles?.full_name} registrou {act.record_type}
                  </p>
                  <p className="text-slate-400 text-[11px] font-medium italic">há {new Date(act.created_at).getMinutes()} minutos</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* BOTÃO SOS FLUTUANTE */}
      <button 
        onClick={() => setShowSOSModal(true)}
        className="fixed bottom-32 right-8 w-16 h-16 bg-[#EF4444] text-white rounded-full shadow-[0_10px_30px_rgba(239,68,68,0.4)] flex items-center justify-center z-40 active:scale-90 transition-transform"
      >
        <Phone size={24} fill="currentColor" />
      </button>

      {/* MODAL SOS ROBUSTO */}
      {showSOSModal && (
        <div className="fixed inset-0 bg-[#2D3142]/90 backdrop-blur-sm z-[60] flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 shadow-2xl scale-in-center">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-6 mx-auto">
              <AlertTriangle size={32} />
            </div>
            <h2 className="text-[#2D3142] font-black text-2xl text-center mb-2 tracking-tighter">Emergência SOS</h2>
            <p className="text-slate-500 text-center text-sm mb-6 font-medium">Isso enviará sua localização e uma mensagem urgente para toda a família.</p>
            
            <textarea 
              className="w-full bg-[#FAF8F4] border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 focus:ring-red-500/20 mb-6 h-24"
              placeholder="Descreva brevemente a situação (opcional)..."
              value={sosMessage}
              onChange={(e) => setSosMessage(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setShowSOSModal(false)}
                className="py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-400 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button 
                onClick={handleSendSOS}
                disabled={isSendingSOS}
                className="py-4 bg-[#EF4444] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-red-200 flex items-center justify-center gap-2"
              >
                {isSendingSOS ? "Enviando..." : <><Send size={14} /> Enviar Alerta</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}