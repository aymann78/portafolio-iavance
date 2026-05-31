import { Outlet, Link } from 'react-router-dom';
import { Container } from '../components/ui';
import { useScrollToTop } from '../hooks/useScrollToTop';

export function RootLayout() {
  useScrollToTop();
  return (
    <div className="min-h-screen flex flex-col pt-16 selection:bg-brand-500 selection:text-white overflow-x-hidden w-full max-w-[100vw]">
      <header className="fixed top-0 w-full h-16 border-b border-zinc-800 bg-black/80 backdrop-blur-md z-50 flex items-center justify-between px-6 md:px-12 lg:px-24">
        <Link to="/" className="text-xl font-bold tracking-tighter text-white">
          iavance<span className="text-brand-500">.es</span>
        </Link>
        <nav className="flex gap-4 md:gap-6 text-sm font-medium">
          <Link to="/" className="text-zinc-400 hover:text-white transition-colors">Home</Link>
          <Link to="/lab" className="text-zinc-400 hover:text-white transition-colors">Lab / Builds</Link>
          <Link to="/automations" className="text-zinc-400 hover:text-white transition-colors">Automatizaciones</Link>
        </nav>
      </header>

      <main className="flex-1 flex flex-col w-full">
        <Outlet />
      </main>
      
      <footer className="py-8 border-t border-zinc-900 mt-auto bg-zinc-950/50">
        <Container className="flex flex-col md:flex-row items-center justify-between text-zinc-500 text-sm">
          <span>&copy; {new Date().getFullYear()} iavance.es. Sistemas que venden.</span>
          <span className="font-mono text-xs mt-4 md:mt-0 opacity-50">VITE // REACT // BUILD</span>
        </Container>
      </footer>
    </div>
  );
}
