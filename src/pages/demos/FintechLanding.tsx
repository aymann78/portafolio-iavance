import { useState } from 'react';
import { ChevronDown, CheckCircle2, ShieldCheck, Zap, PieChart } from 'lucide-react';

export function FintechLanding() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: "¿Cuánto tarda la integración de la API?",
      a: "Nuestra API RESTful está diseñada para implementarse en menos de 48 horas con la documentación de grado bancario que proporcionamos."
    },
    {
      q: "¿Es seguro procesar datos financieros aquí?",
      a: "Sí. Cumplimos con PCI-DSS Nivel 1, SOC2 Tipo II y encriptación AES-256 end-to-end por defecto."
    },
    {
      q: "¿Cuáles son las comisiones operativas?",
      a: "Cero comisiones ocultas. Tarifa plana del 0.8% por transacción para cuentas Pro y Enterprise."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col relative overflow-hidden">
      
      {/* Demo Nav */}
      <nav className="w-full flex justify-between items-center p-6 lg:px-12 fixed top-10 z-50 bg-slate-50/80 backdrop-blur-md border-b border-slate-200">
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
             <div className="w-3 h-3 bg-white rounded-full" />
           </div>
           <span className="font-bold text-xl tracking-tight">VaultPay</span>
        </div>
        <div className="hidden md:flex gap-8 font-medium text-slate-600 text-sm">
          <button className="hover:text-blue-600 transition-colors">Producto</button>
          <button className="hover:text-blue-600 transition-colors">Desarrolladores</button>
          <button className="hover:text-blue-600 transition-colors">Precios</button>
        </div>
        <div className="flex gap-4">
          <button className="hidden sm:block text-slate-600 font-medium text-sm hover:text-slate-900">Sign In</button>
          <button className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-blue-600 transition-all shadow-sm hover:shadow-md">
            Start Free Trial
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 lg:pt-48 pb-20 px-6 lg:px-12 flex flex-col items-center text-center relative">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-3xl h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
        
        <span className="bg-blue-50 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-8 border border-blue-100 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          API V2.0 ahora disponible
        </span>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-slate-900 max-w-4xl leading-[1.1]">
          La infraestructura de pagos para startups que <span className="text-blue-600">escalan rápido.</span>
        </h1>
        
        <p className="mt-8 text-xl text-slate-600 max-w-2xl leading-relaxed">
          Diseñado por ingenieros para ingenieros. API limpia, cero conciliaciones manuales y retención de capital directa a tu balance en 24h.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-2">
            Crear Cuenta Gratis <Zap className="w-5 h-5" />
          </button>
          <button className="bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-full text-lg font-semibold hover:bg-slate-50 transition-all active:scale-95">
            Leer Documentación
          </button>
        </div>

        <p className="mt-6 text-sm text-slate-500 font-medium flex gap-4 items-center justify-center">
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Sin tarjeta de crédito</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Setup en 5 min</span>
        </p>
      </section>

      {/* Social Proof (Simulated) */}
      <section className="py-12 border-y border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Procesando millones diarios para los mejores</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale">
            {['AcmeCorp', 'GlobalTech', 'Nexus Systems', 'Stark Ind', 'Wayne Ent'].map(brand => (
              <span key={brand} className="text-xl md:text-2xl font-black tracking-tighter text-slate-900">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 px-6 lg:px-12 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">¿Por qué cambiar a VaultPay?</h2>
          <p className="text-slate-600 text-lg">Tu antigua pasarela de pagos te está costando un 2% más en abandonos de checkout.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Velocidad de Caja</h3>
            <p className="text-slate-600 leading-relaxed">Liquidaciones T+1 garantizadas. No retendremos tu dinero durante semanas por "políticas de riesgo" oscuras.</p>
          </div>
          
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Compliance Nativo</h3>
            <p className="text-slate-600 leading-relaxed">Motor de fraude potenciado por Machine Learning que reduce falsos positivos en un 40% vs el estándar.</p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-6">
              <PieChart className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Data Granular</h3>
            <p className="text-slate-600 leading-relaxed">Webhooks inmutables. Dashboards financieros en tiempo real. Exporta directo a tu sistema ERP contable.</p>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24 bg-slate-100/50 border-t border-slate-200">
        <div className="max-w-3xl mx-auto px-6">
           <h2 className="text-3xl font-bold tracking-tight text-center mb-12">Preguntas Frecuentes</h2>
           <div className="flex flex-col gap-4">
             {faqs.map((faq, index) => (
               <div key={index} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                 <button 
                   onClick={() => setOpenFaq(openFaq === index ? null : index)}
                   className="w-full flex justify-between items-center p-6 text-left font-semibold text-lg hover:bg-slate-50 transition-colors"
                 >
                   {faq.q}
                   <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                 </button>
                 {openFaq === index && (
                   <div className="p-6 pt-0 text-slate-600 border-t border-slate-100 leading-relaxed">
                     {faq.a}
                   </div>
                 )}
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto bg-slate-900 rounded-3xl p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-600/10" />
          <div className="relative z-10 flex flex-col items-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Lista para procesar en producción.</h2>
            <p className="text-slate-400 text-xl mb-10 max-w-2xl">Únete a las mejores startups que confían su flujo de capital en VaultPay hoy mismo.</p>
            <button className="bg-blue-600 text-white px-10 py-5 rounded-full text-lg font-bold hover:bg-blue-500 transition-all active:scale-95 w-full sm:w-auto">
              Obtener API Keys
            </button>
          </div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="py-12 border-t border-slate-200 bg-white text-center">
        <span className="text-slate-500 font-medium">© {new Date().getFullYear()} VaultPay Demo. Built for iavance.es</span>
      </footer>
    </div>
  );
}
