"use client";

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import GroupContext from '@/context/group/GroupContext';
import DrinkContext from '@/context/drink/DrinkContext';
import EventContext from '@/context/event/EventContext';
import AuthContext from '@/context/auth/AuthContext';
import Navbar from '@/components/layout/Navbar';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import DrinkList from '@/components/drinks/DrinkList';
import EventList from '@/components/events/EventList';

const GroupDetail = ({ params }) => {
  const { id } = params;
  const { currentGroup, getGroup, loading: groupLoading } = useContext(GroupContext);
  const { getGroupDrinks, loading: drinksLoading } = useContext(DrinkContext);
  const { getGroupEvents, loading: eventsLoading } = useContext(EventContext);
  const { isAuthenticated } = useContext(AuthContext);
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState('dashboard');
  
  useEffect(() => {
    if (isAuthenticated) {
      getGroup(id);
      getGroupDrinks(id);
      getGroupEvents(id);
    } else {
      router.push('/login');
    }
  }, [isAuthenticated, id]);
  
  const loading = groupLoading || drinksLoading || eventsLoading;
  
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
  
  if (!currentGroup) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-900 text-white p-4 rounded">
            Grupo não encontrado ou você não tem permissão para acessá-lo.
          </div>
          <div className="mt-4">
            <Link href="/groups" className="text-yellow-500 hover:underline">
              Voltar para meus grupos
            </Link>
          </div>
        </div>
      </>
    );
  }
  
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        {/* Cabeçalho do grupo */}
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg mb-8">
          <div className="md:flex">
            <div className="md:w-1/3 h-48 md:h-auto bg-gray-700 flex items-center justify-center">
              {currentGroup.groupImage ? (
                <img 
                  src={currentGroup.groupImage} 
                  alt={currentGroup.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-6xl text-yellow-500">🍻</span>
              )}
            </div>
            <div className="p-6 md:w-2/3">
              <h1 className="text-3xl font-bold text-yellow-500 mb-2">{currentGroup.name}</h1>
              {currentGroup.description && (
                <p className="text-gray-300 mb-4">{currentGroup.description}</p>
              )}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="bg-gray-700 p-3 rounded text-center">
                  <p className="text-yellow-500 text-xl font-bold">{currentGroup.totalDrinks || 0}</p>
                  <p className="text-gray-400 text-sm">Bebidas</p>
                </div>
                <div className="bg-gray-700 p-3 rounded text-center">
                  <p className="text-yellow-500 text-xl font-bold">{(currentGroup.totalLiters || 0).toFixed(1)}</p>
                  <p className="text-gray-400 text-sm">Litros</p>
                </div>
                <div className="bg-gray-700 p-3 rounded text-center">
                  <p className="text-yellow-500 text-xl font-bold">{currentGroup.totalPoints || 0}</p>
                  <p className="text-gray-400 text-sm">Pontos</p>
                </div>
                <div className="bg-gray-700 p-3 rounded text-center">
                  <p className="text-yellow-500 text-xl font-bold">{(currentGroup.totalPartyHours || 0).toFixed(1)}</p>
                  <p className="text-gray-400 text-sm">Horas de Festa</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs de navegação */}
        <div className="flex border-b border-gray-700 mb-6">
          <button
            className={`py-3 px-6 font-medium ${
              activeTab === 'dashboard'
                ? 'text-yellow-500 border-b-2 border-yellow-500'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`py-3 px-6 font-medium ${
              activeTab === 'drinks'
                ? 'text-yellow-500 border-b-2 border-yellow-500'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('drinks')}
          >
            Bebidas
          </button>
          <button
            className={`py-3 px-6 font-medium ${
              activeTab === 'events'
                ? 'text-yellow-500 border-b-2 border-yellow-500'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('events')}
          >
            Eventos
          </button>
          <button
            className={`py-3 px-6 font-medium ${
              activeTab === 'members'
                ? 'text-yellow-500 border-b-2 border-yellow-500'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('members')}
          >
            Membros
          </button>
        </div>
        
        {/* Conteúdo das tabs */}
        {activeTab === 'dashboard' && <DashboardTabs groupId={id} />}
        
        {activeTab === 'drinks' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-yellow-500">Bebidas do Grupo</h2>
              <Link 
                href={`/groups/${id}/drinks/new`}
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
              >
                Registrar Bebida
              </Link>
            </div>
            <DrinkList groupId={id} />
          </div>
        )}
        
        {activeTab === 'events' && (
          <div>
            <EventList groupId={id} />
          </div>
        )}
        
        {activeTab === 'members' && (
          <div>
            <h2 className="text-2xl font-bold text-yellow-500 mb-6">Membros do Grupo</h2>
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-700">
                    <th className="py-3 px-4 text-left text-yellow-500">Membro</th>
                    <th className="py-3 px-4 text-center text-yellow-500">Função</th>
                    <th className="py-3 px-4 text-right text-yellow-500">Desde</th>
                  </tr>
                </thead>
                <tbody>
                  {currentGroup.members.map((member, index) => (
                    <tr key={index} className="border-t border-gray-700">
                      <td className="py-3 px-4 text-white flex items-center">
                        {member.user.profilePicture && (
                          <img 
                            src={member.user.profilePicture} 
                            alt={member.user.name} 
                            className="w-8 h-8 rounded-full mr-2 object-cover"
                          />
                        )}
                        <span>{member.user.name}</span>
                      </td>
                      <td className="py-3 px-4 text-white text-center">
                        <span className={`px-2 py-1 rounded text-xs ${
                          member.role === 'admin' ? 'bg-yellow-600' : 'bg-gray-600'
                        }`}>
                          {member.role === 'admin' ? 'Administrador' : 'Membro'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-white text-right">
                        {new Date(member.joinedAt).toLocaleDateString('pt-BR')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default GroupDetail;
