"use client";

"use client";

import { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';

// Criar o contexto de autenticação
export const AuthContext = createContext();

// Estado inicial
const initialState = {
  token: null,
  isAuthenticated: false,
  loading: true,
  user: null,
  error: null
};

// Reducer para gerenciar o estado de autenticação
const authReducer = (state, action) => {
  switch (action.type) {
    case 'USER_LOADED':
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: action.payload
      };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS':
      localStorage.setItem('token', action.payload.token);
      return {
        ...state,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false
      };
    case 'AUTH_ERROR':
    case 'LOGIN_FAIL':
    case 'REGISTER_FAIL':
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        user: null,
        error: action.payload
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
};

// Provedor de autenticação
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Configurar o token para todas as requisições
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      setAuthToken(token);
      loadUser();
    } else {
      dispatch({ type: 'AUTH_ERROR' });
    }
    
    // eslint-disable-next-line
  }, []);

  // Configurar o token para o axios
  const setAuthToken = (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  // Carregar usuário
  const loadUser = async () => {
    try {
      const res = await axios.get('/api/users/me');
      dispatch({ type: 'USER_LOADED', payload: res.data });
    } catch (err) {
      dispatch({ type: 'AUTH_ERROR', payload: err.response?.data?.msg || 'Erro ao carregar usuário' });
    }
  };

  // Registrar usuário
  const register = async (formData) => {
    try {
      const res = await axios.post('/api/users/register', formData);
      dispatch({ type: 'REGISTER_SUCCESS', payload: res.data });
      loadUser();
    } catch (err) {
      dispatch({ type: 'REGISTER_FAIL', payload: err.response?.data?.msg || 'Erro ao registrar' });
    }
  };

  // Login de usuário
  const login = async (formData) => {
    try {
      const res = await axios.post('/api/users/login', formData);
      dispatch({ type: 'LOGIN_SUCCESS', payload: res.data });
      loadUser();
    } catch (err) {
      dispatch({ type: 'LOGIN_FAIL', payload: err.response?.data?.msg || 'Credenciais inválidas' });
    }
  };

  // Logout
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  // Limpar erros
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        register,
        login,
        logout,
        loadUser,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
