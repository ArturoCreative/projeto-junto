import React, { useState } from 'react';
import {
  ArrowLeft,
  Plus,
  Utensils,
  Pill,
  Smile,
  Camera,
  FileText,
  MapPin,
  Stethoscope,
  ChevronRight,
} from 'lucide-react';

interface Props {
  onBack: () => void;
  nomeIdoso: string;
}

export default function DailyTimeline({ onBack, nomeIdoso }: Props) {
  // Simulação de registros (depois conectaremos ao Supabase)
  const [registros] = useState([
    {
      id: 1,
      tipo: 'medicamento',
      hora: '14:00',
      titulo: 'Losartana 50mg',
      quem: 'Ana (irmã)',
      cor: 'bg-[#4A7FA5]',
    },
    {
      id: 2,
      tipo: 'refeição',
      hora: '12:30',
      titulo: 'Almoço: Comeu bem',
      quem: 'Cuidadora',
      cor: 'bg-[#E8A87C]',
    },
    {
      id: 3,
      tipo: 'humor',
      hora: '10:00',
      titulo: 'Estava animada e sorridente',
      quem: 'João',
      cor: 'bg-purple-500',
    },
  ]);

  const [showOptions, setShowOptions] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF8F4] p-6 font-sans relative pb-24">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="text-[#4A7FA5] font-bold flex items-center gap-2"
        >
          <ArrowLeft size={20} /> Voltar
        </button>
        <div className="text-right">
          <h2 className="text-xl font-black text-[#2D3142]">
            Dia de {nomeIdoso.split(' ')[0]}
          </h2>
          <p className="text-xs font-bold text-[#4A7FA5] uppercase tracking-widest">
            Hoje, 22 de Outubro
          </p>
        </div>
      </div>

      {/* TIMELINE */}
      <div className="relative">
        {/* Linha vertical cinza no fundo */}
        <div className="absolute left-4 top-0 bottom-0 w-1 bg-slate-200 rounded-full"></div>

        <div className="space-y-10 relative">
          {registros.map((reg) => (
            <div key={reg.id} className="flex gap-6 items-start">
              {/* Círculo com ícone na linha */}
              <div
                className={`w-9 h-9 ${reg.cor} rounded-full flex items-center justify-center text-white shadow-lg z-10 shrink-0 border-4 border-[#FAF8F4]`}
              >
                {reg.tipo === 'medicamento' && <Pill size={16} />}
                {reg.tipo === 'refeição' && <Utensils size={16} />}
                {reg.tipo === 'humor' && <Smile size={16} />}
              </div>

              {/* Card do registro */}
              <div className="bg-white p-4 rounded-2xl shadow-sm flex-1 border border-slate-50">
                <div className="flex justify-between items-start mb-1">
                  <p className="font-black text-[#2D3142]">{reg.titulo}</p>
                  <span className="text-xs font-black text-[#4A7FA5]">
                    {reg.hora}
                  </span>
                </div>
                <p className="text-xs text-[#6B7280] font-medium italic">
                  por {reg.quem}
                </p>

                <div className="mt-3 flex gap-2">
                  <button className="text-[10px] font-black text-[#4A7FA5] uppercase">
                    Editar
                  </button>
                  <button className="text-[10px] font-black text-slate-300 uppercase">
                    Remover
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MENSAGEM SE ESTIVER VAZIO */}
      {registros.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
          <Utensils size={48} className="text-[#4A7FA5] mb-4" />
          <p className="font-bold text-[#6B7280]">
            Nenhum registro ainda hoje.
            <br />
            Que tal registrar o café? ☕
          </p>
        </div>
      )}

      {/* BOTÃO FLUTUANTE "+" */}
      <button
        onClick={() => setShowOptions(!showOptions)}
        className="fixed bottom-28 right-6 w-16 h-16 bg-[#4A7FA5] rounded-full shadow-2xl flex items-center justify-center text-white active:scale-90 transition-all z-50"
      >
        <Plus
          size={32}
          className={`transition-transform ${showOptions ? 'rotate-45' : ''}`}
        />
      </button>

      {/* MENU DE OPÇÕES (BOTTOM SHEET) */}
      {showOptions && (
        <div className="fixed inset-0 bg-[#2D3142]/40 backdrop-blur-sm z-40 flex items-end">
          <div className="bg-white w-full rounded-t-[3rem] p-8 animate-in slide-in-from-bottom duration-300">
            <h3 className="text-center font-black text-[#2D3142] mb-6 uppercase tracking-widest text-sm">
              O que deseja registrar?
            </h3>
            <div className="grid grid-cols-3 gap-6">
              {[
                { i: <Utensils />, l: 'Refeição', c: 'text-orange-500' },
                { i: <Pill />, l: 'Remédio', c: 'text-blue-500' },
                { i: <Smile />, l: 'Humor', c: 'text-purple-500' },
                { i: <Camera />, l: 'Foto', c: 'text-green-500' },
                { i: <FileText />, l: 'Nota', c: 'text-slate-500' },
                { i: <Stethoscope />, l: 'Consulta', c: 'text-red-400' },
              ].map((opt, idx) => (
                <button key={idx} className="flex flex-col items-center gap-2">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center ${opt.c} shadow-sm`}
                  >
                    {opt.i}
                  </div>
                  <span className="text-[10px] font-black text-[#6B7280] uppercase">
                    {opt.l}
                  </span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowOptions(false)}
              className="mt-8 w-full py-4 text-[#6B7280] font-bold underline"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
