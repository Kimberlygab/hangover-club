"use client";

import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AuthContext from '@/context/auth/AuthContext';

const Register = () => {
  const { register, error, clearError, isAuthenticated } = useContext(AuthContext);
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  
  const { name, email, password, password2 } = formData;
  
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) clearError();
    if (passwordError) setPasswordError('');
  };
  
  const onSubmit = async e => {
    e.preventDefault();
    
    if (password !== password2) {
      setPasswordError('As senhas não coincidem');
      return;
    }
    
    setLoading(true);
    await register({
      name,
      email,
      password
    });
    setLoading(false);
  };
  
  // Redirecionar se autenticado
  if (isAuthenticated) {
    router.push('/groups');
    return null;
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-yellow-500">
            HANGOVER CLUB
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Registre-se para começar a gamificar a bebedeira
          </p>
        </div>
        
        {error && (
          <div className="bg-red-900 text-white p-3 rounded">
            {error}
          </div>
        )}
        
        {passwordError && (
          <div className="bg-red-900 text-white p-3 rounded">
            {passwordError}
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="name" className="sr-only">Nome</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={onChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-800 rounded-t-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm"
                placeholder="Nome completo"
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={onChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-800 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm"
                placeholder="Email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Senha</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={onChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-800 focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm"
                placeholder="Senha"
                minLength="6"
              />
            </div>
            <div>
              <label htmlFor="password2" className="sr-only">Confirmar Senha</label>
              <input
                id="password2"
                name="password2"
                type="password"
                autoComplete="new-password"
                required
                value={password2}
                onChange={onChange}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-700 placeholder-gray-500 text-white bg-gray-800 rounded-b-md focus:outline-none focus:ring-yellow-500 focus:border-yellow-500 focus:z-10 sm:text-sm"
                placeholder="Confirmar senha"
                minLength="6"
              />
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              {loading ? 'Registrando...' : 'Registrar'}
            </button>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-400">
              Já tem uma conta?{' '}
              <Link href="/login" className="font-medium text-yellow-500 hover:text-yellow-400">
                Faça login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
