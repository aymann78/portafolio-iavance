import { ArrowRight } from 'lucide-react';
import { Button, Container, Heading, Section } from '../components/ui';

export function NotFound() {
  return (
    <Section spacing="xl" className="flex min-h-[70vh] flex-col items-center justify-center border-b border-zinc-900 bg-black text-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(14,165,233,0.08),transparent_50%)] pointer-events-none" />
      <Container className="relative z-10 max-w-2xl">
        <p className="text-sm font-mono uppercase tracking-[0.2em] text-brand-500">Error 404</p>
        <Heading as="h1" size="2xl" className="mt-6">
          Página no encontrada
        </Heading>
        <p className="mt-6 text-lg leading-8 text-zinc-400">
          La ruta a la que intentas acceder no existe o ha sido movida. Puedes volver al inicio o revisar nuestras soluciones operativas B2B.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button as="Link" to="/" size="lg">
            Volver a inicio <ArrowRight className="h-4 w-4" />
          </Button>
          <Button as="Link" to="/soluciones" variant="outline" size="lg">
            Ver soluciones
          </Button>
        </div>
      </Container>
    </Section>
  );
}
