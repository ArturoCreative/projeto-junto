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
  const [idoso, setIdoso] = useState({ 
    nome: '', 
    apelido: '', 
    genero: 'masculino', 
    sangue: '', 
    rh: '+', 
    obs: '' 
  });
  const [membros, setMembros] = useState([
    { id: 1, nome: 'Artur', papel: 'Responsável', nivel: 'admin' }
  ]);

  return (
    <main>
      {screen === 'welcome' && (
        <Welcome onStart={() => setScreen('elderly')} />
      )}

      {screen === 'elderly' && (
        <ElderlyRegistration 
          dadosIniciais={idoso}
          onBack={() => setScreen('welcome')} 
          onNext={(dados: any) => {
            setIdoso(dados);
            setScreen('family');
          }} 
        />
      )}

      {screen === 'family' && (
        <FamilyMembers 
          membrosSalvos={membros}
          onBack={() => setScreen('elderly')} 
          onNext={(lista: any) => {
            setMembros(lista);
            setScreen('dashboard');
          }} 
        />
      )}

      {screen === 'dashboard' && (
        <Dashboard 
          idoso={idoso}
          membros={membros}
          onNavigate={setScreen} 
        />
      )}

      {/* Estas linhas abaixo garantem que as telas NÃO fiquem em branco */}
      {screen === 'timeline' && <DailyTimeline onNavigate={setScreen} idoso={idoso} />}
      {screen === 'health' && <Health onNavigate={setScreen} idoso={idoso} />}
      {screen === 'finance' && <Finance onNavigate={setScreen} idoso={idoso} />}
    </main>
  );
}