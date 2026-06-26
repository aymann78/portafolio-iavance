import { useState, useMemo, useEffect, startTransition } from 'react';
import { trackEvent } from '../../../lib/analytics';
import { ScenarioId, RunStatus, ActivityItem, InputItem } from './types';
import { scenarios, stageCopy } from './constants';

function stageMessage(stageIndex: number, item: InputItem) {
  if (stageIndex === 1) {
    return `Intento detectado: ${item.intent}`;
  }
  if (stageIndex === 2) {
    return `Ruta asignada a ${item.destination.toLowerCase()}`;
  }
  return `Salida preparada: ${item.action}`;
}

export function useLeadToOpsState() {
  const [scenarioId, setScenarioId] = useState<ScenarioId>('leads');
  const [selectedItemId, setSelectedItemId] = useState('lead-1');
  const [runStatus, setRunStatus] = useState<RunStatus>('idle');
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [activity, setActivity] = useState<ActivityItem[]>([
    { id: 'activity-1', title: 'Flujo listo para clasificar entradas.', meta: 'Motor de automatización', tone: 'info' },
    { id: 'activity-2', title: 'Plantillas de salida preparadas para CRM y equipo.', meta: 'Salida visible', tone: 'neutral' },
    { id: 'activity-3', title: 'Reglas de prioridad cargadas por destino y urgencia.', meta: 'Decisión engine', tone: 'neutral' },
  ]);

  const scenario = scenarios.find((item) => item.id === scenarioId) ?? scenarios[0];
  const selectedItem = scenario.items.find((item) => item.id === selectedItemId) ?? scenario.items[0];

  const metrics = useMemo(() => {
    const highPriority = scenario.items.filter((item) => item.priority === 'Alta').length;
    const routedToSales = scenario.items.filter((item) => item.destination === 'Ventas').length;
    const estimatedValue = scenario.items.reduce((sum, item) => sum + (item.amount ?? 0), 0);

    return {
      incoming: scenario.items.length,
      highPriority,
      routedToSales,
      estimatedValue,
    };
  }, [scenario]);

  useEffect(() => {
    trackEvent('demo_open', { demo: 'lead_to_ops' });
  }, []);

  useEffect(() => {
    if (runStatus !== 'processing') {
      return undefined;
    }

    if (activeStageIndex >= stageCopy.length - 1) {
      setRunStatus('done');
      setActivity((current) => [
        {
          id: `done-${Date.now()}`,
          title: `Salida creada para ${selectedItem.company}`,
          meta: `${selectedItem.destination} · ${selectedItem.action}`,
          tone: 'success' as const,
        },
        ...current,
      ].slice(0, 8));
      return undefined;
    }

    const nextStage = activeStageIndex + 1;
    const timer = window.setTimeout(() => {
      setActiveStageIndex(nextStage);
      setActivity((current) => [
        {
          id: `${scenario.id}-${nextStage}-${Date.now()}`,
          title: stageMessage(nextStage, selectedItem),
          meta: stageCopy[nextStage].label,
          tone: (nextStage === stageCopy.length - 1 ? 'success' : 'info') as ActivityItem['tone'],
        },
        ...current,
      ].slice(0, 8));
    }, 700);

    return () => window.clearTimeout(timer);
  }, [activeStageIndex, runStatus, scenario.id, selectedItem]);

  function switchScenario(nextScenarioId: ScenarioId) {
    startTransition(() => {
      const nextScenario = scenarios.find((item) => item.id === nextScenarioId) ?? scenarios[0];
      setScenarioId(nextScenarioId);
      setSelectedItemId(nextScenario.items[0]?.id ?? '');
      setRunStatus('idle');
      setActiveStageIndex(0);
      setActivity([
        {
          id: `scenario-${nextScenarioId}-1`,
          title: `Escenario cargado: ${nextScenario.title}`,
          meta: nextScenario.inputLabel,
          tone: 'info',
        },
        {
          id: `scenario-${nextScenarioId}-2`,
          title: 'Flujo listo para clasificar y enrutar.',
          meta: 'Motor de automatización',
          tone: 'neutral',
        },
        {
          id: `scenario-${nextScenarioId}-3`,
          title: 'La salida se enviara al equipo correcto con contexto.',
          meta: nextScenario.outputLabel,
          tone: 'neutral',
        },
      ]);
    });

    trackEvent('demo_module_change', { demo: 'lead_to_ops', scenario: nextScenarioId });
  }

  function selectItem(itemId: string) {
    setSelectedItemId(itemId);
    setRunStatus('idle');
    setActiveStageIndex(0);
    setActivity((current) => [
      {
        id: `select-${itemId}-${Date.now()}`,
        title: `Entrada abierta: ${itemId}`,
        meta: 'Contexto listo para decisión',
        tone: 'info' as const,
      },
      ...current,
    ].slice(0, 8));
    trackEvent('demo_action_triggered', { demo: 'lead_to_ops', action: 'select_item', item: itemId });
  }

  function runAutomation() {
    setRunStatus('processing');
    setActiveStageIndex(0);
    setActivity([
      {
        id: `run-start-${Date.now()}`,
        title: `Entrada normalizada desde ${selectedItem.source}`,
        meta: stageCopy[0].label,
        tone: 'info' as const,
      },
      {
        id: `run-ready-${Date.now() + 1}`,
        title: `Preparando salida para ${selectedItem.destination.toLowerCase()}`,
        meta: 'Proceso visible',
        tone: 'neutral' as const,
      },
      ...activity,
    ].slice(0, 8));
    trackEvent('demo_action_triggered', { demo: 'lead_to_ops', action: 'run_automation', scenario: scenarioId });
  }

  function resetDemo() {
    setScenarioId('leads');
    setSelectedItemId(scenarios[0].items[0].id);
    setRunStatus('idle');
    setActiveStageIndex(0);
    setActivity([
      { id: 'activity-1', title: 'Flujo listo para clasificar entradas.', meta: 'Motor de automatización', tone: 'info' },
      { id: 'activity-2', title: 'Plantillas de salida preparadas para CRM y equipo.', meta: 'Salida visible', tone: 'neutral' },
      { id: 'activity-3', title: 'Reglas de prioridad cargadas por destino y urgencia.', meta: 'Decisión engine', tone: 'neutral' },
    ]);
    trackEvent('demo_action_triggered', { demo: 'lead_to_ops', action: 'reset' });
  }

  return {
    state: {
      scenarioId,
      selectedItemId,
      runStatus,
      activeStageIndex,
      activity,
    },
    computed: {
      scenario,
      selectedItem,
      metrics,
    },
    actions: {
      switchScenario,
      selectItem,
      runAutomation,
      resetDemo,
    },
  };
}
