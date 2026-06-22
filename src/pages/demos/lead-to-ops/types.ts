export type ScenarioId = 'leads' | 'incidents' | 'csv';
export type Destination = 'Ventas' | 'Soporte' | 'Finanzas' | 'Operaciones';
export type RunStatus = 'idle' | 'processing' | 'done';

export type InputItem = {
  id: string;
  source: string;
  company: string;
  contact: string;
  payload: string;
  amount?: number;
  priority: 'Alta' | 'Media' | 'Baja';
  destination: Destination;
  action: string;
  intent: string;
};

export type Scenario = {
  id: ScenarioId;
  title: string;
  subtitle: string;
  problem: string;
  inputLabel: string;
  outputLabel: string;
  impact: string;
  assistantPrompt: string;
  sampleInput: string;
  items: InputItem[];
};

export type ActivityItem = {
  id: string;
  title: string;
  meta: string;
  tone: 'neutral' | 'info' | 'success';
};
