"use client";

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import GroupContext from '@/context/group/GroupContext';
import AuthContext from '@/context/auth/AuthContext';
import Navbar from '@/components/layout/Navbar';

const GroupList = () => {
  const { groups, getGroups, loading, error } = useContext(GroupContext);
  const { isAuthenticated } = useContext(AuthContext);
  const router = useRouter();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  
  useEffect(() => {
    if (isAuthenticated) {
      getGroups();
    } else {
      router.push('/login');
    }
  }, [isAuthenticated]);
  
  const { name, description } = formData;
  
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const onSubmit = async e => {
    e.preventDefault();
    
    if (!name) {
      return;
    }
    
    const result = await createGroup(formData);
    
    if (result) {
      setFormData({
        name: '',
        description: ''
      });
      setShowCreateForm(false);
    }
  };
  
  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
          </div>
        </div>
      </>
    );
  }
  
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-yellow-500">Meus Grupos</h1>
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
          >
            {showCreateForm ? 'Cancelar' : 'Novo Grupo'}
          </button>
        </div>
        
        {error && (
          <div className="bg-red-900 text-white p-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {showCreateForm && (
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
            <h2 className="text-xl font-bold text-yellow-500 mb-4">Criar Novo Grupo</h2>
            <form onSubmit={onSubmit}>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2" htmlFor="name">
                  Nome do Grupo *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  onChange={onChange}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded py-2 px-3 focus:outline-none focus:border-yellow-500"
                  placeholder="Ex: Bebedores de Plantão"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-300 mb-2" htmlFor="description">
                  Descrição
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={description}
                  onChange={onChange}
                  className="w-full bg-gray-700 text-white border border-gray-600 rounded py-2 px-3 focus:outline-none focus:border-yellow-500"
                  placeholder="Descreva seu grupo..."
                  rows="3"
                ></textarea>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
                >
                  Criar Grupo
                </button>
              </div>
            </form>
          </div>
        )}
        
        {groups.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-400 mb-4">Você ainda não participa de nenhum grupo.</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
            >
              Criar Meu Primeiro Grupo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map(group => (
              <Link 
                key={group._id} 
                href={`/groups/${group._id}`}
                className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="h-40 bg-gray-700 flex items-center justify-center">
                  {group.groupImage ? (
                    <img 
                      src={group.groupImage} 
                      alt={group.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-5xl text-yellow-500">🍻</span>
                  )}
                </div>
                <div className="p-6">
                  <h2 className="text-xl font-bold text-yellow-500 mb-2">{group.name}</h2>
                  {group.description && (
                    <p className="text-gray-300 mb-4 line-clamp-2">{group.description}</p>
                  )}
                  <div className="flex justify-between items-center">
                    <div className="text-gray-400 text-sm">
                      {group.members.length} {group.members.length === 1 ? 'membro' : 'membros'}
                    </div>
                    <div className="flex space-x-2">
                      <div className="bg-gray-700 px-2 py-1 rounded text-xs text-white">
                        {group.totalDrinks || 0} bebidas
                      </div>
                      <div className="bg-gray-700 px-2 py-1 rounded text-xs text-white">
                        {(group.totalLiters || 0).toFixed(1)}L
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default GroupList;
