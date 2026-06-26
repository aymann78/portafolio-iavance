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
    <aside className="overflow-hidden rounded-[30px] border border-white/8 bg-[#0d1215]">
      <div className="border-b border-white/8 px-5 py-5">
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
              className={`w-full rounded-2xl border p-4 text-left transition ${
                active
                  ? 'border-cyan-300/30 bg-cyan-400/10'
                  : 'border-white/8 bg-[#0b1013] hover:border-cyan-300/20 hover:bg-white/[0.04]'
              }`}
            >
              <p className="text-lg font-semibold text-white">{item.title}</p>
              <p className="mt-2 text-sm leading-6 text-[#9ab0b4]">{item.subtitle}</p>
            </button>
          );
        })}
      </div>

      <div className="border-t border-white/8 px-4 py-4">
        <p className="text-xs font-mono uppercase tracking-[0.24em] text-[#708488]">Input realista</p>
        <pre className="mt-3 whitespace-pre-wrap rounded-2xl border border-white/8 bg-[#0b1013] p-4 text-xs leading-6 text-[#d8e4e6]">
          {scenario.sampleInput}
        </pre>
        <div className="mt-3 rounded-2xl border border-white/8 bg-[#0b1013] p-4">
          <p className="text-xs font-mono uppercase tracking-[0.18em] text-[#708488]">Tecnologia a medida</p>
          <p className="mt-2 text-sm leading-6 text-[#a9bbbf]">
            No hacemos solo automatización: también producto digital, portales, paneles, integraciones, IA y software a medida.
          </p>
        </div>
      </div>
    </aside>
  );
}
