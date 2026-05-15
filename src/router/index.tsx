import { Suspense, lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "../auth/ProtectedRoute";
import { Skeleton } from "../components/ui/Skeleton";

const MainLayout = lazy(() => import("../layouts/MainLayout"));
const AuthLayout = lazy(() => import("../layouts/AuthLayout"));
const AuthPage = lazy(() => import("../pages/AuthPage"));
const RegistrationPage = lazy(() => import("../pages/RegistrationPage"));
const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const ModulePlaceholderPage = lazy(
  () => import("../pages/ModulePlaceholderPage"),
);
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

interface PlaceholderRouteProps {
  moduleName: string;
}

function LazyFallback() {
  return (
    // CORRECCIÓN: era min-h-screen que forzaba scroll interno — cambiado a h-full
    <div className="h-full w-full p-6">
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
    path: "/auth",
    element: withSuspense(<AuthLayout />),
    children: [{ index: true, element: withSuspense(<AuthPage />) }],
  },
  {
    path: "/",
    element: withSuspense(
      <ProtectedRoute
        allowedRoles={["super_admin", "admin", "user"]}
        allowGuests
      >
        <MainLayout />
      </ProtectedRoute>,
    ),
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
