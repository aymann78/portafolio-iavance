import { FormEvent, useEffect, useMemo, useState } from 'react';
import { ArrowRight, CheckCircle2, Instagram, LoaderCircle, Mail } from 'lucide-react';
import { siteMeta } from '../data/site';
import { Button } from './ui';
import { trackEvent } from '../lib/analytics';

type FormState = {
  nombre: string;
  empresa: string;
  email: string;
  tipoProyecto: string;
  tipoNecesidad: string;
  problemaPrincipal: string;
  mensaje: string;
  website: string;
};

const initialState: FormState = {
  nombre: '',
  empresa: '',
  email: '',
  tipoProyecto: '',
  tipoNecesidad: '',
  problemaPrincipal: '',
  mensaje: '',
  website: ''
};

interface DiagnosticFormProps {
  title?: string;
  description?: string;
  compact?: boolean;
  streamlined?: boolean;
  initialProblem?: string;
  initialProjectType?: string;
  initialNeedType?: string;
}

function normalizeProjectType(value: string) {
  const map: Record<string, string> = {
    'webs-de-conversion': 'Webs de conversión',
    'automatizaciones-e-ia': 'Automatizaciones e IA aplicada',
    'software-e-integraciones': 'Software e integraciones',
    'automatización': 'Automatizaciones e IA aplicada',
    'integraciones': 'Software e integraciones',
    'software-interno': 'Software e integraciones',
    'no-lo-tengo-claro': 'No lo tengo claro todavía'
  };

  return map[value] ?? value;
}

