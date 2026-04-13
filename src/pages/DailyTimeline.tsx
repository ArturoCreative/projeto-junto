import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  ChevronRight, 
  CheckCircle2, 
  Circle, 
  Plus, 
  MoreVertical, 
  AlertCircle,
  X,
  Filter
} from 'lucide-react';

interface TimelineItem {
  id: number;
  hora: string;
  tarefa: string;
  descricao: string;
  categoria: 'saude' | 'lazer' | 'alimentacao';
  status: 'concluido' | 'pendente' | 'atrasado';
}

export default function DailyTimeline({ idoso, onNavigate }: any) {
  const [filter, setFilter] = useState<'todos' | 'saude'>('todos');
  const [modalAtividade, setModalAtividade] = useState(false);
  const [atividades, setAtividades] = useState<TimelineItem[]>([
    { id: 1, hora: '08:00', tarefa: 'Losartana 50mg', descricao: 'Tomar com água após o café', categoria: 'saude', status: 'concluido' },
    { id: 2, hora: '09:30', tarefa: 'Café da Manhã', descricao: 'Frutas e aveia', categoria: 'alimentacao', status: 'concluido' },
    { id: 3, hora: '10:30', tarefa: 'Caminhada Leve', descricao: '15 minutos no jardim', categoria: 'lazer', status: 'concluido' },
    { id: 4, hora: '15:30', tarefa: 'Consulta Cardiologista', descricao: 'Dr. Roberto - Levar exames', categoria: 'saude', status: 'pendente' },
    { id: 5, hora: '18:00', tarefa: 'Jantar', descricao: 'Sopa de legumes', categoria: 'alimentacao', status: 'pendente' },
    { id: 6, hora: '21:00', tarefa: 'Medição Pressão', descricao: 'Verificar e anotar no app', categoria: 'saude', status: 'pendente' },
  ]);

  const nomeExibicao = idoso?.apelido || idoso?.nome || "Idoso";
  const fotoExibicao = idoso?.foto || null;

  const toggleStatus = (id: number) => {
    setAtividades(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, status: item.status === 'concluido' ? 'pendente' : 'concluido' };
      }
      return item;
    }));
  };

  const atividadesFiltradas = filter === 'todos' 
    ? atividades 
    : atividades.filter(a => a.categoria === 'saude');

  return (
    <div className="min-h-screen bg-[#FAF8F4] pb-32 animate-in fade-in duration-700">
      
      {/* Modal de Nova Atividade */}
      {modalAtividade && (
        <div className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-white w-full max-w-sm rounded-[3rem] p-10 shadow-2xl animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-black text-[#2D3142] italic uppercase tracking-tighter">Nova Tarefa</h2>
              <button onClick={() => setModalAtividade(false)} className="p-2 bg-slate-100 rounded-full"><X size={20}/></button>
            </div>
            <div className="space-y-4">
              <input type="text" placeholder="O que precisa ser feito?" className="w-full p-5 bg-slate-50 rounded-2xl border-none font-bold text-sm outline-none focus:ring-2 ring-[#4A7FA5]/20" />
              <div className="grid grid-cols-2 gap-4">
                <input type="time" className="p-5 bg-slate-50 rounded-2xl border-none font-bold text-sm outline-none" />
                <select className="p-5 bg-slate-50 rounded-2xl border-none font-bold text-sm outline-none">
                  <option>Saúde</option>
                  <option>Alimentação</option>
                  <option>Lazer</option>
                </select>
              </div>
            </div>
            <button onClick={() => setModalAtividade(false)} className="w-full mt-8 py-6 bg-[#2D3142] text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] shadow-xl">Agendar Atividade</button>
          </div>
        </div>
      )}

      {/* Header Profissional */}
      <header className="p-8 bg-white/50 backdrop-blur-sm sticky top-0 z-50 border-b border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <button onClick={() => onNavigate('dashboard')} className="w-12 h-12 rounded-2xl bg-white shadow-xl flex items-center justify-center text-[#4A7FA5] active:scale-90 transition-all">
            <ArrowLeft size={20}/>
          </button>
          <div className="flex items-center gap-3">
            <button onClick={() => setFilter(filter === 'todos' ? 'saude' : 'todos')} className={`w-12 h-12 rounded-2xl shadow-xl flex items-center justify-center transition-all ${filter === 'saude' ? 'bg-[#4A7FA5] text-white' : 'bg-white text-slate-400'}`}>
              <Filter size={18} />
            </button>
            <div className="w-12 h-12 rounded-2xl bg-[#2D3142] shadow-xl flex items-center justify-center text-white">
              <Calendar size={18} />
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-[1.5rem] bg-slate-200 overflow-hidden border-2 border-white shadow-lg">
            {fotoExibicao ? <img src={fotoExibicao} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-black text-[#4A7FA5]">JD</div>}
          </div>
          <div>
            <p className="text-[10px] font-black text-[#E8A87C] uppercase tracking-[0.3em] leading-none mb-1">Cronograma Diário</p>
            <h1 className="text-2xl font-black text-[#2D3142] tracking-tighter italic leading-none">{nomeExibicao}</h1>
          </div>
        </div>
      </header>

      {/* Conteúdo da Timeline */}
      <div className="p-8 relative">
        {/* Linha Guia Vertical */}
        <div className="absolute left-[55px] top-10 bottom-10 w-1 bg-gradient-to-b from-[#4A7FA5]/20 via-slate-200 to-transparent rounded-full" />

        <div className="space-y-8">
          {atividadesFiltradas.map((item, index) => (
            <div key={item.id} className={`flex gap-6 items-start animate-in slide-in-from-left duration-500`} style={{ delay: `${index * 100}ms` }}>
              
              {/* Indicador de Hora e Status */}
              <div className="flex flex-col items-center relative z-10">
                <button 
                  onClick={() => toggleStatus(item.id)}
                  className={`w-14 h-14 rounded-[1.5rem] shadow-xl flex items-center justify-center transition-all border-4 border-[#FAF8F4] ${
                    item.status === 'concluido' ? 'bg-green-500 text-white' : 'bg-white text-[#4A7FA5]'
                  }`}
                >
                  {item.status === 'concluido' ? <CheckCircle2 size={22} /> : <Clock size={22} />}
                </button>
                <span className="text-[9px] font-black text-slate-400 mt-3 uppercase tracking-tighter">{item.hora}</span>
              </div>

              {/* Card da Atividade */}
              <div className={`flex-1 p-6 rounded-[2.5rem] shadow-xl border border-white transition-all relative overflow-hidden group ${
                item.status === 'concluido' ? 'bg-white/40 opacity-60' : 'bg-white'
              }`}>
                {item.categoria === 'saude' && (
                  <div className="absolute top-0 right-10 w-8 h-1 bg-[#4A7FA5] rounded-b-full" />
                )}
                
                <div className="flex justify-between items-start mb-2">
                  <div className="space-y-1">
                    <p className={`text-[8px] font-black uppercase tracking-widest ${
                      item.categoria === 'saude' ? 'text-[#4A7FA5]' : 'text-slate-300'
                    }`}>
                      {item.categoria}
                    </p>
                    <h3 className={`font-black text-sm italic transition-all ${
                      item.status === 'concluido' ? 'line-through text-slate-400' : 'text-[#2D3142]'
                    }`}>
                      {item.tarefa}
                    </h3>
                  </div>
                  <button className="text-slate-200 group-hover:text-slate-400 transition-colors">
                    <MoreVertical size={16} />
                  </button>
                </div>
                
                <p className="text-[11px] font-bold text-slate-400 leading-tight italic">
                  {item.descricao}
                </p>

                {item.status === 'pendente' && item.hora < '12:00' && (
                  <div className="mt-4 flex items-center gap-2 text-red-400">
                    <AlertCircle size={12} />
                    <span className="text-[8px] font-black uppercase tracking-tighter">Tarefa Atrasada</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAB - Floating Action Button Profissional */}
      <div className="fixed bottom-10 right-8 z-[100]">
        <button 
          onClick={() => setModalAtividade(true)}
          className="w-20 h-20 bg-[#2D3142] text-white rounded-[2.5rem] shadow-[0_20px_40px_rgba(0,0,0,0.3)] flex items-center justify-center active:scale-90 transition-all border-[6px] border-[#FAF8F4]"
        >
          <Plus size={32} />
        </button>
      </div>

      {/* Overlay de navegação inferior opcional/estético */}
      <div className="fixed bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#FAF8F4] to-transparent pointer-events-none" />
    </div>
  );
}