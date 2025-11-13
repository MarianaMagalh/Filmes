import React, { createContext, useState, useEffect } from 'react';  // React hooks para estado e efeitos
import jwtDecode from 'jwt-decode';  // Biblioteca para decodificar JWT

export const AuthContext = createContext();  // Cria um contexto para compartilhar estado de autenticação em toda a app

export const AuthProvider = ({ children }) => {  // Componente provedor do contexto
  const [user, setUser] = useState(null);  // Estado para armazenar dados do usuário decodificado do JWT (ex.: {id, role})
  const [loading, setLoading] = useState(true);  // Estado para indicar carregamento inicial (ex.: verificando token)

  useEffect(() => {  // Executa uma vez ao montar o componente
    const token = localStorage.getItem('token');  // Pega token salvo no navegador
    if (token) {
      try {
        const decoded = jwtDecode(token);  // Decodifica o JWT para obter dados do usuário
        setUser(decoded);  // Define o usuário no estado
      } catch (error) {
        console.error('Token inválido:', error);  // Loga erro se token for inválido
        localStorage.removeItem('token');  // Remove token inválido
      }
    }
    setLoading(false);  // Finaliza carregamento
  }, []);  // Array vazio: executa apenas uma vez

  const login = (token) => {  // Função para fazer login
    localStorage.setItem('token', token);  // Salva token no localStorage
    const decoded = jwtDecode(token);  // Decodifica e define usuário
    setUser(decoded);
  };

  const logout = () => {  // Função para fazer logout
    localStorage.removeItem('token');  // Remove token
    setUser(null);  // Limpa estado do usuário
  };

  // Fornece valores para componentes filhos via contexto
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};