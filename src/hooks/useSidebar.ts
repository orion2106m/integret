import { useCallback, useEffect, useState } from "react";

interface UseSidebarReturn {
  collapsed: boolean;
  toggle: () => void;
  setCollapsed: (value: boolean) => void;
}

const SIDEBAR_KEY = "zenith-shell-sidebar-collapsed";

export function useSidebar(): UseSidebarReturn {
  const [collapsed, setCollapsedState] = useState<boolean>(false);

  useEffect(() => {
    const saved = window.localStorage.getItem(SIDEBAR_KEY);
    if (saved !== null) {
      setCollapsedState(saved === "1");
    }
  }, []);

  const setCollapsed = useCallback((value: boolean) => {
    setCollapsedState(value);
    window.localStorage.setItem(SIDEBAR_KEY, value ? "1" : "0");
  }, []);

  const toggle = useCallback(() => {
    setCollapsed(!collapsed);
  }, [collapsed, setCollapsed]);

  return { collapsed, toggle, setCollapsed };
}
