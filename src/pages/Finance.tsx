import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { 
  Plus, 
  TrendingUp, 
  ShoppingBag, 
  Heart, 
  Receipt, 
  ChevronLeft,
  X,
  Loader2,
  Bell,
  Send,
  Info,
  ExternalLink
} from 'lucide-react';

interface FinanceProps {
  elderly: any;
  familyId: string;
  user: any;
  onNavigate: (screen: any) => void;
}

export default function Finance({ elderly, familyId, user, onNavigate }: FinanceProps) {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [totalMonth, setTotalMonth] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estados para Tutorial/Conexões
  const [pushStatus, setPushStatus] = useState<'default' | 'granted' | 'denied'>('default');

  useEffect(() => {
    if (familyId) {
      fetchFinanceData();
      checkNotificationPermission();
    }
  }, [familyId]);

  const checkNotificationPermission = () => {
    if (!("Notification" in window)) return;
    setPushStatus(Notification.permission as any);
  };

  const requestPush = async () => {
    const permission = await Notification.requestPermission();
    setPushStatus(permission);
  };

  async function fetchFinanceData() {
    try {
      setLoading(true);
      const { data: expData } = await supabase
        .from('expenses')
        .select(`*, profiles:recorded_by (full_name)`)
        .eq('family_id', familyId)
        .order('expense_date', { ascending: false });

      setExpenses(expData || []);
      
      const now = new Date();
      const monthTotal = (expData || [])
        .filter(exp => new Date(exp.expense_date).getMonth() === now.getMonth())
        .reduce((sum, exp) => sum + Number(exp.amount), 0);
      
      setTotalMonth(monthTotal);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  }

  return (
    <div className="min-h-full bg-[#FAF8F4] pb-24 text-[#2D3142]">
      {/* Header com Resumo Financeiro */}
      <header className="bg-white px-8 pt-16 pb-10 rounded-b-[3.5rem] shadow-sm sticky top-0 z-30">
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => onNavigate('dashboard')} className="text-slate-300">
            <ChevronLeft size={24} />
          </button>
          <h2 className="text-2xl font-black tracking-tighter italic">
            Gestão <span className="text-[#4A7FA5]">e Redes</span>
          </h2>
          <div className="w-6" />
        </div>

        <div className="bg-[#2D3142] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 p-6 opacity-10"><TrendingUp size={80} /></div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-60">Gastos do Mês</p>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold opacity-40">R$</span>
            <h3 className="text-4xl font-black tracking-tighter">
              {totalMonth.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </h3>
          </div>
        </div>
      </header>

      <div className="p-8 space-y-10">
        
        {/* CENTRAL DE CONEXÕES SOS (Custo Zero) */}
        <section className="space-y-4">
          <h3 className="font-black text-xs uppercase tracking-widest flex items-center gap-2">
            Rede de Emergência <span className="w-8 h-[1px] bg-slate-200" />
          </h3>
          
          {/* Card Push Notification */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-50 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${pushStatus === 'granted' ? 'bg-green-50 text-green-500' : 'bg-blue-50 text-[#4A7FA5]'}`}>
                <Bell size={22} />
              </div>
              <div className="flex-1">
                <h4 className="font-black text-sm">Alertas no Celular</h4>
                <p className="text-slate-400 text-[10px] font-bold uppercase">Status: {pushStatus === 'granted' ? 'Ativado' : 'Inativo'}</p>
              </div>
              {pushStatus !== 'granted' && (
                <button onClick={requestPush} className="px-4 py-2 bg-[#4A7FA5] text-white text-[9px] font-black uppercase rounded-xl">Ativar</button>
              )}
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed bg-[#FAF8F4] p-3 rounded-xl italic">
              "Isso permite que o SOS apite no seu celular mesmo que o aplicativo esteja fechado."
            </p>
          </div>

          {/* Card Telegram */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-slate-50 shadow-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-500">
                <Send size={22} />
              </div>
              <div className="flex-1">
                <h4 className="font-black text-sm">Grupo SOS Telegram</h4>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-tight">Custo Zero e Ilimitado</p>
              </div>
              <a href="https://t.me/seu_bot_aqui" target="_blank" className="p-3 bg-sky-500 text-white rounded-xl">
                <ExternalLink size={16} />
              </a>
            </div>
            <div className="space-y-3">
              <p className="text-[11px] font-bold text-[#2D3142]">Como conectar sua família:</p>
              <div className="flex gap-2">
                {[1, 2, 3].map(step => (
                  <div key={step} className="flex-1 bg-[#FAF8F4] p-2 rounded-lg text-center">
                    <span className="block text-[14px] font-black text-[#4A7FA5]">{step}</span>
                    <span className="text-[8px] font-black uppercase tracking-tighter text-slate-400">
                      {step === 1 ? 'Instale App' : step === 2 ? 'Clique Link' : 'Diga /Entrar'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* EXTRATO DE CUSTOS (Auditável) */}
        <section className="space-y-4">
          <h3 className="font-black text-xs uppercase tracking-widest flex items-center gap-2">
            Histórico Financeiro <span className="w-8 h-[1px] bg-slate-200" />
          </h3>
          <div className="space-y-4">
            {expenses.length === 0 ? (
              <p className="text-center text-slate-300 py-10 italic text-sm">Sem despesas este mês.</p>
            ) : (
              expenses.map((exp) => (
                <div key={exp.id} className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-slate-50 flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#FAF8F4] rounded-2xl flex items-center justify-center text-[#4A7FA5]">
                     {exp.category === 'health' ? <Heart size={20}/> : <ShoppingBag size={20}/>}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-[13px]">{exp.description}</h4>
                    <p className="text-slate-400 text-[9px] font-bold uppercase tracking-tight">
                      Por {exp.profiles?.full_name?.split(' ')[0]} • {new Date(exp.expense_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-sm">R$ {Number(exp.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      <button onClick={() => setShowAddModal(true)} className="fixed bottom-28 right-8 w-16 h-16 bg-[#2D3142] text-white rounded-2xl shadow-xl flex items-center justify-center z-40">
        <Plus size={28} />
      </button>

      {/* MODAL DE ADIÇÃO (Incluindo os campos necessários para robustez) */}
      {showAddModal && (
        <div className="fixed inset-0 bg-[#2D3142]/80 backdrop-blur-sm z-[100] flex items-end">
          <div className="bg-[#FAF8F4] w-full rounded-t-[4rem] p-10 pb-16 animate-slide-up">
            <div className="flex justify-between items-center mb-10">
              <h3 className="font-black text-2xl italic tracking-tighter">Lançar Despesa</h3>
              <button onClick={() => setShowAddModal(false)} className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-300"><X size={24} /></button>
            </div>
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-50">
                <label className="block text-[9px] font-black uppercase tracking-widest text-slate-300 mb-1">Descrição</label>
                <input type="text" className="w-full bg-transparent border-none p-0 text-sm font-bold focus:ring-0" placeholder="Ex: Farmácia" onChange={e => {/* set state */}}/>
              </div>
              <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-50">
                <label className="block text-[9px] font-black uppercase tracking-widest text-slate-300 mb-1">Valor</label>
                <input type="number" className="w-full bg-transparent border-none p-0 text-sm font-bold focus:ring-0" placeholder="0.00" />
              </div>
              <button className="w-full py-6 bg-[#4A7FA5] text-white rounded-[2rem] font-black uppercase text-[10px] tracking-[0.2em]">Confirmar Gasto</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}