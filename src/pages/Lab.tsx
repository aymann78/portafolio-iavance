import { ArrowRight, FlaskConical, MonitorSmartphone, Radar, Sparkles } from 'lucide-react';
import { ProofBadge } from '../components/ProofBadge';
import { capabilityBuilds, publicCapabilityBuilds } from '../data/projects';
import { Button, Card, CardContent, Container, Eyebrow, Heading, Section, Tag, Reveal } from '../components/ui';

const labNotes = [
  'Prototipamos ideas antes de convertirlas en una propuesta formal.',
  'Las demos sirven para explorar interaccion, visualizacion y arquitectura.',
  'No todo lo que aparece aqui es una pieza comercial; si es concepto, lo decimos.'
];

export function Lab() {
  const interactiveBuilds = publicCapabilityBuilds.filter((build) => build.demoUrl);
  const experimentalBuilds = capabilityBuilds.filter((build) => !build.demoUrl);

  return (
    <div className="flex w-full flex-col">
      <Section spacing="lg" className="border-b border-zinc-900 bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.16),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.08),transparent_24%)]" />
        <Container className="relative z-10 grid gap-12 lg:grid-cols-[1fr_0.9fr]">
          <Reveal>
            <div className="max-w-3xl">
              <Eyebrow>Demos</Eyebrow>
              <Heading as="h1" size="2xl" className="mt-5">
                Demos navegables, interacciones y pruebas de concepto.
              </Heading>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-400">
                Esta zona no sustituye al diagnóstico. Sirve para enseñar criterio, validar decisiones de producto y explorar ideas antes de convertirlas en una solución para negocio.
              </p>
            </div>
          </Reveal>

          <Reveal delay="md" direction="left">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { title: 'Demos interactivas', icon: MonitorSmartphone, text: 'Piezas navegables con foco en experiencia y mensaje.' },
                { title: 'Pipelines y simulaciones', icon: Radar, text: 'Representaciones de procesos, integraciones y flujos.' },
                { title: 'Builds estrategicos', icon: Sparkles, text: 'Artefactos pensados para enseñar una arquitectura.' },
                { title: 'Pruebas de interfaz', icon: FlaskConical, text: 'Exploracion visual sin venderla como caso real.' }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="rounded-[1.75rem] border border-zinc-800 bg-zinc-950/60 p-5">
                    <div className="inline-flex rounded-2xl border border-zinc-800 bg-black p-3 text-brand-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="mt-4 text-lg font-semibold text-white">{item.title}</p>
                    <p className="mt-2 text-sm text-zinc-400">{item.text}</p>
                  </div>
                );
              })}
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section spacing="md">
        <Container>
          <Reveal>
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <Eyebrow>Demos navegables</Eyebrow>
                <Heading as="h2" size="lg" className="mt-4">
                  Experiencias listas para explorar
                </Heading>
              </div>
              <Button as="Link" to="/casos" variant="ghost">
                Ver todas las demos
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Reveal>

          <div className="grid gap-6 lg:grid-cols-2">
            {interactiveBuilds.map((build, index) => (
              <Reveal key={build.slug} delay={index === 0 ? 'sm' : 'md'}>
                <Card className="h-full rounded-[1.75rem] border-zinc-800 bg-black">
                  <CardContent className="pt-8">
                    <div className="flex flex-wrap items-center gap-3">
                      <ProofBadge type={build.proofType} />
                      <Tag variant="ghost" className="text-zinc-500">
                        {build.category}
                      </Tag>
                    </div>
                    <Heading as="h3" size="md" className="mt-5">
                      {build.title}
                    </Heading>
                    <p className="mt-4 text-zinc-400">{build.shortDescription}</p>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                      <Button as="a" href={build.demoUrl} target="_blank" rel="noreferrer">
                        Abrir demo
                      </Button>
                      <Button as="Link" to={`/casos/${build.slug}`} variant="outline">
                        Ver anatomia
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section spacing="md" className="border-y border-zinc-900 bg-zinc-950/40">
        <Container className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal>
            <div>
              <Eyebrow>Cómo leer las demos</Eyebrow>
              <Heading as="h2" size="lg" className="mt-4">
                Lo que entra aqui puede ser demo, concepto o caso de uso
              </Heading>
              <div className="mt-8 space-y-4">
                {labNotes.map((note) => (
                  <div key={note} className="rounded-2xl border border-zinc-800 bg-black/60 p-5 text-zinc-300">
                    {note}
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <div className="grid gap-6 md:grid-cols-2">
            {experimentalBuilds.map((build, index) => (
              <Reveal key={build.slug} delay={index % 2 === 0 ? 'sm' : 'md'}>
                <Card className="h-full rounded-[1.75rem] border-zinc-800 bg-black/80">
                  <CardContent className="pt-8">
                    <ProofBadge type={build.proofType} />
                    <Heading as="h3" size="md" className="mt-5">
                      {build.title}
                    </Heading>
                    <p className="mt-3 text-sm uppercase tracking-[0.2em] text-zinc-500">{build.category}</p>
                    <p className="mt-4 text-zinc-400">{build.problem}</p>
                    <div className="mt-6">
                      <Button as="Link" to={`/casos/${build.slug}`} variant="outline" fullWidth>
                        Ver enfoque
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>
    </div>
  );
}
