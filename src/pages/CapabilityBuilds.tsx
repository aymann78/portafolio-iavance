import { ArrowRight, MousePointer2, PlayCircle } from 'lucide-react';
import { ProofBadge } from '../components/ProofBadge';
import { publicCapabilityBuilds } from '../data/projects';
import { Seo } from '../components/Seo';
import { Button, Card, CardContent, Container, Eyebrow, Heading, Tag, Reveal } from '../components/ui';

export function CapabilityBuilds() {
  return (
    <div className="flex w-full flex-col bg-black">
      <Seo 
        title="Demos de automatización operativa y software B2B | iavance.es" 
        description="Casos y demos interactivas de operaciones B2B" 
        path="/demos" 
      />
      <section className="border-b border-zinc-900 bg-black py-8 md:py-10">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
            <Reveal>
              <Eyebrow>Demos</Eyebrow>
              <Heading as="h1" size="xl" className="mt-4 max-w-4xl">
                Demos y casos de uso para ver que podemos construir antes de hablar.
              </Heading>
              <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-400 md:text-lg">
                No enseñamos clientes inventados. Aqui tienes demos interactivas y casos de uso para entender rápido nuestro criterio en automatización, operaciones y software interno.
              </p>
            </Reveal>

            <Reveal delay="sm">
              <Card className="rounded-2xl border-zinc-800 bg-zinc-950/70">
                <CardContent className="pt-5">
                  <p className="text-xs font-mono uppercase tracking-[0.18em] text-brand-400">Empieza por aquí</p>
                  <p className="mt-3 text-lg font-semibold text-white">Elige una demo parecida a tu problema.</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    Si encaja, pide diagnóstico y lo bajamos a tu negocio sin empezar con un proyecto gigante.
                  </p>
                  <div className="mt-5 grid gap-2">
                    <Button as="Link" to="/contacto" size="sm">
                      Solicitar diagnóstico
                    </Button>
                    <Button as="Link" to="/lab" variant="outline" size="sm">
                      Ver demos navegables
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </Reveal>
          </div>

          <Reveal delay="md">
            <div className="mt-7 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
                <p className="text-xs font-mono uppercase tracking-[0.16em] text-zinc-500">Qué ves</p>
                <p className="mt-2 text-sm font-semibold text-white">Demos, conceptos y arquitectura realista</p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
                <p className="text-xs font-mono uppercase tracking-[0.16em] text-zinc-500">Para qué sirve</p>
                <p className="mt-2 text-sm font-semibold text-white">Entender si una solución encaja en tu operación</p>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/70 p-4">
                <p className="text-xs font-mono uppercase tracking-[0.16em] text-zinc-500">Siguiente paso</p>
                <p className="mt-2 text-sm font-semibold text-white">Diagnóstico digital claro y accesible</p>
              </div>
            </div>
          </Reveal>

          <div className="mt-7 grid gap-4 lg:grid-cols-2">
            {publicCapabilityBuilds.map((build, index) => (
              <Reveal key={build.slug} delay={index === 0 ? 'sm' : index === 1 ? 'md' : 'lg'}>
                <Card hoverable className="h-full rounded-2xl border-zinc-800 bg-zinc-950/70">
                  <CardContent className="pt-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <ProofBadge type={build.proofType} />
                      <Tag variant="ghost" className="text-zinc-500">
                        {build.category}
                      </Tag>
                    </div>

                    <Heading as="h2" size="sm" className="mt-5">
                      {build.title}
                    </Heading>
                    <p className="mt-3 text-sm leading-6 text-zinc-400">{build.shortDescription}</p>

                    <div className="mt-5 rounded-xl border border-zinc-800 bg-black/60 p-3">
                      <p className="text-xs font-mono uppercase tracking-[0.16em] text-zinc-500">Problema</p>
                      <p className="mt-2 text-sm leading-6 text-zinc-300">{build.problem}</p>
                    </div>

                    <div className="mt-5 grid gap-2">
                      {build.demoUrl && (
                        <Button as="a" href={build.demoUrl} size="sm" fullWidth>
                          <PlayCircle className="h-4 w-4" />
                          Probar demo
                        </Button>
                      )}
                      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-1">
                        <Button as="Link" to={`/casos/${build.slug}`} variant="outline" size="sm" fullWidth>
                          Ver detalle
                        </Button>
                        <Button as="Link" to={`/casos/${build.slug}/como-se-hizo`} variant="ghost" size="sm" fullWidth>
                          Anatomía
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-b border-zinc-900 bg-zinc-950/35 py-10 md:py-14">
        <Container>
          <Reveal>
            <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <Eyebrow>Cómo leer esta página</Eyebrow>
                <Heading as="h2" size="lg" className="mt-4">
                  No son casos reales disfrazados. Son pruebas de capacidad.
                </Heading>
              </div>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="border-t border-zinc-800 pt-5">
                  <MousePointer2 className="h-5 w-5 text-brand-400" />
                  <p className="mt-4 font-semibold text-white">Puedes tocar y probar</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    Las demos muestran flujos útiles: mini-ERP operativo y automatización de entradas, clasificación y acción.
                  </p>
                </div>
                <div className="border-t border-zinc-800 pt-5">
                  <ArrowRight className="h-5 w-5 text-brand-400" />
                  <p className="mt-4 font-semibold text-white">Sirven para abrir conversación</p>
                  <p className="mt-2 text-sm leading-6 text-zinc-400">
                    Si una pieza se parece a tu problema, el diagnóstico define alcance, prioridad y siguiente sprint.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="bg-black py-10 md:py-14">
        <Container className="max-w-4xl text-center">
          <Reveal>
            <Eyebrow>Siguiente paso</Eyebrow>
            <Heading as="h2" size="md" className="mt-4">
              Si algo te encaja, lo aterrizamos a tu negocio.
            </Heading>
            <p className="mx-auto mt-3 max-w-2xl text-zinc-400">
              Respuesta clara, primer mapa de oportunidad y una puerta de entrada proporcionada para detectar fricción, priorizar y decidir qué merece construirse.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button as="Link" to="/contacto">
                Solicitar diagnóstico
              </Button>
              <Button as="Link" to="/servicios" variant="outline">
                Ver servicios
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </div>
  );
}
