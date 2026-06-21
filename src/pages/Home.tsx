import { ArrowRight, CheckCircle2, ClipboardCheck, Code2, FileSpreadsheet, MousePointer2, Workflow } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DiagnosticForm } from '../components/DiagnosticForm';
import { ProofBadge } from '../components/ProofBadge';
import { capabilityBuilds } from '../data/projects';
import { services } from '../data/services';
import { Button, Card, CardContent, Container, Eyebrow, Heading, Section, Tag, Reveal } from '../components/ui';

const portalEntries = [
  {
    label: 'Mejorar mi web',
    text: 'La web no explica bien, no genera confianza o no convierte visitas en conversaciones.',
    demoHref: '/demo/fintech-cro-landing',
    contactHref: '/contacto?service=webs-de-conversion&problem=Mi%20web%20no%20convierte',
    icon: MousePointer2
  },
  {
    label: 'Automatizar tareas',
    text: 'El equipo pierde tiempo copiando datos, revisando correos o moviendo informacion.',
    demoHref: '/demo/automation-chatbot',
    contactHref: '/contacto?service=automatizaciones-e-ia&problem=Mi%20equipo%20pierde%20tiempo%20en%20tareas%20manuales',
    icon: Workflow
  },
  {
    label: 'Clasificar CSVs',
    text: 'Subes o pegas datos y el sistema prioriza, enruta y resume acciones.',
    demoHref: '/demo/csv-ops-classifier',
    contactHref: '/contacto?service=automatizaciones-e-ia&problem=Quiero%20clasificar%20CSVs%20o%20datos%20automaticamente',
    icon: FileSpreadsheet
  },
  {
    label: 'Crear software interno',
    text: 'Necesitas un portal, dashboard o herramienta propia para ordenar la operativa.',
    demoHref: '/demo/b2b-saas-platform',
    contactHref: '/contacto?service=software-e-integraciones&problem=Necesito%20una%20herramienta%20interna',
    icon: Code2
  }
] as const;

const process = [
  'Nos cuentas que esta fallando.',
  'Te decimos que conviene hacer primero.',
  'Construimos la pieza prioritaria.',
  'La dejamos lista para usar y medir.'
];

export function Home() {
  const featuredBuilds = capabilityBuilds.slice(0, 2);

  return (
    <div className="flex w-full flex-col">
      <Section spacing="none" className="min-h-[calc(100dvh-4rem)] overflow-hidden border-b border-zinc-900">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff07_1px,transparent_1px),linear-gradient(to_bottom,#ffffff07_1px,transparent_1px)] bg-[size:28px_28px]" />
        <Container className="relative z-10 flex min-h-[calc(100dvh-4rem)] flex-col justify-center py-12">
          <Reveal>
            <div className="max-w-5xl">
              <Eyebrow>iavance.es</Eyebrow>
              <Heading as="h1" size="2xl" className="mt-5 max-w-4xl">
                Consultoria tecnologica para vender mejor, automatizar tareas y ordenar operaciones.
              </Heading>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-300">
                Entras con un problema: una web que no convierte, procesos manuales o sistemas desconectados. Sales con una direccion clara y una primera solucion posible.
              </p>
            </div>
          </Reveal>

          <Reveal delay="sm">
            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {portalEntries.map((entry) => {
                const Icon = entry.icon;

                return (
                  <div
                    key={entry.label}
                    className="group rounded-lg border border-zinc-800 bg-black/80 p-5 transition hover:border-brand-500/40 hover:bg-zinc-950"
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-zinc-800 bg-zinc-950 text-brand-300 transition group-hover:border-brand-500/40">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="block text-lg font-semibold text-white">{entry.label}</span>
                        <span className="mt-2 block text-sm leading-6 text-zinc-400">{entry.text}</span>
                      </span>
                    </div>
                    <div className="mt-5 flex flex-col gap-2 sm:flex-row">
                      <Link
                        to={entry.demoHref}
                        className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-black transition hover:bg-zinc-200"
                      >
                        Ver demo
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                      <Link
                        to={entry.contactHref}
                        className="inline-flex items-center justify-center rounded-md border border-zinc-800 px-3 py-2 text-sm font-medium text-zinc-300 transition hover:border-zinc-600 hover:text-white"
                      >
                        Pedir diagnostico
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>

          <Reveal delay="md">
            <div className="mt-7 flex flex-col gap-4 border-t border-zinc-900 pt-6 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap gap-3 text-sm text-zinc-400">
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Primer diagnostico claro
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Sin precios publicos
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  Demos separadas de casos reales
                </span>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button as="Link" to="/contacto">
                  Pedir diagnostico
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button as="Link" to="/casos" variant="outline">
                  Ver ejemplos
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section spacing="sm" className="border-b border-zinc-900 bg-zinc-950/40">
        <Container>
          <Reveal>
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
              <div>
                <Eyebrow>Servicios</Eyebrow>
                <Heading as="h2" size="lg" className="mt-3">
                  Tres entradas. Una decision: que problema resolvemos primero.
                </Heading>
              </div>
              <p className="text-zinc-400">
                La persona que entra no tiene por que saber si necesita una web, una automatizacion o software propio. La web debe llevarla a una decision sencilla.
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
                        Ver servicio
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
        <Container className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
          <Reveal>
            <div>
              <Eyebrow>Proceso</Eyebrow>
              <Heading as="h2" size="lg" className="mt-3">
                Como pasamos de problema a solucion
              </Heading>
              <div className="mt-6 space-y-3">
                {process.map((step, index) => (
                  <div key={step} className="flex gap-3 rounded-lg border border-zinc-800 bg-zinc-950/50 p-4">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-brand-500/10 text-sm font-semibold text-brand-300">
                      {index + 1}
                    </span>
                    <p className="text-sm text-zinc-300">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal delay="sm">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <Eyebrow>Ejemplos</Eyebrow>
                  <p className="mt-2 text-xl font-semibold text-white">Demos para entender posibilidades</p>
                </div>
                <Button as="Link" to="/casos" variant="ghost" size="sm">
                  Ver todos
                </Button>
              </div>
            </Reveal>

            <div className="grid gap-4 md:grid-cols-2">
              {featuredBuilds.map((build, index) => (
                <Reveal key={build.slug} delay={index === 0 ? 'sm' : 'md'}>
                  <Link to={`/casos/${build.slug}`} className="group block">
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
                      </CardContent>
                    </Card>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section spacing="sm" className="border-t border-zinc-900 bg-zinc-950/40">
        <Container className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <div className="max-w-xl">
              <Eyebrow>Contacto</Eyebrow>
              <Heading as="h2" size="lg" className="mt-3">
                Cuéntanos que te frena y lo ordenamos.
              </Heading>
              <p className="mt-4 text-zinc-400">
                El formulario es la puerta de entrada. No hace falta que tengas un briefing perfecto: con saber que problema quieres resolver ya podemos empezar.
              </p>
              <div className="mt-6 flex items-center gap-3 rounded-lg border border-zinc-800 bg-black/60 p-4 text-sm text-zinc-300">
                <ClipboardCheck className="h-5 w-5 text-brand-300" />
                Primera fase sencilla: diagnostico, prioridad y siguiente accion.
              </div>
            </div>
          </Reveal>

          <Reveal delay="md" direction="left">
            <DiagnosticForm
              compact
              title="Solicita un diagnostico"
              description="Explica el problema en pocas lineas y te respondemos con la forma mas razonable de empezar."
            />
          </Reveal>
        </Container>
      </Section>
    </div>
  );
}
