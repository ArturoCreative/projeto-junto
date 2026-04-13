import React, { useState, useEffect, useCallback } from 'react';
import Welcome from './pages/Welcome';
import ElderlyRegistration from './pages/ElderlyRegistration';
import FamilyMembers from './pages/FamilyMembers';
import Dashboard from './pages/Dashboard';
import Health from './pages/Health';
import Finance from './pages/Finance';
import DailyTimeline from './pages/DailyTimeline';

type Screen = 'welcome' | 'registration' | 'family' | 'dashboard' | 'health' | 'finance' | 'timeline';

interface Member {
  id: number;
  nome: string;
  papel: string;
  nivel: 'admin' | 'membro';
}

interface Elderly {
  nome: string;
  apelido: string;
  nascimento: string;
  sangue: string;
  rh: string;
  foto: string | null;
  obs: string;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [elderlyData, setElderlyData] = useState<Elderly | null>(null);
  const [familyMembers, setFamilyMembers] = useState<Member[]>([
    { id: 1, nome: 'Artur', papel: 'Administrador', nivel: 'admin' }
  ]);

  useEffect(() => {
    console.log(`[Inovare System]: Navegando para ${currentScreen.toUpperCase()}`);
  }, [currentScreen]);

  const handleElderlyData = useCallback((data: Elderly) => {
    try {
      if (!data) throw new Error("Dados inválidos");
      setElderlyData(data);
      setCurrentScreen('family');
    } catch (e) {
      console.error("Erro no fluxo de cadastro:", e);
    }
  }, []);

  const handleFamilyData = useCallback((members: Member[]) => {
    setFamilyMembers(members);
    setCurrentScreen('dashboard');
  }, []);

  const navigateTo = useCallback((screen: string) => {
    setCurrentScreen(screen as Screen);
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#0F172A] flex justify-center items-center p-0 sm:p-6">
      <main className="w-full max-w-[430px] h-full sm:h-[932px] bg-[#FAF8F4] shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] overflow-hidden relative sm:rounded-[4rem] border-[10px] border-[#1E293B] flex flex-col">
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {currentScreen === 'welcome' && (
            <Welcome onStart={() => setCurrentScreen('registration')} />
          )}
          {currentScreen === 'registration' && (
            <ElderlyRegistration onBack={() => setCurrentScreen('welcome')} onNext={handleElderlyData} dadosIniciais={elderlyData} />
          )}
          {currentScreen === 'family' && (
            <FamilyMembers membrosSalvos={familyMembers} onBack={() => setCurrentScreen('registration')} onNext={handleFamilyData} />
          )}
          {currentScreen === 'dashboard' && (
            <Dashboard idoso={elderlyData} familia={familyMembers} onNavigate={navigateTo} />
          )}
          {currentScreen === 'health' && (
            <Health idoso={elderlyData} onNavigate={navigateTo} />
          )}
          {currentScreen === 'finance' && (
            <Finance idoso={elderlyData} onNavigate={navigateTo} />
          )}
          {currentScreen === 'timeline' && (
            <DailyTimeline idoso={elderlyData} onNavigate={navigateTo} />
          )}
        </div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1.5 bg-slate-900/10 rounded-full pointer-events-none" />
      </main>
    </div>
  );
}