export const siteMeta = {
  name: 'iavance.es',
  domain: 'https://iavance.es',
  description:
    'Automatización operativa B2B para empresas que pierden horas entre hojas, correos, datos dispersos y procesos manuales.',
  email: 'hola@iavance.es',
  instagram: 'https://instagram.com/iavance.es',
  formEndpoint: 'https://formsubmit.co/ajax/hola@iavance.es',
  ogImage: '/og-image.svg',
  sameAs: ['https://instagram.com/iavance.es'],
  schema: {
    organization: {
      '@type': 'Organization',
      name: 'iavance.es',
      url: 'https://iavance.es',
      email: 'hola@iavance.es',
    },
    service: {
      '@type': 'Service',
      name: 'Automatización operativa B2B',
      serviceType: 'Automatizaciones, integraciones y software interno B2B',
      areaServed: 'España',
      audience: 'Empresas B2B con procesos manuales y datos dispersos',
    },
  },
} as const;
