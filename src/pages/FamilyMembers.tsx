import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Users, 
  UserPlus, 
  Trash2, 
  ShieldCheck, 
  Heart, 
  ChevronRight,
  Plus
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
    <div className="min-h-screen bg-[#FAF8F4] font-sans pb-32 overflow-x-hidden animate-in fade-in duration-500">
      <header className="p-8 pb-4">
        <button 
          onClick={() => { onNext(membros); onBack(); }}
          className="mb-8 flex items-center text-[#4A7FA5] font-black uppercase text-[10px] tracking-[0.3em] group active:scale-95 transition-all"
        >
          <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center mr-3 group-hover:bg-[#4A7FA5] group-hover:text-white transition-colors">
            <ArrowLeft size={14} />
          </div>
          Voltar
        </button>

        <div className="space-y-1">
          <p className="text-[#4A7FA5] text-[10px] font-black uppercase tracking-[0.2em] opacity-70">
            Passo 02 de 03
          </p>
          <h1 className="text-4xl font-black text-[#2D3142] tracking-tighter italic leading-none">
            Rede de <span className="text-[#E8A87C]">Apoio</span>
          </h1>
          <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-[280px] pt-2">
            Adicione as pessoas que terão acesso ao cuidado diário.
          </p>
        </div>
      </header>

      <div className="px-8 mt-6 space-y-6">
        {/* LISTA DE MEMBROS JÁ ADICIONADOS */}
        <div className="space-y-3">
          <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-2 mb-2">Membros Ativos</p>
          {membros.map((m) => (
            <div 
              key={m.id} 
              className="bg-white p-5 rounded-[2rem] flex justify-between items-center shadow-lg shadow-slate-200/50 border border-white group animate-in slide-in-from-right-4 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${m.nivel === 'admin' ? 'bg-[#4A7FA5] text-white' : 'bg-[#FAF8F4] text-[#4A7FA5]'}`}>
                  {m.nivel === 'admin' ? <ShieldCheck size={20} /> : <Users size={20} />}
                </div>
                <div>
                  <p className="font-black text-[#2D3142] text-sm leading-none mb-1">{m.nome}</p>
                  <p className="text-[9px] uppercase font-black text-[#E8A87C] tracking-[0.15em]">{m.papel}</p>
                </div>
              </div>
              
              {m.nivel !== 'admin' && (
                <button 
                  onClick={() => removerMembro(m.id)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-200 hover:text-red-400 hover:bg-red-50 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* FORMULÁRIO DE ADIÇÃO (DESIGN COMPLETO) */}
        <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 space-y-5 border-2 border-dashed border-slate-100">
          <div className="flex items-center gap-2 mb-2">
            <UserPlus size={16} className="text-[#4A7FA5]" />
            <span className="text-[10px] font-black text-[#4A7FA5] uppercase tracking-widest">Novo Convidado</span>
          </div>

          <div className="space-y-4">
            <input 
              type="text"
              placeholder="Nome do familiar ou cuidador"
              className="w-full p-5 rounded-2xl bg-[#FAF8F4] border-2 border-transparent focus:border-[#4A7FA5] focus:bg-white outline-none font-bold text-[#2D3142] transition-all placeholder:text-slate-300"
              value={novoNome}
              onChange={(e) => setNovoNome(e.target.value)}
            />

            <div className="space-y-2">
              <label className="text-[9px] font-black text-slate-400 uppercase ml-2 tracking-widest">Parentesco / Função</label>
              <select 
                className="w-full p-5 rounded-2xl bg-[#FAF8F4] border-2 border-transparent focus:border-[#4A7FA5] outline-none font-bold text-[#2D3142] appearance-none"
                value={novoPapel}
                onChange={(e) => setNovoPapel(e.target.value)}
              >
                <option value="Filho(a)">Filho(a)</option>
                <option value="Filho(a) Distante">Filho(a) Distante</option>
                <option value="Cônjuge">Cônjuge</option>
                <option value="Cuidador(a)">Cuidador(a)</option>
                <option value="Neto(a)">Neto(a)</option>
                <option value="Outros">Outros</option>
              </select>
            </div>

            {novoPapel === 'Outros' && (
              <input 
                placeholder="Especifique o vínculo"
                className="w-full p-5 rounded-2xl bg-white border-2 border-[#E8A87C] outline-none font-bold text-[#2D3142] animate-in zoom-in-95 duration-300"
                value={outroPapel}
                onChange={(e) => setOutroPapel(e.target.value)}
              />
            )}

            <button 
              onClick={adicionarMembro}
              className="w-full py-5 bg-[#4A7FA5] text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-[#4A7FA5]/20 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Plus size={16} /> Adicionar à Rede
            </button>
          </div>
        </div>

        {/* BOTÃO FINAL */}
        <div className="pt-6">
          <button 
            onClick={() => onNext(membros)}
            className="w-full py-7 bg-[#2D3142] text-white rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-3 shadow-2xl shadow-[#2D3142]/40 active:scale-95 transition-all group"
          >
            Finalizar e Abrir Painel
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}