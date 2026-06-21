import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Outlet, Link, NavLink, useLocation } from 'react-router-dom';
import { Container } from '../components/ui';
import { useScrollToTop } from '../hooks/useScrollToTop';
import { siteMeta } from '../data/site';

const navigation = [
  { to: '/', label: 'Inicio' },
  { to: '/servicios', label: 'Servicios' },
  { to: '/casos', label: 'Capability Builds' },
  { to: '/lab', label: 'Lab' },
  { to: '/proceso', label: 'Proceso' },
  { to: '/contacto', label: 'Contacto' }
];

export function RootLayout() {
  useScrollToTop();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-black text-white selection:bg-brand-500 selection:text-white">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-zinc-800/80 bg-black/80 backdrop-blur-xl">
        <Container className="flex h-16 items-center justify-between">
          <Link to="/" className="text-xl font-semibold tracking-tight text-white">
            iavance<span className="text-brand-400">.es</span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm font-medium lg:flex">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `transition-colors ${isActive ? 'text-white' : 'text-zinc-400 hover:text-white'}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:block">
            <NavLink
              to="/contacto"
              className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-zinc-200"
            >
              Solicitar diagnostico
            </NavLink>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-zinc-800 bg-zinc-950 text-zinc-200 lg:hidden"
            aria-label="Abrir menu"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </Container>

        {menuOpen && (
          <div className="border-t border-zinc-800 bg-black lg:hidden">
            <Container className="flex flex-col gap-2 py-4">
              {navigation.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `rounded-2xl px-4 py-3 text-sm font-medium transition-colors ${
                      isActive ? 'bg-zinc-900 text-white' : 'text-zinc-400 hover:bg-zinc-950 hover:text-white'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </Container>
          </div>
        )}
      </header>

      <main className="flex min-h-screen flex-1 flex-col pt-16">
        <Outlet />
      </main>
      
      <footer className="border-t border-zinc-900 bg-zinc-950/70 py-12">
        <Container className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xl font-semibold tracking-tight text-white">
              iavance<span className="text-brand-400">.es</span>
            </p>
            <p className="mt-4 max-w-md text-sm leading-7 text-zinc-400">
              Detectamos friccion en captacion, operaciones y producto para convertirla en una solucion clara y ejecutable.
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.24em] text-zinc-500">Mapa</p>
              <div className="mt-4 flex flex-col gap-3 text-sm text-zinc-400">
                {navigation.map((item) => (
                  <NavLink key={item.to} to={item.to} className="transition hover:text-white">
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.24em] text-zinc-500">Contacto</p>
              <div className="mt-4 flex flex-col gap-3 text-sm text-zinc-400">
                <a href={`mailto:${siteMeta.email}`} className="transition hover:text-white">
                  {siteMeta.email}
                </a>
                <a href={siteMeta.instagram} target="_blank" rel="noreferrer" className="transition hover:text-white">
                  Instagram
                </a>
              </div>
            </div>
            <div>
              <p className="text-xs font-mono uppercase tracking-[0.24em] text-zinc-500">Entrada</p>
              <NavLink to="/contacto" className="mt-4 inline-flex text-sm text-white transition hover:text-brand-300">
                Solicitar diagnostico
              </NavLink>
            </div>
          </div>
        </Container>
        <Container className="mt-10 border-t border-zinc-900 pt-6">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500">
            © {new Date().getFullYear()} iavance.es
          </p>
        </Container>
      </footer>
    </div>
  );
}
