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
}

export const services: ServiceLine[] = [
  {
    slug: 'webs-de-conversion',
    title: 'Webs de conversion',
    kicker: 'Captacion con criterio',
    summary:
      'Webs, landings y experiencias comerciales pensadas para aclarar la propuesta, reducir friccion y convertir interes en conversaciones.',
    problem:
      'No se entiende rapido que vendes, para quien es y por que alguien deberia contactar ahora.',
    solution:
      'Construimos paginas ligeras, bien ordenadas y enfocadas en negocio: mensaje, estructura, prueba y CTA trabajando juntos.',
    outcomes: [
      'Mejor primera impresion comercial',
      'Menos friccion en captacion y campañas',
      'Jerarquia pensada para trafico frio',
      'Base mas solida para ventas y demos'
    ],
    deliverables: [
      'Arquitectura de mensajes y estructura',
      'Diseño y desarrollo a medida',
      'Optimizacion de carga y claridad visual',
      'CTAs, formularios y recorrido de conversion'
    ],
    whenItFits: [
      'Lanzas una nueva propuesta o servicio',
      'Tu web actual no ayuda a vender',
      'Necesitas una landing para captacion',
      'Quieres una presencia premium sin humo'
    ],
    relatedBuilds: []
  },
  {
    slug: 'automatizaciones-e-ia',
    title: 'Automatizaciones e IA aplicada',
    kicker: 'Operaciones mas ligeras',
    summary:
      'Diseñamos flujos que eliminan tareas manuales, conectan herramientas y usan IA solo cuando mejora una decision o un proceso.',
    problem:
      'Pierdes horas copiando datos, revisando correos, moviendo informacion entre herramientas o persiguiendo tareas repetitivas.',
    solution:
      'Mapeamos el proceso, detectamos cuellos de botella y construimos automatizaciones que conectan captura, clasificacion, accion y seguimiento.',
    outcomes: [
      'Menos tareas repetitivas y menos errores',
      'Datos mas ordenados y accesibles',
      'Mejor tiempo de respuesta operativo',
      'IA usada con sentido, no como decorado'
    ],
    deliverables: [
      'Mapa de automatizacion priorizado',
      'Integraciones entre herramientas y APIs',
      'Flujos con reglas, validaciones y alertas',
      'Documentacion operativa y criterio de uso'
    ],
    whenItFits: [
      'El equipo repite procesos todos los dias',
      'Hay informacion repartida en varias herramientas',
      'Necesitas clasificar o enrutar datos',
      'Quieres reducir dependencia de tareas manuales'
    ],
    relatedBuilds: ['lead-to-ops']
  },
  {
    slug: 'software-e-integraciones',
    title: 'Software e integraciones a medida',
    kicker: 'Producto interno que ordena',
    summary:
      'Portales, dashboards y herramientas internas para empresas que ya no pueden sostener su operativa con parches.',
    problem:
      'Tu equipo trabaja en hojas, correos y herramientas separadas, y nadie ve con claridad que esta pasando en operaciones.',
    solution:
      'Diseñamos interfaces y capas de integracion que centralizan tareas criticas, ordenan informacion y facilitan escalar con control.',
    outcomes: [
      'Procesos mas claros y trazables',
      'Menos dependencia de soluciones improvisadas',
      'Mejor visibilidad de estados y datos',
      'Base solida para crecer sin caos'
    ],
    deliverables: [
      'Mapa funcional y arquitectura de solucion',
      'Portal, dashboard o herramienta a medida',
      'Conexion con APIs, CRM, ERP o bases internas',
      'MVP claro o evolutivo por sprints'
    ],
    whenItFits: [
      'Necesitas una herramienta propia',
      'Tu operativa B2B es compleja',
      'Hay demasiadas dependencias entre personas',
      'Quieres centralizar datos y acciones'
    ],
    relatedBuilds: ['b2b-autoflow']
  }
];
