import { useMemo, useState } from 'react';
import { ArrowRight, BarChart3, Cpu, Gauge, Network, Sparkles } from 'lucide-react';
import { publicCapabilityBuilds } from '../data/projects';
import { Button, Card, CardContent, Eyebrow, Heading, Tag } from './ui';
import { ProofBadge } from './ProofBadge';

const options = [
  {
    id: 'conversión',
    label: 'Mi web no convierte',
    icon: Gauge,
    service: 'Webs de conversión',
    summary:
      'Tu propuesta necesita claridad, jerarquia y una experiencia que convierta visitas en conversaciones.',
    recommendation:
      'Empezariamos por un diagnóstico de mensajes, estructura y fricción en captación para decidir si hace falta una landing, una web comercial o un ajuste del funnel.',
      buildSlug: 'b2b-autoflow',
    href: '/contacto?service=webs-de-conversion&problem=Mi%20web%20no%20convierte'
  },
  {
    id: 'ops',
    label: 'Mi equipo pierde tiempo en tareas manuales',
    icon: Cpu,
    service: 'Automatizaciones e IA aplicada',
    summary:
      'Hay tiempo y margen que se escapan en tareas repetitivas, seguimiento manual y movimientos de datos.',
    recommendation:
      'Mapeariamos el flujo actual, priorizariamos los puntos mas costosos y planteariamos automatizaciones con reglas claras y una capa de IA solo donde mejore la operación.',
      buildSlug: 'lead-to-ops',
    href: '/contacto?service=automatizaciones-e-ia&problem=Mi%20equipo%20pierde%20tiempo%20en%20tareas%20manuales'
  },
  {
    id: 'systems',
    label: 'Tengo herramientas desconectadas',
    icon: Network,
    service: 'Software e integraciones',
    summary:
      'Tus datos viven en varios sitios, los equipos trabajan con versiones distintas y cada paso depende de alguien.',
    recommendation:
      'La prioridad seria definir una capa comun de integración y una interfaz que ordene estados, datos y acciones sin añadir mas herramientas por encima.',
    buildSlug: 'b2b-autoflow',
    href: '/contacto?service=software-e-integraciones&problem=Tengo%20herramientas%20desconectadas'
  },
  {
    id: 'internal-tool',
    label: 'Necesito una herramienta interna',
    icon: BarChart3,
    service: 'Software e integraciones',
    summary:
      'Hay una parte del negocio que ya no cabe bien en software generalista y necesita una herramienta propia.',
    recommendation:
      'Definiriamos un MVP con el minimo de complejidad útil: roles, estados, flujos y conexiones con las herramientas que ya usas.',
    buildSlug: 'b2b-autoflow',
    href: '/contacto?service=software-e-integraciones&problem=Necesito%20una%20herramienta%20interna'
  }
] as const;

export function DiagnosticExperience() {
  const [activeId, setActiveId] = useState<(typeof options)[number]['id']>('conversión');

  const activeItem = useMemo(
    () => options.find((option) => option.id === activeId) ?? options[0],
    [activeId]
  );

  const relatedBuild = publicCapabilityBuilds.find((build) => build.slug === activeItem.buildSlug);

  return (
    <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      <Card className="border-zinc-800 bg-zinc-950/70">
        <CardContent className="pt-8">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div className="max-w-md">
              <Eyebrow>Diagnóstico interactivo</Eyebrow>
              <Heading as="h3" size="md" className="mt-3">
                Elige el cuello de botella principal
              </Heading>
              <p className="mt-3 text-zinc-400">
                Esta experiencia resume como traducimos un problema difuso en una direccion concreta de trabajo.
              </p>
            </div>
            <div className="hidden rounded-2xl border border-brand-500/20 bg-brand-500/10 p-3 text-brand-300 lg:block">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>

          <div className="space-y-3">
            {options.map((option) => {
              const Icon = option.icon;
              const active = option.id === activeId;

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setActiveId(option.id)}
                  className={`w-full rounded-2xl border p-4 text-left transition-all ${
                    active
                      ? 'border-brand-500/40 bg-brand-500/10 shadow-[0_0_30px_rgba(14,165,233,0.08)]'
                      : 'border-zinc-800 bg-black/50 hover:border-zinc-700 hover:bg-zinc-900/60'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`rounded-xl border p-3 ${
                        active
                          ? 'border-brand-500/30 bg-brand-500/10 text-brand-300'
                          : 'border-zinc-800 bg-zinc-900 text-zinc-500'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className={`font-semibold ${active ? 'text-white' : 'text-zinc-200'}`}>
                        {option.label}
                      </p>
                      <p className="mt-1 text-sm text-zinc-400">{option.summary}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="border-zinc-800 bg-black">
        <CardContent className="pt-8">
          <div className="flex flex-wrap items-center gap-3">
            <Tag variant="solid" className="bg-brand-500/15 text-brand-200">
              Ruta recomendada
            </Tag>
            <Tag variant="ghost" className="text-zinc-500">
              {activeItem.service}
            </Tag>
          </div>

          <Heading as="h3" size="md" className="mt-5">
            {activeItem.label}
          </Heading>

          <p className="mt-4 max-w-2xl text-zinc-300">{activeItem.recommendation}</p>

          {relatedBuild && (
            <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950/70 p-6">
              <div className="flex flex-wrap items-center gap-3">
                <ProofBadge type={relatedBuild.proofType} />
                <Tag variant="ghost" className="text-zinc-500">
                  Demo relacionada
                </Tag>
              </div>
              <div className="mt-4 flex flex-col gap-3">
                <p className="text-lg font-semibold text-white">{relatedBuild.title}</p>
                <p className="text-zinc-400">{relatedBuild.shortDescription}</p>
              </div>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Button as="Link" to={`/casos/${relatedBuild.slug}`} variant="outline">
                  Ver demo
                </Button>
                <Button as="Link" to={activeItem.href}>
                  Solicitar diagnóstico <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500">
                Siguiente paso
              </p>
              <p className="mt-3 text-sm text-zinc-300">
                Te ayudamos a priorizar primero lo que mas impacta, no lo que mas ruido hace.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
              <p className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500">
                Puerta de entrada
              </p>
              <p className="mt-3 text-sm text-zinc-300">
                El diagnóstico sirve para empezar con una primera fase clara sin comprometer un proyecto grande desde el dia uno.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
