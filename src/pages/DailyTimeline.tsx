import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { 
  Plus, 
  Utensils, 
  Smile, 
  Camera, 
  FileText, 
  MoreVertical, 
  ChevronLeft,
  X,
  Send,
  Loader2
} from 'lucide-react';

interface TimelineProps {
  elderly: any;
  user: any;
  onNavigate: (screen: any) => void;
}

export default function DailyTimeline({ elderly, user, onNavigate }: TimelineProps) {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // Estados para novo registro
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recordType, setRecordType] = useState<'meal' | 'mood' | 'photo' | 'note'>('note');
  const [content, setContent] = useState('');
  const [tempPhoto, setTempPhoto] = useState<File | null>(null);

  useEffect(() => {
    fetchRecords();

    // Inscrição Realtime para atualizações instantâneas na família
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'daily_records', filter: `family_id=eq.${user.family_id}` },
        () => fetchRecords()
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [filter]);

  async function fetchRecords() {
    try {
      setLoading(true);
      let query = supabase
        .from('daily_records')
        .select(`
          *,
          profiles:recorded_by (full_name, avatar_url)
        `)
        .eq('elderly_id', elderly.id)
        .order('created_at', { ascending: false });

      if (filter !== 'all') {
        query = query.eq('record_type', filter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setRecords(data || []);
    } catch (err) {
      console.error("Erro ao carregar timeline:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitRecord() {
    if (!content && !tempPhoto) return;
    setIsSubmitting(true);

    try {
      let photoUrl = null;

      // 1. Upload de foto se houver
      if (tempPhoto) {
        const fileExt = tempPhoto.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `daily/${user.family_id}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('daily-photos')
          .upload(filePath, tempPhoto);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('daily-photos').getPublicUrl(filePath);
        photoUrl = data.publicUrl;
      }

      // 2. Inserir Registro no Banco (Seguindo seu Schema SQL)
      const { error: insertError } = await supabase.from('daily_records').insert({
        elderly_id: elderly.id,
        family_id: user.family_id,
        recorded_by: user.id,
        record_type: recordType,
        photo_url: photoUrl,
        content: { text: content },
        record_date: new Date().toISOString().split('T')[0]
      });

      if (insertError) throw insertError;

      setShowAddModal(false);
      setContent('');
      setTempPhoto(null);
      fetchRecords();

    } catch (err) {
      alert("Falha ao registrar atividade.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-full bg-[#FAF8F4] pb-24">
      {/* Header com Filtros */}
      <header className="bg-white px-6 pt-12 pb-6 sticky top-0 z-30 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => onNavigate('dashboard')} className="text-slate-400">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-[#2D3142] font-black text-lg tracking-tight">Linha do Tempo</h2>
          <div className="w-6" />
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {['all', 'meal', 'mood', 'photo', 'note'].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                filter === t ? 'bg-[#4A7FA5] text-white shadow-lg' : 'bg-slate-50 text-slate-400'
              }`}
            >
              {t === 'all' ? 'Tudo' : t === 'meal' ? 'Refeição' : t === 'mood' ? 'Humor' : t === 'photo' ? 'Fotos' : 'Notas'}
            </button>
          ))}
        </div>
      </header>

      {/* Lista de Registros */}
      <div className="p-6 relative">
        <div className="absolute left-[39px] top-0 bottom-0 w-[2px] bg-slate-100 z-0" />
        
        {loading ? (
          <div className="flex flex-col items-center py-20 opacity-30">
            <Loader2 className="animate-spin text-[#4A7FA5]" size={32} />
          </div>
        ) : records.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-400 text-sm font-medium">Nenhum registro hoje.</p>
          </div>
        ) : (
          <div className="space-y-10 relative z-10">
            {records.map((record) => (
              <div key={record.id} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-white border-4 border-[#FAF8F4] shadow-sm flex items-center justify-center text-xs z-10 overflow-hidden">
                   {record.record_type === 'meal' && <Utensils size={14} className="text-orange-400" />}
                   {record.record_type === 'mood' && <Smile size={14} className="text-green-400" />}
                   {record.record_type === 'photo' && <Camera size={14} className="text-[#4A7FA5]" />}
                   {record.record_type === 'note' && <FileText size={14} className="text-slate-400" />}
                </div>
                
                <div className="flex-1 bg-white rounded-[2rem] p-5 shadow-sm border border-slate-50">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-slate-100 rounded-full overflow-hidden">
                        {record.profiles?.avatar_url && <img src={record.profiles.avatar_url} alt="User" />}
                      </div>
                      <span className="text-[#2D3142] text-[11px] font-black uppercase tracking-tighter">
                        {record.profiles?.full_name?.split(' ')[0]}
                      </span>
                    </div>
                    <span className="text-slate-300 text-[10px] font-bold">
                      {new Date(record.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <p className="text-[#2D3142] text-[13px] font-medium leading-relaxed mb-3">
                    {record.content?.text}
                  </p>

                  {record.photo_url && (
                    <div className="rounded-2xl overflow-hidden mb-2">
                      <img src={record.photo_url} alt="Registro" className="w-full h-auto object-cover max-h-60" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botão de Adicionar */}
      <button 
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-28 left-1/2 -translate-x-1/2 w-14 h-14 bg-[#2D3142] text-white rounded-2xl shadow-xl flex items-center justify-center z-40 active:scale-95 transition-all"
      >
        <Plus size={24} />
      </button>

      {/* Modal de Registro Robusto */}
      {showAddModal && (
        <div className="fixed inset-0 bg-[#2D3142]/80 backdrop-blur-sm z-[100] flex items-end">
          <div className="bg-[#FAF8F4] w-full rounded-t-[3.5rem] p-8 pb-12 animate-slide-up">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-[#2D3142] font-black text-xl tracking-tighter italic">Novo Registro</h3>
              <button onClick={() => setShowAddModal(false)} className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-300">
                <X size={20} />
              </button>
            </div>

            {/* Seleção de Tipo */}
            <div className="flex justify-between mb-8">
              {[
                { id: 'meal', icon: <Utensils size={20} />, label: 'Refeição' },
                { id: 'mood', icon: <Smile size={20} />, label: 'Humor' },
                { id: 'photo', icon: <Camera size={20} />, label: 'Foto' },
                { id: 'note', icon: <FileText size={20} />, label: 'Nota' },
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setRecordType(type.id as any)}
                  className={`flex flex-col items-center gap-2 group`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                    recordType === type.id ? 'bg-[#4A7FA5] text-white shadow-lg' : 'bg-white text-slate-300'
                  }`}>
                    {type.icon}
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-widest ${
                    recordType === type.id ? 'text-[#4A7FA5]' : 'text-slate-300'
                  }`}>{type.label}</span>
                </button>
              ))}
            </div>

            <textarea
              className="w-full bg-white rounded-[2rem] p-6 text-sm font-medium border-none focus:ring-2 focus:ring-[#4A7FA5]/20 min-h-[120px] mb-6 shadow-sm"
              placeholder={`Descreva a ${recordType === 'meal' ? 'refeição' : 'atividade'}...`}
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />

            <div className="flex items-center gap-4">
              <label className="flex-1 h-16 bg-white rounded-2xl border-2 border-dashed border-slate-100 flex items-center justify-center gap-3 text-slate-400 cursor-pointer overflow-hidden">
                {tempPhoto ? (
                  <span className="text-[10px] font-black text-[#4A7FA5]">{tempPhoto.name}</span>
                ) : (
                  <><Camera size={20} /> <span className="text-[10px] font-black uppercase tracking-widest">Anexar Foto</span></>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={(e) => setTempPhoto(e.target.files?.[0] || null)} />
              </label>

              <button
                onClick={handleSubmitRecord}
                disabled={isSubmitting}
                className="w-16 h-16 bg-[#4A7FA5] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-[#4A7FA5]/20 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}