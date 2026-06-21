import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button, Card, CardContent, Container, Eyebrow, Heading, Section, Reveal } from '../components/ui';

const steps = [
  {
    title: 'Diagnostico',
    text: 'Analizamos el problema, el contexto del negocio y el coste real de la friccion actual.'
  },
  {
    title: 'Mapa de solucion',
    text: 'Convertimos ese contexto en una propuesta clara: que construir, que no tocar y por donde empezar.'
  },
  {
    title: 'Sprint',
    text: 'Diseñamos y desarrollamos la primera pieza prioritaria con alcance razonable y criterios de calidad claros.'
  },
  {
    title: 'Despliegue',
    text: 'Ponemos la solucion en marcha, conectamos puntos criticos y dejamos claro como se utiliza.'
  },
  {
    title: 'Optimizacion',
    text: 'Si el proyecto lo pide, afinamos la siguiente iteracion con datos y aprendizaje real.'
  }
];

const engagement = [
  'Primero se ordena el problema; luego se discute la tecnologia.',
  'No hace falta empezar con un proyecto enorme para generar traccion.',
  'Cada fase deja una decision mas clara que la anterior.',
  'Lo que no aporta al negocio en esta etapa, se descarta.'
];

export function Process() {
  return (
    <div className="flex w-full flex-col">
      <Section spacing="lg" className="border-b border-zinc-900">
        <Container className="max-w-5xl">
          <Reveal>
            <Eyebrow>Proceso</Eyebrow>
            <Heading as="h1" size="2xl" className="mt-5">
              Un metodo sencillo para no perderse entre ideas, herramientas y urgencias.
            </Heading>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-400">
              La manera de trabajar importa tanto como la solucion final. Si el proceso es confuso, el proyecto tambien lo sera.
            </p>
          </Reveal>
        </Container>
      </Section>

      <Section spacing="md">
        <Container>
          <div className="grid gap-6 lg:grid-cols-5">
            {steps.map((step, index) => (
              <Reveal key={step.title} delay={index < 2 ? 'sm' : index < 4 ? 'md' : 'lg'}>
                <Card className="h-full rounded-[1.75rem] border-zinc-800 bg-black/70">
                  <CardContent className="pt-8">
                    <span className="text-xs font-mono uppercase tracking-[0.24em] text-zinc-500">
                      Paso 0{index + 1}
                    </span>
                    <Heading as="h2" size="sm" className="mt-5">
                      {step.title}
                    </Heading>
                    <p className="mt-4 text-sm leading-7 text-zinc-400">{step.text}</p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <Section spacing="md" className="border-y border-zinc-900 bg-zinc-950/40">
        <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <Reveal>
            <div className="max-w-xl">
              <Eyebrow>Que incluye la entrada</Eyebrow>
              <Heading as="h2" size="lg" className="mt-4">
                El diagnostico digital ordena la siguiente decision
              </Heading>
              <p className="mt-4 text-zinc-400">
                Es la forma de entrar sin comprar complejidad a ciegas. Se trata de aterrizar el problema, las prioridades y la mejor direccion para avanzar.
              </p>
            </div>
          </Reveal>

          <Reveal delay="md">
            <Card className="rounded-[1.75rem] border-zinc-800 bg-black">
              <CardContent className="pt-8">
                <div className="grid gap-4 md:grid-cols-2">
                  {engagement.map((item) => (
                    <div key={item} className="flex gap-3 rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                      <p className="text-sm text-zinc-300">{item}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </Reveal>
        </Container>
      </Section>

      <Section spacing="md">
        <Container>
          <Reveal>
            <Card className="rounded-[2rem] border-zinc-800 bg-black/70">
              <CardContent className="pt-10">
                <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
                  <div>
                    <Eyebrow>Siguiente paso</Eyebrow>
                    <Heading as="h2" size="lg" className="mt-4">
                      Si necesitas ordenar el problema antes de construir, empecemos por ahi.
                    </Heading>
                    <p className="mt-4 max-w-3xl text-zinc-400">
                      A veces lo mas valioso no es una nueva pantalla, sino una decision bien tomada al principio.
                    </p>
                  </div>
                  <div className="flex flex-col gap-4">
                    <Button as="Link" to="/contacto">
                      Solicitar diagnostico
                    </Button>
                    <Button as="Link" to="/servicios" variant="outline">
                      Ver lineas de trabajo
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Reveal>
        </Container>
      </Section>
    </div>
  );
}
