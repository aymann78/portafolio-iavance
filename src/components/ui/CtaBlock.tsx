import { Button } from './Button';
import { Heading } from './Heading';
import { Eyebrow } from './Eyebrow';
import { siteMeta } from '../../data/site';

interface CtaBlockProps {
  title: string;
  description: string;
  primaryAction: {
    label: string;
    href: string;
  };
  eyebrow?: string;
}

export function CtaBlock({ title, description, primaryAction, eyebrow }: CtaBlockProps) {
  return (
    <div className="w-full relative overflow-hidden bg-zinc-900 border border-zinc-800 rounded-lg p-8 md:p-16 flex flex-col items-center text-center gap-6">
      {/* Background radial gradient glow for premium feel */}
      <div className="absolute inset-0 bg-subtle-glow opacity-50 pointer-events-none" />
      
      <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center gap-6">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <Heading as="h2" size="lg">{title}</Heading>
        <p className="text-zinc-400 text-lg md:text-xl leading-relaxed">
          {description}
        </p>
        <div className="mt-4 flex flex-col sm:flex-row gap-4">
          {primaryAction.href.startsWith('http') || primaryAction.href.startsWith('mailto') ? (
            <Button as="a" href={primaryAction.href} size="lg">
              {primaryAction.label}
            </Button>
          ) : (
            <Button as="Link" to={primaryAction.href} size="lg">
              {primaryAction.label}
            </Button>
          )}
          <Button as="a" href={`mailto:${siteMeta.email}`} variant="outline" size="lg">
            Contactar por mail
          </Button>
        </div>
      </div>
    </div>
  );
}
