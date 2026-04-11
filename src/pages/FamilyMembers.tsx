import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Users, 
  UserPlus, 
  Trash2, 
  ShieldCheck, 
  ChevronRight, 
  Plus,
  Heart,
  Search,
  Info
} from 'lucide-react';

interface Member {
  id: number;
  nome: string;
  papel: string;
  nivel: 'admin' | 'membro';
}

interface FamilyMembersProps {
  membrosSalvos: Member[];
  onBack: () => void;
  onNext: (membros: Member[]) => void;
}

export default function FamilyMembers({ membrosSalvos, onBack, onNext }: FamilyMembersProps) {
  const [membros, setMembros] = useState<Member[]>(membrosSalvos);
  const [novoNome, setNovoNome] = useState('');
  const [novoPapel, setNovoPapel] = useState('Filho(a)');
  const [outroPapel, setOutroPapel] = useState('');

  const adicionarMembro = () => {
    if (!novoNome.trim()) return;
    
    const papelFinal = novoPapel === 'Outros' ? outroPapel : novoPapel;
    const novo: Member = {
      id: Date.now(),
      nome: novoNome,
      papel: papelFinal || 'Apoio',
      nivel: 'membro'
    };

    setMembros([...membros, novo]);
    setNovoNome('');
    setOutroPapel('');
    setNovoPapel('Filho(a)');
  };

  const removerMembro = (id: number) => {
    setMembros(membros.filter(m => m.id !== id));
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4] font-sans pb-32 overflow-x-hidden animate-in fade-in duration-700">
      {/* DECORAÇÃO DE FUNDO */}
      <div className="fixed -top-24 -left-24 w-64 h-64 bg-[#E8A87C]/5 rounded-full blur-3xl" />

      <header className="relative p-8 pb-4 z-10">
        <button 
          onClick={() => { onNext(membros); onBack(); }}
          className="mb-8 flex items-center text-[#4A7FA5] font-black uppercase text-[10px] tracking-[0.3em] group active:scale-95 transition-all"
        >
          <div className="w-10 h-10 rounded-full bg-white shadow-md shadow-slate-200/50 flex items-center justify-center mr-4 group-hover:bg-[#4A7FA5] group-hover:text-white transition-all">
            <ArrowLeft size={16} />
          </div>
          Voltar
        </button>

        <div className="space-y-2">
          <span className="bg-[#E8A87C]/10 text-[#E8A87C] px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em]">
            Passo 02 de 03
          </span>
          <h1 className="text-4xl font-black text-[#2D3142] tracking-tighter italic leading-[0.9]">
            Rede de <span className="text-[#E8A87C]">Apoio</span>
          </h1>
          <p className="text-slate-400 text-sm font-bold leading-relaxed max-w-[280px] pt-3 flex items-center gap-2">
            <Users size={14} className="text-[#4A7FA5] shrink-0" />
            Adicione familiares e cuidadores ao círculo de cuidado.
          </p>
        </div>
      </header>

      <div className="relative px-8 mt-8 space-y-8 z-10">
        {/* LISTAGEM DE MEMBROS */}
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Membros Ativos</span>
            <span className="text-[10px] font-black text-[#4A7FA5] bg-[#4A7FA5]/5 px-2 py-0.5 rounded-md">{membros.length} Pessoas</span>
          </div>
          
          <div className="space-y-3">
            {membros.map((m) => (
              <div 
                key={m.id} 
                className="bg-white p-5 rounded-[2.5rem] flex justify-between items-center shadow-xl shadow-slate-200/40 border border-white group animate-in slide-in-from-right-4 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center shadow-inner ${
                    m.nivel === 'admin' ? 'bg-[#2D3142] text-white' : 'bg-[#FAF8F4] text-[#4A7FA5]'
                  }`}>
                    {m.nivel === 'admin' ? <ShieldCheck size={24} /> : <Users size={24} />}
                  </div>
                  <div>
                    <p className="font-black text-[#2D3142] text-md leading-none mb-1.5">{m.nome}</p>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#E8A87C]" />
                      <p className="text-[10px] uppercase font-black text-[#E8A87C] tracking-widest">{m.papel}</p>
                    </div>
                  </div>
                </div>
                
                {m.nivel !== 'admin' && (
                  <button 
                    onClick={() => removerMembro(m.id)}
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-200 hover:text-red-400 hover:bg-red-50 transition-all active:scale-90"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CARD DE ADIÇÃO (DESIGN COMPLETO) */}
        <section className="space-y-5">
          <div className="flex items-center gap-3 ml-4">
            <UserPlus size={14} className="text-[#4A7FA5]" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Novo Convidado</span>
          </div>

          <div className="bg-white p-8 rounded-[3rem] shadow-2xl shadow-slate-200/50 space-y-6 border-2 border-dashed border-slate-100 relative overflow-hidden">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-[#4A7FA5] uppercase ml-2 tracking-widest">Nome do Familiar</label>
              <input 
                type="text"
                placeholder="Ex: Maria Oliveira"
                className="w-full p-5 rounded-2xl bg-[#FAF8F4] border-2 border-transparent focus:border-[#4A7FA5] focus:bg-white outline-none font-bold text-[#2D3142] transition-all"
                value={novoNome}
                onChange={(e) => setNovoNome(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black text-[#4A7FA5] uppercase ml-2 tracking-widest">Grau de Parentesco / Função</label>
              <div className="relative">
                <select 
                  className="w-full p-5 rounded-2xl bg-[#FAF8F4] border-2 border-transparent focus:border-[#4A7FA5] outline-none font-black text-[#2D3142] appearance-none cursor-pointer"
                  value={novoPapel}
                  onChange={(e) => setNovoPapel(e.target.value)}
                >
                  <option value="Filho(a)">Filho(a)</option>
                  <option value="Filho(a) Distante">Filho(a) Distante</option>
                  <option value="Cônjuge">Cônjuge</option>
                  <option value="Cuidador(a)">Cuidador(a)</option>
                  <option value="Neto(a)">Neto(a)</option>
                  <option value="Irmão/Irmã">Irmão/Irmã</option>
                  <option value="Outros">Outros</option>
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                  <ChevronRight size={16} className="rotate-90" />
                </div>
              </div>
            </div>

            {novoPapel === 'Outros' && (
              <div className="space-y-2 animate-in zoom-in-95 duration-300">
                <label className="text-[9px] font-black text-[#E8A87C] uppercase ml-2 tracking-widest">Especifique o Vínculo</label>
                <input 
                  type="text"
                  placeholder="Ex: Vizinho, Fisioterapeuta..."
                  className="w-full p-5 rounded-2xl bg-white border-2 border-[#E8A87C] outline-none font-bold text-[#2D3142] shadow-inner"
                  value={outroPapel}
                  onChange={(e) => setOutroPapel(e.target.value)}
                />
              </div>
            )}

            <button 
              onClick={adicionarMembro}
              className="w-full py-5 bg-[#4A7FA5] text-white rounded-[1.5rem] font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-[#4A7FA5]/20 active:scale-95 transition-all flex items-center justify-center gap-3 group"
            >
              <Plus size={18} className="group-hover:rotate-90 transition-transform" /> 
              Adicionar à Rede
            </button>
          </div>
        </section>

        {/* BOTÃO FINALIZAR */}
        <div className="pt-8 space-y-6">
          <button 
            onClick={() => onNext(membros)}
            className="w-full py-8 bg-[#2D3142] text-white rounded-[2.5rem] font-black text-[11px] uppercase tracking-[0.4em] flex items-center justify-center gap-4 shadow-2xl shadow-[#2D3142]/40 active:scale-95 transition-all group"
          >
            Concluir e Abrir Painel
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          
          <div className="flex flex-col items-center gap-2 opacity-20">
            <Heart size={16} className="text-[#2D3142] fill-[#2D3142]" />
            <p className="text-[8px] font-black uppercase tracking-[0.2em] text-[#2D3142]">
              Juntos, cuidamos melhor
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}