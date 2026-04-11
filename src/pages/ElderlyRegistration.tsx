import React, { useState, useEffect } from 'react';
import { ArrowLeft, Camera, Save, Loader2 } from 'lucide-react';
import { supabase } from '../supabase';

interface Props {
  onBack: () => void;
  onNext: (name: string, gender: string) => void; // Agora aceita o gênero também
}

export default function ElderlyRegistration({ onBack, onNext }: Props) {
  const [nome, setNome] = useState('');
  const [dataNasc, setDataNasc] = useState('');
  const [idade, setIdade] = useState<number | null>(null);
  const [sexo, setSexo] = useState('');
  const [foto, setFoto] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (dataNasc) {
      const hoje = new Date();
      const nascimento = new Date(dataNasc + 'T00:00:00');
      let idadeCalculada = hoje.getFullYear() - nascimento.getFullYear();
      const m = hoje.getMonth() - nascimento.getMonth();
      if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate()))
        idadeCalculada--;
      setIdade(idadeCalculada);
    }
  }, [dataNasc]);

  const handleSave = async () => {
    if (!nome || !dataNasc || !sexo) {
      alert('Por favor, preencha os campos obrigatórios.');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from('elderly_profiles').insert([
        {
          full_name: nome,
          birth_date: dataNasc,
          gender: sexo === 'Feminino' ? 'female' : 'male',
          age: idade,
        },
      ]);
      if (error) throw error;

      // AQUI A MUDANÇA: Passamos nome e sexo
      onNext(nome, sexo);
    } catch (e: any) {
      alert('Erro ao salvar: ' + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F4] p-6 font-sans">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[#4A7FA5] font-bold mb-8"
      >
        <ArrowLeft size={20} /> Voltar
      </button>

      <div className="max-w-md mx-auto">
        <h2 className="text-3xl font-black text-[#2D3142] mb-2 text-center">
          Perfil do Idoso
        </h2>
        <p className="text-[#6B7280] mb-8 font-medium text-center">
          Conte-nos quem vamos cuidar juntos.
        </p>

        <div className="flex flex-col items-center mb-10">
          <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl bg-slate-200 flex items-center justify-center overflow-hidden mb-4 relative group">
            {foto ? (
              <img src={foto} className="w-full h-full object-cover" />
            ) : (
              <Camera size={40} className="text-slate-400" />
            )}
            <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
              <span className="text-white text-[10px] font-black uppercase">
                Alterar Foto
              </span>
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setFoto(reader.result as string);
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </label>
          </div>
          <p className="text-[10px] font-black text-[#4A7FA5] uppercase tracking-tighter">
            Foto do Idoso
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-2 rounded-2xl shadow-sm">
            <label className="block text-[10px] font-black text-[#6B7280] uppercase ml-3 mt-1">
              Nome Completo
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Maria da Silva"
              className="w-full p-3 outline-none font-bold text-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-2 rounded-2xl shadow-sm">
              <label className="block text-[10px] font-black text-[#6B7280] uppercase ml-3 mt-1">
                Nascimento
              </label>
              <input
                type="date"
                value={dataNasc}
                onChange={(e) => setDataNasc(e.target.value)}
                className="w-full p-3 outline-none font-bold"
              />
            </div>
            <div className="bg-[#4A7FA5]/5 p-2 rounded-2xl border-2 border-[#4A7FA5]/10 flex flex-col justify-center items-center font-black text-[#4A7FA5]">
              <span className="text-[10px] uppercase">Idade</span>
              <span className="text-xl">
                {idade !== null ? `${idade} anos` : '--'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-[#6B7280] uppercase text-center mb-2">
              Sexo Biológico
            </label>
            <div className="flex gap-3">
              {['Feminino', 'Masculino'].map((s) => (
                <button
                  key={s}
                  onClick={() => setSexo(s)}
                  className={`flex-1 py-4 rounded-2xl font-black transition-all ${
                    sexo === s
                      ? 'bg-[#4A7FA5] text-white shadow-md'
                      : 'bg-white text-[#6B7280]'
                  }`}
                >
                  {s.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-[#E8A87C] text-white py-5 rounded-[2rem] text-xl font-black shadow-xl mt-8 flex items-center justify-center gap-3"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Save size={24} /> SALVAR E CONTINUAR
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
