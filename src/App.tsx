import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from './supabase';

// Importação das Páginas
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import ElderlyRegistration from './pages/ElderlyRegistration';
import FamilyMembers from './pages/FamilyMembers';
import Dashboard from './pages/Dashboard';
import DailyTimeline from './pages/DailyTimeline';
import Health from './pages/Health';
import Finance from './pages/Finance';

// Tipagem para Garantir Robustez
interface UserProfile {
  id: string;
  family_id: string;
  full_name: string;
  role: string;
  avatar_url?: string;
}

interface ElderlyProfile {
  id: string;
  family_id: string;
  full_name: string;
  nickname: string;
  birth_date: string;
}

export default function App() {
  // --- ESTADOS DE DADOS (CORE) ---
  const [session, setSession] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [selectedElderly, setSelectedElderly] = useState<ElderlyProfile | null>(null);
  const [familyId, setFamilyId] = useState<string | null>(null);

  // --- ESTADOS DE CONTROLE DE INTERFACE ---
  const [currentScreen, setCurrentScreen] = useState<string>('welcome');
  const [loading, setLoading] = useState<boolean>(true);
  const [appError, setAppError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);

  /**
   * Função Mestre para Carregar Contexto do Usuário
   * Busca Perfil, Família e Idoso de forma encadeada
   */
  const loadUserContext = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      setAppError(null);

      // 1. Buscar Perfil do Usuário
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (profileError) {
        if (profileError.code === 'PGRST116') {
          // Perfil não existe no DB, mas existe no Auth (raro, mas tratamos)
          setCurrentScreen('login');
          return;
        }
        throw profileError;
      }

      if (profile) {
        setUserProfile(profile);
        setFamilyId(profile.family_id);

        // 2. Buscar Perfil do Idoso vinculado à Família
        // Um perfil de família pode ter um idoso principal
        const { data: elderly, error: elderlyError } = await supabase
          .from('elderly_profiles')
          .select('*')
          .eq('family_id', profile.family_id)
          .maybeSingle();

        if (elderlyError) throw elderlyError;

        if (elderly) {
          setSelectedElderly(elderly);
          // Se tudo estiver pronto, manda para o Dashboard
          setCurrentScreen('dashboard');
        } else {
          // Se o perfil existe mas não tem idoso, vai para o cadastro de idoso
          setCurrentScreen('elderly-reg');
        }
      }
    } catch (err: any) {
      console.error("Erro Crítico no App Context:", err.message);
      setAppError("Não conseguimos sincronizar seus dados. Verifique sua internet.");
    } finally {
      setLoading(false);
      setIsInitializing(false);
    }
  }, []);

  /**
   * Monitoramento de Sessão Ativa
   */
  useEffect(() => {
    // Check inicial de sessão
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        loadUserContext(session.user.id);
      } else {
        setIsInitializing(false);
        setLoading(false);
      }
    });

    // Listener para mudanças de login/logout
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        loadUserContext(session.user.id);
      } else {
        // Limpeza de estados ao deslogar
        setUserProfile(null);
        setSelectedElderly(null);
        setFamilyId(null);
        setCurrentScreen('welcome');
        setLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadUserContext]);

  /**
   * Handler de Navegação Segura
   */
  const handleNavigate = (screen: string) => {
    // Log de auditoria simples para debug em desenvolvimento
    console.log(`[Navegação] Indo para: ${screen}`);
    setCurrentScreen(screen);
  };

  /**
   * Renderizador de Estados de Erro e Loading
   */
  if (isInitializing || (loading && currentScreen === 'welcome')) {
    return (
      <div className="min-h-screen bg-[#FAF8F4] flex flex-col items-center justify-center p-8 text-center">
        <div className="w-16 h-16 border-4 border-[#4A7FA5]/20 border-t-[#4A7FA5] rounded-full animate-spin mb-6" />
        <h1 className="text-[#2D3142] font-black text-xl italic tracking-tighter">JUNTO</h1>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.3em] mt-2">Sincronizando Rede...</p>
      </div>
    );
  }

  if (appError) {
    return (
      <div className="min-h-screen bg-[#FAF8F4] flex flex-col items-center justify-center p-12 text-center">
        <div className="bg-red-50 text-red-500 p-6 rounded-[2.5rem] mb-6">
          <p className="font-black text-sm uppercase tracking-tight">{appError}</p>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="bg-[#2D3142] text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl"
        >
          Tentar Novamente
        </button>
      </div>
    );
  }

  /**
   * Roteador Principal (Switch Case)
   */
  const renderCurrentPage = () => {
    switch (currentScreen) {
      case 'welcome':
        return <Welcome onNext={() => handleNavigate('login')} />;
      
      case 'login':
        return <Login onAuthenticated={(session: any) => setSession(session)} />;

      case 'elderly-reg':
        return (
          <ElderlyRegistration 
            familyId={familyId || ''} 
            onNext={(elderly) => {
              setSelectedElderly(elderly);
              handleNavigate('family-members');
            }} 
          />
        );

      case 'family-members':
        return (
          <FamilyMembers 
            familyId={familyId || ''} 
            onNext={() => handleNavigate('dashboard')} 
          />
        );

      case 'dashboard':
        return (
          <Dashboard 
            elderly={selectedElderly} 
            user={userProfile}
            onNavigate={handleNavigate} 
          />
        );

      case 'daily':
        return (
          <DailyTimeline 
            elderly={selectedElderly} 
            user={userProfile} 
            onNavigate={handleNavigate} 
          />
        );

      case 'health':
        return (
          <Health 
            elderly={selectedElderly} 
            onNavigate={handleNavigate} 
          />
        );

      case 'finance':
        return (
          <Finance 
            elderly={selectedElderly} 
            familyId={familyId || ''} 
            user={userProfile} 
            onNavigate={handleNavigate} 
          />
        );

      default:
        return <Welcome onNext={() => handleNavigate('login')} />;
    }
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white shadow-2xl overflow-hidden relative border-x border-slate-50">
      {/* Container Principal de Renderização */}
      <main className="h-full w-full">
        {renderCurrentPage()}
      </main>

      {/* Camada Visual de Feedback (Opcional - Toast ou Offline Alert) */}
      {!navigator.onLine && (
        <div className="absolute top-0 left-0 right-0 bg-amber-500 text-white text-[8px] font-black uppercase tracking-[0.2em] py-2 text-center z-[999]">
          Você está offline. Algumas funções podem não salvar.
        </div>
      )}
    </div>
  );
}