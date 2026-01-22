import { LayoutDashboard, Users, UserCircle, FolderOpen, DollarSign, Ticket, Settings } from "lucide-react";

export interface NavLink {
  href: string;
  label: string;
  icon: any;
  roles: ("MATRIZ" | "EMPRESA" | "CLIENTE")[];
}

export const NAV_LINKS: NavLink[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: ["MATRIZ", "EMPRESA", "CLIENTE"],
  },
  {
    href: "/tecnicos",
    label: "Técnicos",
    icon: Users,
    roles: ["MATRIZ", "EMPRESA"],
  },
  {
    href: "/clientes",
    label: "Clientes",
    icon: UserCircle,
    roles: ["MATRIZ", "EMPRESA"],
  },
  {
    href: "/categorias",
    label: "Categorias",
    icon: FolderOpen,
    roles: ["MATRIZ"],
  },
  {
    href: "/financeiro",
    label: "Financeiro",
    icon: DollarSign,
    roles: ["MATRIZ"],
  },
  {
    href: "/meus-chamados",
    label: "Meus Chamados",
    icon: Ticket,
    roles: ["CLIENTE"],
  },
  {
    href: "/configuracoes",
    label: "Configurações",
    icon: Settings,
    roles: ["MATRIZ", "EMPRESA", "CLIENTE"],
  },
];

export const getNavLinksByRole = (role: string | null): NavLink[] => {
  if (!role) return [];
  return NAV_LINKS.filter((link) => link.roles.includes(role as any));
};