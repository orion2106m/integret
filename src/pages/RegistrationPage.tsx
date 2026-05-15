import { useEffect, useState } from "react";
import ModulePlaceholderPage from "./ModulePlaceholderPage";

export interface RegistrationPageProps {
  tenantId?: string;
  userId?: string;
}

type RemoteRegistrationModule = {
  default: (props: RegistrationPageProps) => JSX.Element;
};

const registrationModuleMap = import.meta.glob<RemoteRegistrationModule>(
  "../../apps/registration/src/pages/RegistrationPage.tsx",
);

export default function RegistrationPage(props: RegistrationPageProps) {
  const [RemotePage, setRemotePage] = useState<
    RemoteRegistrationModule["default"] | null
  >(null);

  useEffect(() => {
    let mounted = true;
    const loader =
      registrationModuleMap[
        "../../apps/registration/src/pages/RegistrationPage.tsx"
      ];

    if (!loader) {
      return () => {
        mounted = false;
      };
    }

    void loader().then((module) => {
      if (mounted) {
        setRemotePage(() => module.default);
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  if (!RemotePage) {
    return <ModulePlaceholderPage moduleName="Registro" />;
  }

  return <RemotePage {...props} />;
}
