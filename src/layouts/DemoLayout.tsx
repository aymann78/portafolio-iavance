import { Outlet, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function DemoLayout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col w-full bg-white text-zinc-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* Portfolio Top Bar - Para indicar que están dentro del portfolio */}
      <div className="w-full h-10 bg-black border-b border-zinc-800 flex items-center justify-between px-4 sticky top-0 z-[100]">
        <button 
          onClick={() => navigate(-1)}
          className="text-zinc-400 hover:text-white flex items-center gap-2 text-xs font-mono transition-colors"
        >
          <ArrowLeft className="w-3 h-3" /> VOLVER A IAVANCE.ES
        </button>
        <span className="text-zinc-600 text-[10px] font-mono uppercase tracking-widest hidden sm:inline-block">
          Modo demo // Caso de uso navegable
        </span>
      </div>

      <main className="flex-1 w-full bg-slate-50 relative">
        <Outlet />
      </main>
    </div>
  );
}
