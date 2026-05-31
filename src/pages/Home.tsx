import { Link } from 'react-router-dom';
import { projects } from '../data/projects';
import { 
  Button, 
  Container, 
  Section, 
  Heading, 
  Eyebrow, 
  Card, 
  CardContent, 
  Tag, 
  Metric,
  CtaBlock,
  Reveal
} from '../components/ui';

// Icos de lucide-react (necesitamos asegurar que está instalado)
import { MonitorSmartphone, Cpu, BarChart3, ArrowRight, CheckCircle2, Zap } from 'lucide-react';

export function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero */}
      <section className="relative w-full min-h-screen flex flex-col justify-center overflow-hidden pt-20 pb-10 px-6 md:px-12 lg:px-16">
        {/* decorations */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-500/15 rounded-full blur-[140px] pointer-events-none -translate-y-1/4" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-6">
          {/* Eyebrow */}
          <Reveal delay="sm">
            <Eyebrow className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
              Sistemas digitales de alto rendimiento
            </Eyebrow>
          </Reveal>

          {/* The big headline — fills viewport width */}
          <Reveal delay="md">
            <h1
              className="font-black text-white leading-[0.88] tracking-tighter"
              style={{ fontSize: 'clamp(3rem, 10.5vw, 10rem)' }}
            >
              Tu negocio es<br />
              demasiado lento.
            </h1>
          </Reveal>

          {/* Subtitle */}
          <Reveal delay="lg">
            <p className="text-zinc-400 text-lg md:text-xl leading-relaxed max-w-2xl font-medium">
              No decoramos internet. Construimos <strong className="text-white">infraestructuras agresivas</strong> diseñadas para robar cuota de mercado, automatizar el trabajo repetitivo y escalar tus ingresos.
            </p>
          </Reveal>

          {/* CTAs */}
          <Reveal delay="xl">
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Button as="Link" to="/lab" size="lg" className="group">
                Ver Sistemas en Acción
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button as="a" href="#contact" variant="outline" size="lg">
                Agendar Auditoría Cruda
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 2. Sección de Servicios (Webs, Automations, Systems) */}
      <Section spacing="lg" className="border-t border-zinc-900 bg-zinc-950/50">
        <Container className="flex flex-col gap-16">
          <Reveal>
            <div className="flex flex-col gap-4 max-w-2xl">
              <Eyebrow>Capacidades Core</Eyebrow>
              <Heading as="h2" size="xl">Infraestructura para Escalar</Heading>
              <p className="text-zinc-400 text-lg">
                Eliminamos parches y herramientas lentas. Construimos sistemas definitivos que operan sin intervención diaria.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Reveal delay="sm">
              <Card hoverable className="bg-black h-full">
                <CardContent className="pt-8 flex flex-col gap-6">
                  <div className="w-12 h-12 rounded bg-zinc-900 flex items-center justify-center text-brand-500 border border-zinc-800">
                    <MonitorSmartphone className="w-6 h-6" />
                  </div>
                  <div>
                    <Heading as="h3" size="sm" className="mb-2">Webs de Altísima Conversión</Heading>
                    <p className="text-zinc-400">Frontend de rendimiento crítico. Cero plantillas lentas. Arquitecturas web programadas a medida para reducir la latencia a milisegundos y maximizar la inyección de tráfico frío a negocio final.</p>
                  </div>
                </CardContent>
              </Card>
            </Reveal>

            <Reveal delay="md">
              <Card hoverable className="bg-black h-full">
                <CardContent className="pt-8 flex flex-col gap-6">
                  <div className="w-12 h-12 rounded bg-zinc-900 flex items-center justify-center text-brand-500 border border-zinc-800">
                    <Cpu className="w-6 h-6" />
                  </div>
                  <div>
                    <Heading as="h3" size="sm" className="mb-2">Operaciones Automatizadas</Heading>
                    <p className="text-zinc-400">Destruimos la introducción manual de datos. Orquestamos interacciones (CRM, ERPs, APIs) en pipelines invisibles de alta fidelidad. Operatividad ininterrumpida sin margen de error humano.</p>
                  </div>
                </CardContent>
              </Card>
            </Reveal>

            <Reveal delay="lg">
              <Card hoverable className="bg-black h-full">
                <CardContent className="pt-8 flex flex-col gap-6">
                  <div className="w-12 h-12 rounded bg-zinc-900 flex items-center justify-center text-brand-500 border border-zinc-800">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <div>
                    <Heading as="h3" size="sm" className="mb-2">Sistemas Core Personalizados</Heading>
                    <p className="text-zinc-400">Interfaces privadas, portales B2B e infraestructura interna robusta. Construimos los engranajes digitales que centralizan las operaciones críticas de tu activo, liquidando dependencias externas limitantes.</p>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          </div>
        </Container>
      </Section>

      {/* 3. Advantages / Results Section */}
      <Section spacing="lg">
        <Container className="grid lg:grid-cols-2 gap-16 items-center">
          <Reveal direction="right">
            <div className="flex flex-col gap-8">
              <Eyebrow>El ROI</Eyebrow>
              <Heading as="h2" size="lg">No pagas por código. Inviertes en capacidad operativa.</Heading>
              <p className="text-zinc-400 text-lg">
                La diferencia entre comprar una web y construir un sistema se mide en cuántas horas humanas ahorras al mes y el impacto directo en tu facturación.
              </p>
              <ul className="flex flex-col gap-4 mt-4">
                {[
                  'Latencia sub-segundo. Todo carga de forma instantánea.',
                  'Arquitecturas limpias. Sin plugins de terceros que colapsen el sistema.',
                  'Infraestructura preparada para picos de tráfico de campañas agresivas.',
                  'Digitalización que absorbe el 100% de la fricción operativa.'
                ].map((adv, i) => (
                  <li key={i} className="flex gap-3 text-zinc-300">
                    <CheckCircle2 className="w-6 h-6 text-brand-500 shrink-0" />
                    <span>{adv}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          
          <Reveal direction="left" delay="md">
            <div className="grid grid-cols-2 gap-6 p-8 bg-zinc-900/50 rounded-2xl border border-zinc-800 relative overflow-hidden">
               <div className="absolute inset-0 bg-subtle-glow opacity-30 pointer-events-none" />
               <Metric value="< 1s" label="Latencia" trend="Render Instantáneo" trendUp className="z-10" />
               <Metric value="0" label="Dependencias Ocultas" className="z-10" />
               <Metric value="100%" label="Stack Limpio" className="z-10" />
               <Metric value="∞" label="Capacidad" className="z-10" />
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* 4. Projects Teaser Section */}
      <Section spacing="lg" className="border-t border-zinc-900 bg-zinc-950/30">
        <Container className="flex flex-col gap-12">
          <Reveal>
            <div className="flex items-end justify-between border-b border-zinc-800 pb-6">
              <div className="flex flex-col gap-2">
                <Eyebrow>Despliegues Recientes</Eyebrow>
                <Heading as="h2" size="lg">Sistemas en Producción</Heading>
              </div>
              <Button as="Link" to="/lab" variant="ghost" className="hidden sm:flex">
                Acceder al Lab <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Reveal>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.slice(0, 2).map((project, idx) => (
              <Reveal key={project.id} delay={idx === 0 ? 'sm' : 'lg'}>
                <Link to={`/projects/${project.slug}`} className="group block focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-lg">
                  <Card hoverable className="h-full bg-black">
                    <div className="aspect-video bg-zinc-900 border-b border-zinc-800 flex items-center justify-center relative overflow-hidden group-hover:border-zinc-700 transition-colors">
                      {/* Fake image skeleton pattern for premium feel */}
                      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,0.2)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px]" />
                      <span className="text-4xl font-black text-zinc-800 tracking-tighter mix-blend-overlay uppercase">
                        {project.title.substring(0, 4)}
                      </span>
                      <div className="absolute top-4 left-4 z-10 flex gap-2">
                        <Tag variant="solid">{project.category}</Tag>
                        <Tag variant="ghost" className="bg-black/50 backdrop-blur-md">{project.year}</Tag>
                      </div>
                    </div>
                    <CardContent className="pt-6 flex flex-col gap-3">
                      <Heading as="h3" size="sm" className="group-hover:text-brand-500 transition-colors">
                        {project.title}
                      </Heading>
                      <p className="text-zinc-400 leading-relaxed line-clamp-2">
                        {project.shortDescription}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              </Reveal>
            ))}
          </div>

          <div className="flex sm:hidden justify-center mt-4">
            <Button as="Link" to="/lab" variant="outline" fullWidth>
              Ver todos los proyectos
            </Button>
          </div>
        </Container>
      </Section>

      {/* 5. Automations Teaser Section */}
      <Section spacing="lg">
        <Container>
          <Reveal delay="sm">
            <div className="bg-brand-950/20 border border-brand-500/20 rounded-2xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row gap-12 items-center justify-between">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Zap className="w-64 h-64 text-brand-500" />
              </div>
              <div className="flex flex-col gap-6 relative z-10 max-w-xl">
                <Tag variant="solid" className="w-fit bg-brand-500/20 text-brand-400">Unidad de Procesos Mapeados</Tag>
                <Heading as="h2" size="md">Detección de Fugas Tecnológicas</Heading>
                <p className="text-zinc-400 text-lg">
                  Auditamos silenciosamente tus flujos de trabajo actuales, detectamos los sistemas que queman horas de tu equipo y construimos la arquitectura exacta para automatizarlos desde la raíz.
                </p>
              </div>
              <div className="relative z-10 w-full md:w-auto">
                <Button as="Link" to="/automations" variant="secondary" size="lg" fullWidth>
                  Explorar Casos de Uso
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* 6. CTA Section Final */}
      <Section spacing="xl" id="contact" className="border-t border-zinc-900">
        <Container>
          <Reveal delay="md">
            <CtaBlock 
              eyebrow="El Siguiente Paso"
              title="Deja de debatir. Empieza a construir."
              description="Si tu ecosistema digital opera como un pasivo en lugar de una máquina de generar ingresos, tenemos trabajo por hacer. Agenda una sesión estratégica cruda y tracemos la arquitectura de conversión que te falta."
              primaryAction={{
                label: "Auditar Mi Ecosistema",
                href: "https://iavance.es/contacto"
              }}
            />
          </Reveal>
        </Container>
      </Section>
    </div>
  );
}
