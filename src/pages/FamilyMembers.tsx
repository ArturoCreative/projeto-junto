import React, { useState } from 'react';
import {
  ArrowLeft,
  UserPlus,
  Users,
  Star,
  Trash2,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

export default function FamilyMembers({ membrosSalvos, onBack, onNext }: any) {
  const [membros, setMembros] = useState(membrosSalvos);
  const [novoNome, setNovoNome] = useState('');
  const [novoPapel, setNovoPapel] = useState('Filho(a)');
  const [outroPapel, setOutroPapel] = useState('');

  const adicionarMembro = () => {
    if (!novoNome.trim()) return;
    const papelFinal = novoPapel === 'Outros' ? outroPapel : novoPapel;
    const novo = {
      id: Date.now(),
      nome: novoNome,
      papel: papelFinal,
      nivel: 'membro',
    };
    setMembros([...membros, novo]);
    setNovoNome('');
    setOutroPapel('');
  };

  return (
    <div className="p-8 bg-[#FAF8F4] min-h-screen font-sans">
      <button
        onClick={() => {
          onNext(membros);
          onBack();
        }}
        className="mb-6 flex items-center text-[#4A7FA5] font-black uppercase text-[10px] tracking-widest"
      >
        <ArrowLeft size={16} className="mr-2" /> VOLTAR E SALVAR
      </button>

      <div className="space-y-4 mb-8">
        {membros.map((m: any) => (
          <div
            key={m.id}
            className="bg-white p-4 rounded-2xl shadow-sm flex justify-between items-center"
          >
            <div className="flex items-center gap-3">
              <div className="bg-slate-100 p-2 rounded-xl text-[#4A7FA5]">
                <Users size={20} />
              </div>
              <div>
                <p className="font-bold text-[#2D3142]">{m.nome}</p>
                <p className="text-[10px] uppercase font-black text-[#E8A87C]">
                  {m.papel}
                </p>
              </div>
            </div>
            {m.nivel !== 'admin' && (
              <button
                onClick={() =>
                  setMembros(membros.filter((i: any) => i.id !== m.id))
                }
              >
                <Trash2 size={16} className="text-slate-300" />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-[2.5rem] shadow-inner space-y-4 border-2 border-dashed border-slate-200">
        <input
          placeholder="Nome"
          className="w-full p-4 rounded-xl bg-slate-50 outline-none font-bold"
          value={novoNome}
          onChange={(e) => setNovoNome(e.target.value)}
        />
        <select
          className="w-full p-4 rounded-xl bg-slate-50 outline-none font-bold text-slate-500"
          value={novoPapel}
          onChange={(e) => setNovoPapel(e.target.value)}
        >
          <option value="Filho(a)">Filho(a)</option>
          <option value="Filho(a) Distante">Filho(a) Distante</option>
          <option value="Outros">Outros</option>
        </select>
        {novoPapel === 'Outros' && (
          <input
            placeholder="Especifique a função"
            className="w-full p-4 rounded-xl border-2 border-[#E8A87C] outline-none font-bold"
            value={outroPapel}
            onChange={(e) => setOutroPapel(e.target.value)}
          />
        )}
        <button
          onClick={adicionarMembro}
          className="w-full py-4 bg-[#4A7FA5] text-white rounded-xl font-black text-[10px] uppercase tracking-widest"
        >
          Adicionar Membro
        </button>
      </div>

      <button
        onClick={() => onNext(membros)}
        className="w-full py-6 bg-[#2D3142] text-white rounded-[2rem] font-black mt-8 shadow-xl"
      >
        CONCLUIR REDE
      </button>
    </div>
  );
}
