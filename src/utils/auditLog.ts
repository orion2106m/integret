import { supabaseClient } from "../lib/supabaseClient";
import type { AlertSeverity, UserRole } from "../types/shell.types";
import { sanitizeUnknown } from "./sanitizer";

export interface AuditLogEntry {
  actorId: string;
  actorRole: UserRole;
  action: string;
  entity: string;
  entityId?: string;
  severity?: AlertSeverity;
  details?: Record<string, unknown>;
  notifySuperAdmin?: boolean;
}

export async function recordAuditLog(entry: AuditLogEntry) {
  const payload = {
    actor_id: entry.actorId,
    actor_role: entry.actorRole,
    action: sanitizeUnknown(entry.action),
    entity: sanitizeUnknown(entry.entity),
    entity_id: entry.entityId ?? null,
    severity: entry.severity ?? "info",
    details: entry.details ? sanitizeUnknown(entry.details) : null,
    created_at: new Date().toISOString(),
  };

  const { error } = await supabaseClient.from("audit_logs").insert(payload);
  if (error) {
    console.warn("Failed to persist audit log:", error.message);
  }

  if (entry.notifySuperAdmin) {
    await supabaseClient.channel("zenith-super-admin-alerts").send({
      type: "broadcast",
      event: "incident",
      payload: {
        titulo: `${entry.action} · ${entry.entity}`,
        detalle: entry.details
          ? JSON.stringify(entry.details)
          : "Acción crítica registrada.",
        severidad: entry.severity ?? "warning",
        rolOrigen: entry.actorRole,
      },
    });
  }
}
