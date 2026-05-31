import { Link } from 'react-router-dom';
import { projects } from '../data/projects';
import { Container, Section, Heading, Eyebrow, Card, CardContent, Tag, Button, Reveal } from '../components/ui';

export function Lab() {
  return (
    <div className="flex flex-col w-full">
      <Section spacing="xl" className="border-b border-zinc-900 bg-black">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-900 via-black to-black opacity-50 pointer-events-none" />
        <Container className="relative z-10 flex flex-col gap-6 max-w-4xl">
          <Reveal>
            <Eyebrow>Repositorio Abierto</Eyebrow>
            <Heading as="h1" size="2xl">
              Sistemas <span className="text-zinc-600">en Producción</span>
            </Heading>
            <p className="text-zinc-400 text-xl md:text-2xl leading-relaxed max-w-2xl mt-4">
              Cero humo. Explora la arquitectura interna, decisiones de stack y el impacto operativo de las máquinas digitales que construimos.
            </p>
          </Reveal>
        </Container>
      </Section>

      <Section spacing="lg">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {projects.map((project, idx) => (
              <Reveal key={project.id} delay={idx % 2 === 0 ? 'sm' : 'md'}>
                <div className="flex flex-col gap-4">
                  <Link to={`/projects/${project.slug}`} className="group block focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-lg">
                    <Card hoverable className="h-full bg-black border-zinc-800">
                      <div className="aspect-video bg-zinc-900 border-b border-zinc-800 flex flex-col justify-between p-6 relative overflow-hidden group-hover:border-brand-500/50 transition-colors">
                        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,0.2)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px]" />
                        
                        <div className="relative z-10 flex justify-between items-start w-full">
                          <Tag variant="solid" className={project.status === 'Live' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' : ''}>
                            {project.status.toUpperCase()}
                          </Tag>
                          <Tag variant="ghost" className="bg-black/50 backdrop-blur-md uppercase tracking-widest">{project.category}</Tag>
                        </div>

                        <div className="relative z-10 mt-auto">
                          <span className="text-4xl md:text-5xl font-black text-white/90 tracking-tighter mix-blend-overlay">
                            {project.title.substring(0, 10)}
                          </span>
                        </div>
                      </div>
                      
                      <CardContent className="pt-8 flex flex-col gap-6">
                        <div className="flex flex-col gap-3">
                          <Heading as="h3" size="md" className="group-hover:text-brand-400 transition-colors">
                            {project.title}
                          </Heading>
                          <p className="text-zinc-400 text-lg leading-relaxed line-clamp-3">
                            {project.shortDescription}
                          </p>
                        </div>

                        <div className="mt-2 border-t border-zinc-900 pt-6">
                          <div className="flex flex-wrap gap-2">
                            {project.tags.slice(0, 3).map(tag => (
                              <Tag key={tag} variant="outline" className="opacity-80 group-hover:opacity-100 transition-opacity">
                                {tag}
                              </Tag>
                            ))}
                            {project.tags.length > 3 && (
                              <Tag variant="ghost">+{project.tags.length - 3}</Tag>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>

                  <div className="flex gap-4 mt-2 mb-12 lg:mb-0">
                     <Button as="Link" to={`/projects/${project.slug}`} size="sm" variant="secondary" className="flex-1">
                       Ver Despliegue
                     </Button>
                     <Button as="Link" to={`/projects/${project.slug}/how-it-was-made`} size="sm" variant="outline" className="flex-1">
                       Anatomía del Sistema
                     </Button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>
    </div>
  );
}
