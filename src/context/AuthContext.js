import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  loginWithEmail, 
  registerWithEmail, 
  loginWithGoogle, 
  logoutUser, 
  getCurrentUser 
} from '../utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Criar contexto de autenticação
const AuthContext = createContext();

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => useContext(AuthContext);

// Provedor de autenticação
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Efeito para monitorar mudanças no estado de autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Limpar listener ao desmontar
    return unsubscribe;
  }, []);

  // Função para login com email e senha
  const login = async (email, password) => {
    setError(null);
    try {
      const result = await loginWithEmail(email, password);
      if (!result.success) {
        setError(result.error);
        return false;
      }
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Função para registro com email e senha
  const register = async (email, password) => {
    setError(null);
    try {
      const result = await registerWithEmail(email, password);
      if (!result.success) {
        setError(result.error);
        return false;
      }
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Função para login com Google
  const loginWithGoogleProvider = async () => {
    setError(null);
    try {
      const result = await loginWithGoogle();
      if (!result.success) {
        setError(result.error);
        return false;
      }
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Função para logout
  const logout = async () => {
    setError(null);
    try {
      await logoutUser();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  // Valor do contexto
  const value = {
    currentUser,
    loading,
    error,
    login,
    register,
    loginWithGoogle: loginWithGoogleProvider,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
