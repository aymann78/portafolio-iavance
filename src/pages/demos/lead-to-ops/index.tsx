import { useLeadToOpsState } from './useLeadToOpsState';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ProcessPanel } from './components/ProcessPanel';
import { BusinessSummaryPanel, LiveRunSidebar } from './components/OutputPanel';

export function LeadToOpsCommandCenter() {
  const { state, computed, actions } = useLeadToOpsState();

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#090b0d] text-[#eef5f5]">
      <div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_18%_6%,rgba(0,245,255,0.12),transparent_30%),radial-gradient(circle_at_80%_2%,rgba(16,185,129,0.10),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.03),transparent)]" />
      <main className="relative mx-auto grid w-full max-w-[1580px] gap-4 px-4 py-4 xl:grid-cols-[260px_minmax(0,1fr)_340px]">
        
        {/* Left Sidebar */}
        <Sidebar
          scenarioId={state.scenarioId}
          scenario={computed.scenario}
          switchScenario={actions.switchScenario}
        />

        {/* Center Area */}
        <section className="min-w-0 space-y-4">
          <Header
            scenario={computed.scenario}
            metrics={computed.metrics}
            runAutomation={actions.runAutomation}
            resetDemo={actions.resetDemo}
          />

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.18fr)_minmax(320px,0.82fr)]">
            <div className="min-w-0 space-y-4">
              <ProcessPanel
                scenario={computed.scenario}
                selectedItem={computed.selectedItem}
                selectedItemId={state.selectedItemId}
                activeStageIndex={state.activeStageIndex}
                runStatus={state.runStatus}
                selectItem={actions.selectItem}
              />
            </div>

            {/* Inner Right Sidebar (Business Summary) */}
            <BusinessSummaryPanel
              scenario={computed.scenario}
              selectedItem={computed.selectedItem}
              metrics={computed.metrics}
              runStatus={state.runStatus}
            />
          </div>
        </section>

        {/* Global Right Sidebar (Live Run) */}
        <LiveRunSidebar
          scenario={computed.scenario}
          selectedItem={computed.selectedItem}
          activity={state.activity}
        />
        
      </main>
    </div>
  );
}
