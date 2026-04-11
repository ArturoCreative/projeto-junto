import React, { useState } from 'react';
import {
  Heart,
  Upload,
  ChevronRight,
  Home,
  Calendar,
  Users,
  Star,
} from 'lucide-react';

interface WelcomeProps {
  onStart: () => void;
  onLogoUpload: (url: string) => void;
}

export default function Welcome({ onStart, onLogoUpload }: WelcomeProps) {
  const [showModal, setShowModal] = useState(false);
  const [localLogo, setLocalLogo] = useState<string | null>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setLocalLogo(base64);
        onLogoUpload(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-between p-6 bg-[#FAF8F4] font-sans text-center">
      <div className="flex flex-col items-center mt-8 w-full">
        {/* CONTAINER DA LOGO AJUSTADO PARA LEITURA */}
        <div className="w-full max-w-[280px] h-32 border-2 border-dashed border-[#4A7FA5] rounded-2xl flex items-center justify-center mb-4 relative bg-white shadow-sm overflow-hidden cursor-pointer group">
          {localLogo ? (
            <img
              src={localLogo}
              alt="Logo JUNTO"
              className="w-full h-full object-contain p-1" // 'p-1' para não esmagar a logo
            />
          ) : (
            <label className="cursor-pointer flex flex-col items-center p-4">
              <Upload className="text-[#4A7FA5] mb-2 w-8 h-8" />
              <span className="text-[10px] text-[#4A7FA5] font-black uppercase tracking-widest">
                Subir Logo do Notebook
              </span>
              <input
                type="file"
                hidden
                onChange={handleLogoUpload}
                accept="image/*"
              />
            </label>
          )}
        </div>

        <h1 className="text-4xl font-black text-[#2D3142] tracking-tighter">
          JUNTO
        </h1>
        <p className="text-[#4A7FA5] uppercase tracking-[0.3em] text-[10px] font-black">
          Cuidar à distância, juntos.
        </p>
      </div>

      <div className="w-full max-w-sm flex flex-col items-center gap-5">
        <p className="text-[#6B7280] text-base leading-relaxed px-6 font-medium">
          A central familiar para quem cuida de quem ama.
        </p>
        <button
          onClick={onStart}
          className="w-full bg-[#4A7FA5] text-white py-5 rounded-2xl text-lg font-bold shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          Criar minha família <ChevronRight size={20} />
        </button>
        <button className="w-full bg-white text-[#4A7FA5] border-2 border-[#4A7FA5] py-5 rounded-2xl text-lg font-bold active:scale-95 transition-transform">
          Já tenho conta — Entrar
        </button>
        <button
          onClick={() => setShowModal(true)}
          className="text-[#6B7280] underline text-xs font-bold uppercase tracking-widest"
        >
          Como funciona?
        </button>
      </div>

      <div className="mb-6 flex items-center gap-2 text-[#E8A87C] font-bold">
        <Heart size={14} fill="#E8A87C" />
        <span className="text-[10px] uppercase tracking-widest">
          Central Familiar de Cuidado
        </span>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-[#2D3142]/60 backdrop-blur-sm flex items-center justify-center p-6 z-50">
          <div className="bg-[#FAF8F4] rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl">
            <h2 className="text-[#2D3142] text-xl font-black mb-8 text-center uppercase tracking-widest">
              O Plano JUNTO
            </h2>
            <div className="space-y-6">
              <div className="flex gap-4 items-center">
                <div className="bg-white p-3 rounded-2xl shadow-sm text-[#4A7FA5]">
                  <Home size={24} />
                </div>
                <p className="text-[#6B7280] font-bold text-xs text-left">
                  Crie o perfil do idoso e convide a família
                </p>
              </div>
              <div className="flex gap-4 items-center">
                <div className="bg-white p-3 rounded-2xl shadow-sm text-[#E8A87C]">
                  <Calendar size={24} />
                </div>
                <p className="text-[#6B7280] font-bold text-xs text-left">
                  Registre o dia a dia e consultas
                </p>
              </div>
              <div className="flex gap-4 items-center">
                <div className="bg-white p-3 rounded-2xl shadow-sm text-[#E8A87C]">
                  <Star size={24} />
                </div>
                <p className="text-[#6B7280] font-bold text-xs text-left">
                  IA resume o dia para todos às 21:30
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="mt-10 w-full bg-[#E8A87C] text-white py-4 rounded-2xl font-black shadow-lg"
            >
              ENTENDI!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
