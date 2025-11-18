// src/context/.jsx
import React, { createContext, useState, useEffect } from 'react';

// Cria o contexto
export const  = createContext();

// Provider que envolve o app
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || null);  // Token JWT
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);  // Info do user (ex.: {id, role})

  // Função para login: chama back-end, armazena token/user
  const login = async (email, senha) => {
    try {
      const response = await fetch('http://localhost:8000/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
      });
      if (!response.ok) throw new Error('Credenciais inválidas');
      const data = await response.json();
      setToken(data.token);
      setUser({ role: data.role });  // Armazena role (expanda se precisar de mais info)
      localStorage.setItem('token', data.token);  // Persiste no navegador
      localStorage.setItem('user', JSON.stringify({ role: data.role }));
    } catch (error) {
      throw error;  // Lança erro para o componente Login lidar
    }
  };

  // Função para logout: limpa estado e localStorage
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Verifica se está logado (útil para rotas)
  const isAuthenticated = !!token;

  // Efeito para verificar token ao carregar (opcional, para persistência)
  useEffect(() => {
    if (token) {
      // Opcional: Verificar se token ainda é válido chamando um endpoint (ex.: /verify)
      // Por enquanto, assume válido se existir.
    }
  }, [token]);

  return (
    <.Provider value={{ token, user, login, logout, isAuthenticated }}>
      {children}
    </.Provider>
  );
};