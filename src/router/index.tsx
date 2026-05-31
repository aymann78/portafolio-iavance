import { createBrowserRouter } from 'react-router-dom';
import { RootLayout } from '../layouts/RootLayout';
import { Home } from '../pages/Home';
import { Lab } from '../pages/Lab';
import { ProjectDetail } from '../pages/ProjectDetail';
import { HowItWasMade } from '../pages/HowItWasMade';
import { Automations } from '../pages/Automations';
import { DemoLayout } from '../layouts/DemoLayout';
import { FintechLanding } from '../pages/demos/FintechLanding';
import { B2bSaasLanding } from '../pages/demos/B2bSaasLanding';

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
        path: 'lab',
        element: <Lab />,
      },
      {
        path: 'projects/:slug',
        element: <ProjectDetail />,
      },
      {
        path: 'projects/:slug/how-it-was-made',
        element: <HowItWasMade />,
      },
      {
        path: 'automations',
        element: <Automations />,
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
      }
    ]
  }
]);
