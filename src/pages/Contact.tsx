import { useState } from 'react';
import { DatabaseZap, Instagram, Mail, MessageCircleMore, Rows3, Workflow } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { DiagnosticForm } from '../components/DiagnosticForm';
import { siteMeta } from '../data/site';
import { Button, Card, CardContent, Container, Eyebrow, Heading, Section, Reveal } from '../components/ui';
import { trackEvent } from '../lib/analytics';

const nextSteps = [
  'Leemos el contexto y vemos si el problema esta bien planteado.',
  'Si tiene sentido, te proponemos un siguiente paso claro y proporcionado.',
  'Si no lo vemos, también te lo diremos sin vender una solución forzada.'
];

const problemOptions = [
  {
    id: 'manual',
    title: 'Tareas manuales',
    description: 'Copiar datos, revisar correos, perseguir estados o hacer seguimiento a mano.',
    problem: 'Perdemos horas cada semana en tareas manuales y necesitamos automatizar una primera pieza.',
    need: 'Automatización',
    projectType: 'Automatizaciones e IA aplicada',
    icon: Workflow,
  },
  {
    id: 'spreadsheet',
    title: 'Datos en hojas',
    description: 'CSV, hojas y exportaciones que nadie ve de forma clara ni a tiempo.',
    problem: 'Tenemos datos dispersos en hojas o CSVs y necesitamos clasificarlos, conectarlos o convertirlos en acciones.',
    need: 'Integraciones',
    projectType: 'Software e integraciones',
    icon: Rows3,
  },
  {
    id: 'internal',
    title: 'Software interno',
    description: 'Portal, panel o herramienta propia para ordenar operaciones y responsabilidades.',
    problem: 'Necesitamos una herramienta interna para centralizar operaciones, estados y responsables.',
    need: 'Software interno',
    projectType: 'Software e integraciones',
    icon: DatabaseZap,
  },
] as const;

export function Contact() {
  const [searchParams] = useSearchParams();
  const initialProblem = searchParams.get('problem') ?? '';
  const initialProjectType = searchParams.get('service') ?? '';
  const [selectedProblemId, setSelectedProblemId] = useState<(typeof problemOptions)[number]['id']>('manual');
  const selectedProblem = problemOptions.find((option) => option.id === selectedProblemId) ?? problemOptions[0];
  const formProblem = initialProblem || selectedProblem.problem;
  const formProjectType = initialProjectType || selectedProblem.projectType;

  return (
    <div className="flex w-full flex-col">
      <Section spacing="lg" className="border-b border-zinc-900">
        <Container className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <Reveal>
            <div className="max-w-2xl">
              <Eyebrow>Contacto</Eyebrow>
              <Heading as="h1" size="2xl" className="mt-5">
                Pide un diagnóstico gratuito y sal con una primera ruta clara.
              </Heading>
              <p className="mt-6 text-lg leading-8 text-zinc-400">
                Puedes venir con una idea clara o con un problema todavía difuso. Lo importante es detectar que pieza puede quitar fricción sin arrancar con un proyecto gigante.
              </p>

              <div className="mt-8 grid gap-3">
                {problemOptions.map((option) => {
                  const Icon = option.icon;
                  const active = option.id === selectedProblemId;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => {
                        setSelectedProblemId(option.id);
                        trackEvent('cta_click', { location: 'contact_problem_selector', label: option.title });
                      }}
                      className={`flex gap-4 rounded-lg border p-4 text-left transition ${
                        active
                          ? 'border-brand-400/60 bg-brand-500/10 text-white'
                          : 'border-zinc-800 bg-zinc-950/45 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-950'
                      }`}
                    >
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-white/10 bg-black/50 text-brand-300">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="block font-semibold">{option.title}</span>
                        <span className="mt-1 block text-sm leading-6 text-zinc-400">{option.description}</span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 grid gap-4">
                <Card className="rounded-lg border-zinc-800 bg-zinc-950/50">
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
                    <p className="mt-5 text-xs leading-5 text-zinc-500">{siteMeta.contactEmailRecommendation}</p>
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
            <DiagnosticForm
              key={`${selectedProblem.id}-${initialProblem}-${initialProjectType}`}
              streamlined
              title="Pedir diagnóstico gratuito"
              description="Deja los datos minimos y el cuello de botella. La respuesta busca claridad, no vender complejidad."
              initialProblem={formProblem}
              initialProjectType={formProjectType}
              initialNeedType={selectedProblem.need}
            />
          </Reveal>
        </Container>
      </Section>

      <Section spacing="md" className="bg-zinc-950/40">
        <Container className="grid gap-6 md:grid-cols-3">
          {nextSteps.map((step, index) => (
            <Reveal key={step} delay={index === 0 ? 'sm' : index === 1 ? 'md' : 'lg'}>
              <Card className="h-full rounded-lg border-zinc-800 bg-black/60">
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
