import { FormEvent, useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Bot,
  ClipboardCheck,
  Database,
  FileSpreadsheet,
  Filter,
  Play,
  RefreshCw,
  Send,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

type Route = 'Ventas' | 'Soporte' | 'Facturacion' | 'Riesgo' | 'Nutricion';

type CsvRecord = {
  id: number;
  nombre: string;
  empresa: string;
  email: string;
  canal: string;
  mensaje: string;
  importe: number;
  route: Route;
  priority: number;
  reason: string;
  action: string;
};

type ChatMessage = {
  id: number;
  sender: 'user' | 'assistant';
  text: string;
};

const sampleCsv = `nombre,empresa,email,canal,mensaje,importe
Laura Gomez,Reformas Luna,laura@luna.es,web,"Necesito presupuesto urgente para automatizar seguimiento de clientes",8500
Carlos Ruiz,Taller Norte,carlos@norte.es,email,"Tengo 120 facturas pendientes por revisar y clasificar",4200
Marta Vidal,Clinica Senda,marta@senda.es,instagram,"Quiero una demo de chatbot para responder leads fuera de horario",6200
Ivan Soler,Distribuciones Soler,ivan@soler.es,csv,"Pedido duplicado y queja por error de stock en el ERP",1800
Nadia Perez,Hotel Mar,nadia@hotelmar.es,web,"Estoy comparando opciones, quizas mas adelante",900
Andres Mora,Obra10,andres@obra10.es,email,"Cancelacion de servicio y posible reclamacion por cargos",2500`;

const routeColor: Record<Route, string> = {
  Ventas: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  Soporte: 'bg-blue-500/10 text-blue-300 border-blue-500/20',
  Facturacion: 'bg-amber-500/10 text-amber-200 border-amber-500/20',
  Riesgo: 'bg-red-500/10 text-red-300 border-red-500/20',
  Nutricion: 'bg-zinc-500/10 text-zinc-300 border-zinc-500/20'
};

function splitCsvLine(line: string) {
  const cells: string[] = [];
  let current = '';
  let insideQuotes = false;

  for (const char of line) {
    if (char === '"') {
      insideQuotes = !insideQuotes;
      continue;
    }

    if (char === ',' && !insideQuotes) {
      cells.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  cells.push(current.trim());
  return cells;
}

function classifyRecord(row: Record<string, string>, id: number): CsvRecord {
  const message = row.mensaje ?? row.message ?? row.descripcion ?? '';
  const normalizedText = `${message} ${row.canal ?? ''}`.toLowerCase();
  const amount = Number(String(row.importe ?? row.valor ?? row.budget ?? '0').replace(/[^\d.]/g, '')) || 0;

  let route: Route = 'Nutricion';
  let priority = 35;
  let reason = 'No hay urgencia clara';
  let action = 'Añadir a secuencia de seguimiento';

  if (/cancel|reclam|queja|error|duplicado|fallo|riesgo/.test(normalizedText)) {
    route = 'Riesgo';
    priority = 92;
    reason = 'Riesgo de churn, queja o incidencia sensible';
    action = 'Crear alerta para responsable y abrir ticket prioritario';
  } else if (/factur|cobro|pago|cargo|invoice/.test(normalizedText)) {
    route = 'Facturacion';
    priority = 74;
    reason = 'Tema administrativo con posible impacto económico';
    action = 'Enviar a administración y preparar resumen de facturas';
  } else if (/urgente|presupuesto|demo|comprar|automatizar|proyecto/.test(normalizedText)) {
    route = 'Ventas';
    priority = 68;
    reason = 'Interés comercial con intención activa';
    action = 'Crear oportunidad en CRM y asignar llamada';
  } else if (/soporte|ayuda|problema|stock|erp/.test(normalizedText)) {
    route = 'Soporte';
    priority = 62;
    reason = 'Solicitud operativa o técnica';
    action = 'Abrir ticket y pedir contexto adicional';
  }

  if (amount >= 5000) {
    priority += 12;
    reason += ' + importe alto';
  }

  if (/urgente|hoy|ahora/.test(normalizedText)) {
    priority += 10;
  }

  return {
    id,
    nombre: row.nombre ?? row.name ?? `Registro ${id}`,
    empresa: row.empresa ?? row.company ?? 'Sin empresa',
    email: row.email ?? row.correo ?? 'sin-email',
    canal: row.canal ?? row.source ?? 'csv',
    mensaje: message,
    importe: amount,
    route,
    priority: Math.min(100, priority),
    reason,
    action
  };
}

function parseCsv(input: string) {
  const lines = input
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) {
    return [];
  }

  const headers = splitCsvLine(lines[0]).map((header) => header.toLowerCase());

  return lines.slice(1).map((line, index) => {
    const cells = splitCsvLine(line);
    const row = headers.reduce<Record<string, string>>((acc, header, cellIndex) => {
      acc[header] = cells[cellIndex] ?? '';
      return acc;
    }, {});

    return classifyRecord(row, index + 1);
  });
}

function answerQuestion(question: string, records: CsvRecord[]) {
  const normalizedQuestion = question.toLowerCase();
  const urgent = records.filter((record) => record.priority >= 80);
  const sales = records.filter((record) => record.route === 'Ventas');
  const risk = records.filter((record) => record.route === 'Riesgo');
  const billing = records.filter((record) => record.route === 'Facturacion');
  const totalValue = records.reduce((sum, record) => sum + record.importe, 0);

  if (records.length === 0) {
    return 'Primero procesa un CSV. Después podré resumir prioridades, rutas y acciones.';
  }

  if (/urgent|urgente|prioridad|prioritarios/.test(normalizedQuestion)) {
    return urgent.length
      ? `Hay ${urgent.length} registros urgentes: ${urgent.map((record) => `${record.nombre} (${record.route})`).join(', ')}.`
      : 'No hay registros por encima de prioridad 80. Revisaría primero ventas con importe alto.';
  }

  if (/venta|lead|comercial|oportunidad/.test(normalizedQuestion)) {
    return sales.length
      ? `Ventas debería mirar ${sales.length} oportunidades: ${sales.map((record) => `${record.empresa} ${record.importe ? `(${record.importe}€)` : ''}`).join(', ')}.`
      : 'No detecto oportunidades comerciales claras en este CSV.';
  }

  if (/riesgo|queja|cancel|reclam/.test(normalizedQuestion)) {
    return risk.length
      ? `Riesgo tiene ${risk.length} caso(s). El más sensible es ${risk[0].empresa}: ${risk[0].reason}.`
      : 'No hay señales fuertes de riesgo, queja o cancelación.';
  }

  if (/factur|cobro|pago/.test(normalizedQuestion)) {
    return billing.length
      ? `Facturación recibe ${billing.length} registro(s). Acción recomendada: validar importes y preparar resumen para administración.`
      : 'No veo registros de facturación en este lote.';
  }

  return `Resumen: ${records.length} registros procesados, ${sales.length} a ventas, ${risk.length} a riesgo, ${billing.length} a facturación y valor estimado de ${totalValue.toLocaleString('es-ES')}€.`;
}

export function CsvOpsClassifier() {
  const [csvInput, setCsvInput] = useState(sampleCsv);
  const [records, setRecords] = useState<CsvRecord[]>(() => parseCsv(sampleCsv));
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      sender: 'assistant',
      text: 'CSV procesado. Pregúntame por urgentes, ventas, riesgos, facturación o resumen.'
    }
  ]);

  const stats = useMemo(() => {
    const urgent = records.filter((record) => record.priority >= 80).length;
    const totalValue = records.reduce((sum, record) => sum + record.importe, 0);
    const routes = records.reduce<Record<Route, number>>(
      (acc, record) => {
        acc[record.route] += 1;
        return acc;
      },
      { Ventas: 0, Soporte: 0, Facturacion: 0, Riesgo: 0, Nutricion: 0 }
    );

    return { urgent, totalValue, routes };
  }, [records]);

  function processCsv() {
    const parsedRecords = parseCsv(csvInput);
    setRecords(parsedRecords);
    setMessages([
      {
        id: Date.now(),
        sender: 'assistant',
        text: parsedRecords.length
          ? `He procesado ${parsedRecords.length} filas y las he convertido en rutas operativas.`
          : 'No he encontrado filas suficientes. Necesito cabecera y al menos una línea de datos.'
      }
    ]);
  }

  function askAssistant(question: string) {
    const answer = answerQuestion(question, records);
    setMessages((current) => [
      ...current,
      { id: current.length + 1, sender: 'user', text: question },
      { id: current.length + 2, sender: 'assistant', text: answer }
    ]);
  }

  function handleChatSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedInput = chatInput.trim();

    if (!trimmedInput) {
      return;
    }

    askAssistant(trimmedInput);
    setChatInput('');
  }

  function resetDemo() {
    setCsvInput(sampleCsv);
    const parsedRecords = parseCsv(sampleCsv);
    setRecords(parsedRecords);
    setMessages([
      {
        id: 1,
        sender: 'assistant',
        text: 'CSV de ejemplo restaurado y procesado.'
      }
    ]);
  }

  return (
    <div className="min-h-screen bg-[#070707] text-zinc-100">
      <main className="mx-auto grid min-h-screen w-full max-w-7xl gap-5 px-4 py-5 xl:grid-cols-[390px_1fr_340px]">
        <aside className="flex min-h-[620px] flex-col rounded-lg border border-zinc-800 bg-black">
          <div className="border-b border-zinc-800 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.18em] text-zinc-500">Demo CSV automation</p>
                <h1 className="mt-2 text-2xl font-semibold text-white">Clasificador operativo de CSV</h1>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-cyan-500/10 text-cyan-300">
                <FileSpreadsheet className="h-5 w-5" />
              </span>
            </div>
            <p className="mt-4 text-sm leading-6 text-zinc-400">
              Pega datos de leads, incidencias o solicitudes. El sistema clasifica, prioriza y propone acciones.
            </p>
          </div>

          <div className="flex-1 p-4">
            <textarea
              value={csvInput}
              onChange={(event) => setCsvInput(event.target.value)}
              spellCheck={false}
              className="h-full min-h-[420px] w-full resize-none rounded-md border border-zinc-800 bg-zinc-950 p-3 font-mono text-xs leading-6 text-zinc-200 outline-none transition focus:border-cyan-500/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 border-t border-zinc-800 p-4">
            <button
              type="button"
              onClick={processCsv}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-cyan-400 px-4 py-3 text-sm font-semibold text-black transition hover:bg-cyan-300"
            >
              <Play className="h-4 w-4" />
              Procesar
            </button>
            <button
              type="button"
              onClick={resetDemo}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-zinc-800 px-4 py-3 text-sm text-zinc-300 transition hover:border-zinc-600 hover:text-white"
            >
              <RefreshCw className="h-4 w-4" />
              Reset
            </button>
          </div>
        </aside>

        <section className="grid gap-5">
          <div className="grid gap-4 md:grid-cols-3">
            <Metric label="Filas procesadas" value={String(records.length)} />
            <Metric label="Prioridad alta" value={String(stats.urgent)} tone={stats.urgent > 0 ? 'warning' : 'default'} />
            <Metric label="Valor detectado" value={`${stats.totalValue.toLocaleString('es-ES')}€`} />
          </div>

          <div className="rounded-lg border border-zinc-800 bg-black">
            <div className="flex flex-col gap-4 border-b border-zinc-800 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.18em] text-zinc-500">Resultado</p>
                <h2 className="mt-2 text-xl font-semibold text-white">Registros clasificados y enrutados</h2>
              </div>
              <a
                href="/contacto?service=automatizaciones-e-ia&problem=Quiero%20clasificar%20CSVs%20o%20datos%20automaticamente"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
              >
                Automatizar mis datos
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead className="border-b border-zinc-800 text-xs uppercase tracking-[0.14em] text-zinc-500">
                  <tr>
                    <th className="px-4 py-3">Lead</th>
                    <th className="px-4 py-3">Canal</th>
                    <th className="px-4 py-3">Ruta</th>
                    <th className="px-4 py-3">Prioridad</th>
                    <th className="px-4 py-3">Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <tr key={record.id} className="border-b border-zinc-900 last:border-0">
                      <td className="px-4 py-4">
                        <p className="font-medium text-white">{record.nombre}</p>
                        <p className="text-xs text-zinc-500">{record.empresa}</p>
                      </td>
                      <td className="px-4 py-4 text-zinc-300">{record.canal}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex rounded-md border px-2 py-1 text-xs ${routeColor[record.route]}`}>
                          {record.route}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <span className="w-9 text-sm font-semibold text-white">{record.priority}</span>
                          <div className="h-2 w-24 overflow-hidden rounded-full bg-zinc-900">
                            <div
                              className={`h-full rounded-full ${
                                record.priority >= 80 ? 'bg-red-400' : record.priority >= 65 ? 'bg-amber-300' : 'bg-cyan-300'
                              }`}
                              style={{ width: `${record.priority}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <p className="max-w-xs text-xs leading-5 text-zinc-400">{record.action}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-5">
            {Object.entries(stats.routes).map(([route, count]) => (
              <div key={route} className="rounded-lg border border-zinc-800 bg-black p-4">
                <p className="text-xs text-zinc-500">{route}</p>
                <p className="mt-2 text-2xl font-semibold text-white">{count}</p>
              </div>
            ))}
          </div>
        </section>

        <aside className="grid gap-5">
          <div className="rounded-lg border border-zinc-800 bg-black p-4">
            <div className="flex items-center gap-2">
              <Bot className="h-4 w-4 text-cyan-300" />
              <p className="text-xs font-mono uppercase tracking-[0.18em] text-zinc-500">Asistente</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {['Resumen', 'Urgentes', 'Ventas', 'Riesgos', 'Facturación'].map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => askAssistant(question)}
                  className="rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-zinc-300 transition hover:border-cyan-500/40 hover:text-white"
                >
                  {question}
                </button>
              ))}
            </div>

            <div className="mt-4 max-h-[390px] space-y-3 overflow-y-auto pr-1">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`rounded-md px-3 py-2 text-sm leading-6 ${
                    message.sender === 'assistant'
                      ? 'bg-cyan-500/10 text-cyan-50 ring-1 ring-cyan-500/15'
                      : 'bg-zinc-900 text-zinc-200'
                  }`}
                >
                  {message.text}
                </div>
              ))}
            </div>

            <form onSubmit={handleChatSubmit} className="mt-4 flex gap-2">
              <input
                value={chatInput}
                onChange={(event) => setChatInput(event.target.value)}
                placeholder="Pregunta por los datos"
                className="h-11 min-w-0 flex-1 rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-white outline-none transition focus:border-cyan-500/50"
              />
              <button
                type="submit"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-cyan-400 text-black transition hover:bg-cyan-300"
                aria-label="Preguntar"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>

          <div className="rounded-lg border border-zinc-800 bg-black p-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-zinc-500" />
              <p className="text-xs font-mono uppercase tracking-[0.18em] text-zinc-500">Motor de reglas</p>
            </div>
            <div className="mt-4 space-y-3 text-sm text-zinc-300">
              <Rule icon={Sparkles} text="Detecta intención comercial y manda a ventas." />
              <Rule icon={ShieldAlert} text="Identifica quejas, cancelaciones y riesgo." />
              <Rule icon={Database} text="Separa facturación, soporte y nutrición." />
              <Rule icon={ClipboardCheck} text="Propone la siguiente acción por fila." />
              <Rule icon={AlertTriangle} text="Eleva prioridad por urgencia o importe." />
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
}

function Metric({ label, value, tone = 'default' }: { label: string; value: string; tone?: 'default' | 'warning' }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-black p-4">
      <p className="text-xs font-mono uppercase tracking-[0.18em] text-zinc-500">{label}</p>
      <p className={`mt-2 text-3xl font-semibold ${tone === 'warning' ? 'text-amber-200' : 'text-white'}`}>
        {value}
      </p>
    </div>
  );
}

function Rule({ icon: Icon, text }: { icon: React.ComponentType<{ className?: string }>; text: string }) {
  return (
    <div className="flex gap-3 rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-cyan-300" />
      <span>{text}</span>
    </div>
  );
}
