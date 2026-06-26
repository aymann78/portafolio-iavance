import { ScenarioId, Scenario } from '../types';
import { scenarios } from '../constants';

export function Sidebar({
  scenarioId,
  scenario,
  switchScenario,
}: {
  scenarioId: ScenarioId;
  scenario: Scenario;
  switchScenario: (id: ScenarioId) => void;
}) {
  return (
    <aside className="overflow-hidden rounded-[30px] border border-zinc-800 bg-[#0d1215]">
      <div className="border-b border-zinc-800 px-5 py-5">
        <p className="text-xs font-mono uppercase tracking-[0.24em] text-cyan-300">Automatización operativa</p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight text-white">Lead-to-Ops</h1>
        <p className="mt-3 text-sm leading-7 text-[#97a9ad]">
          Una sola demo para entender que entra, que decide el sistema y que sale hacia ventas, soporte o finanzas.
        </p>
      </div>

      <div className="space-y-3 px-4 py-4">
        {scenarios.map((item) => {
          const active = item.id === scenarioId;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => switchScenario(item.id)}
              className={`w-full rounded-md border p-4 text-left transition ${
                active
                  ? 'border-cyan-300/30 bg-cyan-400/10'
                  : 'border-zinc-800 bg-zinc-950 hover:border-cyan-300/20 hover:bg-white/[0.04]'
              }`}
            >
              <p className="text-lg font-semibold text-white">{item.title}</p>
              <p className="mt-2 text-sm leading-6 text-[#9ab0b4]">{item.subtitle}</p>
            </button>
          );
        })}
      </div>

      <div className="border-t border-zinc-800 px-4 py-4">
        <p className="text-xs font-mono uppercase tracking-[0.24em] text-[#708488]">Input realista simulado</p>
        <pre className="mt-3 whitespace-pre-wrap rounded-md border border-zinc-800 bg-zinc-950 p-4 text-xs leading-6 text-[#d8e4e6]">
          {scenario.sampleInput}
        </pre>
        <div className="mt-4 rounded-md border border-amber-500/20 bg-amber-500/10 p-4 text-amber-200">
          <p className="text-xs font-mono uppercase tracking-[0.18em] text-amber-400">Demo conceptual</p>
          <p className="mt-2 text-sm leading-6 text-amber-200/80">
            Esta interfaz ilustra un flujo operativo automatizado. En un entorno real, las entradas se conectarían a tu email o formularios, y los datos se enviarían a tu CRM.
          </p>
        </div>
        <div className="mt-4">
          <a
            href="/contacto?service=automatizaciones-e-ia"
            className="flex w-full items-center justify-center gap-2 rounded-md bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
          >
            Diagnosticar automatización
          </a>
        </div>
      </div>
    </aside>
  );
}
