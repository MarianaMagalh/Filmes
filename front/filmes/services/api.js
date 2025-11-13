import axios from 'axios';  // Biblioteca para requisições HTTP

// Configura base URL para o back-end
axios.defaults.baseURL = 'http://localhost:8000';

// Interceptor para adicionar JWT automaticamente nas requisições
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');  // Pega token do localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;  // Adiciona no header
    }
    return config;
  },
  (error) => Promise.reject(error)  // Rejeita erro se houver
);

export default axios;  // Exporta axios configurado
