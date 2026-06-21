import { Instagram, Mail, MessageCircleMore } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { DiagnosticForm } from '../components/DiagnosticForm';
import { siteMeta } from '../data/site';
import { Button, Card, CardContent, Container, Eyebrow, Heading, Section, Reveal } from '../components/ui';

const nextSteps = [
  'Leemos el contexto y vemos si el problema esta bien planteado.',
  'Si tiene sentido, te proponemos un siguiente paso claro y proporcionado.',
  'Si no lo vemos, tambien te lo diremos sin vender una solucion forzada.'
];

export function Contact() {
  const [searchParams] = useSearchParams();
  const initialProblem = searchParams.get('problem') ?? '';
  const initialProjectType = searchParams.get('service') ?? '';

  return (
    <div className="flex w-full flex-col">
      <Section spacing="lg" className="border-b border-zinc-900">
        <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div className="max-w-2xl">
              <Eyebrow>Contacto</Eyebrow>
              <Heading as="h1" size="2xl" className="mt-5">
                Cuéntanos el punto de friccion y te ayudamos a ordenar el siguiente paso.
              </Heading>
              <p className="mt-6 text-lg leading-8 text-zinc-400">
                Puedes venir con una idea clara o con un problema todavia difuso. Lo importante es salir con mas claridad que al entrar.
              </p>

              <div className="mt-10 grid gap-4">
                <Card className="rounded-[1.75rem] border-zinc-800 bg-zinc-950/50">
                  <CardContent className="pt-8">
                    <div className="flex items-center gap-3 text-zinc-300">
                      <Mail className="h-5 w-5 text-brand-400" />
                      <span>{siteMeta.email}</span>
                    </div>
                    <div className="mt-4 flex items-center gap-3 text-zinc-300">
                      <Instagram className="h-5 w-5 text-brand-400" />
                      <a href={siteMeta.instagram} target="_blank" rel="noreferrer" className="transition hover:text-white">
                        @iavance.es
                      </a>
                    </div>
                    <div className="mt-6">
                      <Button as="a" href={siteMeta.instagram} target="_blank" rel="noreferrer" variant="outline">
                        Hablar por Instagram
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </Reveal>

          <Reveal delay="md" direction="left">
            <DiagnosticForm initialProblem={initialProblem} initialProjectType={initialProjectType} />
          </Reveal>
        </Container>
      </Section>

      <Section spacing="md" className="bg-zinc-950/40">
        <Container className="grid gap-6 md:grid-cols-3">
          {nextSteps.map((step, index) => (
            <Reveal key={step} delay={index === 0 ? 'sm' : index === 1 ? 'md' : 'lg'}>
              <Card className="h-full rounded-[1.75rem] border-zinc-800 bg-black/60">
                <CardContent className="pt-8">
                  <MessageCircleMore className="h-5 w-5 text-brand-400" />
                  <p className="mt-5 text-zinc-300">{step}</p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </Container>
      </Section>
    </div>
  );
}
