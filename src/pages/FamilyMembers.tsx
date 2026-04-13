import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { 
  UserPlus, 
  Users, 
  Copy, 
  Check, 
  ShieldCheck, 
  ChevronLeft,
  Plus,
  X
} from 'lucide-react';

interface Props {
  familyId: string;
  onNext: () => void;
}

export default function FamilyMembers({ familyId, onNext }: Props) {
  const [members, setMembers] = useState<any[]>([]);
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Estados para o seletor de papel personalizado
  const [isOther, setIsOther] = useState(false);
  const [customRole, setCustomRole] = useState('');

  useEffect(() => {
    if (familyId) {
      fetchFamilyData();
    }
  }, [familyId]);

  async function fetchFamilyData() {
    try {
      setLoading(true);
      
      // 1. Buscar membros da família através dos perfis
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('family_id', familyId)
        .order('role', { ascending: true });

      if (profileError) throw profileError;
      setMembers(profiles || []);

      // 2. Buscar o código de convite da família
      const { data: family, error: familyError } = await supabase
        .from('families')
        .select('invite_code')
        .eq('id', familyId)
        .single();

      if (familyError) throw familyError;
      setInviteCode(family.invite_code);

    } catch (err) {
      console.error("Erro ao carregar família:", err);
    } finally {
      setLoading(false);
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Mapeamento de Roles para exibição
  const getRoleLabel = (role: string, customLabel?: string) => {
    if (role === 'other' && customLabel) return customLabel;
    
    const roles: any = {
      admin: 'Administrador',
      distant_child: 'Filho(a) à distância',
      local_child: 'Filho(a) local',
      spouse: 'Cônjuge',
      caregiver: 'Cuidador(a)',
      other: 'Outro'
    };
    return roles[role] || 'Membro';
  };

  return (
    <div className="min-h-full bg-[#FAF8F4] flex flex-col">
      {/* Header Fixo */}
      <header className="bg-white px-8 pt-16 pb-8 rounded-b-[3.5rem] shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-[#2D3142] tracking-tighter italic">
            Sua <span className="text-[#4A7FA5]">Rede de Apoio</span>
          </h2>
          <div className="w-12 h-12 bg-[#FAF8F4] rounded-2xl flex items-center justify-center text-[#4A7FA5]">
            <Users size={24} />
          </div>
        </div>
        
        <p className="text-slate-400 text-xs font-medium leading-relaxed max-w-[250px]">
          Gerencie quem tem acesso aos cuidados e convide novos membros.
        </p>
      </header>

      <div className="p-8 space-y-8 flex-1">
        {/* Card de Convite Robusto */}
        <section className="bg-[#4A7FA5] rounded-[2.5rem] p-6 text-white shadow-xl shadow-[#4A7FA5]/20 relative overflow-hidden">
          <div className="absolute -top-4 -right-4 opacity-10">
            <UserPlus size={100} />
          </div>
          
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 opacity-80">Convidar Membro</h3>
          <p className="text-sm font-medium mb-6 leading-relaxed">
            Compartilhe o código abaixo para que outros familiares se conectem.
          </p>
          
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl p-2 pl-6 border border-white/20">
            <span className="flex-1 font-black tracking-[0.3em] text-lg uppercase select-all">
              {inviteCode}
            </span>
            <button 
              onClick={copyToClipboard}
              className="w-12 h-12 bg-white text-[#4A7FA5] rounded-xl flex items-center justify-center transition-transform active:scale-90"
            >
              {copied ? <Check size={20} /> : <Copy size={20} />}
            </button>
          </div>
        </section>

        {/* Lógica de Papel Personalizado (Outro) */}
        <section className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-50">
          <label className="text-[9px] font-black uppercase tracking-widest text-slate-300 mb-4 block">
            Definir seu papel nesta família
          </label>
          <div className="space-y-3">
            <select 
              className="w-full bg-[#FAF8F4] rounded-2xl p-4 text-sm font-bold border-none focus:ring-2 focus:ring-[#4A7FA5]/20 appearance-none"
              onChange={(e) => {
                const val = e.target.value;
                setIsOther(val === 'other');
                if (val !== 'other') setCustomRole('');
              }}
            >
              <option value="distant_child">Filho(a) à distância</option>
              <option value="local_child">Filho(a) local</option>
              <option value="caregiver">Cuidador(a)</option>
              <option value="spouse">Cônjuge</option>
              <option value="other">Outro papel...</option>
            </select>

            {isOther && (
              <div className="animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-2 bg-[#FAF8F4] rounded-2xl p-2 pr-4 border-2 border-[#4A7FA5]/10">
                  <input 
                    type="text" 
                    placeholder="Ex: Fisioterapeuta, Vizinho..."
                    className="flex-1 bg-transparent border-none p-3 text-sm font-bold focus:ring-0"
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                  />
                  {customRole && <Check size={16} className="text-[#4A7FA5]" />}
                </div>
                <p className="text-[9px] text-slate-400 mt-2 px-2 font-medium italic">
                  * Este nome aparecerá nos seus registros da Timeline.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Lista de Membros Ativos */}
        <section>
          <h3 className="text-[#2D3142] font-black text-xs uppercase tracking-widest mb-6 flex items-center gap-2 px-2">
            Membros Ativos <span className="w-8 h-[1px] bg-slate-200" />
          </h3>

          <div className="space-y-4 pb-10">
            {loading ? (
              [1, 2].map(i => (
                <div key={i} className="h-24 bg-white rounded-[2rem] animate-pulse" />
              ))
            ) : (
              members.map((member) => (
                <div key={member.id} className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-slate-50 flex items-center gap-4">
                  <div className="w-14 h-14 bg-[#FAF8F4] rounded-2xl overflow-hidden flex items-center justify-center border-2 border-white shadow-inner">
                    {member.avatar_url ? (
                      <img src={member.avatar_url} className="w-full h-full object-cover" alt="Avatar" />
                    ) : (
                      <div className="text-[#4A7FA5]/30 font-black text-xl italic">
                        {member.full_name?.charAt(0)}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="text-[#2D3142] font-black text-sm">{member.full_name}</h4>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-0.5">
                      {getRoleLabel(member.role, member.custom_role)}
                    </p>
                  </div>

                  {member.role === 'admin' && (
                    <div className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full flex items-center gap-1.5 border border-amber-100">
                      <ShieldCheck size={10} />
                      <span className="text-[8px] font-black uppercase tracking-tighter">Gestor</span>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </section>
      </div>

      {/* Footer Fixo */}
      <footer className="p-8 bg-white/50 backdrop-blur-sm border-t border-slate-100 sticky bottom-0">
        <button 
          onClick={onNext}
          className="w-full py-6 bg-[#2D3142] text-white rounded-[2rem] font-black uppercase text-[10px] tracking-[0.2em] shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all"
        >
          Acessar Painel <ChevronLeft size={18} className="rotate-180" />
        </button>
      </footer>
    </div>
  );
}