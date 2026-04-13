import React, { useState } from 'react';
import { supabase } from '../supabase';
import { 
  Camera, 
  User, 
  Calendar, 
  MapPin, 
  Heart, 
  ChevronRight, 
  Loader2,
  Stethoscope
} from 'lucide-react';

interface Props {
  familyId: string;
  onNext: (data: any) => void;
}

export default function ElderlyRegistration({ familyId, onNext }: Props) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  // Estado do Formulário (Nomes exatos das colunas do seu SQL)
  const [formData, setFormData] = useState({
    full_name: '',
    nickname: '',
    birth_date: '',
    gender: 'female',
    city: '',
    blood_type: 'O+',
    mobility: 'autonomous',
    diet_type: 'normal',
    health_plan_name: '',
    chronic_conditions: [] as string[]
  });

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleRegister = async () => {
    if (!formData.full_name || !formData.birth_date) {
      alert("Por favor, preencha o nome e a data de nascimento.");
      return;
    }

    setLoading(true);
    try {
      let photo_url = null;

      // 1. Upload da Foto se existir
      if (photoFile) {
        const fileExt = photoFile.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `elderly/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(filePath, photoFile);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
        photo_url = data.publicUrl;
      }

      // 2. Inserir no Supabase (Tabela elderly_profiles)
      const { data: newElderly, error } = await supabase
        .from('elderly_profiles')
        .insert({
          family_id: familyId,
          full_name: formData.full_name,
          nickname: formData.nickname,
          birth_date: formData.birth_date,
          gender: formData.gender,
          photo_url: photo_url,
          city: formData.city,
          blood_type: formData.blood_type,
          mobility: formData.mobility,
          diet_type: formData.diet_type,
          health_plan_name: formData.health_plan_name,
          chronic_conditions: formData.chronic_conditions,
          is_primary: true
        })
        .select()
        .single();

      if (error) throw error;

      // Avançar para o App
      onNext(newElderly);

    } catch (err: any) {
      console.error(err);
      alert("Erro ao cadastrar: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-[#FAF8F4] p-8 flex flex-col">
      <header className="mb-10 text-center">
        <div className="w-20 h-2px bg-[#E8A87C] mx-auto mb-6 rounded-full" />
        <h1 className="text-3xl font-black text-[#2D3142] tracking-tighter italic">
          Quem vamos <br /> cuidar <span className="text-[#4A7FA5]">juntos?</span>
        </h1>
      </header>

      {step === 1 ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          {/* Upload de Foto */}
          <div className="flex justify-center mb-8">
            <label className="relative cursor-pointer group">
              <div className="w-32 h-32 bg-white rounded-[2.5rem] shadow-xl border-4 border-white overflow-hidden flex items-center justify-center transition-transform group-active:scale-95">
                {photoPreview ? (
                  <img src={photoPreview} className="w-full h-full object-cover" alt="Preview" />
                ) : (
                  <Camera size={32} className="text-slate-200" />
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-[#4A7FA5] text-white p-3 rounded-2xl shadow-lg">
                <Plus size={16} />
              </div>
              <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
            </label>
          </div>

          <div className="space-y-4">
            <InputBlock label="Nome Completo" icon={<User size={18}/>}>
              <input 
                type="text" 
                placeholder="Ex: Maria de Oliveira"
                className="w-full bg-transparent border-none p-0 text-sm font-bold focus:ring-0"
                value={formData.full_name}
                onChange={e => setFormData({...formData, full_name: e.target.value})}
              />
            </InputBlock>

            <InputBlock label="Data de Nascimento" icon={<Calendar size={18}/>}>
              <input 
                type="date" 
                className="w-full bg-transparent border-none p-0 text-sm font-bold focus:ring-0"
                value={formData.birth_date}
                onChange={e => setFormData({...formData, birth_date: e.target.value})}
              />
            </InputBlock>

            <div className="grid grid-cols-2 gap-4">
              <InputBlock label="Cidade" icon={<MapPin size={18}/>}>
                <input 
                  type="text" 
                  placeholder="Ex: Rio de Janeiro"
                  className="w-full bg-transparent border-none p-0 text-sm font-bold focus:ring-0"
                  value={formData.city}
                  onChange={e => setFormData({...formData, city: e.target.value})}
                />
              </InputBlock>
              <InputBlock label="Tipo Sanguíneo" icon={<Heart size={18}/>}>
                <select 
                  className="w-full bg-transparent border-none p-0 text-sm font-bold focus:ring-0"
                  value={formData.blood_type}
                  onChange={e => setFormData({...formData, blood_type: e.target.value})}
                >
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(t => <option key={t}>{t}</option>)}
                </select>
              </InputBlock>
            </div>
          </div>

          <button 
            onClick={() => setStep(2)}
            className="w-full py-6 bg-[#2D3142] text-white rounded-[2rem] font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all mt-8"
          >
            Próximo Passo <ChevronRight size={18} />
          </button>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
          <InputBlock label="Mobilidade" icon={<Stethoscope size={18}/>}>
            <select 
              className="w-full bg-transparent border-none p-0 text-sm font-bold focus:ring-0"
              value={formData.mobility}
              onChange={e => setFormData({...formData, mobility: e.target.value})}
            >
              <option value="autonomous">Autônomo</option>
              <option value="partial">Ajuda parcial</option>
              <option value="wheelchair">Cadeira de Rodas</option>
              <option value="bedridden">Acamado</option>
            </select>
          </InputBlock>

          <InputBlock label="Plano de Saúde" icon={<Heart size={18}/>}>
            <input 
              type="text" 
              placeholder="Nome do convênio..."
              className="w-full bg-transparent border-none p-0 text-sm font-bold focus:ring-0"
              value={formData.health_plan_name}
              onChange={e => setFormData({...formData, health_plan_name: e.target.value})}
            />
          </InputBlock>

          <div className="p-6 bg-white rounded-[2rem] shadow-sm border border-slate-50">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Condições Crônicas</h4>
            <div className="flex flex-wrap gap-2">
              {['Diabetes', 'Hipertensão', 'Alzheimer', 'Cardíaco'].map(cond => (
                <button
                  key={cond}
                  onClick={() => {
                    const exists = formData.chronic_conditions.includes(cond);
                    setFormData({
                      ...formData,
                      chronic_conditions: exists 
                        ? formData.chronic_conditions.filter(c => c !== cond)
                        : [...formData.chronic_conditions, cond]
                    });
                  }}
                  className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all ${
                    formData.chronic_conditions.includes(cond)
                    ? 'bg-[#4A7FA5] text-white shadow-md'
                    : 'bg-[#FAF8F4] text-slate-400'
                  }`}
                >
                  {cond}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4 mt-8">
            <button 
              onClick={() => setStep(1)}
              className="px-8 py-6 bg-white text-slate-400 rounded-[2rem] font-black uppercase text-[10px] tracking-widest border border-slate-100"
            >
              Voltar
            </button>
            <button 
              onClick={handleRegister}
              disabled={loading}
              className="flex-1 py-6 bg-[#4A7FA5] text-white rounded-[2rem] font-black uppercase text-[10px] tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : 'Finalizar Cadastro'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Sub-componente para inputs consistentes
function InputBlock({ label, icon, children }: any) {
  return (
    <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-50 flex items-center gap-4 focus-within:ring-2 focus-within:ring-[#4A7FA5]/10 transition-all">
      <div className="text-slate-200">{icon}</div>
      <div className="flex-1">
        <label className="block text-[9px] font-black uppercase tracking-widest text-slate-300 mb-1">{label}</label>
        {children}
      </div>
    </div>
  );
}

function Plus({ size }: { size: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
}