export type ProjectStatus = 'Live' | 'En desarrollo' | 'Concepto';

export interface Project {
  id: string;
  slug: string;
  title: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  objective: string;
  client: string;
  year: string;
  stack: string[];
  tags: string[];
  status: ProjectStatus;
  demoUrl?: string; // Ruta interna a la web implementada o url externa si aplica
  howItWasMade?: {
    businessGoal: string;
    strategicFocus: string;
    frontendDecisions: string;
    uxUiDecisions: string;
    technicalChallenges: string;
  };
}

export const projects: Project[] = [
  {
    id: '1',
    slug: 'ecommerce-automation',
    title: 'B2B Autoflow — Portal de Pedidos',
    category: 'Sistemas & Automatización',
    shortDescription: 'Demo de un portal B2B de autoservicio que elimina la entrada manual de pedidos y centraliza operaciones de cliente.',
    fullDescription: 'Prototipo interactivo de una plataforma B2B diseñada para empresas distribuidoras. Muestra cómo se puede construir un sistema de pedidos autónomo, con dashboard de sincronización, gestión de catálogo y estados de operación en tiempo real. Un capability build que muestra la arquitectura aplicable a cualquier operación B2B con volumen.',
    objective: 'Demostrar que es posible eliminar el 100% de la entrada manual de pedidos B2B y reducir el ciclo de procesamiento de días a segundos mediante frontend + integración de API.',
    client: 'Demo / Capability Build',
    year: '2025',
    stack: ['React', 'TypeScript', 'TailwindCSS', 'Vite'],
    tags: ['B2B', 'Portal', 'Operaciones'],
    status: 'Concepto',
    demoUrl: '/demo/b2b-saas-platform',
    howItWasMade: {
      businessGoal: 'Mostrar cómo una empresa con pedidos recurrentes B2B puede digitalizar el proceso sin depender de llamadas, emails ni hojas de cálculo. La fricción operativa es el mayor coste oculto en distribución.',
      strategicFocus: 'Portal de autoservicio para clientes B2B. El objetivo no es decorar un dashboard, sino construir un flujo donde el cliente haga todo sin intervención del equipo de ventas.',
      frontendDecisions: 'SPA con React para interactividad inmediata. Optimistic UI en acciones de cesta para que el usuario no espere confirmación del servidor en operaciones comunes.',
      uxUiDecisions: 'Dark Mode industrial de alta densidad. La prioridad es la legibilidad de tablas de datos, SKUs y estados, no la estética. Cada píxel debe ayudar a la decisión de compra, no distraer.',
      technicalChallenges: 'El reto conceptual clave fue diseñar el flujo de sincronización de inventario entre el panel del cliente y el backend ERP sin añadir latencia perceptible. Se resolvió con una capa de estado optimista y reconciliación en background.'
    }
  },
  {
    id: '2',
    slug: 'fintech-cro-landing',
    title: 'VaultPay — Landing de Alta Conversión',
    category: 'Webs de Conversión',
    shortDescription: 'Demo de landing page para producto FinTech. Arquitectura CRO orientada a convertir tráfico frío en registros de prueba.',
    fullDescription: 'Prototipo de landing page construida para demostrar cómo se arquitectura una web cuyo único objetivo es la conversión. Sin constructores, sin plantillas. 100% código nativo, estructura psicológica de ventas aplicada a la jerarquía de componentes, y carga sub-segundo como requisito no negociable.',
    objective: 'Reducir la tasa de rebote de tráfico frío y aumentar el ratio de registro a trial eliminando fricciones de carga, credibilidad y claridad de propuesta.',
    client: 'Demo / Capability Build',
    year: '2025',
    stack: ['Vite', 'React', 'TailwindCSS', 'CSS puro'],
    tags: ['CRO', 'Performance', 'Landing Page'],
    status: 'Concepto',
    demoUrl: '/demo/fintech-cro-landing',
    howItWasMade: {
      businessGoal: 'Demostrar cómo bajar el CPA de campañas de Paid Media optimizando la página de destino, no el anuncio. El mayor desperdicio en performance marketing es enviar tráfico a páginas que destruyen la conversión.',
      strategicFocus: 'Rediseño con mentalidad de Performance Marketing. Cada sección responde a una objeción de compra. La jerarquía visual sigue el flujo de atención natural del usuario en una primera visita.',
      frontendDecisions: 'Vite + React para carga instantánea. Sin jQuery, sin dependencias pesadas. El bundle debe ser el mínimo necesario para que el contenido sea lo primero que renderiza el navegador.',
      uxUiDecisions: 'Light Mode para transmitir transparencia y credibilidad financiera. Mockups del producto integrados en la página para que el usuario pueda "tocar" la herramienta antes de registrarse.',
      technicalChallenges: 'El equilibrio entre código limpio para Core Web Vitals y animaciones suaves sin comprometer el TTI. Se resolvió usando CSS nativo para transiciones y evitando cualquier librería de animación pesada.'
    }
  },
  {
    id: '3',
    slug: 'real-estate-scraper',
    title: 'Real Estate Data Engine',
    category: 'Automatización de Datos',
    shortDescription: 'Concepto de pipeline de inteligencia de mercado inmobiliario. Extracción, normalización y análisis de oportunidades en tiempo real.',
    fullDescription: 'Diseño de arquitectura para un motor autónomo de vigilancia de mercado inmobiliario. El sistema extrae datos de múltiples fuentes, normaliza el inventario, aplica filtros de valoración y envía alertas directas al CRM sin intervención humana. Concepto de automatización aplicable a cualquier vertical con mercados de datos públicos.',
    objective: 'Eliminar la búsqueda manual diaria de propiedades. Detectar oportunidades infravaloradas antes que la competencia, con mínima intervención humana.',
    client: 'Concepto de Automatización',
    year: '2025',
    stack: ['Make.com', 'Webhooks', 'n8n', 'Airtable'],
    tags: ['Scraping', 'Data Pipeline', 'Automatización'],
    status: 'Concepto',
  }
];
