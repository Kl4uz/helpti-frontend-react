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
        setIsAuthenticated(false);
        setUser(null);
        setIsLoading(false);
        return;
      }

      // Mapeia roles customizadas
      let defRole = "CLIENTE";
      if (decoded.roles.length > 0) {
        if(decoded.roles[1]=="ROLE_0"){
          defRole = "MATRIZ";
        }
        if(decoded.roles[1]=="ROLE_1"){
          defRole = "EMPRESA";
        }
        if(decoded.roles[1]=="ROLE_2"){
          defRole = "CLIENTE";
        }
      }
      const userData: User = {
        id: decoded.id || decoded.sub,
        nome: decoded.nome || decoded.name,
        email: decoded.email,
        role: defRole,
        avatar: decoded.avatar,
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
      let role = "CLIENTE";
      if (decodedToken.roles && Array.isArray(decodedToken.roles) && decodedToken.roles.length > 0) {
        switch (decodedToken.roles[1]) {
          case "ROLE_0":
            role = "MATRIZ";
            break;
          case "ROLE_1":
            role = "EMPRESA";
            break;
          case "ROLE_2":
            role = "CLIENTE";
            break;
          default:
            role = "CLIENTE";
        }
      }
      const user: User = {
        id: decodedToken.id || decodedToken.sub,
        nome: userData.nome || decodedToken.nome,
        email: userData.email || decodedToken.email,
        role: role,
        avatar: userData.avatar,
      };

      setUser(user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem("helpti_token");
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
