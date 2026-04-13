import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { 
  Plus, 
  Pill, 
  Stethoscope, 
  ClipboardList, 
  Clock, 
  ChevronRight, 
  AlertCircle,
  Calendar,
  Check,
  X,
  Loader2,
  ChevronLeft
} from 'lucide-react';

interface HealthProps {
  elderly: any;
  onNavigate: (screen: any) => void;
}

export default function Health({ elderly, onNavigate }: HealthProps) {
  const [activeTab, setActiveTab] = useState<'meds' | 'appointments'>('meds');
  const [meds, setMeds] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Estados para Novo Medicamento
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newMed, setNewMed] = useState({
    name: '',
    dosage: '',
    frequency: '1x ao dia',
    instructions: '',
    category: 'medication'
  });

  useEffect(() => {
    if (elderly?.id) {
      fetchHealthData();
    }
  }, [elderly, activeTab]);

  async function fetchHealthData() {
    try {
      setLoading(true);
      if (activeTab === 'meds') {
        const { data } = await supabase
          .from('medications')
          .select('*')
          .eq('elderly_id', elderly.id)
          .eq('is_active', true)
          .order('name');
        setMeds(data || []);
      } else {
        const { data } = await supabase
          .from('health_appointments')
          .select('*')
          .eq('elderly_id', elderly.id)
          .order('appointment_date', { ascending: true });
        setAppointments(data || []);
      }
    } catch (err) {
      console.error("Erro ao carregar dados de saúde:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddMed() {
    if (!newMed.name) return;
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('medications').insert({
        elderly_id: elderly.id,
        name: newMed.name,
        dosage: newMed.dosage,
        frequency_description: newMed.frequency,
        instructions: newMed.instructions,
        is_active: true
      });

      if (error) throw error;
      setShowAddModal(false);
      fetchHealthData();
      setNewMed({ name: '', dosage: '', frequency: '1x ao dia', instructions: '', category: 'medication' });
    } catch (err) {
      alert("Erro ao salvar medicamento.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-full bg-[#FAF8F4] pb-24">
      {/* Header Fixo e Elegante */}
      <header className="bg-white px-8 pt-16 pb-8 rounded-b-[3.5rem] shadow-sm sticky top-0 z-30">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => onNavigate('dashboard')} className="text-slate-300">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-2xl font-black text-[#2D3142] tracking-tighter italic text-center">
            Saúde & <span className="text-[#4A7FA5]">Cuidado</span>
          </h2>
          <div className="w-6" />
        </div>

        {/* Tabs Estilizadas */}
        <div className="flex bg-[#FAF8F4] p-1.5 rounded-2xl">
          <button 
            onClick={() => setActiveTab('meds')}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'meds' ? 'bg-white text-[#4A7FA5] shadow-sm' : 'text-slate-400'}`}
          >
            Medicamentos
          </button>
          <button 
            onClick={() => setActiveTab('appointments')}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'appointments' ? 'bg-white text-[#4A7FA5] shadow-sm' : 'text-slate-400'}`}
          >
            Consultas
          </button>
        </div>
      </header>

      <div className="p-6 space-y-4">
        {loading ? (
          <div className="flex justify-center py-20 opacity-20">
            <Loader2 className="animate-spin text-[#4A7FA5]" size={32} />
          </div>
        ) : activeTab === 'meds' ? (
          /* LISTA DE MEDICAMENTOS */
          <div className="space-y-4">
            {meds.length === 0 && (
              <div className="text-center py-10 px-10">
                <p className="text-slate-300 text-sm font-medium italic">Nenhum medicamento registrado ainda.</p>
              </div>
            )}
            {meds.map((med) => (
              <div key={med.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-50 flex items-center gap-5">
                <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-[#4A7FA5]">
                  <Pill size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="text-[#2D3142] font-black text-sm">{med.name}</h4>
                  <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">
                    {med.dosage} • {med.frequency_description}
                  </p>
                </div>
                <div className="w-10 h-10 bg-[#FAF8F4] rounded-full flex items-center justify-center text-slate-300">
                  <ChevronRight size={18} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* LISTA DE CONSULTAS */
          <div className="space-y-4">
            {appointments.length === 0 && (
              <div className="text-center py-10 px-10">
                <p className="text-slate-300 text-sm font-medium italic">Sem consultas ou exames agendados.</p>
              </div>
            )}
            {appointments.map((app) => (
              <div key={app.id} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-50">
                <div className="flex justify-between items-start mb-4">
                  <div className="px-4 py-1.5 bg-green-50 text-green-600 rounded-full text-[9px] font-black uppercase tracking-widest">
                    {app.category || 'Consulta'}
                  </div>
                  <span className="text-slate-300 text-[10px] font-bold">
                    {new Date(app.appointment_date).toLocaleDateString()}
                  </span>
                </div>
                <h4 className="text-[#2D3142] font-black text-sm mb-1">{app.title}</h4>
                <p className="text-slate-400 text-[11px] font-medium flex items-center gap-1.5">
                  <Stethoscope size={12} /> {app.doctor_name || 'Profissional não informado'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botão Flutuante de Adição */}
      <button 
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-28 right-8 w-16 h-16 bg-[#4A7FA5] text-white rounded-2xl shadow-xl shadow-[#4A7FA5]/20 flex items-center justify-center z-40 active:scale-95 transition-all"
      >
        <Plus size={28} />
      </button>

      {/* Modal de Cadastro Robusto */}
      {showAddModal && (
        <div className="fixed inset-0 bg-[#2D3142]/80 backdrop-blur-sm z-[100] flex items-end">
          <div className="bg-[#FAF8F4] w-full rounded-t-[4rem] p-10 pb-16 animate-slide-up shadow-2xl">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-[#2D3142] font-black text-2xl tracking-tighter italic">Adicionar {activeTab === 'meds' ? 'Remédio' : 'Consulta'}</h3>
              <button onClick={() => setShowAddModal(false)} className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-300">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-6">
              <InputBlock label="Nome / Título">
                <input 
                  type="text" 
                  placeholder="Ex: Losartana 50mg"
                  className="w-full bg-transparent border-none p-0 text-sm font-bold focus:ring-0"
                  value={newMed.name}
                  onChange={e => setNewMed({...newMed, name: e.target.value})}
                />
              </InputBlock>

              <div className="grid grid-cols-2 gap-4">
                <InputBlock label="Dosagem">
                  <input 
                    type="text" 
                    placeholder="Ex: 1 comprimido"
                    className="w-full bg-transparent border-none p-0 text-sm font-bold focus:ring-0"
                    value={newMed.dosage}
                    onChange={e => setNewMed({...newMed, dosage: e.target.value})}
                  />
                </InputBlock>
                <InputBlock label="Frequência">
                  <select 
                    className="w-full bg-transparent border-none p-0 text-sm font-bold focus:ring-0"
                    value={newMed.frequency}
                    onChange={e => setNewMed({...newMed, frequency: e.target.value})}
                  >
                    <option>1x ao dia</option>
                    <option>2x ao dia</option>
                    <option>De 8h em 8h</option>
                    <option>Uso contínuo</option>
                  </select>
                </InputBlock>
              </div>

              <button 
                onClick={handleAddMed}
                disabled={isSubmitting}
                className="w-full py-6 bg-[#4A7FA5] text-white rounded-[2rem] font-black uppercase text-[10px] tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all mt-6 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Confirmar Registro'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InputBlock({ label, children }: any) {
  return (
    <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-50">
      <label className="block text-[9px] font-black uppercase tracking-widest text-slate-300 mb-1">{label}</label>
      {children}
    </div>
  );
}