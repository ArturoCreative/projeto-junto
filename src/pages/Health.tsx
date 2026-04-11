export default function Health({onNavigate}: any) { 
    return <div className="p-8"><h2>Tela de Saúde</h2><button onClick={() => onNavigate('dashboard')} className="mt-4 p-2 bg-blue-500 text-white rounded">Voltar</button></div> 
  }