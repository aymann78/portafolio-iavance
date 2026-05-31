import { ArrowRight, Server, Layers, Workflow, Check, Activity } from 'lucide-react';

export function B2bSaasLanding() {
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navbar Simple */}
      <nav className="w-full flex items-center justify-between p-6 max-w-7xl mx-auto border-b border-zinc-900/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center">
            <Workflow className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-white tracking-wide">SyncBase</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-zinc-400">
          <a href="#platform" className="hover:text-white transition-colors">Plataforma</a>
          <a href="#features" className="hover:text-white transition-colors">Características</a>
          <a href="#pricing" className="hover:text-white transition-colors">Planes</a>
        </div>
        <div className="flex gap-4 items-center">
          <button className="text-sm font-medium hover:text-white transition-colors hidden sm:block">Log in</button>
          <button className="bg-white text-black px-4 py-2 rounded font-medium text-sm hover:bg-zinc-200 transition-colors">
            Contactar Ventas
          </button>
        </div>
      </nav>

      {/* Hero with Visual Showcase */}
      <section className="pt-24 pb-32 px-6 relative overflow-hidden flex flex-col items-center border-b border-zinc-900">
        {/* Glow Effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
          <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-mono text-zinc-400 mb-8 uppercase tracking-widest flex items-center gap-2">
            <Activity className="w-3 h-3 text-emerald-500" /> B2B Automation Engine
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-8 text-balance">
            Conecta tu ERP con el resto del mundo. Sin código espagueti.
          </h1>
          <p className="text-xl text-zinc-400 max-w-2xl mb-12 leading-relaxed">
            Sincroniza inventario, pedidos B2B y logística en una única capa de abstracción. Despliega flujos de trabajo en minutos, escala a millones de peticiones.
          </p>
          <div className="flex gap-4">
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded font-semibold transition-colors flex items-center gap-2">
              Ver Demo Interactiva <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Product Visual Showcase / Mockup */}
        <div className="w-full max-w-5xl mx-auto mt-20 relative z-10">
          <div className="aspect-[16/9] w-full bg-zinc-950 rounded-xl border border-zinc-800 shadow-2xl flex flex-col overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent z-10 sm:hidden" />
            {/* Fake macOS Header */}
            <div className="h-10 bg-zinc-900 border-b border-zinc-800 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-zinc-700" />
              <div className="w-3 h-3 rounded-full bg-zinc-700" />
              <div className="w-3 h-3 rounded-full bg-zinc-700" />
            </div>
            {/* Fake Dashboard Body */}
            <div className="flex-1 p-6 flex gap-6 overflow-hidden">
               {/* Sidebar */}
               <div className="w-48 hidden md:flex flex-col gap-4 border-r border-zinc-800 pr-6">
                 {[1,2,3,4,5].map(i => (
                   <div key={i} className={`h-8 rounded ${i === 2 ? 'bg-indigo-600/20 text-indigo-400' : 'bg-zinc-900/50'} flex items-center px-3`}>
                     <div className={`w-full h-2 rounded ${i === 2 ? 'bg-indigo-500/50' : 'bg-zinc-800'}`} />
                   </div>
                 ))}
               </div>
               {/* Main Canvas */}
               <div className="flex-1 flex flex-col gap-6">
                 <div className="w-1/3 h-8 bg-zinc-800 rounded" />
                 <div className="flex gap-4">
                   <div className="flex-1 h-32 bg-zinc-900 border border-zinc-800 rounded flex flex-col justify-center p-6 gap-3">
                     <span className="text-xs uppercase font-mono text-zinc-500">Pedidos Sincronizados</span>
                     <span className="text-4xl font-bold text-white">12,492</span>
                   </div>
                   <div className="flex-1 h-32 bg-zinc-900 border border-zinc-800 rounded flex flex-col justify-center p-6 gap-3">
                     <span className="text-xs uppercase font-mono text-zinc-500">Latencia Media</span>
                     <span className="text-4xl font-bold text-emerald-400">42ms</span>
                   </div>
                   <div className="flex-1 h-32 bg-zinc-900 border border-zinc-800 rounded hidden lg:flex flex-col justify-center p-6 gap-3">
                     <span className="text-xs uppercase font-mono text-zinc-500">Errores de Webhook</span>
                     <span className="text-4xl font-bold text-white">0</span>
                   </div>
                 </div>
                 {/* Flow diagram fake */}
                 <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded flex items-center justify-center p-8 gap-4 opacity-50">
                    <div className="w-16 h-16 bg-zinc-800 rounded shadow-lg" />
                    <div className="flex-1 h-px bg-indigo-500/50 relative">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                    </div>
                    <div className="w-24 h-24 bg-indigo-900/30 border border-indigo-500/30 rounded shadow-lg flex items-center justify-center text-indigo-500"><Workflow /></div>
                    <div className="flex-1 h-px bg-emerald-500/50 relative">
                       <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    </div>
                    <div className="w-16 h-16 bg-zinc-800 rounded shadow-lg" />
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Blocks */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white tracking-tight mb-4">Ingeniería sin compromisos</h2>
          <p className="text-zinc-400 max-w-2xl text-lg">No empaquetamos promesas vacías. Nuestra infraestructura soporta operaciones críticas empresariales.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:bg-zinc-900 hover:border-zinc-700 transition-colors">
            <Server className="w-8 h-8 text-indigo-400 mb-6" />
            <h3 className="text-xl font-bold text-white mb-3">Infraestructura Edge</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">Tus webhooks y sincronizaciones operan en el borde, garantizando la menor latencia posible independientemente de dónde estén tus servidores.</p>
          </div>
          <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:bg-zinc-900 hover:border-zinc-700 transition-colors">
            <Layers className="w-8 h-8 text-indigo-400 mb-6" />
            <h3 className="text-xl font-bold text-white mb-3">Abstracción unificada</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">Conecta Magento, Shopify, SAP o bases de datos crudas en una sola interfaz GraphQL limpia y estandarizada.</p>
          </div>
          <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-xl hover:bg-zinc-900 hover:border-zinc-700 transition-colors">
            <Activity className="w-8 h-8 text-indigo-400 mb-6" />
            <h3 className="text-xl font-bold text-white mb-3">Observabilidad 24/7</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">Trazabilidad total de cada byte transaccionado. Logs inmutables y alertas proactivas antes de que tus clientes noten un fallo.</p>
          </div>
        </div>
      </section>

      {/* Simulated Pricing */}
      <section id="pricing" className="py-24 px-6 bg-zinc-950 border-t border-zinc-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-4xl font-bold text-white tracking-tight mb-4">Precio transparente. Escalable.</h2>
            <p className="text-zinc-400 text-lg">Suscripciones adaptadas al nivel técnico y volumen transaccional de tus operaciones.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Plan 1 */}
            <div className="p-8 bg-zinc-900 rounded-2xl border border-zinc-800 flex flex-col">
              <h3 className="text-2xl font-bold text-white mb-2">Growth</h3>
              <p className="text-zinc-400 text-sm mb-6">Para operaciones B2B automatizando sus primeros procesos masivos.</p>
              <div className="mb-8">
                <span className="text-5xl font-black text-white">$499</span>
                <span className="text-zinc-500">/mes</span>
              </div>
              <ul className="flex flex-col gap-4 mb-8 flex-1">
                {[
                  'Hasta 50,000 requests/mes',
                  'Soporte Email',
                  'Retención de logs de 7 días',
                  'Conectores estándar'
                ].map((feature, i) => (
                  <li key={i} className="flex gap-3 text-zinc-300 text-sm items-center">
                    <Check className="w-4 h-4 text-indigo-500" /> {feature}
                  </li>
                ))}
              </ul>
              <button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white py-3 rounded font-medium transition-colors">
                Iniciar Plan
              </button>
            </div>

            {/* Plan 2 */}
            <div className="p-8 bg-indigo-900/20 rounded-2xl border border-indigo-500/30 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 px-3 py-1 bg-indigo-600 text-[10px] uppercase tracking-widest font-bold text-white rounded-bl">Popular</div>
              <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
              <p className="text-zinc-400 text-sm mb-6">Para infraestructuras críticas que requieren SLA militar y escala ilimitada.</p>
              <div className="mb-8">
                <span className="text-5xl font-black text-white">Custom</span>
              </div>
              <ul className="flex flex-col gap-4 mb-8 flex-1">
                {[
                  'Requests Ilimitados',
                  'Canal SLACK directo',
                  'Retención inmutable',
                  'Conectores legacy (AS400, SAP)',
                  'SLA del 99.99% garantizado'
                ].map((feature, i) => (
                  <li key={i} className="flex gap-3 text-zinc-300 text-sm items-center">
                    <Check className="w-4 h-4 text-indigo-400" /> {feature}
                  </li>
                ))}
              </ul>
              <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded font-medium transition-colors">
                Contactar Ventas
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-24 px-6 text-center border-t border-zinc-900 border-b">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-6">
          <h2 className="text-4xl font-bold text-white tracking-tighter">Deja de perder datos entre sistemas.</h2>
          <p className="text-zinc-400 text-xl">Integra una vez de forma correcta y dedícate al crecimiento en lugar del mantenimiento.</p>
          <button className="mt-4 bg-white text-black px-8 py-4 rounded font-bold hover:bg-zinc-200 transition-colors flex items-center gap-2">
            Desplegar ahora <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Footer minimalista */}
      <footer className="py-8 text-center text-zinc-600 text-xs font-mono uppercase tracking-widest bg-[#050505]">
        © {new Date().getFullYear()} SyncBase Demo. All systems nominal.
      </footer>
    </div>
  );
}
