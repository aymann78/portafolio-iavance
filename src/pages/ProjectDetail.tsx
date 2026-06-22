import { ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { ProofBadge, getProofLabel } from '../components/ProofBadge';
import { findCapabilityBuild } from '../data/projects';
import { Button, Card, CardContent, Container, Eyebrow, Heading, Section, Tag, Reveal } from '../components/ui';

export function ProjectDetail() {
  const { slug } = useParams();
  const build = findCapabilityBuild(slug);

  if (!build) {
    return (
      <Section spacing="xl">
        <Container className="flex flex-col items-center gap-6 text-center">
          <Heading as="h1" size="xl">
            Demo no encontrada
          </Heading>
          <Button as="Link" to="/casos">
            Volver a demos
          </Button>
        </Container>
      </Section>
    );
  }

  return (
    <div className="flex w-full flex-col">
      <Section spacing="lg" className="border-b border-zinc-900">
        <Container className="grid gap-12 lg:grid-cols-[1fr_0.8fr]">
          <Reveal>
            <div className="max-w-3xl">
              <Link to="/casos" className="inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white">
                <ArrowLeft className="h-4 w-4" />
                Volver a demos
              </Link>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <ProofBadge type={build.proofType} />
                <Tag variant="ghost" className="text-zinc-500">
                  {build.category}
                </Tag>
                <Tag variant="ghost" className="text-zinc-500">
                  {build.year}
                </Tag>
              </div>

              <Heading as="h1" size="2xl" className="mt-6">
                {build.title}
              </Heading>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">{build.shortDescription}</p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                {build.demoUrl ? (
                  <Button as="a" href={build.demoUrl} target="_blank" rel="noreferrer">
                    Abrir demo
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button as="Link" to={build.ctaHref ?? '/contacto'}>
                    Hablar de este enfoque
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
                <Button as="Link" to={`/casos/${build.slug}/como-se-hizo`} variant="outline">
                  Ver anatomia
                </Button>
              </div>
            </div>
          </Reveal>

          <Reveal delay="md" direction="left">
            <Card className="rounded-[1.75rem] border-zinc-800 bg-black/80">
              <CardContent className="pt-8">
                <p className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500">Lectura correcta</p>
                <p className="mt-4 text-zinc-300">
                  {getProofLabel(build.proofType)} orientada a enseñar capacidad, criterio y tipo de solucion. No se presenta como caso real de cliente.
                </p>
                <div className="mt-8 space-y-6">
                  <div>
                    <p className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500">Cliente ideal</p>
                    <p className="mt-3 text-zinc-300">{build.idealClient}</p>
                  </div>
                  <div>
                    <p className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500">Contexto</p>
                    <p className="mt-3 text-zinc-300">{build.clientLabel}</p>
                  </div>
                  <div>
                    <p className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500">Stack</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {build.stack.map((tech) => (
                        <Tag key={tech} variant="outline">
                          {tech}
                        </Tag>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Reveal>
        </Container>
      </Section>

      <Section spacing="md">
        <Container className="grid gap-8 lg:grid-cols-3">
          {[
            { label: 'Problema', value: build.problem },
            { label: 'Solucion', value: build.solution },
            { label: 'Impacto esperado', value: build.expectedImpact }
          ].map((item, index) => (
            <Reveal key={item.label} delay={index === 0 ? 'sm' : index === 1 ? 'md' : 'lg'}>
              <Card className="h-full rounded-[1.75rem] border-zinc-800 bg-zinc-950/60">
                <CardContent className="pt-8">
                  <p className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500">{item.label}</p>
                  <p className="mt-5 text-zinc-300">{item.value}</p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </Container>
      </Section>

      <Section spacing="md" className="border-y border-zinc-900 bg-zinc-950/40">
        <Container className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <div className="max-w-3xl">
              <Eyebrow>Descripcion</Eyebrow>
              <Heading as="h2" size="lg" className="mt-4">
                {build.objective}
              </Heading>
              <p className="mt-6 text-lg leading-8 text-zinc-300">{build.fullDescription}</p>
            </div>
          </Reveal>

          <Reveal delay="md">
            <Card className="rounded-[1.75rem] border-zinc-800 bg-black/70">
              <CardContent className="pt-8">
                <p className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500">Siguiente paso recomendado</p>
                <p className="mt-4 text-zinc-300">
                  Si tu situacion se parece a esta demo o caso de uso, el siguiente paso util es un diagnostico que nos permita aterrizar alcance, prioridades y orden de ejecucion.
                </p>
                <div className="mt-8 flex flex-col gap-3">
                  <Button as="Link" to={build.ctaHref ?? '/contacto'}>
                    {build.ctaLabel ?? 'Solicitar diagnostico'}
                  </Button>
                  <Button as="Link" to={`/casos/${build.slug}/como-se-hizo`} variant="outline">
                    Ver como se penso
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Reveal>
        </Container>
      </Section>
    </div>
  );
}
