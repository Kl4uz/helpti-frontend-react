import { Badge } from "@/components/ui/badge"; // Ajuste o import conforme seu projeto

// Mapeamento de Status e Prioridades
// Ajuste as chaves ("0", "1", "ABERTO", etc) conforme o que vem do seu banco
const STATUS_MAP: Record<string, { label: string; className: string }> = {
  // Status Numéricos (Do nosso SQL antigo)
  "0": { label: "Aberto", className: "bg-blue-500 hover:bg-blue-600" },
  "1": { label: "Em Andamento", className: "bg-yellow-500 hover:bg-yellow-600" },
  "2": { label: "Fechado", className: "bg-green-500 hover:bg-green-600" },
  
  // Status Texto (Caso o Backend mande texto)
  "ABERTO": { label: "Aberto", className: "bg-blue-500 hover:bg-blue-600" },
  "ANDAMENTO": { label: "Em Andamento", className: "bg-yellow-500 hover:bg-yellow-600" },
  "ENCERRADO": { label: "Encerrado", className: "bg-green-500 hover:bg-green-600" },
};

// Configuração padrão para quando o status não for encontrado
const DEFAULT_CONFIG = { 
  label: "Desconhecido", 
  className: "bg-gray-500 hover:bg-gray-600" 
};

interface StatusBadgeProps {
  status: string | number; // Aceita string ou número
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  // Converte para string para garantir a busca no mapa
  const statusKey = String(status).toUpperCase();
  
  // Tenta achar no mapa. Se não achar, usa o DEFAULT_CONFIG (Isso evita o erro!)
  const config = STATUS_MAP[statusKey] || DEFAULT_CONFIG;

  return (
    <Badge className={`${config.className} text-white`}>
      {config.label}
    </Badge>
  );
};

export { StatusBadge };
export default StatusBadge;