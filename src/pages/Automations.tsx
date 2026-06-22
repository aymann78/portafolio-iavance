import { useState, useEffect, useRef } from 'react';
import { Container, Section, Heading, Eyebrow, Tag, Reveal } from '../components/ui';
import { Zap, GitMerge, Mail, UserPlus, Database, MessageSquare, Cog, ShieldCheck, Share2 } from 'lucide-react';

interface PipelineNode {
  id: number;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  desc: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  dotColor: string;
}

const nodes: PipelineNode[] = [
  { id: 0, title: 'Captura', icon: Share2, desc: 'Webhook / Formulario / Ads', colorClass: 'text-blue-400', bgClass: 'bg-blue-400/10', borderClass: 'border-blue-400/40', dotColor: 'bg-blue-400' },
  { id: 1, title: 'Enriquecimiento', icon: Database, desc: 'Perfil + datos adicionales', colorClass: 'text-purple-400', bgClass: 'bg-purple-400/10', borderClass: 'border-purple-400/40', dotColor: 'bg-purple-400' },
  { id: 2, title: 'Clasificación', icon: GitMerge, desc: 'Scoring & routing condicional', colorClass: 'text-orange-400', bgClass: 'bg-orange-400/10', borderClass: 'border-orange-400/40', dotColor: 'bg-orange-400' },
  { id: 3, title: 'CRM Pipeline', icon: UserPlus, desc: 'Deal creado automáticamente', colorClass: 'text-brand-500', bgClass: 'bg-brand-500/10', borderClass: 'border-brand-500/40', dotColor: 'bg-brand-500' },
  { id: 4, title: 'Seguimiento', icon: Mail, desc: 'Secuencia de bienvenida activa', colorClass: 'text-emerald-400', bgClass: 'bg-emerald-400/10', borderClass: 'border-emerald-400/40', dotColor: 'bg-emerald-400' },
];

const batchJobs = [
  { name: 'Sincronización Stripe → CRM', time: 'hace 2 min', status: 'OK', items: '12', color: 'bg-emerald-500' },
  { name: 'Generación de Contratos PDF', time: 'hace 5 min', status: 'OK', items: '3', color: 'bg-emerald-500' },
  { name: 'Scraping de Precios de Mercado', time: 'en curso', status: 'Activo', items: '840', color: 'bg-blue-500' },
  { name: 'Deduplicación de Contactos CRM', time: 'hace 1h', status: 'OK', items: '45', color: 'bg-emerald-500' },
];