export function DiagnosticForm({
  title = 'Solicita un diagnóstico digital',
  description = 'Cuéntanos el cuello de botella principal y te responderemos con el siguiente paso más razonable para tu caso.',
  compact = false,
  streamlined = false,
  initialProblem = '',
  initialProjectType = '',
  initialNeedType = ''
}: DiagnosticFormProps) {
  const normalizedProjectType = normalizeProjectType(initialProjectType);
  const [form, setForm] = useState<FormState>({
    ...initialState,
    problemaPrincipal: initialProblem,
    tipoProyecto: normalizedProjectType,
    tipoNecesidad: initialNeedType
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (initialProblem || initialProjectType || initialNeedType) {
      setForm(prev => ({
        ...prev,
        problemaPrincipal: initialProblem || prev.problemaPrincipal,
        tipoProyecto: initialProjectType ? normalizeProjectType(initialProjectType) : prev.tipoProyecto,
        tipoNecesidad: initialNeedType || prev.tipoNecesidad
      }));
    }
  }, [initialProblem, initialProjectType, initialNeedType]);

  const projectOptions = useMemo(
    () => [
      'Automatizaciones e IA aplicada',
      'Software e integraciones',
      'Webs de conversión',
      'No lo tengo claro todavía'
    ],
    []
  );

  const needOptions = useMemo(
    () => ['Automatización', 'Integraciones', 'Software interno', 'No lo tengo claro'],
    []
  );

  function handleChange(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (form.website) {
      return;
    }

    setStatus('submitting');
    setFeedback('');
    trackEvent('diagnostic_submit_attempt', {
      project_type: form.tipoProyecto,
      need_type: form.tipoNecesidad,
    });

    try {
      const response = await fetch(siteMeta.formEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          name: form.nombre,
          company: form.empresa,
          email: form.email,
          project_type: form.tipoProyecto,
          need_type: form.tipoNecesidad,
          main_problem: form.problemaPrincipal,
          message: form.mensaje,
          _subject: `Nuevo diagnóstico desde ${siteMeta.name}`,
          _template: 'table',
          _captcha: 'false'
        })
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok || payload?.success === 'false') {
        throw new Error(payload?.message ?? 'No se pudo enviar el formulario');
      }

      setStatus('success');
      trackEvent('diagnostic_submit_success', {
        project_type: form.tipoProyecto,
        need_type: form.tipoNecesidad,
      });
      setFeedback('Mensaje recibido. Revisaremos tu caso y te responderemos en 24–48 h laborables.');
      setForm({
        ...initialState,
        problemaPrincipal: initialProblem,
        tipoProyecto: normalizedProjectType,
        tipoNecesidad: initialNeedType
      });
    } catch {
      setStatus('error');
      trackEvent('diagnostic_submit_error', {
        project_type: form.tipoProyecto,
        need_type: form.tipoNecesidad,
      });
      setFeedback('No hemos podido enviar el formulario ahora mismo. Escríbenos a hola@iavance.es y conserva este mismo contexto.');
    }
  }

  return (
    <div className="rounded-lg border border-zinc-800 bg-black/90 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.35)] md:p-7">
      <div className="mb-6">
        <p className="text-xs font-mono uppercase tracking-[0.24em] text-brand-400">Diagnóstico digital</p>
        <h3 className="mt-3 text-2xl font-semibold tracking-normal text-white">{title}</h3>
        <p className="mt-3 max-w-xl text-zinc-400">{description}</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(event) => handleChange('website', event.target.value)}
          className="hidden"
          name="website"
        />

        <div className={`grid gap-4 ${compact ? 'md:grid-cols-2' : 'md:grid-cols-2'}`}>
          <Field
            label="Nombre"
            required
            value={form.nombre}
            onChange={(value) => handleChange('nombre', value)}
            placeholder="Tu nombre"
          />
          <Field
            label="Empresa o web"
            required
            value={form.empresa}
            onChange={(value) => handleChange('empresa', value)}
            placeholder="Nombre de la empresa o web"
          />
        </div>

        <div className={`grid gap-4 ${compact ? 'md:grid-cols-2' : 'md:grid-cols-2'}`}>
          <Field
            label="Email"
            type="email"
            required
            value={form.email}
            onChange={(value) => handleChange('email', value)}
            placeholder="tu@empresa.com"
          />
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-zinc-300">Tipo de necesidad</span>
            <select
              value={form.tipoNecesidad}
              onChange={(event) => {
                handleChange('tipoNecesidad', event.target.value);
                if (!form.tipoProyecto) {
                  handleChange('tipoProyecto', event.target.value === 'Software interno' ? 'Software e integraciones' : 'Automatizaciones e IA aplicada');
                }
              }}
              required
              className="h-12 rounded-xl border border-zinc-800 bg-zinc-950 px-4 text-sm text-white outline-none transition focus:border-brand-500/40 focus:ring-2 focus:ring-brand-500/10"
            >
              <option value="">Selecciona una opcion</option>
              {needOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-zinc-300">Problema principal</span>
          <textarea
            required
            rows={3}
            value={form.problemaPrincipal}
            onChange={(event) => handleChange('problemaPrincipal', event.target.value)}
            placeholder="Qué tarea se repite, qué herramientas usáis y qué pasa cuando se retrasa."
            className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition focus:border-brand-500/40 focus:ring-2 focus:ring-brand-500/10"
          />
        </label>

        {!streamlined && (
          <>
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-zinc-300">Línea de trabajo</span>
              <select
                value={form.tipoProyecto}
                onChange={(event) => handleChange('tipoProyecto', event.target.value)}
                required
                className="h-12 rounded-xl border border-zinc-800 bg-zinc-950 px-4 text-sm text-white outline-none transition focus:border-brand-500/40 focus:ring-2 focus:ring-brand-500/10"
              >
                <option value="">Selecciona una opcion</option>
                {projectOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-zinc-300">Mensaje</span>
              <textarea
                required
                rows={compact ? 4 : 6}
                value={form.mensaje}
                onChange={(event) => handleChange('mensaje', event.target.value)}
                placeholder="Contexto, objetivos, herramientas actuales o cualquier dato útil"
                className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-sm text-white outline-none transition focus:border-brand-500/40 focus:ring-2 focus:ring-brand-500/10"
              />
            </label>
          </>
        )}

        <div className="flex flex-col gap-4 pt-2 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2 text-sm text-zinc-500">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>{siteMeta.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Instagram className="h-4 w-4" />
              <a className="transition hover:text-white" href={siteMeta.instagram} target="_blank" rel="noreferrer">
                @iavance.es
              </a>
            </div>
          </div>

          <div className="flex flex-col items-start gap-3 md:items-end">
            <Button as="button" type="submit" size="lg" className="min-w-[220px]">
              {status === 'submitting' ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Enviando
                </>
              ) : (
                <>
                  Solicitar diagnóstico
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
            {status === 'success' && (
              <p className="flex items-center gap-2 text-sm text-emerald-300">
                <CheckCircle2 className="h-4 w-4" />
                {feedback}
              </p>
            )}
            {status === 'error' && <p className="max-w-sm text-sm text-amber-300">{feedback}</p>}
          </div>
        </div>
        <div className="mt-4 text-xs text-zinc-500 text-center md:text-left">
          Respuesta en 24–48 h laborables. Sin spam. Si no vemos encaje, te lo diremos claro. Al enviar, aceptas la <a href="/privacidad" className="underline hover:text-white transition">política de privacidad</a>.
        </div>
      </form>
    </div>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
  type?: 'text' | 'email';
}

function Field({ label, value, onChange, placeholder, required = false, type = 'text' }: FieldProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-zinc-300">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-12 rounded-xl border border-zinc-800 bg-zinc-950 px-4 text-sm text-white outline-none transition focus:border-brand-500/40 focus:ring-2 focus:ring-brand-500/10"
      />
    </label>
  );
}
