import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import logoHelpTI from "@/assets/logo-helpti-bg.png";
import loginHero from "@/assets/login-hero.jpg";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";

// 🛠️ AJUSTE 1: A interface deve bater com o nome do campo no Token (geralmente plural "roles")
interface JwtPayload {
  sub: string;
  id: number;
  roles: string[]; // Alterado de 'role' para 'roles' para bater com o código abaixo
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erroLogin, setErroLogin] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErroLogin(false);
    setLoading(true);

    try {
      // 🛠️ AJUSTE 2: Rota corrigida para bater com o SecurityConfig (/api/auth/login)
      const response = await api.post('/api/auth/login', {
        email,
        senha: password 
      });

      const token = response.data.token;
      
      // Salva no Storage
      localStorage.setItem('helpti_token', token);
      
      // Define o token padrão para as próximas requisições do Axios
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      // Decodifica o token
      const decoded = jwtDecode<JwtPayload>(token);
      
      // Fallback de segurança: Se roles vier undefined, usa array vazio para não quebrar
      const roles = decoded.roles || [];

      console.log("Login Sucesso. Roles:", roles); // Log para debug

      if (roles.includes("ROLE_ADMIN")) {
        navigate('/admin/dashboard');
      } else if (roles.includes("ROLE_TECNICO")) {
        navigate('/tecnico/dashboard');
      } else {
        navigate('/cliente/dashboard');
      }

    } catch (error) {
      console.error("Erro no login:", error);
      setErroLogin(true);
      // Opcional: Mostrar mensagem específica se for 403 ou 401
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Lado esquerdo - Hero Image */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden">
        <img
          src={loginHero}
          alt="Equipe de suporte técnico HelpTI"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-accent-orange/40" />
        <div className="relative z-10 flex flex-col justify-end p-12 text-primary-foreground">
          <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <h2 className="font-display text-4xl xl:text-5xl font-bold mb-4 leading-tight">
              Soluções de TI
              <br />
              <span className="text-accent">simplificadas</span>
            </h2>
            <p className="text-lg xl:text-xl opacity-90 max-w-md">
              Gerencie seus chamados de suporte técnico de forma eficiente e
              organizada com o HelpTI.
            </p>
          </div>
        </div>
      </div>

      {/* Lado direito - Formulário de Login */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md animate-slide-in-right">
          {/* Logo e Título */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-6">
              <img
                src={logoHelpTI}
                alt="HelpTI Logo"
                className="h-16 w-auto object-contain"
              />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">
              Bem-vindo de volta
            </h1>
            <p className="text-muted-foreground">
              Acesse sua conta para continuar
            </p>
          </div>

          {/* Mensagem de Erro (Adicionada visualmente) */}
          {erroLogin && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm text-center">
              Erro ao fazer login. Verifique email e senha.
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campo Email */}
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-medium text-foreground"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12"
                  required
                />
              </div>
            </div>

            {/* Campo Senha */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-medium text-foreground"
              >
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-12 pr-12"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Lembrar-me e Esqueceu a senha */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked === true)}
                  className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <label
                  htmlFor="remember"
                  className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                >
                  Lembrar-me
                </label>
              </div>
              <a
                href="#"
                className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Esqueceu a senha?
              </a>
            </div>

            {/* Botão de Login */}
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>

          {/* Link para criar conta */}
          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              Não tem uma conta?{" "}
              <a
                href="#"
                className="text-primary hover:text-primary/80 font-semibold transition-colors"
              >
                Criar conta
              </a>
            </p>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} HelpTI. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;