import { LayoutDashboard, Users, UserCircle, FolderOpen, DollarSign, Ticket, Settings } from "lucide-react";

export interface NavLink {
  href: string;
  label: string;
  icon: any;
  roles: ("ADMIN" | "GESTOR" | "CLIENTE" | "PRESTADORA")[];
}

export const NAV_LINKS: NavLink[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    roles: ["ADMIN", "GESTOR", "CLIENTE", "PRESTADORA"],
  },
  {
    href: "/tecnicos",
    label: "Técnicos",
    icon: Users,
    roles: ["ADMIN", "GESTOR"],
  },
  {
    href: "/clientes",
    label: "Clientes",
    icon: UserCircle,
    roles: ["ADMIN", "GESTOR"],
  },
  {
    href: "/categorias",
    label: "Categorias",
    icon: FolderOpen,
    roles: ["ADMIN"],
  },
  {
    href: "/financeiro",
    label: "Financeiro",
    icon: DollarSign,
    roles: ["ADMIN", "PRESTADORA"],
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
    roles: ["ADMIN", "GESTOR", "CLIENTE", "PRESTADORA"],
  },
];

export const getNavLinksByRole = (role: string | null): NavLink[] => {
  if (!role) return [];
  return NAV_LINKS.filter((link) => link.roles.includes(role as any));
};