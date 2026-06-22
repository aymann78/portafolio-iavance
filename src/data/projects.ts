export type ProofType = 'demo' | 'concept' | 'strategic-build';

export interface CapabilityBuild {
  id: string;
  slug: string;
  title: string;
  category: string;
  visibility?: 'public' | 'legacy';
  proofType: ProofType;
  shortDescription: string;
  fullDescription: string;
  problem: string;
  solution: string;
  expectedImpact: string;
  objective: string;
  idealClient: string;
  clientLabel: string;
  year: string;
  stack: string[];
  tags: string[];
  demoUrl?: string;
  ctaLabel?: string;
  ctaHref?: string;
  howItWasMade?: {
    businessGoal: string;
    strategicFocus: string;
    frontendDecisions: string;
    uxUiDecisions: string;
    technicalChallenges: string;
  };
}

export const capabilityBuilds: CapabilityBuild[] = [
  {
    id: '1',
    slug: 'b2b-autoflow',
    title: 'B2B Autoflow ERP',
    category: 'ERP / Operaciones B2B',
    proofType: 'strategic-build',
    shortDescription:
      'Mini-ERP comercial para pedidos, crédito, stock, aprobaciones e integraciones en operaciones B2B.',
    fullDescription:
      'Demo principal de iavance para enseñar cómo una operación B2B puede pasar de pedidos por correo, stock en hojas y validaciones manuales a un sistema unificado con control operativo visible.',
    problem:
      'El equipo comercial y de operaciones pierde tiempo gestionando pedidos por canales dispersos, validaciones manuales y bloqueos de crédito sin contexto claro.',
    solution:
      'Un mini-ERP con portal B2B, cola de pedidos, stock conectado, aprobaciones y sincronización con ERP, CRM y logística.',
    expectedImpact:
      'Reduce fricción operativa, hace visibles los cuellos de botella y prepara la operación para crecer sin multiplicar trabajo manual.',
    objective:
      'Demostrar cómo sería una primera capa de producto interno para empresas distribuidoras o industriales con caos operativo creciente.',
    idealClient:
      'Distribución, industria ligera y operaciones B2B con clientes recurrentes y alta dependencia de procesos manuales.',
    clientLabel: 'Caso de uso estrategico',
    year: '2026',
    stack: ['React', 'TypeScript', 'TailwindCSS', 'Vite'],
    tags: ['B2B', 'Portal', 'Integraciones', 'Operaciones'],
    demoUrl: '/demo/b2b-saas-platform',
    ctaLabel: 'Pedir diagnostico para operaciones',
    ctaHref: '/contacto?service=software-e-integraciones&problem=Necesito%20ordenar%20mi%20operativa%20B2B',
    howItWasMade: {
      businessGoal:
        'Traducir un problema operativo real a una experiencia que enseñe producto interno, trazabilidad y control sin depender de un backend visible en esta demo.',
      strategicFocus:
        'Se priorizó que cada acción tenga una consecuencia visible para que el visitante entienda el valor del sistema antes que sus detalles técnicos.',
      frontendDecisions:
        'La demo usa una SPA con múltiples estados conectados, paneles reutilizables y narrativa visual de producto para parecer un mini-SaaS creíble.',
      uxUiDecisions:
        'El lenguaje visual se acerca más a un SaaS premium que a un panel neutro: señales de estado claras, color útil y jerarquía más ejecutiva.',
      technicalChallenges:
        'El reto principal fue mostrar profundidad operativa sin convertir la demo en una interfaz confusa. Se resolvió separando módulos, cola de acciones y panel ejecutivo.'
    }
  },
  {
    id: '2',
    slug: 'lead-to-ops',
    title: 'Lead-to-Ops Command Center',
    category: 'Automatizacion operativa',
    proofType: 'demo',
    shortDescription:
      'Demo unificada donde entran leads, correos, incidencias y CSVs, y el sistema clasifica, enruta y genera acciones visibles.',
    fullDescription:
      'Demo comercial pensada para enseñar una automatización operativa de verdad: entran señales dispersas, el sistema las interpreta, decide la ruta y deja el negocio en un estado más claro.',
    problem:
      'Leads, correos, formularios y CSVs llegan por canales distintos, se revisan a mano y nadie sabe con claridad qué hacer primero.',
    solution:
      'Un centro de automatización que clasifica entradas, puntúa prioridad, propone acciones y sincroniza resultado con CRM, soporte u operaciones.',
    expectedImpact:
      'Reduce revisión manual, acelera respuesta y convierte señales dispersas en acciones operativas visibles para el equipo.',
    objective:
      'Mostrar cómo una empresa puede pasar de caos de entrada a control de operaciones con una primera capa de automatización bien planteada.',
    idealClient:
      'Equipos comerciales, operaciones, soporte o administración que trabajan con formularios, correos, hojas o datos repartidos.',
    clientLabel: 'Demo interactiva',
    year: '2026',
    stack: ['React', 'TypeScript', 'Rules Engine', 'UI State'],
    tags: ['Automatizacion', 'Clasificacion', 'CRM', 'Operaciones'],
    demoUrl: '/demo/lead-to-ops',
    ctaLabel: 'Pedir mapa de automatizacion',
    ctaHref: '/contacto?service=automatizaciones-e-ia&problem=Mi%20equipo%20pierde%20tiempo%20ordenando%20entradas%20y%20datos',
    howItWasMade: {
      businessGoal:
        'Enseñar una automatización que cualquier visitante entienda sin tener que imaginar el beneficio por su cuenta.',
      strategicFocus:
        'La demo se construye alrededor del antes/despues: qué entra, qué decide el sistema y qué acción útil sale de ahí.',
      frontendDecisions:
        'Se mezclan conversación, tabla, clasificación, score y outputs operativos para que el valor sea visible desde varios ángulos.',
      uxUiDecisions:
        'La interfaz no busca parecer un juguete técnico; busca parecer una mesa de control donde el usuario entiende qué gana en pocos segundos.',
      technicalChallenges:
        'El reto principal fue combinar varias entradas y varias salidas sin confundir. La solución fue narrar la automatización por etapas.'
    }
  },
  {
    id: 'legacy-vaultpay',
    slug: 'vaultpay-cro',
    title: 'VaultPay CRO Landing',
    category: 'Webs de conversion',
    visibility: 'legacy',
    proofType: 'demo',
    shortDescription:
      'Legacy demo de landing CRO conservada solo por compatibilidad con rutas antiguas.',
    fullDescription:
      'Pieza legacy conservada como referencia técnica. No forma parte del recorrido comercial principal actual de iavance.es.',
    problem:
      'Muchas webs reciben visitas pero no convierten porque mezclan mensajes, tardan en cargar o no ordenan bien las objeciones del usuario.',
    solution:
      'Una landing construida con mentalidad CRO: promesa clara, recorrido guiado, prueba visual, objeciones cubiertas y CTAs visibles desde el primer scroll.',
    expectedImpact:
      'Sirve como referencia de un enfoque CRO, pero ya no es la mejor pieza para explicar la oferta principal actual.',
    objective:
      'Mantener compatibilidad con rutas antiguas sin usarla como demo principal.',
    idealClient:
      'Servicios B2B, SaaS, producto digital y empresas que invierten en tráfico o necesitan una mejor primera impresión comercial.',
    clientLabel: 'Legacy demo',
    year: '2026',
    stack: ['React', 'TypeScript', 'TailwindCSS', 'CSS nativo'],
    tags: ['CRO', 'Landing', 'Legacy'],
    demoUrl: '/demo/fintech-cro-landing',
    ctaLabel: 'Hablar de conversion',
    ctaHref: '/contacto?service=webs-de-conversion&problem=Mi%20web%20no%20convierte',
    howItWasMade: {
      businessGoal:
        'Demostrar una landing de conversion como experimento anterior dentro del portfolio.',
      strategicFocus:
        'Cada bloque responde a una duda del visitante: qué es, por qué importa, si puedo confiar y qué tengo que hacer ahora.',
      frontendDecisions:
        'Se priorizó una estructura ligera, animaciones suaves y componentes sencillos para reforzar rendimiento y legibilidad.',
      uxUiDecisions:
        'La demo usa un lenguaje más claro y luminoso que el sitio corporativo.',
      technicalChallenges:
        'El equilibrio estaba en mantener riqueza visual sin penalizar la carga.'
    }
  }
];

export const publicCapabilityBuilds = capabilityBuilds.filter((build) => build.visibility !== 'legacy');

const buildSlugAliases: Record<string, string> = {
  'ecommerce-automation': 'b2b-autoflow',
  'fintech-cro-landing': 'vaultpay-cro',
  'real-estate-scraper': 'lead-to-ops',
  'market-signal-engine': 'lead-to-ops',
  'automation-chatbot': 'lead-to-ops',
  'csv-ops-classifier': 'lead-to-ops'
};

export function findCapabilityBuild(slug?: string) {
  if (!slug) {
    return undefined;
  }

  const resolvedSlug = buildSlugAliases[slug] ?? slug;
  return capabilityBuilds.find((build) => build.slug === resolvedSlug);
}
