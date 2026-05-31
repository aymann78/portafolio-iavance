import { useParams, Link } from 'react-router-dom';
import { projects } from '../data/projects';
import { Container, Section, Heading, Eyebrow, Button, Tag, Reveal } from '../components/ui';
import { ArrowLeft, Code2, ExternalLink, Target, LayoutGrid, Layers, Cpu, AlertCircle } from 'lucide-react';

export function HowItWasMade() {
  const { slug } = useParams();
  const project = projects.find(p => p.slug === slug);

  if (!project) {
    return (
      <Section spacing="xl">
        <Container className="flex flex-col items-center text-center gap-6">
          <Heading as="h1" size="xl">Proyecto no encontrado</Heading>
          <Button as="Link" to="/lab">Volver al laboratorio</Button>
        </Container>
      </Section>
    );
  }

  // Si no hay datos detallados para el howItWasMade
  const noData = !project.howItWasMade;

  return (
    <div className="flex flex-col w-full">
      <Section spacing="lg" className="border-b border-zinc-900 bg-black relative overflow-hidden">
        {/* Wireframe bg pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        
        <Container className="relative z-10 flex flex-col gap-8 max-w-4xl">
          <Reveal>
            <div className="flex flex-col gap-6">
              <Link to={`/projects/${project.slug}`} className="inline-flex items-center text-zinc-500 hover:text-white transition-colors w-fit font-medium text-sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Proyecto
              </Link>
              
              <div className="flex gap-3 items-center flex-wrap">
                <Code2 className="w-6 h-6 text-brand-500" />
                <Eyebrow>El Código // {project.category}</Eyebrow>
                {project.demoUrl && (
                  <Button as="Link" to={project.demoUrl} size="sm" variant="outline" className="ml-auto">
                    Ver Demo Interactiva <ExternalLink className="w-3 h-3 ml-2" />
                  </Button>
                )}
              </div>

              <Heading as="h1" size="2xl" className="leading-tight text-balance">
                Diseccionando <span className="text-zinc-500">{project.title}</span>
              </Heading>
            </div>
          </Reveal>
        </Container>
      </Section>

      <Section spacing="lg">
        <Container className="max-w-4xl">
          
          {noData ? (
             <div className="flex flex-col items-center justify-center p-12 bg-zinc-900 border border-zinc-800 rounded-xl text-center">
               <AlertCircle className="w-12 h-12 text-zinc-600 mb-4" />
               <Heading as="h3" size="md">Documentación en Proceso</Heading>
               <p className="text-zinc-500 mt-2 max-w-md">
                 [NO INFO] Estamos redactando los specifics técnicos y comerciales de esta máquina digital. Estarán disponibles en la siguiente iteración.
               </p>
             </div>
          ) : (
            <div className="flex flex-col gap-16">
              
              <div className="grid md:grid-cols-2 gap-8">
                {/* Objetivo y Enfoque */}
                <Reveal delay="sm">
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 flex flex-col gap-4 hover:border-zinc-700 transition-colors h-full">
                    <div className="w-10 h-10 bg-brand-500/10 rounded flex items-center justify-center text-brand-500">
                      <Target className="w-5 h-5" />
                    </div>
                    <Heading as="h3" size="sm">Objetivo de Negocio</Heading>
                    <p className="text-zinc-400 leading-relaxed text-sm">
                      {project.howItWasMade!.businessGoal}
                    </p>
                  </div>
                </Reveal>

                <Reveal delay="md">
                  <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 flex flex-col gap-4 hover:border-zinc-700 transition-colors h-full">
                    <div className="w-10 h-10 bg-indigo-500/10 rounded flex items-center justify-center text-indigo-400">
                      <Layers className="w-5 h-5" />
                    </div>
                    <Heading as="h3" size="sm">Enfoque Estratégico</Heading>
                    <p className="text-zinc-400 leading-relaxed text-sm">
                      {project.howItWasMade!.strategicFocus}
                    </p>
                  </div>
                </Reveal>
              </div>

              {/* El Stack (Visual) */}
              <Reveal>
                <div className="flex flex-col gap-6">
                  <Heading as="h2" size="lg" className="border-b border-zinc-800 pb-4">Arquitectura Técnica (Frontend)</Heading>
                  <div className="flex flex-wrap gap-3">
                    {project.stack.map(tech => (
                      <Tag key={tech} variant="outline" className="px-4 py-2 bg-black border-zinc-700 font-mono text-sm">{tech}</Tag>
                    ))}
                  </div>
                  <div className="bg-black border border-zinc-800 rounded-xl p-6 md:p-8 mt-4">
                    <div className="flex items-start gap-4">
                       <Cpu className="w-6 h-6 text-emerald-500 shrink-0 mt-1" />
                       <div>
                         <h4 className="text-white font-bold mb-2">Decisiones Frontend</h4>
                         <p className="text-zinc-400 leading-relaxed text-sm">
                           {project.howItWasMade!.frontendDecisions}
                         </p>
                       </div>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* UX / UI y Componentes */}
              <Reveal delay="sm">
                <div className="flex flex-col gap-6">
                  <Heading as="h2" size="lg" className="border-b border-zinc-800 pb-4">Sistemas de Diseño / UX</Heading>
                  <div className="bg-black border border-zinc-800 rounded-xl p-6 md:p-8">
                    <div className="flex items-start gap-4">
                       <LayoutGrid className="w-6 h-6 text-purple-400 shrink-0 mt-1" />
                       <div>
                         <h4 className="text-white font-bold mb-2">Criterio Estilístico</h4>
                         <p className="text-zinc-400 leading-relaxed text-sm">
                           {project.howItWasMade!.uxUiDecisions}
                         </p>
                       </div>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Retos Técnicos */}
              <Reveal delay="md">
                <div className="flex flex-col gap-6">
                  <Heading as="h2" size="lg" className="text-amber-500 border-b border-zinc-800 pb-4">Retos Técnicos Superados</Heading>
                  <p className="text-zinc-300 leading-relaxed text-lg border-l-2 border-amber-500 pl-6 py-2 bg-amber-500/5">
                    "{project.howItWasMade!.technicalChallenges}"
                  </p>
                </div>
              </Reveal>

              {/* Redirección */}
              <Reveal delay="lg">
                <div className="bg-brand-500/10 border border-brand-500 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-brand-500/20 via-transparent to-transparent p-8 md:p-12 rounded-2xl flex flex-col items-center text-center gap-6 mt-8">
                  <Heading as="h3" size="md">No creas en diapositivas, cree en software en ejecución.</Heading>
                  {project.demoUrl ? (
                    <Button as="Link" to={project.demoUrl} size="lg">
                      Cargar Demostración en Vivo
                    </Button>
                  ) : (
                    <Button as="button" variant="outline" disabled size="lg">
                      Demo No Disponible
                    </Button>
                  )}
                </div>
              </Reveal>

            </div>
          )}

        </Container>
      </Section>
    </div>
  );
}
