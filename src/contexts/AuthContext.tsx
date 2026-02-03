import React, { createContext, useContext, useState, useEffect } from "react";
import { User, AuthContextType } from "@/types/auth";
import api from "@/services/api";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar autenticação ao carregar a aplicação
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("helpti_token");
      
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Decodificar o token para obter informações do usuário
      const decoded: any = jwtDecode(token);
      
      // Verificar se o token expirou
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("helpti_token");
        localStorage.removeItem("helpti_empresaId");
        localStorage.removeItem("helpti_empresaNome");
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Recupera empresaId do localStorage ou token
      const empresaIdStorage = localStorage.getItem("helpti_empresaId");
      const empresaNomeStorage = localStorage.getItem("helpti_empresaNome");

      // Mapeia roles customizadas
      let defRole = "CLIENTE";
      if (decoded.roles && decoded.roles.length > 0) {
        if(decoded.roles=="ROLE_ADMIN"){
          defRole = "ADMIN";
        }
        if(decoded.roles=="ROLE_PRESTADORA"){
          defRole = "PRESTADORA";
        }
        if(decoded.roles=="ROLE_CLIENTE"){
          defRole = "CLIENTE";
        }
        if(decoded.roles == "ROLE_GESTOR"){
          defRole = "GESTOR";
        }
      }
      
      const userData: User = {
        id: decoded.id || decoded.sub,
        nome: decoded.nome || decoded.name,
        email: decoded.email,
        role: defRole,
        avatar: decoded.avatar,
        empresaId: decoded.empresaId || (empresaIdStorage ? Number(empresaIdStorage) : undefined),
        empresaNome: decoded.empresaNome || empresaNomeStorage || undefined,
      };

      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error);
      localStorage.removeItem("helpti_token");
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token, user: userData } = response.data;

      localStorage.setItem("helpti_token", token);
      
      const decodedToken: any = jwtDecode(token);
      // Mapeia roles customizadas

      const user: User = {
        id: decodedToken.id || decodedToken.sub,
        nome: userData.nome || decodedToken.nome,
        email: userData.email || decodedToken.email,
        role: userData.role || decodedToken.role,
        avatar: userData.avatar,
      };

      setUser(user);
      setIsAuthenticated(true);

      await checkAuth();
      
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("helpti_token");
    localStorage.removeItem("helpti_empresaId");
    localStorage.removeItem("helpti_empresaNome");
    setUser(null);
    setIsAuthenticated(false);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}
