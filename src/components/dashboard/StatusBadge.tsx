import { cn } from "@/lib/utils";
import { ChamadoStatus } from "@/types/ticket";

interface StatusBadgeProps {
  status: ChamadoStatus;
}

const statusConfig: Record<ChamadoStatus, { label: string; className: string }> = {
  ABERTO: {
    label: "Aguardando",
    className: "bg-accent/10 text-accent border-accent/30",
  },
  EM_ATENDIMENTO: {
    label: "Em Andamento",
    className: "bg-primary/10 text-primary border-primary/30",
  },
  FECHADO: {
    label: "Finalizado",
    className: "bg-secondary/10 text-secondary border-secondary/30",
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "px-3 py-1 text-xs font-bold rounded-full border",
        config.className
      )}
    >
      {config.label}
    </span>
  );
}
