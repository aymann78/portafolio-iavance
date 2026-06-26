import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { publicCapabilityBuilds } from '../data/projects';
import { services } from '../data/services';
import { Button, Card, CardContent, Container, Eyebrow, Heading, Section, Tag, Reveal } from '../components/ui';

export function Services() {
  return (
    <div className="flex w-full flex-col">
      <Section spacing="sm" className="border-b border-zinc-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.14),transparent_36%),linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent)]" />
        <Container className="relative z-10 max-w-5xl">
          <Reveal>
            <Eyebrow>Soluciones</Eyebrow>
            <Heading as="h1" size="2xl" className="mt-5">
              Tres formas de quitar fricción a captación, operaciones y producto.
            </Heading>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-400">
              La propuesta no gira alrededor de vender horas. Gira alrededor de detectar que pieza hace falta y ponerla en marcha con un plan asumible.
            </p>
          </Reveal>
        </Container>
      </Section>

      {services.map((service, index) => {
        const relatedBuilds = publicCapabilityBuilds.filter((build) => service.relatedBuilds.includes(build.slug));

        return (
          <Section
            key={service.slug}
            id={service.slug}
            spacing="md"
            className={index % 2 === 1 ? 'border-y border-zinc-900 bg-zinc-950/40' : ''}
          >
            <Container className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
              <Reveal>
                <div className="max-w-xl">
                  <Tag variant="solid" className="bg-brand-500/10 text-brand-200">
                    {service.kicker}
                  </Tag>
                  <Heading as="h2" size="lg" className="mt-5">
                    {service.title}
                  </Heading>
                  <p className="mt-4 text-lg leading-8 text-zinc-300">{service.summary}</p>

                  <div className="mt-8 rounded-[1.75rem] border border-zinc-800 bg-black/60 p-6">
                    <p className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500">Problema que resolvemos</p>
                    <p className="mt-4 text-zinc-300">{service.problem}</p>
                    <p className="mt-6 text-xs font-mono uppercase tracking-[0.2em] text-zinc-500">Como lo abordamos</p>
                    <p className="mt-4 text-zinc-300">{service.solution}</p>
                  </div>
                </div>
              </Reveal>

              <div className="space-y-6">
                <Reveal delay="sm">
                  <Card className="rounded-[1.75rem] border-zinc-800 bg-black">
                    <CardContent className="pt-8">
                      <p className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500">Resultados que perseguimos</p>
                      <div className="mt-6 grid gap-4 md:grid-cols-2">
                        {service.outcomes.map((outcome) => (
                          <div key={outcome} className="flex gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                            <span className="text-sm text-zinc-300">{outcome}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </Reveal>

                <div className="grid gap-6 md:grid-cols-2">
                  <Reveal delay="md">
                    <Card className="rounded-[1.75rem] border-zinc-800 bg-zinc-950/50">
                      <CardContent className="pt-8">
                        <p className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500">Entregables habituales</p>
                        <ul className="mt-6 space-y-4 text-sm text-zinc-300">
                          {service.deliverables.map((item) => (
                            <li key={item} className="flex gap-3">
                              <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </Reveal>

                  <Reveal delay="lg">
                    <Card className="rounded-[1.75rem] border-zinc-800 bg-zinc-950/50">
                      <CardContent className="pt-8">
                        <p className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500">Cuando suele encajar</p>
                        <ul className="mt-6 space-y-4 text-sm text-zinc-300">
                          {service.whenItFits.map((item) => (
                            <li key={item} className="flex gap-3">
                              <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </Reveal>
                </div>

                {relatedBuilds.length > 0 && (
                  <Reveal delay="md">
                    <div className="rounded-[1.75rem] border border-zinc-800 bg-black/70 p-6">
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500">Demo relacionada</p>
                          <p className="mt-2 text-lg font-semibold text-white">{relatedBuilds[0].title}</p>
                        </div>
                        <Button as="Link" to={`/casos/${relatedBuilds[0].slug}`} variant="outline">
                          Ver demo
                        </Button>
                      </div>
                    </div>
                  </Reveal>
                )}
              </div>
            </Container>
          </Section>
        );
      })}

      <Section spacing="md">
        <Container>
          <Reveal>
            <Card className="rounded-[2rem] border-zinc-800 bg-zinc-950/50">
              <CardContent className="pt-10 text-center">
                <Eyebrow>Siguiente paso</Eyebrow>
                <Heading as="h2" size="lg" className="mt-4">
                  Si no tienes claro que línea encaja, empezamos por el diagnóstico.
                </Heading>
                <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
                  Lo mas importante al inicio no es elegir tecnologia. Es entender bien el cuello de botella y ordenar la siguiente decisión.
                </p>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <Button as="Link" to="/contacto">
                    Solicitar diagnóstico
                  </Button>
                  <Button as="Link" to="/casos" variant="outline">
                    Ver demos
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
