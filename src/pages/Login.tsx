import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Loader2, 
  ShieldCheck, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false); // Alterna entre Login e Cadastro
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsReady(true);
  }, []);

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        // Lógica de Criar Cadastro
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;
        alert("Conta criada! Verifique seu e-mail ou faça login.");
        setIsSignUp(false);
      } else {
        // Lógica de Login
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
      }
    } catch (err: any) {
      setError(err.message === "Invalid login credentials" ? "E-mail ou senha incorretos." : err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF8F4] flex flex-col font-sans relative overflow-hidden">
      {/* Background Decor Inovare */}
      <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[30%] bg-[#4A7FA5]/5 rounded-full blur-[100px]" />

      <main className={`flex-1 flex flex-col items-center justify-center px-10 transition-all duration-1000 ${isReady ? 'opacity-100' : 'opacity-0'}`}>
        <header className="text-center mb-12 space-y-4">
          <div className="w-20 h-20 bg-[#2D3142] rounded-[2.2rem] flex items-center justify-center text-white shadow-2xl mx-auto mb-8">
            <ShieldCheck size={38} />
          </div>
          <h1 className="text-[#2D3142] font-black text-5xl tracking-tighter italic leading-none">
            {isSignUp ? 'CRIAR' : 'JUNTO'}<span className="text-[#4A7FA5]">.</span>
          </h1>
          <p className="text-[#4A7FA5] text-[10px] font-black uppercase tracking-[0.4em]">
            {isSignUp ? 'Registre sua família' : 'Acesso à Rede de Cuidado'}
          </p>
        </header>

        <form onSubmit={handleAuth} className="w-full max-w-sm space-y-5">
          {/* Campo Email */}
          <div className="group bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm focus-within:ring-4 focus-within:ring-[#4A7FA5]/5 transition-all">
            <div className="flex items-center gap-4">
              <div className="text-slate-300 group-focus-within:text-[#4A7FA5] transition-colors">
                <Mail size={20} />
              </div>
              <input 
                type="email"
                placeholder="seu@email.com"
                className="bg-transparent border-none w-full text-[15px] font-bold focus:ring-0 p-0 text-[#2D3142] placeholder:text-slate-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Campo Senha */}
          <div className="group bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm focus-within:ring-4 focus-within:ring-[#4A7FA5]/5 transition-all">
            <div className="flex items-center gap-4">
              <div className="text-slate-300 group-focus-within:text-[#4A7FA5] transition-colors">
                <Lock size={20} />
              </div>
              <input 
                type="password"
                placeholder="********"
                className="bg-transparent border-none w-full text-[15px] font-bold focus:ring-0 p-0 text-[#2D3142] placeholder:text-slate-200"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 justify-center text-red-500 animate-pulse">
              <AlertCircle size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">{error}</span>
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-[#2D3142] text-white py-7 rounded-[2.5rem] font-black uppercase text-[11px] tracking-[0.4em] shadow-xl flex items-center justify-center gap-4 active:scale-95 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : (
              <>
                {isSignUp ? 'Finalizar Cadastro' : 'Entrar na Conta'}
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <footer className="mt-12 text-center space-y-6">
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-[11px] font-black uppercase tracking-[0.2em] text-[#4A7FA5] hover:text-[#2D3142] transition-colors"
          >
            {isSignUp ? 'Já tenho uma conta — Entrar' : 'Não tenho conta — Criar agora'}
          </button>
          
          <div className="flex flex-col items-center gap-2 opacity-20">
            <p className="text-[#2D3142] text-[8px] font-black uppercase tracking-[0.5em]">Agência Inovare © 2026</p>
          </div>
        </footer>
      </main>
    </div>
  );
}