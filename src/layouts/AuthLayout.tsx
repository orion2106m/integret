import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--color-bg)] p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(79,70,229,0.16),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(45,212,191,0.12),transparent_32%)]" />
      <div className="relative z-10 w-full">
        <Outlet />
      </div>
    </div>
  );
}
