import axios from "axios";
import { Chamado } from "@/types/ticket";

// Mock data para desenvolvimento - será substituído pela integração real
const mockChamados: Chamado[] = [
  {
    id: 1,
    titulo: "Computador não liga",
    descricao: "Hoje não quis ligar, simplesmente. Já tentei trocar a tomada.",
    dataAbertura: "2026-01-13T10:00:00",
    status: "ABERTO",
    prioridade: "ALTA",
    tecnico: undefined,
  },
  {
    id: 2,
    titulo: "Instalação de software",
    descricao: "Preciso instalar o pacote Office 365 no computador da recepção.",
    dataAbertura: "2026-01-12T14:30:00",
    status: "EM_ATENDIMENTO",
    prioridade: "MEDIA",
    tecnico: { nome: "Carlos Silva" },
  },
  {
    id: 3,
    titulo: "Configuração de email",
    descricao: "Email corporativo não sincroniza no Outlook, mostra erro de autenticação.",
    dataAbertura: "2026-01-10T09:15:00",
    status: "FECHADO",
    prioridade: "BAIXA",
    tecnico: { nome: "Ana Costa" },
  },
];

// Placeholder API - será substituído pela integração real com backend

const api = axios.create({
    baseURL: "http://localhost:8082"
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('helpti_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
});

export default api;
