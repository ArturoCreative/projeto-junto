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

  // O COFRE DE DADOS (ESTADO GLOBAL)
  const [idoso, setIdoso] = useState({ nome: '', genero: 'feminino' });
  const [membros, setMembros] = useState([
    { id: 1, nome: 'Artur', papel: 'Responsável', nivel: 'admin' },
  ]);

  // Função para salvar idoso e avançar
  const salvarIdoso = (dados: any) => {
    setIdoso(dados);
    setScreen('family');
  };

  return (
    <main>
      {screen === 'welcome' && <Welcome onStart={() => setScreen('elderly')} />}

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
          onNext={(listaAtualizada: any) => {
            setMembros(listaAtualizada);
            setScreen('dashboard');
          }}
        />
      )}

      {screen === 'dashboard' && (
        <Dashboard idoso={idoso} membros={membros} onNavigate={setScreen} />
      )}

      {/* Telas de detalhe agora recebem os dados para edição */}
      {screen === 'timeline' && (
        <DailyTimeline idoso={idoso} onNavigate={setScreen} />
      )}
      {screen === 'health' && <Health idoso={idoso} onNavigate={setScreen} />}
      {screen === 'finance' && <Finance onNavigate={setScreen} />}
    </main>
  );
}
