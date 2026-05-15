import { Sparkles } from "lucide-react";
import { Card } from "../ui/Card";

export interface ActivityItem {
  id: string;
  titulo: string;
  detalle: string;
  fechaRelativa: string;
}

export interface ActivityPanelProps {
  title?: string;
  items?: ActivityItem[];
}

const defaultItems: ActivityItem[] = [
  {
    id: "1",
    titulo: "Sin actividad conectada",
    detalle: "Este panel mostrará eventos transversales de los módulos.",
    fechaRelativa: "Ahora",
  },
];

export default function ActivityPanel({
  title = "Actividad reciente",
  items = defaultItems,
}: ActivityPanelProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-[15px] font-semibold text-[var(--color-text-primary)]">
          {title}
        </h3>
        <Sparkles
          className="h-4 w-4 text-[var(--color-text-secondary)]"
          aria-hidden="true"
        />
      </div>

      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-3"
          >
            <p className="text-sm font-medium text-[var(--color-text-primary)]">
              {item.titulo}
            </p>
            <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
              {item.detalle}
            </p>
            <p className="mt-2 text-xs text-[var(--color-text-disabled)]">
              {item.fechaRelativa}
            </p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
