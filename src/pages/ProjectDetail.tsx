import { useParams, Link } from 'react-router-dom';
import { projects } from '../data/projects';
import { Container, Section, Heading, Eyebrow, Button, Tag, Reveal } from '../components/ui';
import { ArrowLeft, ExternalLink, Code2 } from 'lucide-react';

export function ProjectDetail() {
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

  return (
    <div className="flex flex-col w-full">
      <Section spacing="lg" className="border-b border-zinc-900">
        <Container className="flex flex-col gap-12 max-w-4xl">
          <Reveal>
            <div className="flex flex-col gap-6">
              <Link to="/lab" className="inline-flex items-center text-zinc-500 hover:text-white transition-colors w-fit font-medium text-sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver al Laboratorio
              </Link>
              
              <div className="flex gap-3 items-center flex-wrap">
                <Tag variant="solid" className={project.status === 'Live' ? 'bg-emerald-500/20 text-emerald-400 border-none' : ''}>
                  {project.status.toUpperCase()}
                </Tag>
                <Eyebrow>{project.category}</Eyebrow>
                <span className="text-zinc-600 font-mono text-sm uppercase">/ {project.year}</span>
              </div>

              <Heading as="h1" size="xl" className="mt-2">{project.title}</Heading>
              <p className="text-xl md:text-2xl text-zinc-400 leading-relaxed font-medium">
                {project.shortDescription}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              {project.demoUrl ? (
                <Button as="a" href={project.demoUrl} target="_blank" rel="noopener noreferrer" size="lg" className="w-full sm:w-auto">
                  Abrir Demo / App <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button as="button" disabled size="lg" className="w-full sm:w-auto opacity-50 cursor-not-allowed">
                  Demo No Disponible Aún
                </Button>
              )}
              <Button as="Link" to={`/projects/${project.slug}/how-it-was-made`} variant="outline" size="lg" className="w-full sm:w-auto">
                Ver "Cómo se hizo" <Code2 className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Reveal>
        </Container>
      </Section>

      {/* Main Content */}
      <Section spacing="lg">
        <Container className="grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8 flex flex-col gap-12">
            <Reveal>
              {project.demoUrl ? (
                <a
                  href={project.demoUrl}
                  className="group block aspect-video bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden relative hover:border-brand-500/40 transition-colors"
                >
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808010_1px,transparent_1px),linear-gradient(to_bottom,#80808010_1px,transparent_1px)] bg-[size:24px_24px]" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                    <div className="w-16 h-16 bg-brand-500/10 border border-brand-500/30 rounded-2xl flex items-center justify-center group-hover:bg-brand-500/20 transition-colors">
                      <ExternalLink className="w-7 h-7 text-brand-500" />
                    </div>
                    <div className="text-center">
                      <p className="text-white font-bold text-lg">Vista Previa Interactiva</p>
                      <p className="text-zinc-500 text-sm mt-1">Haz clic para abrir la demo en pantalla completa</p>
                    </div>
                  </div>
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-2 bg-brand-500 text-white text-sm font-semibold rounded-full group-hover:bg-brand-500/90 transition-colors">
                      Abrir Demo &rarr;
                    </span>
                  </div>
                </a>
              ) : (
                <div className="aspect-video bg-zinc-950 border border-zinc-800 rounded-lg flex flex-col items-center justify-center gap-4 relative">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px]" />
                  <MonitorSmartphone className="w-12 h-12 text-zinc-700" />
                  <p className="text-zinc-500 text-sm font-medium">Demo no disponible para este concepto</p>
                </div>
              )}
            </Reveal>

             <Reveal delay="sm">
               <div className="prose prose-invert prose-brand max-w-none prose-lg">
                  <h2>El Objetivo</h2>
                  <p className="text-zinc-300 leading-relaxed">
                    {project.objective}
                  </p>

                  <h2>La Solución</h2>
                  <p className="text-zinc-300 leading-relaxed">
                    {project.fullDescription}
                  </p>
               </div>
             </Reveal>
          </div>

          <aside className="lg:col-span-4 flex flex-col gap-12">
            <Reveal delay="md">
              <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-8 flex flex-col gap-8 sticky top-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-subtle-glow opacity-10 pointer-events-none" />
                <div className="flex flex-col gap-2 relative z-10">
                  <span className="text-zinc-500 uppercase font-mono text-xs tracking-widest font-semibold">Cliente</span>
                  <span className="text-white font-medium text-lg">{project.client}</span>
                </div>
                
                <div className="flex flex-col gap-2 relative z-10">
                  <span className="text-zinc-500 uppercase font-mono text-xs tracking-widest font-semibold">Año de Despliegue</span>
                  <span className="text-white font-medium text-lg">{project.year}</span>
                </div>

                <div className="flex flex-col gap-3 relative z-10">
                  <span className="text-zinc-500 uppercase font-mono text-xs tracking-widest font-semibold">Stack Tecnológico</span>
                  <div className="flex flex-col gap-2">
                    {project.stack.map(tech => (
                      <div key={tech} className="flex items-center gap-2 text-zinc-300 font-medium font-mono text-sm bg-black/40 px-3 py-2 rounded border border-zinc-800">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                        {tech}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </aside>
        </Container>
      </Section>
    </div>
  );
}

// Needed icon imported at the very end to avoid mess up
import { MonitorSmartphone } from 'lucide-react';
