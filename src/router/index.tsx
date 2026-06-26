import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy } from 'react';
import { RootLayout } from '../layouts/RootLayout';
import { Home } from '../pages/Home';
import { Lab } from '../pages/Lab';
import { ProjectDetail } from '../pages/ProjectDetail';
import { HowItWasMade } from '../pages/HowItWasMade';
import { DemoLayout } from '../layouts/DemoLayout';
import { Services } from '../pages/Services';
import { CapabilityBuilds } from '../pages/CapabilityBuilds';
import { Process } from '../pages/Process';
import { Contact } from '../pages/Contact';
import { Automations } from '../pages/Automations';
import { Privacy } from '../pages/Privacy';
import { NotFound } from '../pages/NotFound';
import { SuspenseWrapper } from '../components/SuspenseWrapper';

const FintechLanding = lazy(() => import('../pages/demos/FintechLanding').then(m => ({ default: m.FintechLanding })));
const B2bSaasLanding = lazy(() => import('../pages/demos/b2b-saas').then(m => ({ default: m.B2bSaasLanding })));
const LeadToOpsCommandCenter = lazy(() => import('../pages/demos/lead-to-ops').then(m => ({ default: m.LeadToOpsCommandCenter })));

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
        path: 'soluciones',
        element: <Services />
      },
      {
        path: 'casos',
        element: <CapabilityBuilds />
      },
      {
        path: 'demos',
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
        path: 'como-trabajamos',
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
      {
        path: 'privacidad',
        element: <Privacy />
      },
      {
        path: '*',
        element: <NotFound />
      }
    ],
  },
  {
    path: '/demo',
    element: <DemoLayout />,
    children: [
      {
        path: 'fintech-cro-landing',
        element: <SuspenseWrapper><FintechLanding /></SuspenseWrapper>
      },
      {
        path: 'b2b-saas-platform',
        element: <SuspenseWrapper><B2bSaasLanding /></SuspenseWrapper>
      },
      {
        path: 'lead-to-ops',
        element: <SuspenseWrapper><LeadToOpsCommandCenter /></SuspenseWrapper>
      },
      {
        path: 'market-signal-engine',
        element: <Navigate to="/demo/lead-to-ops" replace />
      },
      {
        path: 'automation-chatbot',
        element: <Navigate to="/demo/lead-to-ops" replace />
      },
      {
        path: 'csv-ops-classifier',
        element: <Navigate to="/demo/lead-to-ops" replace />
      }
    ]
  }
]);
