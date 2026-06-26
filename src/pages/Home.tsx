import { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  DatabaseZap,
  FileSpreadsheet,
  Gauge,
  MousePointer2,
  PlugZap,
  ShieldCheck,
  Workflow,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { DiagnosticForm } from '../components/DiagnosticForm';
import { ProofBadge } from '../components/ProofBadge';
import { publicCapabilityBuilds } from '../data/projects';
import { services } from '../data/services';
import { Button, Card, CardContent, Container, Eyebrow, Heading, Section, Tag, Reveal } from '../components/ui';
import { trackEvent } from '../lib/analytics';

const operatingModes = [
  {
    id: 'orders',
    label: 'Pedidos manuales',
    pain: 'Pedidos por correo, stock en hojas y estados que nadie ve a tiempo.',
    result: 'Portal B2B conectado a inventario, reglas comerciales y seguimiento operativo.',
    metric: '18 h/sem',
    metricLabel: 'trabajo manual recuperable',
    errorMetric: '-42%',
    errorLabel: 'errores de traspaso',
    cta: '/contacto?service=software-e-integraciones&problem=Tenemos%20pedidos%20manuales%20y%20operaciones%20B2B%20desordenadas',
    icon: Workflow,
    stages: ['Captura', 'Validacion', 'ERP', 'Seguimiento'],
  },
  {
    id: 'leads',
    label: 'Leads sin seguimiento',
    pain: 'Formularios, Instagram y contactos entran por separado y el equipo llega tarde.',
    result: 'Lead routing, scoring, CRM y avisos para responder antes y con contexto.',
    metric: '< 3 min',
    metricLabel: 'tiempo de respuesta objetivo',
    errorMetric: '+31%',
    errorLabel: 'oportunidades atendidas',
    cta: '/contacto?service=automatizaciones-e-ia&problem=Quiero%20ordenar%20leads%20y%20seguimiento%20comercial',
    icon: MousePointer2,
    stages: ['Origen', 'Scoring', 'CRM', 'Aviso'],
  },
  {
    id: 'csv',
    label: 'Datos en CSV',
    pain: 'Exportaciones, incidencias o leads mezclados que alguien revisa fila por fila.',
    result: 'Clasificación, prioridad, resumen y siguiente acción sin revisar todo a mano.',
    metric: '74%',
    metricLabel: 'revisión repetitiva reducible',
    errorMetric: '4 rutas',
    errorLabel: 'acciones recomendadas',
    cta: '/contacto?service=automatizaciones-e-ia&problem=Queremos%20clasificar%20CSVs%20o%20datos%20automaticamente',
    icon: FileSpreadsheet,
    stages: ['Carga', 'Limpieza', 'Prioridad', 'Acción'],
  },
] as const;

const trustSignals = ['Pedidos por correo', 'Stock en hojas', 'Leads sin seguimiento', 'CRM/ERP desconectados'];

const capabilities = [
  { label: 'Automatización', text: 'Flujos que eliminan pasos repetitivos.', icon: Zap },
  { label: 'Integraciones', text: 'Datos conectados entre herramientas.', icon: PlugZap },
  { label: 'Software interno', text: 'Paneles, portales y control operativo.', icon: DatabaseZap },
];

const fastWins = [
  'Conectar formularios, WhatsApp, email o CRM para no perder oportunidades.',
  'Convertir hojas de calculo en flujos con reglas, prioridad y avisos.',
  'Crear paneles internos para ver estado, responsables y cuellos de botella.',
  'Montar portales B2B para pedidos, stock, clientes y seguimiento.',
];

const confidenceNotes = [
  'No prometemos IA magica: si una regla simple resuelve mejor el problema, usamos eso.',
  'El diagnóstico separa fricción real, prioridad de negocio y primera pieza viable.',
  'Las demos son demos o conceptos. No se presentan como casos reales de clientes.',
  'Cada entrega debe dejar algo usable: flujo, panel, integración, documentación o decisión.',
];

const faqs = [
  {
    question: '¿Cuánto cuesta empezar?',
    answer:
      'La primera entrada es el diagnóstico gratuito. Despues se propone una primera pieza proporcionada al problema, no un proyecto enorme por defecto.',
  },
  {
    question: '¿En cuanto tiempo se puede automatizar algo?',
    answer:
      'Muchas primeras piezas se pueden acotar en 30 días si el proceso esta claro y las herramientas actuales permiten integración razonable.',
  },
  {
    question: '¿Tengo que cambiar mis herramientas actuales?',
    answer:
      'No de entrada. La prioridad es conectar o mejorar lo que ya existe antes de proponer sustituciones grandes.',
  },
  {
    question: '¿Usais IA en todos los proyectos?',
    answer:
      'Solo cuando mejora una decisión o reduce trabajo repetitivo con suficiente control. Automatizar no siempre significa meter IA.',
  },
  {
    question: '¿Quién mantiene lo que se construye?',
    answer:
      'La entrega debe quedar documentada y preparada para evolucionar. Si hace falta mantenimiento, se plantea como una fase separada y clara.',
  },
];

export function Home() {
  const [activeModeId, setActiveModeId] = useState<(typeof operatingModes)[number]['id']>('orders');
  const activeMode = operatingModes.find((mode) => mode.id === activeModeId) ?? operatingModes[0];
  const ActiveIcon = activeMode.icon;
  const featuredBuilds = publicCapabilityBuilds.slice(0, 2);

  function selectMode(modeId: (typeof operatingModes)[number]['id']) {
    setActiveModeId(modeId);
    trackEvent('hero_demo_mode_change', { mode: modeId });
  }

  return (
    <div className="flex w-full flex-col">
      <Section spacing="none" className="overflow-hidden border-b border-zinc-900 bg-black">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:36px_36px]" />
        <div className="absolute inset-x-0 top-0 h-80 bg-[radial-gradient(circle_at_24%_8%,rgba(14,165,233,0.2),transparent_34%),radial-gradient(circle_at_76%_18%,rgba(34,197,94,0.12),transparent_28%)]" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent" />

        <Container className="relative z-10 grid gap-6 py-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:py-10">
          <Reveal direction="none">
            <div className="max-w-3xl">
              <Eyebrow>Automatización operativa B2B</Eyebrow>
              <Heading as="h1" size="2xl" className="mt-4 max-w-4xl text-balance">
                Automatizamos operaciones B2B que todavía dependen de correos, hojas y seguimiento manual.
              </Heading>
              <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300 md:text-lg">
                Detectamos dónde se pierden horas, priorizamos la primera automatización viable y construimos una solución usable conectada con tus herramientas actuales.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button
                  as="Link"
                  to="/contacto"
                  size="lg"
                  onClick={() => trackEvent('cta_click', { location: 'hero', label: 'Solicitar diagnóstico operativo' })}
                >
                  Solicitar diagnóstico operativo
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  as="Link"
                  to="/casos"
                  variant="outline"
                  size="lg"
                  onClick={() => trackEvent('cta_click', { location: 'hero', label: 'Ver demos' })}
                >
                  Ver demos
                </Button>
              </div>

              <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm text-zinc-400">
                {trustSignals.map((signal) => (
                  <span key={signal} className="inline-flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-400" />
                    {signal}
                  </span>
                ))}
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {capabilities.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="rounded-lg border border-zinc-800 bg-black/55 p-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-white">
                        <Icon className="h-4 w-4 text-brand-300" />
                        {item.label}
                      </div>
                      <p className="mt-2 text-xs leading-5 text-zinc-500">{item.text}</p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
                <p className="text-xs font-mono uppercase tracking-[0.18em] text-zinc-400">Software a medida</p>
                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  Cuando el proceso lo necesita, también construimos software interno, portales y paneles conectados para dar visibilidad a la operación.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay="sm" direction="none">
            <div className="rounded-lg border border-zinc-800 bg-black/82 shadow-[0_24px_90px_rgba(0,0,0,0.42)]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 items-center justify-center rounded-md border border-brand-500/25 bg-brand-500/10 text-brand-300">
                    <ActiveIcon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">Panel de oportunidad</p>
                    <p className="text-xs text-zinc-500">Demo viva basada en fricciones B2B reales</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                  Sistema activo
                </span>
              </div>

              <div className="grid lg:grid-cols-[190px_1fr]">
                <div className="border-b border-zinc-800 p-3 lg:border-b-0 lg:border-r">
                  <div className="grid gap-2">
                    {operatingModes.map((mode) => {
                      const Icon = mode.icon;
                      const active = mode.id === activeModeId;

                      return (
                        <button
                          key={mode.id}
                          type="button"
                          onClick={() => selectMode(mode.id)}
                          className={`flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition ${
                            active ? 'bg-white text-black' : 'text-zinc-400 hover:bg-zinc-950 hover:text-white'
                          }`}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <span>{mode.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <MetricTile icon={Clock3} label={activeMode.metricLabel} value={activeMode.metric} />
                    <MetricTile icon={Gauge} label={activeMode.errorLabel} value={activeMode.errorMetric} tone="emerald" />
                  </div>

                  <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-950/75 p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="mt-1 h-4 w-4 shrink-0 text-amber-300" />
                      <div>
                        <p className="text-xs font-mono uppercase tracking-[0.14em] text-zinc-500">Problema detectado</p>
                        <p className="mt-2 text-base font-semibold leading-7 text-white">{activeMode.pain}</p>
                        <p className="mt-3 text-sm leading-6 text-zinc-400">{activeMode.result}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-4 gap-2">
                    {activeMode.stages.map((stage, index) => (
                      <div key={stage} className="min-w-0 rounded-md border border-zinc-800 bg-black px-2 py-3 text-center">
                        <span className="mx-auto flex h-7 w-7 items-center justify-center rounded-md bg-brand-500/10 text-xs font-semibold text-brand-300">
                          {index + 1}
                        </span>
                        <p className="mt-2 truncate text-xs text-zinc-400">{stage}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-col gap-3 border-t border-zinc-900 pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="grid gap-1 text-xs text-zinc-500">
                      <span className="inline-flex items-center gap-1">
                        <ShieldCheck className="h-3.5 w-3.5 text-brand-300" />
                        Mapa inicial sin compromiso
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <PlugZap className="h-3.5 w-3.5 text-brand-300" />
                        Encaje con herramientas actuales
                      </span>
                    </div>
                    <Button
                      as="Link"
                      to={activeMode.cta}
                      size="sm"
                      onClick={() => trackEvent('cta_click', { location: 'hero_panel', label: activeMode.label })}
                    >
                      Aterrizar mi caso
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section spacing="sm" className="border-b border-zinc-900 bg-zinc-950/35">
        <Container>
          <Reveal>
            <div className="grid gap-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
              <div>
                <Eyebrow>Soluciones B2B</Eyebrow>
                <Heading as="h2" size="lg" className="mt-3">
                  Para empresas con pedidos, leads, stock, operaciones o datos repartidos entre herramientas.
                </Heading>
              </div>
              <p className="text-zinc-400">
                No tienes por qué saber si necesitas automatizar, integrar o crear software a medida. Entramos por el dolor operativo, mapeamos el proceso y decidimos la solución más simple.
              </p>
            </div>
          </Reveal>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {services.map((service, index) => (
              <Reveal key={service.slug} delay={index === 0 ? 'sm' : index === 1 ? 'md' : 'lg'}>
                <Card hoverable className="h-full rounded-lg border-zinc-800 bg-black/70">
                  <CardContent className="pt-6">
                    <Tag variant="solid" className="bg-brand-500/10 text-brand-200">
                      {service.kicker}
                    </Tag>
                    <Heading as="h3" size="sm" className="mt-4">
                      {service.title}
                    </Heading>
                    <p className="mt-3 text-sm leading-6 text-zinc-400">{service.problem}</p>
                    <div className="mt-5">
                      <Button as="Link" to={`/servicios#${service.slug}`} variant="ghost" size="sm">
                        Ver enfoque
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section spacing="sm">
        <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <div>
              <Eyebrow>Primeros 30 días</Eyebrow>
              <Heading as="h2" size="lg" className="mt-3">
                Qué podemos automatizar sin rehacer toda la empresa.
              </Heading>
              <p className="mt-4 text-zinc-400">
                El objetivo es encontrar una primera pieza que quite fricción real y deje una base mas ordenada para seguir creciendo.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-3 md:grid-cols-2">
            {fastWins.map((item, index) => (
              <Reveal key={item} delay={index % 2 === 0 ? 'sm' : 'md'}>
                <div className="flex gap-3 rounded-lg border border-zinc-800 bg-zinc-950/55 p-4">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-brand-500/10 text-sm font-semibold text-brand-300">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-6 text-zinc-300">{item}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section spacing="sm" className="border-y border-zinc-900 bg-zinc-950/35">
        <Container className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr]">
          <Reveal>
            <div>
              <Eyebrow>Confianza</Eyebrow>
              <Heading as="h2" size="lg" className="mt-3">
                Claridad antes que promesas enormes.
              </Heading>
              <p className="mt-4 text-zinc-400">
                Trabajamos mejor cuando el alcance inicial es pequeño, medible y conectado con un dolor real del negocio.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-3 md:grid-cols-2">
            {confidenceNotes.map((note, index) => (
              <Reveal key={note} delay={index % 2 === 0 ? 'sm' : 'md'}>
                <div className="flex h-full gap-3 rounded-lg border border-zinc-800 bg-black/70 p-4">
                  <ClipboardCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                  <p className="text-sm leading-6 text-zinc-300">{note}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section spacing="sm">
        <Container className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
          <Reveal>
            <div>
              <Eyebrow>Demos</Eyebrow>
              <Heading as="h2" size="lg" className="mt-3">
                Pruebas para ver criterio antes de hablar.
              </Heading>
              <p className="mt-4 text-zinc-400">
                Son demos y casos de uso. Sirven para comprobar como pensamos producto, operaciones e interfaces.
              </p>
              <div className="mt-6">
                <Button as="Link" to="/casos" variant="outline" size="sm">
                  Ver todas las demos
                </Button>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-4 md:grid-cols-2">
            {featuredBuilds.map((build, index) => (
              <Reveal key={build.slug} delay={index === 0 ? 'sm' : 'md'}>
                <Card hoverable className="h-full rounded-lg border-zinc-800 bg-black">
                  <CardContent className="pt-6">
                    <div className="flex flex-wrap gap-2">
                      <ProofBadge type={build.proofType} />
                      <Tag variant="ghost" className="text-zinc-500">
                        {build.category}
                      </Tag>
                    </div>
                    <p className="mt-5 text-xl font-semibold text-white">{build.title}</p>
                    <p className="mt-3 text-sm leading-6 text-zinc-400">{build.shortDescription}</p>
                    <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                      {build.demoUrl && (
                        <Button as="a" href={build.demoUrl} size="sm">
                          Probar demo
                        </Button>
                      )}
                      <Button as="Link" to={`/casos/${build.slug}`} variant="outline" size="sm">
                        Ver detalle
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section spacing="sm" className="border-y border-zinc-900 bg-zinc-950/35">
        <Container className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr]">
          <Reveal>
            <div>
              <Eyebrow>FAQ</Eyebrow>
              <Heading as="h2" size="lg" className="mt-3">
                Objeciones normales antes de automatizar.
              </Heading>
            </div>
          </Reveal>

          <div className="grid gap-3">
            {faqs.map((faq, index) => (
              <Reveal key={faq.question} delay={index < 2 ? 'sm' : 'md'}>
                <div className="rounded-lg border border-zinc-800 bg-black/70 p-5">
                  <p className="flex items-center gap-2 font-semibold text-white">
                    <ShieldCheck className="h-4 w-4 text-brand-300" />
                    {faq.question}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-zinc-400">{faq.answer}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section spacing="sm">
        <Container className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <div className="max-w-xl">
              <Eyebrow>Contacto</Eyebrow>
              <Heading as="h2" size="lg" className="mt-3">
                Trae el problema. Te devolvemos la primera ruta clara.
              </Heading>
              <p className="mt-4 text-zinc-400">
                No necesitas un briefing perfecto. Con saber donde se pierden horas, leads o control operativo ya podemos ordenar el siguiente paso.
              </p>
              <div className="mt-6 flex items-center gap-3 rounded-lg border border-zinc-800 bg-black/60 p-4 text-sm text-zinc-300">
                <ClipboardCheck className="h-5 w-5 text-brand-300" />
                Diagnóstico gratuito: fricción, prioridad y primera acción recomendable.
              </div>
            </div>
          </Reveal>

          <Reveal delay="md" direction="left">
            <DiagnosticForm
              compact
              streamlined
              title="Solicitar diagnóstico operativo"
              description="Cuentanos que parte del negocio sigue dependiendo de trabajo manual y te respondemos con una forma razonable de empezar."
              initialNeedType="Automatización"
              initialProjectType="Automatizaciones e IA aplicada"
            />
          </Reveal>
        </Container>
      </Section>
    </div>
  );
}

function MetricTile({
  icon: Icon,
  label,
  value,
  tone = 'brand',
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  tone?: 'brand' | 'emerald';
}) {
  const toneClass = tone === 'emerald' ? 'text-emerald-300 bg-emerald-400/10' : 'text-brand-300 bg-brand-500/10';

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950/75 p-4">
      <div className={`mb-3 flex h-8 w-8 items-center justify-center rounded-md ${toneClass}`}>
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-xs leading-5 text-zinc-500">{label}</p>
    </div>
  );
}
