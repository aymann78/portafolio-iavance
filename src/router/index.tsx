import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from '../layouts/RootLayout';
import { Home } from '../pages/Home';
import { Lab } from '../pages/Lab';
import { ProjectDetail } from '../pages/ProjectDetail';
import { HowItWasMade } from '../pages/HowItWasMade';
import { DemoLayout } from '../layouts/DemoLayout';
import { FintechLanding } from '../pages/demos/FintechLanding';
import { B2bSaasLanding } from '../pages/demos/B2bSaasLanding';
import { AutomationChatbot } from '../pages/demos/AutomationChatbot';
import { CsvOpsClassifier } from '../pages/demos/CsvOpsClassifier';
import { Services } from '../pages/Services';
import { CapabilityBuilds } from '../pages/CapabilityBuilds';
import { Process } from '../pages/Process';
import { Contact } from '../pages/Contact';
import { Automations } from '../pages/Automations';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'servicios',
        element: <Services />
      },
      {
        path: 'casos',
        element: <CapabilityBuilds />
      },
      {
        path: 'casos/:slug',
        element: <ProjectDetail />,
      },
      {
        path: 'casos/:slug/como-se-hizo',
        element: <HowItWasMade />,
      },
      {
        path: 'lab',
        element: <Lab />
      },
      {
        path: 'proceso',
        element: <Process />
      },
      {
        path: 'contacto',
        element: <Contact />
      },
      {
        path: 'automations',
        element: <Automations />
      },
      {
        path: 'projects/:slug',
        element: <ProjectDetail />
      },
      {
        path: 'projects/:slug/how-it-was-made',
        element: <HowItWasMade />
      },
    ],
  },
  {
    path: '/demo',
    element: <DemoLayout />,
    children: [
      {
        path: 'fintech-cro-landing',
        element: <FintechLanding />
      },
      {
        path: 'b2b-saas-platform',
        element: <B2bSaasLanding />
      },
      {
        path: 'market-signal-engine',
        element: <AutomationChatbot />
      },
      {
        path: 'automation-chatbot',
        element: <AutomationChatbot />
      },
      {
        path: 'csv-ops-classifier',
        element: <CsvOpsClassifier />
      }
    ]
  }
]);
