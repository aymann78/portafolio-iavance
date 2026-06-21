import { ArrowLeft, Code2, Cpu, Layers, LayoutGrid, Target } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { findCapabilityBuild } from '../data/projects';
import { Button, Card, CardContent, Container, Eyebrow, Heading, Section, Tag, Reveal } from '../components/ui';

export function HowItWasMade() {
  const { slug } = useParams();
  const build = findCapabilityBuild(slug);

  if (!build) {
    return (
      <Section spacing="xl">
        <Container className="flex flex-col items-center gap-6 text-center">
          <Heading as="h1" size="xl">
            Build no encontrado
          </Heading>
          <Button as="Link" to="/casos">
            Volver a capability builds
          </Button>
        </Container>
      </Section>
    );
  }

  const details = build.howItWasMade;

  if (!details) {
    return (
      <Section spacing="xl">
        <Container className="flex flex-col items-center gap-6 text-center">
          <Heading as="h1" size="xl">
            Anatomia en proceso
          </Heading>
          <p className="max-w-xl text-zinc-400">
            Este build aun no tiene la documentacion detallada publicada, aunque el enfoque general ya esta explicado en su ficha principal.
          </p>
          <Button as="Link" to={`/casos/${build.slug}`}>
            Volver al build
          </Button>
        </Container>
      </Section>
    );
  }

  return (
    <div className="flex w-full flex-col">
      <Section spacing="lg" className="border-b border-zinc-900 bg-black">
        <Container className="max-w-5xl">
          <Reveal>
            <Link to={`/casos/${build.slug}`} className="inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-white">
              <ArrowLeft className="h-4 w-4" />
              Volver al build
            </Link>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Code2 className="h-5 w-5 text-brand-400" />
              <Eyebrow>Anatomia del build</Eyebrow>
              <Tag variant="ghost" className="text-zinc-500">
                {build.title}
              </Tag>
            </div>
            <Heading as="h1" size="2xl" className="mt-5">
              Como se penso y por que esta montado asi
            </Heading>
          </Reveal>
        </Container>
      </Section>

      <Section spacing="md">
        <Container className="grid gap-6 md:grid-cols-2">
          {[
            {
              icon: Target,
              title: 'Objetivo de negocio',
              text: details.businessGoal,
              color: 'text-brand-300 bg-brand-500/10 border-brand-500/20'
            },
            {
              icon: Layers,
              title: 'Enfoque estrategico',
              text: details.strategicFocus,
              color: 'text-violet-300 bg-violet-500/10 border-violet-500/20'
            },
            {
              icon: Cpu,
              title: 'Decisiones frontend',
              text: details.frontendDecisions,
              color: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20'
            },
            {
              icon: LayoutGrid,
              title: 'Criterio de experiencia',
              text: details.uxUiDecisions,
              color: 'text-amber-200 bg-amber-500/10 border-amber-500/20'
            }
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={index % 2 === 0 ? 'sm' : 'md'}>
                <Card className="h-full rounded-[1.75rem] border-zinc-800 bg-black/70">
                  <CardContent className="pt-8">
                    <div className={`inline-flex rounded-2xl border p-3 ${item.color}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <Heading as="h2" size="md" className="mt-5">
                      {item.title}
                    </Heading>
                    <p className="mt-4 text-zinc-300">{item.text}</p>
                  </CardContent>
                </Card>
              </Reveal>
            );
          })}
        </Container>
      </Section>

      <Section spacing="md" className="border-t border-zinc-900 bg-zinc-950/40">
        <Container>
          <Reveal>
            <Card className="rounded-[1.75rem] border-zinc-800 bg-black/80">
              <CardContent className="pt-8">
                <p className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500">Reto principal</p>
                <p className="mt-4 text-lg leading-8 text-zinc-300">{details.technicalChallenges}</p>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Button as="Link" to={`/casos/${build.slug}`}>
                    Volver al build
                  </Button>
                  <Button as="Link" to={build.ctaHref ?? '/contacto'} variant="outline">
                    Llevar este enfoque a mi caso
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
