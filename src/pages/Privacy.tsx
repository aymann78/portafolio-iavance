import { Container, Heading, Section } from '../components/ui';

export function Privacy() {
  return (
    <div className="flex w-full flex-col">
      <Section spacing="lg" className="border-b border-zinc-900">
        <Container className="max-w-3xl">
          <Heading as="h1" size="xl" className="mb-8">
            Política de Privacidad
          </Heading>
          
          <div className="space-y-6 text-zinc-300 text-sm leading-relaxed">
            <section>
              <h2 className="text-white text-lg font-semibold mb-3">Qué datos recogemos</h2>
              <p>Al utilizar nuestro formulario de diagnóstico, recogemos el nombre, la empresa o web y el correo electrónico, además de los datos que voluntariamente compartas en el campo del problema principal o el mensaje, estrictamente para entender tu contexto.</p>
            </section>
            
            <section>
              <h2 className="text-white text-lg font-semibold mb-3">Para qué los usamos</h2>
              <p>Usamos esta información exclusivamente para analizar el caso, contactar contigo y proponer un siguiente paso u orientar el proyecto. No utilizamos estos datos para campañas masivas de marketing ni enviamos spam comercial que no hayas solicitado.</p>
            </section>
            
            <section>
              <h2 className="text-white text-lg font-semibold mb-3">No vendemos datos</h2>
              <p>Tus datos son tratados de forma confidencial. No los compartimos, cedemos ni vendemos a terceros. Únicamente empleamos herramientas seguras para la gestión interna de nuestra comunicación y análisis de proyecto.</p>
            </section>
            
            <section>
              <h2 className="text-white text-lg font-semibold mb-3">Proveedores externos</h2>
              <p>Para la recepción segura de formularios en esta web, podemos usar proveedores de email transaccional (como FormSubmit o similares) que cumplen con los estándares habituales de cifrado en la transmisión de datos. Dichos servicios actúan únicamente como un canal de paso para que el mensaje llegue a nuestro buzón seguro.</p>
            </section>

            <section>
              <h2 className="text-white text-lg font-semibold mb-3">Tus derechos</h2>
              <p>En cualquier momento puedes contactar con nosotros a través de <strong>hola@iavance.es</strong> para ejercer tus derechos de acceso, rectificación o eliminación de cualquier información que hayamos guardado sobre ti tras tu consulta.</p>
            </section>
          </div>
        </Container>
      </Section>
    </div>
  );
}