export function Automations() {
  const [activeStep, setActiveStep] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveStep(prev => (prev + 1) % nodes.length);
    }, 1800);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) };
  }, []);

  return (
    <div className="flex flex-col w-full">

      {/* Header */}
      <Section spacing="sm" className="border-b border-zinc-900 bg-black overflow-hidden relative">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-[100px] pointer-events-none" />
        <Container className="relative z-10 flex flex-col items-center text-center gap-6 max-w-3xl mx-auto">
          <Reveal>
            <div className="flex flex-col items-center gap-5">
              <div className="w-14 h-14 bg-brand-500/10 border border-brand-500/20 rounded-2xl flex items-center justify-center relative">
                <div className="absolute inset-0 bg-brand-500/20 blur-xl rounded-full" />
                <Zap className="w-7 h-7 text-brand-500 relative z-10" />
              </div>
              <Heading as="h1" size="xl" className="leading-tight">
                Arquitectura de Procesos
              </Heading>
              <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl">
                Liquida el trabajo manual. Construimos flujos de datos instantáneos y autónomos. 0% fricción humana, 100% margen operativo.
              </p>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Visual Simulation: Pipeline */}
      <Section spacing="md">
        <Container>
          <Reveal>
            <div className="mb-10">
              <Eyebrow>Pipelines de Captación</Eyebrow>
              <Heading as="h2" size="lg" className="mt-2">El Ciclo de Vida del Dato</Heading>
              <p className="text-zinc-400 mt-3 max-w-2xl">
                Simulación del recorrido de un contacto desde su captura hasta su integración en el CRM. Cada paso ocurre en milisegundos, sin intervención humana.
              </p>
            </div>
          </Reveal>

          <Reveal delay="sm">
            <div className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">

              {/* Pipeline status bar */}
              <div className="bg-zinc-900/80 border-b border-zinc-800 px-6 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-mono uppercase text-emerald-400 tracking-wider">Pipeline Activo</span>
                </div>
                <span className="text-xs text-zinc-600 font-mono">
                  Paso {activeStep + 1}/{nodes.length} — {nodes[activeStep].title}
                </span>
              </div>

              {/* Steps */}
              <div className="p-6 lg:p-10">

                {/* Mobile/Tablet: vertical stack */}
                <div className="flex flex-col gap-0 lg:hidden">
                  {nodes.map((node, i) => {
                    const Icon = node.icon;
                    const isActive = activeStep === i;
                    const isDone = activeStep > i;
                    return (
                      <div key={node.id} className="flex gap-4">
                        {/* Left: Line + dot */}
                        <div className="flex flex-col items-center">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-500 shrink-0 ${isActive ? `${node.bgClass} ${node.borderClass}` : isDone ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-900 border-zinc-800 opacity-40'}`}>
                            <Icon className={`w-4 h-4 transition-colors duration-500 ${isActive ? node.colorClass : isDone ? 'text-zinc-400' : 'text-zinc-700'}`} />
                          </div>
                          {i < nodes.length - 1 && (
                            <div className={`w-px h-8 mt-1 transition-all duration-700 ${isDone ? 'bg-zinc-600' : 'bg-zinc-800'}`} />
                          )}
                        </div>
                        {/* Right: Content */}
                        <div className={`pb-8 transition-opacity duration-300 ${isActive ? 'opacity-100' : isDone ? 'opacity-60' : 'opacity-30'}`}>
                          <p className={`font-bold text-sm ${isActive ? 'text-white' : 'text-zinc-400'}`}>{node.title}</p>
                          <p className="text-zinc-500 text-xs font-mono mt-0.5">{node.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Desktop: horizontal rail */}
                <div className="hidden lg:flex items-start gap-0">
                  {nodes.map((node, i) => {
                    const Icon = node.icon;
                    const isActive = activeStep === i;
                    const isDone = activeStep > i;
                    return (
                      <div key={node.id} className="flex-1 flex flex-col items-center gap-3 relative">
                        {/* Connector line */}
                        {i < nodes.length - 1 && (
                          <div className="absolute top-[18px] left-1/2 w-full h-px">
                            <div className={`h-full transition-all duration-700 origin-left ${isDone ? 'bg-zinc-500 scale-x-100' : 'bg-zinc-800 scale-x-100'}`} />
                            {isActive && (
                              <div className="absolute inset-0 overflow-hidden">
                                <div className={`h-full w-16 ${node.dotColor} opacity-60 animate-[slide_1.6s_linear_infinite]`} />
                              </div>
                            )}
                          </div>
                        )}

                        {/* Icon node */}
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all duration-500 relative z-10 shrink-0 ${isActive ? `${node.bgClass} ${node.borderClass} scale-110` : isDone ? 'bg-zinc-800 border-zinc-700' : 'bg-zinc-900 border-zinc-800 opacity-40'}`}>
                          {isActive && <div className={`absolute inset-0 ${node.bgClass} blur-lg rounded-xl`} />}
                          <Icon className={`w-4 h-4 transition-colors duration-500 relative z-10 ${isActive ? node.colorClass : isDone ? 'text-zinc-400' : 'text-zinc-700'}`} />
                        </div>

                        {/* Label */}
                        <div className={`text-center transition-opacity duration-300 ${isActive ? 'opacity-100' : isDone ? 'opacity-70' : 'opacity-30'}`}>
                          <p className={`font-bold text-xs ${isActive ? 'text-white' : 'text-zinc-400'}`}>{node.title}</p>
                          <p className="text-zinc-600 text-[10px] font-mono mt-0.5 leading-tight">{node.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Active step detail */}
                <div className="mt-8 pt-6 border-t border-zinc-800/50">
                  {nodes.map((node, i) => {
                    const Icon = node.icon;
                    return (
                      <div key={node.id} className={`flex items-center gap-4 transition-all duration-500 ${activeStep === i ? 'opacity-100 translate-y-0' : 'opacity-0 absolute pointer-events-none'}`}>
                        <div className={`w-10 h-10 rounded-xl ${node.bgClass} flex items-center justify-center shrink-0`}>
                          <Icon className={`w-5 h-5 ${node.colorClass}`} />
                        </div>
                        <div>
                          <p className="text-white font-semibold text-sm">{node.title} — procesando</p>
                          <p className="text-zinc-500 text-xs font-mono mt-0.5">{node.desc}</p>
                        </div>
                        <div className="ml-auto flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full animate-pulse ${node.dotColor}`} />
                          <span className="text-xs text-zinc-500 font-mono">activo</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Dashboard Panel */}
      <Section spacing="md" className="border-t border-zinc-900 bg-zinc-950/30">
        <Container>
          <Reveal>
            <div className="mb-10">
              <Eyebrow>Centro de Mando</Eyebrow>
              <Heading as="h2" size="lg" className="mt-2">Control Centralizado</Heading>
              <p className="text-zinc-400 mt-3 max-w-2xl">
                Todos los procesos convergen en dashboards ejecutivos. Monitorea volúmenes procesados, integraciones y estado de la máquina sin depender de técnicos.
              </p>
            </div>
          </Reveal>

          <div className="grid lg:grid-cols-12 gap-6">
            <Reveal delay="sm" className="lg:col-span-8 flex">
              <div className="w-full bg-black border border-zinc-800 rounded-xl p-6 flex flex-col gap-5 relative overflow-hidden">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-brand-500/3 rounded-full blur-[80px]" />

                <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
                  <span className="text-zinc-300 font-semibold flex items-center gap-2 text-sm">
                    <Cog className="w-4 h-4 text-zinc-500 animate-spin-slow" />
                    Operaciones en Ejecución
                  </span>
                  <Tag variant="outline" className="text-xs">Sistema Activo</Tag>
                </div>

                <div className="flex flex-col gap-3">
                  {batchJobs.map((job, i) => (
                    <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-zinc-900/50 rounded-lg border border-zinc-800/50 hover:border-zinc-700 transition-colors gap-2 sm:gap-0">
                      <div className="flex flex-col gap-0.5">
                        <span className="text-sm font-medium text-white">{job.name}</span>
                        <span className="text-xs text-zinc-500 font-mono">{job.time}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-mono text-zinc-400 bg-black px-2 py-1 rounded">{job.items} registros</span>
                        <div className="flex items-center gap-2 min-w-[70px]">
                          <span className={`w-1.5 h-1.5 rounded-full ${job.color} ${job.status === 'Activo' ? 'animate-pulse' : ''}`} />
                          <span className="text-xs font-medium text-zinc-300">{job.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay="md" className="lg:col-span-4 flex">
              <div className="w-full flex flex-col gap-4">
                <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-6 flex flex-col justify-center flex-1">
                  <h3 className="text-zinc-500 font-mono text-xs uppercase tracking-widest mb-4">Capacidad del Sistema</h3>
                  <div className="flex flex-col gap-3">
                    {[
                      { label: 'Errores de digitación', value: '0', color: 'text-emerald-400' },
                      { label: 'Intervención manual', value: '0%', color: 'text-emerald-400' },
                      { label: 'Disponibilidad', value: '24/7', color: 'text-white' },
                    ].map(stat => (
                      <div key={stat.label} className="flex justify-between items-center">
                        <span className="text-zinc-500 text-sm">{stat.label}</span>
                        <span className={`font-mono font-bold text-xl ${stat.color}`}>{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-black border border-brand-500/20 rounded-xl p-5">
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-full bg-brand-500/10 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4 text-brand-500" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm mb-1">Cero errores humanos</h4>
                      <p className="text-zinc-400 text-xs leading-relaxed">Las máquinas no sufren fatiga ni cometen errores de copia. Los datos fluyen por API estructurada con integridad total.</p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* Final CTA */}
      <Section spacing="md" className="border-t border-zinc-900">
        <Container className="text-center max-w-2xl">
          <Reveal>
            <MessageSquare className="w-10 h-10 text-zinc-700 mx-auto mb-5" />
            <Heading as="h3" size="md" className="mb-4">Tus herramientas son silos que no se hablan</Heading>
            <p className="text-zinc-400 text-lg">
              Deja de mover datos manualmente. Integramos tu ecosistema de software mediante Webhooks y APIs para que la información fluya sin ningún tipo de fricción humana.
            </p>
          </Reveal>
        </Container>
      </Section>
    </div>
  );
}
