import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';

// Tipagem declarada internamente para estabilidade
export type Screen = 'welcome' | 'elderly' | 'family' | 'dashboard' | 'timeline' | 'health' | 'finance';

// Importação das páginas conforme sua estrutura de pastas
import Welcome from './pages/Welcome';
import ElderlyRegistration from './pages/ElderlyRegistration';
import FamilyMembers from './pages/FamilyMembers';
import Dashboard from './pages/Dashboard';
import DailyTimeline from './pages/DailyTimeline';
import Health from './pages/Health';
import Finance from './pages/Finance';

// Ícones da biblioteca Lucide
import { Home, Clock, Heart, DollarSign, AlertCircle } from 'lucide-react';

export default function App() {
  const [screen, setScreen] = useState<Screen>('welcome');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [familyData, setFamilyData] = useState<any>(null);
  const [elderly, setElderly] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Carrega o contexto global do aplicativo buscando no Supabase:
   * Usuário -> Perfil -> Família -> Idoso Principal
   */
  const loadAppContext = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data: { session }, error: authError } = await supabase.auth.getSession();
      
      if (authError) throw authError;
      if (!session) {
        setScreen('welcome');
        return;
      }

      // Busca perfil e dados da família em uma única query (Join)
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select(`
          *,
          families:family_id (*)
        `)
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (profileError) throw profileError;

      if (profile) {
        setUserProfile(profile);
        setFamilyData(profile.families);

        if (profile.family_id) {
          // Busca o idoso marcado como principal na família
          const { data: elderlyData, error: elderlyError } = await supabase
            .from('elderly_profiles')
            .select('*')
            .eq('family_id', profile.family_id)
            .eq('is_primary', true)
            .maybeSingle();

          if (elderlyError) throw elderlyError;

          if (elderlyData) {
            setElderly(elderlyData);
            setScreen('dashboard');
          } else {
            setScreen('elderly');
          }
        }
      } else {
        // Se o usuário está logado mas não tem perfil, envia para Welcome/Cadastro
        setScreen('welcome');
      }

    } catch (err: any) {
      console.error('Erro de Sincronização:', err.message);
      setError('Falha na conexão com o servidor. Verifique sua internet.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAppContext();
    
    // Gerenciador de estado de autenticação em tempo real
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setScreen('welcome');
        setUserProfile(null);
        setElderly(null);
      } else {
        loadAppContext();
      }
    });

    return () => subscription.unsubscribe();
  }, [loadAppContext]);

  const navigateTo = (nextScreen: Screen) => {
    setScreen(nextScreen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F4] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-white rounded-[2.5rem] shadow-xl flex items-center justify-center mb-6 animate-pulse border-2 border-slate-50">
          <div className="w-10 h-10 bg-[#4A7FA5] rounded-2xl opacity-20" />
        </div>
        <p className="text-[#4A7FA5] font-black uppercase tracking-[0.3em] text-[10px] italic">Sincronizando JUNTO...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAF8F4] flex flex-col items-center justify-center p-10 text-center">
        <AlertCircle size={48} className="text-red-400 mb-4" />
        <h2 className="text-[#2D3142] font-black text-xl mb-2 italic">Erro de Conexão</h2>
        <p className="text-slate-500 text-sm mb-8 font-medium">{error}</p>
        <button 
          onClick={loadAppContext} 
          className="px-10 py-5 bg-[#2D3142] text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest shadow-2xl active:scale-95 transition-all"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] flex justify-center items-center p-0 sm:p-6">
      <main className="w-full max-w-[430px] h-full sm:h-[932px] bg-[#FAF8F4] shadow-2xl overflow-hidden relative sm:rounded-[4rem] border-[8px] border-[#1E293B] flex flex-col">
        <div className="flex-1 overflow-y-auto no-scrollbar relative">
          {screen === 'welcome' && (
            <Welcome onNext={() => navigateTo('elderly')} />
          )}
          {screen === 'elderly' && (
            <ElderlyRegistration familyId={userProfile?.family_id} onNext={loadAppContext} />
          )}
          {screen === 'family' && (
            <FamilyMembers familyId={userProfile?.family_id} onNext={() => navigateTo('dashboard')} onBack={() => navigateTo('elderly')} />
          )}
          {screen === 'dashboard' && (
            <Dashboard user={userProfile} elderly={elderly} family={familyData} onNavigate={navigateTo} />
          )}
          {screen === 'timeline' && (
            <DailyTimeline elderly={elderly} user={userProfile} onNavigate={navigateTo} />
          )}
          {screen === 'health' && (
            <Health elderly={elderly} onNavigate={navigateTo} />
          )}
          {screen === 'finance' && (
            <Finance elderly={elderly} familyId={userProfile?.family_id} user={userProfile} onNavigate={navigateTo} />
          )}
        </div>

        {/* Bottom Navigation Visível apenas dentro do App logado */}
        {['dashboard', 'timeline', 'health', 'finance'].includes(screen) && (
          <nav className="h-24 bg-white/95 backdrop-blur-md border-t border-slate-100 flex justify-around items-center px-6 z-50">
            <NavItem active={screen === 'dashboard'} onClick={() => navigateTo('dashboard')} icon={<Home size={22} />} label="Home" />
            <NavItem active={screen === 'timeline'} onClick={() => navigateTo('timeline')} icon={<Clock size={22} />} label="Dia" />
            <NavItem active={screen === 'health'} onClick={() => navigateTo('health')} icon={<Heart size={22} />} label="Saúde" />
            <NavItem active={screen === 'finance'} onClick={() => navigateTo('finance')} icon={<DollarSign size={22} />} label="Finanças" />
          </nav>
        )}
      </main>
    </div>
  );
}

// Sub-componente de item da Navbar
function NavItem({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick} 
      className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${
        active ? 'text-[#4A7FA5] scale-110' : 'text-slate-300 hover:text-slate-400'
      }`}
    >
      <div className={`p-1.5 rounded-xl ${active ? 'bg-[#4A7FA5]/10' : ''}`}>
        {icon}
      </div>
      <span className={`text-[9px] font-black uppercase tracking-tighter ${active ? 'opacity-100' : 'opacity-40'}`}>
        {label}
      </span>
    </button>
  );
}