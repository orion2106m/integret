export interface TopbarProps {
  tenantName: string;
  userName: string;
  userRole: string;
  avatarInitials: string;
}

export default function Topbar({
  tenantName,
  userName,
  userRole,
  avatarInitials,
}: TopbarProps) {
  return (
    <header className="surface-1 anim-fade-up flex min-h-16 items-center justify-between rounded-[var(--radius-md)] px-4 py-3">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-2.5 w-2.5 rounded-full bg-[var(--color-accent-teal)]" />
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-text-muted)]">
            Tenant activo
          </p>
          <h1 className="text-base font-semibold text-[var(--color-text)]">
            {tenantName}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-[var(--color-text)]">
            {userName}
          </p>
          <p className="text-xs text-[var(--color-text-muted)]">{userRole}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(78,205,196,0.35)] bg-[rgba(78,205,196,0.14)] text-sm font-semibold text-[var(--color-accent-teal)]">
          {avatarInitials}
        </div>
      </div>
    </header>
  );
}
