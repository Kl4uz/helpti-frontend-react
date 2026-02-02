export type UserRole = "ADMIN" | "CLIENTE" | "TECNICO" | "GESTOR" | "EMPRESA";

export interface User {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  avatar?: string;
  empresaId?: number;
  empresaNome?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}
