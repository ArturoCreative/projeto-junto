import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { 
  Plus, 
  FileText, 
  ChevronLeft, 
  X, 
  Loader2, 
  Sparkles, 
  BrainCircuit,
  AlertTriangle,
  MapPin,
  Clock,
  User
} from 'lucide-react';

interface TimelineProps {
  elderly: any;
  user: any;
  onNavigate: (screen: string) => void;
}

export default function DailyTimeline({ elderly, user, onNavigate }: TimelineProps) {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Estados para novo registo
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newRecord, setNewRecord] = useState({
    content: '',
    category: 'routine'
  });

  useEffect(() => {
    if (elderly?.id) {
      fetchRecords();
    }
  }, [elderly]);

  async function fetchRecords() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('daily_records')
        .select(`
          *,
          profiles:recorded_by (full_name)
        `)
        .eq('elderly_id', elderly.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (err) {
      console.error("Erro ao carregar linha do tempo:", err);
    } finally {
      setLoading(false);
    }
  }

  // Lógica do Relatório IA
  async function generateAiSummary() {
    if (records.length === 0) return;
    setAiLoading(true);
    try {
      // Simulação da chamada de IA (será integrada via Edge Function/n8n)
      // O prompt enviado levará em conta o nickname do idoso para humanização
      setTimeout(() => {
        setAiSummary(
          `Com base nos registos, o dia de ${elderly.nickname} está a decorrer de forma positiva. Houve uma boa adesão à alimentação e o estado emocional parece estável. Recomendamos manter a hidratação reforçada no período da tarde.`
        );
        setAiLoading(false);
      }, 2500);
    } catch (err) {
      setAiLoading(false);
    }
  }

  async function handleAddRecord() {
    if (!newRecord.content) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('daily_records').insert({
        elderly_id: elderly.id,
        recorded_by: user.id,
        content: { text: newRecord.content },
        category: newRecord.category
      });

      if (error) throw error;
      
      setShowAddModal(false);
      setNewRecord({ content: '', category: 'routine' });
      fetchRecords();
    } catch (err) {
      alert("Erro ao salvar registo.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-full bg-[#FAF8F4] pb-24 text-[#2D3142]">
      {/* Header Fixo */}
      <header className="bg-white px-8 pt-16 pb-6 sticky top-0 z-30 shadow-sm rounded-b-[3rem]">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => onNavigate('dashboard')} className="text-slate-300">
            <ChevronLeft size={24} />
          </button>
          <div className="text-center">
            <h2 className="font-black text-lg tracking-tight italic">Dia a Dia</h2>
            <p className="text-[10px] font-bold text-[#4A7FA5] uppercase tracking-widest">
              {elderly.nickname}
            </p>
          </div>
          <div className="w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center animate-pulse">
            <AlertTriangle size={20} />
          </div>
        </div>
      </header>

      <div className="p-6 space-y-8">
        
        {/* SEÇÃO IA: Relatório Inteligente */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#4A7FA5] to-[#2D3142] rounded-[2.5rem] p-8 text-white shadow-xl">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <BrainCircuit size={100} />
          </div>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
              <Sparkles size={18} className="text-amber-300" />
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em]">Resumo de IA</h3>
          </div>

          {aiSummary ? (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <p className="text-[13px] leading-relaxed font-medium italic opacity-95">
                "{aiSummary}"
              </p>
              <button 
                onClick={() => setAiSummary(null)} 
                className="mt-6 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity"
              >
                <Loader2 size={12} /> Atualizar Relatório
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center py-2">
              <p className="text-[11px] text-center mb-6 opacity-80 leading-relaxed max-w-[200px]">
                Consolide todos os eventos de hoje num relatório humano em segundos.
              </p>
              <button 
                onClick={generateAiSummary}
                disabled={aiLoading || records.length === 0}
                className="w-full bg-white text-[#2D3142] py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
              >
                {aiLoading ? <Loader2 className="animate-spin" size={16} /> : 'Gerar Resumo Agora'}
              </button>
            </div>
          )}
        </section>

        {/* LISTA DE REGISTOS (TIMELINE) */}
        <section className="relative pl-6 space-y-8">
          {/* Linha da Timeline */}
          <div className="absolute left-[34px] top-2 bottom-0 w-[2px] bg-slate-100 z-0" />

          {loading ? (
            <div className="flex justify-center py-10 opacity-20"><Loader2 className="animate-spin" /></div>
          ) : records.length === 0 ? (
            <div className="text-center py-12 px-10">
              <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mx-auto mb-4 text-slate-200">
                <FileText size={32} />
              </div>
              <p className="text-slate-300 text-sm font-medium italic">Sem registos para exibir hoje.</p>
            </div>
          ) : (
            records.map((record) => (
              <div key={record.id} className="flex gap-6 relative z-10">
                {/* Indicador Temporal */}
                <div className="w-4 h-4 rounded-full bg-white border-[3px] border-[#4A7FA5] mt-6 shadow-sm shadow-[#4A7FA5]/20" />
                
                {/* Card de Conteúdo */}
                <div className="flex-1 bg-white p-5 rounded-[2rem] shadow-sm border border-slate-50">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-[#FAF8F4] rounded-lg flex items-center justify-center text-slate-400">
                        <User size={12} />
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-tight text-slate-400">
                        {record.profiles?.full_name?.split(' ')[0]}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Clock size={10} />
                      <span className="text-[9px] font-bold">
                        {new Date(record.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  <p className="text-[13px] font-medium leading-relaxed text-[#2D3142]">
                    {record.content?.text || record.content}
                  </p>
                </div>
              </div>
            ))
          )}
        </section>
      </div>

      {/* Botão Flutuante (Add Registo) */}
      <button 
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-28 right-8 w-16 h-16 bg-[#2D3142] text-white rounded-2xl shadow-xl flex items-center justify-center z-40 active:scale-95 transition-all"
      >
        <Plus size={28} />
      </button>

      {/* Modal de Registo Robusto */}
      {showAddModal && (
        <div className="fixed inset-0 bg-[#2D3142]/80 backdrop-blur-sm z-[100] flex items-end">
          <div className="bg-[#FAF8F4] w-full rounded-t-[4rem] p-10 pb-16 animate-slide-up shadow-2xl">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-[#2D3142] font-black text-2xl tracking-tighter italic">Novo Registo</h3>
              <button onClick={() => setShowAddModal(false)} className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-300">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-50">
                <label className="block text-[9px] font-black uppercase tracking-widest text-slate-300 mb-3">O que aconteceu?</label>
                <textarea 
                  className="w-full bg-transparent border-none p-0 text-sm font-bold focus:ring-0 min-h-[100px] resize-none"
                  placeholder="Ex: Almoçou tudo e estava muito bem disposto..."
                  value={newRecord.content}
                  onChange={(e) => setNewRecord({...newRecord, content: e.target.value})}
                />
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={() => setNewRecord({...newRecord, category: 'routine'})}
                  className={`flex-1 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${newRecord.category === 'routine' ? 'bg-[#4A7FA5] text-white shadow-lg' : 'bg-white text-slate-300'}`}
                >
                  Rotina
                </button>
                <button 
                  onClick={() => setNewRecord({...newRecord, category: 'health'})}
                  className={`flex-1 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all ${newRecord.category === 'health' ? 'bg-red-500 text-white shadow-lg' : 'bg-white text-slate-300'}`}
                >
                  Saúde
                </button>
              </div>

              <button 
                onClick={handleAddRecord}
                disabled={isSubmitting || !newRecord.content}
                className="w-full py-6 bg-[#2D3142] text-white rounded-[2rem] font-black uppercase text-[10px] tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Publicar Registo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}