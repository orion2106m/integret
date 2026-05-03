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
    <Card className="anim-fade-up p-4">
      <h3 className="text-sm font-semibold text-[var(--color-text)]">
        {title}
      </h3>
      <ul className="mt-3 space-y-3">
        {items.map((item) => (
          <li
            key={item.id}
            className="rounded-[var(--radius-sm)] bg-[var(--color-surface-2)] p-3"
          >
            <p className="text-sm font-medium text-[var(--color-text)]">
              {item.titulo}
            </p>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">
              {item.detalle}
            </p>
            <p className="mt-2 text-xs text-[var(--color-text-muted)]">
              {item.fechaRelativa}
            </p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
