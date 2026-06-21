export type ProofType = 'demo' | 'concept' | 'strategic-build';

export interface CapabilityBuild {
  id: string;
  slug: string;
  title: string;
  category: string;
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
    title: 'B2B Autoflow',
    category: 'Software e integraciones',
    proofType: 'strategic-build',
    shortDescription:
      'Portal de pedidos y capa de sincronización pensados para operaciones B2B con catálogo, stock y procesos internos lentos.',
    fullDescription:
      'Build estratégico que muestra cómo centralizar pedidos, estados y sincronización operativa en una sola experiencia. La pieza no vende una interfaz bonita; demuestra cómo digitalizar una operación repetitiva sin depender de correos, llamadas ni hojas de cálculo.',
    problem:
      'El equipo comercial y de operaciones pierde tiempo gestionando pedidos por canales dispersos, con validaciones manuales y poco control del estado real.',
    solution:
      'Un portal B2B conectado a inventario y reglas de negocio, con autoservicio para cliente, estado de pedido visible y una capa preparada para integrarse con ERP o CRM.',
    expectedImpact:
      'Reduce fricción operativa, acorta tiempos de procesamiento y prepara la operación para crecer sin multiplicar tareas manuales.',
    objective:
      'Demostrar una arquitectura lista para empresas distribuidoras o industriales que necesitan digitalizar pedidos, catálogo y coordinación interna.',
    idealClient:
      'Distribución, industria ligera y operaciones B2B con clientes recurrentes y alta dependencia de procesos manuales.',
    clientLabel: 'Strategic capability build',
    year: '2026',
    stack: ['React', 'TypeScript', 'TailwindCSS', 'Vite'],
    tags: ['B2B', 'Portal', 'Integraciones', 'Operaciones'],
    demoUrl: '/demo/b2b-saas-platform',
    ctaLabel: 'Pedir diagnóstico para operaciones',
    ctaHref: '/contacto?service=software-e-integraciones&problem=Necesito%20ordenar%20mi%20operativa%20B2B',
    howItWasMade: {
      businessGoal:
        'Traducir un problema operativo real a una experiencia que enseñe autoservicio, trazabilidad y escalabilidad sin depender de un backend visible en esta demo.',
      strategicFocus:
        'Se priorizó la claridad del flujo de compra y del estado del sistema para que el visitante entienda el impacto operativo antes que los detalles visuales.',
      frontendDecisions:
        'La demo usa una SPA ligera con componentes reutilizables y estados visibles que simulan sincronización, catálogo y actividad en tiempo real.',
      uxUiDecisions:
        'El lenguaje visual es sobrio, técnico y denso para acercarse a un entorno de trabajo real sin ruido innecesario.',
      technicalChallenges:
        'El reto principal fue mostrar complejidad operativa sin saturar la interfaz. Se resolvió separando claramente panel, métricas y flujo central.'
    }
  },
  {
    id: '2',
    slug: 'vaultpay-cro',
    title: 'VaultPay CRO Landing',
    category: 'Webs de conversión',
    proofType: 'demo',
    shortDescription:
      'Landing de alta conversión pensada para tráfico frío, claridad de propuesta y reducción de fricción en el registro.',
    fullDescription:
      'Demo interactiva que enseña cómo estructuramos una web comercial cuando el objetivo es convertir, no solo verse bien. La jerarquía, el copy, la prueba y la velocidad se tratan como parte del sistema de captación.',
    problem:
      'Muchas webs reciben visitas pero no convierten porque mezclan mensajes, tardan en cargar o no ordenan bien las objeciones del usuario.',
    solution:
      'Una landing construida con mentalidad CRO: promesa clara, recorrido guiado, prueba visual, objeciones cubiertas y CTAs visibles desde el primer scroll.',
    expectedImpact:
      'Mejora la comprensión de la propuesta, reduce rebote y prepara campañas de captación con una base más sólida.',
    objective:
      'Mostrar cómo una web de conversión puede funcionar como un activo comercial serio sin depender de plantillas o constructores lentos.',
    idealClient:
      'Servicios B2B, SaaS, producto digital y empresas que invierten en tráfico o necesitan una mejor primera impresión comercial.',
    clientLabel: 'Demo interactiva',
    year: '2026',
    stack: ['React', 'TypeScript', 'TailwindCSS', 'CSS nativo'],
    tags: ['CRO', 'Paid Media', 'Landing', 'Performance'],
    demoUrl: '/demo/fintech-cro-landing',
    ctaLabel: 'Pedir diagnóstico de conversión',
    ctaHref: '/contacto?service=webs-de-conversion&problem=Mi%20web%20no%20convierte',
    howItWasMade: {
      businessGoal:
        'Demostrar cómo una web puede reducir fricción comercial y dar soporte real a campañas, demos o captación orgánica.',
      strategicFocus:
        'Cada bloque responde a una duda del visitante: qué es, por qué importa, si puedo confiar y qué tengo que hacer ahora.',
      frontendDecisions:
        'Se priorizó una estructura ligera, animaciones suaves y componentes sencillos para reforzar rendimiento y legibilidad.',
      uxUiDecisions:
        'La demo usa un lenguaje más claro y luminoso que el sitio corporativo para dejar claro que el estilo sigue al objetivo del negocio.',
      technicalChallenges:
        'El equilibrio estaba en mantener riqueza visual sin penalizar la carga. La solución fue apoyarse en CSS y una jerarquía visual simple.'
    }
  },
  {
    id: '3',
    slug: 'market-signal-engine',
    title: 'Market Signal Engine',
    category: 'Automatizaciones e IA aplicada',
    proofType: 'concept',
    shortDescription:
      'Concepto de pipeline para capturar datos, normalizarlos y activar alertas o acciones cuando aparecen señales útiles para negocio.',
    fullDescription:
      'Concepto de automatización orientado a vigilancia de mercado, scoring y activación. Representa cómo diseñar una máquina digital que detecta eventos, enriquece datos y envía información accionable sin intervención continua.',
    problem:
      'Cuando la información clave llega tarde o dispersa, el equipo depende de revisión manual y pierde oportunidades antes que la competencia.',
    solution:
      'Un pipeline que captura eventos, los ordena, los enriquece y activa rutas de decisión según reglas de negocio o modelos sencillos de IA aplicada.',
    expectedImpact:
      'Ahorra horas de revisión, mejora el tiempo de respuesta y permite convertir datos dispersos en decisiones operativas.',
    objective:
      'Explicar cómo planteamos automatizaciones que conectan captura, procesamiento y acción sin vender la IA como espectáculo.',
    idealClient:
      'Equipos comerciales, operaciones, real estate, consultoría o negocios que dependen de datos externos y seguimiento continuo.',
    clientLabel: 'Concepto de automatización',
    year: '2026',
    stack: ['n8n', 'Webhooks', 'APIs', 'Data Enrichment'],
    tags: ['Automatización', 'IA aplicada', 'Pipelines', 'Datos'],
    demoUrl: '/demo/market-signal-engine',
    ctaLabel: 'Pedir mapa de automatización',
    ctaHref: '/contacto?service=automatizaciones-e-ia&problem=Mi%20equipo%20pierde%20tiempo%20en%20tareas%20manuales'
  },
  {
    id: '4',
    slug: 'csv-ops-classifier',
    title: 'CSV Ops Classifier',
    category: 'Automatizaciones e IA aplicada',
    proofType: 'demo',
    shortDescription:
      'Demo para pegar un CSV, clasificar registros, detectar prioridades y convertir datos sueltos en acciones operativas.',
    fullDescription:
      'Automatización interactiva que representa un flujo muy común: entran datos desde hojas, formularios, campañas o exportaciones, y el sistema los limpia, clasifica, prioriza y enruta hacia ventas, soporte, facturación o seguimiento.',
    problem:
      'Muchos equipos reciben CSVs o exportaciones con leads, incidencias, facturas o solicitudes mezcladas y pierden horas revisando fila por fila.',
    solution:
      'Un clasificador operativo que lee el CSV, entiende el contenido, asigna prioridad, propone la ruta adecuada y permite consultar el resultado con un asistente.',
    expectedImpact:
      'Reduce revisión manual, acelera decisiones y convierte datos desordenados en tareas claras para el equipo.',
    objective:
      'Mostrar cómo una automatización puede transformar un archivo plano en un flujo útil de clasificación, scoring y acción.',
    idealClient:
      'Equipos comerciales, operaciones, administración, soporte o negocios que trabajan con hojas de cálculo y exportaciones recurrentes.',
    clientLabel: 'Demo interactiva',
    year: '2026',
    stack: ['React', 'TypeScript', 'CSV parsing', 'Rules Engine'],
    tags: ['CSV', 'Clasificación', 'Scoring', 'Automatización'],
    demoUrl: '/demo/csv-ops-classifier',
    ctaLabel: 'Automatizar mis CSVs',
    ctaHref: '/contacto?service=automatizaciones-e-ia&problem=Quiero%20clasificar%20CSVs%20o%20datos%20automaticamente'
  }
];

const buildSlugAliases: Record<string, string> = {
  'ecommerce-automation': 'b2b-autoflow',
  'fintech-cro-landing': 'vaultpay-cro',
  'real-estate-scraper': 'market-signal-engine'
};

export function findCapabilityBuild(slug?: string) {
  if (!slug) {
    return undefined;
  }

  const resolvedSlug = buildSlugAliases[slug] ?? slug;
  return capabilityBuilds.find((build) => build.slug === resolvedSlug);
}
