import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { Skeleton } from "../components/ui/Skeleton";

const MainLayout = lazy(() => import("../layouts/MainLayout"));
const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const RegistrationPage = lazy(
  () => import("../../apps/registration/src/pages/RegistrationPage"),
);
const ModulePlaceholderPage = lazy(
  () => import("../pages/ModulePlaceholderPage"),
);
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

interface PlaceholderRouteProps {
  moduleName: string;
}

function LazyFallback() {
  return (
    <div className="min-h-screen p-6">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="mt-4 h-28 w-full" />
      <Skeleton className="mt-4 h-28 w-full" />
    </div>
  );
}

function PlaceholderRoute({ moduleName }: PlaceholderRouteProps) {
  return <ModulePlaceholderPage moduleName={moduleName} />;
}

function withSuspense(node: JSX.Element): JSX.Element {
  return <Suspense fallback={<LazyFallback />}>{node}</Suspense>;
}

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: withSuspense(<MainLayout />),
    children: [
      {
        index: true,
        element: withSuspense(<DashboardPage />),
      },
      {
        path: "assistance",
        element: withSuspense(<PlaceholderRoute moduleName="Asistencia" />),
      },
      {
        path: "registration",
        element: withSuspense(
          <RegistrationPage
            tenantId="demo-tenant-001"
            userId="demo-user-001"
          />,
        ),
      },
      {
        path: "filed",
        element: withSuspense(<PlaceholderRoute moduleName="Radicado" />),
      },
      {
        path: "contact",
        element: withSuspense(<PlaceholderRoute moduleName="Contacto" />),
      },
      {
        path: "contracts",
        element: withSuspense(<PlaceholderRoute moduleName="Contratos" />),
      },
      {
        path: "billing",
        element: withSuspense(<PlaceholderRoute moduleName="Facturación" />),
      },
    ],
  },
  {
    path: "*",
    element: withSuspense(<NotFoundPage />),
  },
]);
