import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';
import { Screen } from './types/navigation'; // Certifique-se de ter este tipo definido ou use string

// Importação das páginas conforme estrutura original
import Welcome from './pages/Welcome';
import ElderlyRegistration from './pages/ElderlyRegistration';
import FamilyMembers from './pages/FamilyMembers';
import Dashboard from './pages/Dashboard';
import DailyTimeline from './pages/DailyTimeline';
import Health from './pages/Health';
import Finance from './pages/Finance';

// Ícones para a Navbar robusta
import { Home, Clock, Heart, DollarSign, AlertCircle } from 'lucide-react';

export default function App() {
  // Estados de Controle de Fluxo e Dados
  const [screen, setScreen] = useState<string>('welcome');
  const [userProfile, setUserProfile] = useState<any>(null);
  const [familyData, setFamilyData] = useState<any>(null);
  const [elderly, setElderly] = useState<any>(null);
  
  // Estados de UI e Erros
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Função Robusta para Carregamento de Contexto Global
   * Busca Perfil -> Família -> Idoso Principal
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

      // 1. Buscar Perfil do Usuário
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select(`
          *,
          families:family_id (*)
        `)
        .eq('user_id', session.user.id)
        .single();

      if (profileError) throw profileError;

      setUserProfile(profile);
      setFamilyData(profile.families);

      // 2. Buscar Idoso Principal da Família
      if (profile.family_id) {
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
      } else {
        setScreen('welcome');
      }

    } catch (err: any) {
      console.error('Erro crítico no carregamento do App:', err.message);
      setError('Não foi possível sincronizar os dados. Verifique sua conexão.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAppContext();
    
    // Ouvinte para mudanças de autenticação (Login/Logout)
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

  // Função de Navegação com Scroll Reset
  const navigateTo = (nextScreen: string) => {
    setScreen(nextScreen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Renderização de Estados de Carregamento (Skeleton/Calm Tech)
   */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F4] flex flex-col items-center justify-center p-6">
        <div className="w-24 h-24 bg-white rounded-[2rem] shadow-xl flex items-center justify-center mb-6 animate-bounce">
          <div className="w-12 h-12 bg-[#4A7FA5] rounded-2xl opacity-20" />
        </div>
        <p className="text-[#4A7FA5] font-black uppercase tracking-[0.3em] text-[10px] italic">
          Sincronizando JUNTO...
        </p>
      </div>
    );
  }

  /**
   * Renderização de Erros Críticos
   */
  if (error) {
    return (
      <div className="min-h-screen bg-[#FAF8F4] flex flex-col items-center justify-center p-10 text-center">
        <AlertCircle size={48} className="text-red-400 mb-4" />
        <h2 className="text-[#2D3142] font-black text-xl mb-2">Ops! Algo deu errado.</h2>
        <p className="text-slate-500 text-sm mb-6 font-medium">{error}</p>
        <button 
          onClick={loadAppContext}
          className="px-8 py-4 bg-[#2D3142] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] flex justify-center items-center p-0 sm:p-6 transition-colors duration-500">
      <main className="w-full max-w-[430px] h-full sm:h-[932px] bg-[#FAF8F4] shadow-2xl overflow-hidden relative sm:rounded-[4rem] border-[10px] border-[#1E293B] flex flex-col">
        
        {/* Container de Telas */}
        <div className="flex-1 overflow-y-auto no-scrollbar relative bg-[#FAF8F4]">
          {screen === 'welcome' && (
            <Welcome onNext={() => navigateTo('elderly')} />
          )}
          
          {screen === 'elderly' && (
            <ElderlyRegistration 
              familyId={userProfile?.family_id} 
              onNext={loadAppContext} 
            />
          )}

          {screen === 'family' && (
            <FamilyMembers 
              familyId={userProfile?.family_id} 
              onNext={() => navigateTo('dashboard')} 
            />
          )}

          {screen === 'dashboard' && (
            <Dashboard 
              user={userProfile}
              elderly={elderly}
              family={familyData}
              onNavigate={navigateTo} 
            />
          )}

          {screen === 'timeline' && (
            <DailyTimeline 
              elderly={elderly} 
              user={userProfile}
              onNavigate={navigateTo} 
            />
          )}

          {screen === 'health' && (
            <Health 
              elderly={elderly} 
              onNavigate={navigateTo} 
            />
          )}

          {screen === 'finance' && (
            <Finance 
              elderly={elderly} 
              familyId={userProfile?.family_id}
              user={userProfile}
              onNavigate={navigateTo} 
            />
          )}
        </div>

        {/* Bottom Navigation - Interatividade Premium */}
        {['dashboard', 'timeline', 'health', 'finance'].includes(screen) && (
          <nav className="h-24 bg-white/80 backdrop-blur-lg border-t border-slate-100 flex justify-around items-center px-6 z-50">
            <NavItem 
              active={screen === 'dashboard'} 
              onClick={() => navigateTo('dashboard')} 
              icon={<Home size={22} />} 
              label="Home" 
            />
            <NavItem 
              active={screen === 'timeline'} 
              onClick={() => navigateTo('timeline')} 
              icon={<Clock size={22} />} 
              label="Dia" 
            />
            <NavItem 
              active={screen === 'health'} 
              onClick={() => navigateTo('health')} 
              icon={<Heart size={22} />} 
              label="Saúde" 
            />
            <NavItem 
              active={screen === 'finance'} 
              onClick={() => navigateTo('finance')} 
              icon={<DollarSign size={22} />} 
              label="Finanças" 
            />
          </nav>
        )}
      </main>
    </div>
  );
}

// Sub-componente de navegação para garantir clareza e reutilização
function NavItem({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${
        active ? 'text-[#4A7FA5] scale-110' : 'text-slate-300 hover:text-slate-400'
      }`}
    >
      <div className={`p-1 rounded-xl ${active ? 'bg-[#4A7FA5]/10' : ''}`}>
        {icon}
      </div>
      <span className={`text-[9px] font-black uppercase tracking-tighter ${active ? 'opacity-100' : 'opacity-50'}`}>
        {label}
      </span>
      {active && <div className="w-1 h-1 bg-[#4A7FA5] rounded-full animate-pulse" />}
    </button>
  );
}