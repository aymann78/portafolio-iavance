export interface ServiceLine {
  slug: string;
  title: string;
  kicker: string;
  summary: string;
  problem: string;
  solution: string;
  outcomes: string[];
  deliverables: string[];
  whenItFits: string[];
  relatedBuilds: string[];
  cta: string;
}

export const services: ServiceLine[] = [
  {
    slug: 'automatizaciones-e-ia',
    title: 'Automatizaciones e IA aplicada',
    kicker: 'Operaciones más ligeras',
    summary:
      'Diseñamos flujos que eliminan tareas manuales, conectan herramientas y usan IA solo cuando mejora una decisión o un proceso.',
    problem:
      'Pierdes horas copiando datos, revisando correos, moviendo información entre herramientas o persiguiendo tareas repetitivas.',
    solution:
      'Mapeamos el proceso, detectamos cuellos de botella y construimos automatizaciones que conectan captura, clasificación, acción y seguimiento.',
    outcomes: [
      'Menos tareas repetitivas y menos errores',
      'Datos mas ordenados y accesibles',
      'Mejor tiempo de respuesta operativo',
      'IA usada con sentido, no como decorado'
    ],
    deliverables: [
      'Mapa de automatización priorizado',
      'Integraciones entre herramientas y APIs',
      'Flujos con reglas, validaciones y alertas',
      'Documentación operativa y criterio de uso'
    ],
    whenItFits: [
      'El equipo repite procesos todos los días',
      'Hay información repartida en varias herramientas',
      'Necesitas clasificar o enrutar datos',
      'Quieres reducir dependencia de tareas manuales'
    ],
    relatedBuilds: ['lead-to-ops'],
    cta: 'Diagnosticar automatización'
  },
  {
    slug: 'integraciones-crm-erp',
    title: 'Integraciones CRM/ERP y datos',
    kicker: 'Herramientas conectadas',
    summary:
      'Conectamos sistemas para que la información fluya sin intervención manual, eliminando silos de datos y pérdida de contexto.',
    problem:
      'Cada equipo usa un software distinto, el CRM no se habla con el ERP, y sacar un informe fiable cuesta horas o días cruzando datos.',
    solution:
      'Mapeamos el modelo de datos, conectamos las APIs necesarias y centralizamos la información para tener una única fuente de verdad operativa.',
    outcomes: [
      'Una única fuente de verdad',
      'Información consistente en todos los equipos',
      'Sincronización en tiempo real',
      'Adiós al cruce manual de CSVs'
    ],
    deliverables: [
      'Mapa de arquitectura de datos',
      'Conexión segura entre APIs y webhooks',
      'Sincronización de estados y entidades',
      'Alertas de error y monitoreo'
    ],
    whenItFits: [
      'El CRM y el ERP están desconectados',
      'Ventas no ve lo que pasa en Operaciones',
      'Hay que hacer doble introducción de datos',
      'Se pierde contexto entre herramientas'
    ],
    relatedBuilds: [],
    cta: 'Revisar integración'
  },
  {
    slug: 'software-interno',
    title: 'Software interno y portales B2B',
    kicker: 'Control y visibilidad',
    summary:
      'Portales, dashboards y herramientas a medida para empresas que ya no pueden sostener su operativa ni la relación con sus clientes a base de parches.',
    problem:
      'Trabajas con un montón de hojas, correos y herramientas separadas. Tus clientes te piden información constantemente y nadie ve con claridad qué está pasando.',
    solution:
      'Diseñamos interfaces claras que centralizan tareas críticas, ordenan la información para el equipo o los clientes y facilitan operar con control.',
    outcomes: [
      'Procesos más claros y trazables',
      'Menos consultas repetitivas de clientes',
      'Mejor visibilidad de estados y bloqueos',
      'Base sólida para crecer sin caos'
    ],
    deliverables: [
      'Arquitectura de la solución',
      'Portal, dashboard o herramienta a medida',
      'Conexión con las bases de datos de la empresa',
      'Despliegue de un MVP funcional'
    ],
    whenItFits: [
      'Necesitas un portal para tus clientes B2B',
      'Tu operativa interna es demasiado compleja',
      'Hay dependencias entre demasiadas personas',
      'Quieres dar autonomía a usuarios externos'
    ],
    relatedBuilds: ['b2b-autoflow'],
    cta: 'Aterrizar software interno'
  }
];
