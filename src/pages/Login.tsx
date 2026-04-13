import React, { useState } from 'react';
import { supabase } from '../supabase';
import { Mail, Lock, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginProps {
  onAuthenticated: (session: any) => void;
}

export default function Login({ onAuthenticated }: LoginProps) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (data.session) onAuthenticated(data.session);
    } catch (err: any) {
      setError(err.message === 'Invalid login credentials' 
        ? 'E-mail ou senha incorretos.' 
        : 'Erro ao conectar. Verifique sua internet.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF8F4] flex flex-col px-10 pt-24 pb-12">
      {/* Branding */}
      <div className="mb-16">
        <div className="w-16 h-16 bg-[#2D3142] rounded-[2rem] flex items-center justify-center text-white mb-6 shadow-xl shadow-slate-200">
          <ShieldCheck size={32} />
        </div>
        <h1 className="text-[#2D3142] font-black text-4xl tracking-tighter italic leading-none">
          JUNTO
        </h1>
        <p className="text-[#4A7FA5] text-[11px] font-black uppercase tracking-[0.3em] mt-3">
          Acesso à Rede de Cuidado
        </p>
      </div>

      {/* Formulário */}
      <form onSubmit={handleLogin} className="flex-1 space-y-6">
        <div className="space-y-4">
          <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-50 flex items-center gap-4 focus-within:ring-2 focus-within:ring-[#4A7FA5]/20 transition-all">
            <div className="w-10 h-10 bg-[#FAF8F4] rounded-xl flex items-center justify-center text-slate-300">
              <Mail size={18} />
            </div>
            <input 
              type="email" 
              placeholder="Seu e-mail"
              className="bg-transparent border-none p-0 text-sm font-bold w-full focus:ring-0 placeholder:text-slate-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-slate-50 flex items-center gap-4 focus-within:ring-2 focus-within:ring-[#4A7FA5]/20 transition-all">
            <div className="w-10 h-10 bg-[#FAF8F4] rounded-xl flex items-center justify-center text-slate-300">
              <Lock size={18} />
            </div>
            <input 
              type="password" 
              placeholder="Sua senha"
              className="bg-transparent border-none p-0 text-sm font-bold w-full focus:ring-0 placeholder:text-slate-200"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-[10px] font-black uppercase tracking-widest text-center animate-pulse">
            {error}
          </p>
        )}

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-[#2D3142] text-white py-6 rounded-[2rem] font-black uppercase text-[10px] tracking-[0.3em] shadow-2xl shadow-slate-300 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <>Entrar na conta <ArrowRight size={16} /></>
          )}
        </button>
      </form>

      {/* Rodapé */}
      <footer className="mt-12 text-center">
        <p className="text-slate-300 text-[9px] font-bold uppercase tracking-widest">
          Agência Inovare &copy; 2026
        </p>
      </footer>
    </div>
  );
}