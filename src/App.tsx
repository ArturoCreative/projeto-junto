import React, { useState } from 'react';
import Welcome from './pages/Welcome';
import ElderlyRegistration from './pages/ElderlyRegistration';
import FamilyMembers from './pages/FamilyMembers';
import Dashboard from './pages/Dashboard';
import DailyTimeline from './pages/DailyTimeline';
import Health from './pages/Health';
import Finance from './pages/Finance';

export default function App() {
  const [screen, setScreen] = useState('welcome');
  
  // Onde o nome do Einstein e o Gênero ficam guardados
  const [idoso, setIdoso] = useState({ nome: '', genero: 'masculino' });
  
  // Onde os membros da família ficam guardados
  const [membros, setMembros] = useState([
    { id: 1, nome: 'Artur', papel: 'Responsável', nivel: 'admin' }
  ]);

  const salvarIdoso = (dados: any) => {
    setIdoso(dados);
    setScreen('family');
  };

  const finalizarRede = (listaAtualizada: any) => {
    setMembros(listaAtualizada);
    setScreen('dashboard');
  };

  return (
    <main>
      {screen === 'welcome' && (
        <Welcome onStart={() => setScreen('elderly')} />
      )}

      {screen === 'elderly' && (
        <ElderlyRegistration 
          dadosIniciais={idoso}
          onBack={() => setScreen('welcome')} 
          onNext={salvarIdoso} 
        />
      )}

      {screen === 'family' && (
        <FamilyMembers 
          membrosSalvos={membros}
          onBack={() => setScreen('elderly')} 
          onNext={finalizarRede} 
        />
      )}

      {screen === 'dashboard' && (
        <Dashboard 
          idoso={idoso}
          membros={membros}
          onNavigate={setScreen} 
        />
      )}

      {/* Telas de detalhe que agora recebem os dados corretamente */}
      {screen === 'timeline' && <DailyTimeline idoso={idoso} onNavigate={setScreen} />}
      {screen === 'health' && <Health idoso={idoso} onNavigate={setScreen} />}
      {screen === 'finance' && <Finance idoso={idoso} onNavigate={setScreen} />}
    </main>
  );
}