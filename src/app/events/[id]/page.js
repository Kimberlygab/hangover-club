"use client";

"use client";

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import EventContext from '@/context/event/EventContext';
import DrinkContext from '@/context/drink/DrinkContext';
import GroupContext from '@/context/group/GroupContext';
import AuthContext from '@/context/auth/AuthContext';
import Navbar from '@/components/layout/Navbar';
import DrinkList from '@/components/drinks/DrinkList';
import DrinkForm from '@/components/drinks/DrinkForm';

const EventDetail = ({ params }) => {
  const { id: eventId } = params;
  const { currentEvent, getEvent, loading: eventLoading } = useContext(EventContext);
  const { getEventDrinks, loading: drinksLoading } = useContext(DrinkContext);
  const { isAuthenticated } = useContext(AuthContext);
  const router = useRouter();
  
  const [showAddDrink, setShowAddDrink] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      if (isAuthenticated) {
        setLoading(true);
        await getEvent(eventId);
        await getEventDrinks(eventId);
        setLoading(false);
      } else {
        router.push('/login');
      }
    };
    
    loadData();
  }, [isAuthenticated, eventId]);
  
  const formatDate = (dateString) => {
    const options = { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };
  
  if (loading || eventLoading || drinksLoading) {
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
  
  if (!currentEvent) {
    return (
      <>
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-900 text-white p-4 rounded">
            Evento não encontrado ou você não tem permissão para acessá-lo.
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
  
  // Calcular se o evento é passado, atual ou futuro
  const now = new Date();
  const startDate = new Date(currentEvent.startDate);
  const endDate = new Date(currentEvent.endDate);
  const eventStatus = now < startDate ? 'future' : (now > endDate ? 'past' : 'current');
  
  // Calcular duração do evento em horas
  const durationHours = (endDate - startDate) / (1000 * 60 * 60);
  
  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href={`/groups/${currentEvent.group._id}`} className="text-yellow-500 hover:underline flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Voltar para {currentEvent.group.name}
          </Link>
        </div>
        
        {/* Detalhes do evento */}
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg mb-8">
          <div className="md:flex">
            <div className="md:w-1/3 h-48 md:h-auto bg-gray-700 flex items-center justify-center">
              {currentEvent.eventImage ? (
                <img 
                  src={currentEvent.eventImage} 
                  alt={currentEvent.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-6xl text-yellow-500">🎉</span>
              )}
            </div>
            <div className="p-6 md:w-2/3">
              <div className="flex justify-between items-start">
                <h1 className="text-3xl font-bold text-yellow-500 mb-2">{currentEvent.name}</h1>
                <div className={`text-white font-bold rounded-full px-3 py-1 text-xs ${
                  eventStatus === 'future' ? 'bg-blue-600' : 
                  eventStatus === 'current' ? 'bg-green-600' : 'bg-gray-600'
                }`}>
                  {eventStatus === 'future' ? 'Futuro' : 
                   eventStatus === 'current' ? 'Acontecendo' : 'Passado'}
                </div>
              </div>
              
              <p className="text-gray-300 mb-4">{currentEvent.location}</p>
              
              {currentEvent.description && (
                <p className="text-gray-300 mb-4">{currentEvent.description}</p>
              )}
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-gray-400 text-sm">Início:</p>
                  <p className="text-white">{formatDate(currentEvent.startDate)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Término:</p>
                  <p className="text-white">{formatDate(currentEvent.endDate)}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Duração:</p>
                  <p className="text-white">{durationHours.toFixed(1)} horas</p>
                </div>
                <div>
                  <p className="text-gray-400 text-sm">Criador:</p>
                  <p className="text-white">{currentEvent.creator?.name || 'Usuário'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="bg-gray-700 p-3 rounded text-center">
                  <p className="text-yellow-500 text-xl font-bold">{currentEvent.totalDrinks || 0}</p>
                  <p className="text-gray-400 text-sm">Bebidas</p>
                </div>
                <div className="bg-gray-700 p-3 rounded text-center">
                  <p className="text-yellow-500 text-xl font-bold">{(currentEvent.totalLiters || 0).toFixed(1)}</p>
                  <p className="text-gray-400 text-sm">Litros</p>
                </div>
                <div className="bg-gray-700 p-3 rounded text-center">
                  <p className="text-yellow-500 text-xl font-bold">{currentEvent.totalPoints || 0}</p>
                  <p className="text-gray-400 text-sm">Pontos</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bebidas do evento */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-yellow-500">Bebidas do Evento</h2>
            {(eventStatus === 'current' || eventStatus === 'future') && (
              <button
                onClick={() => setShowAddDrink(!showAddDrink)}
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
              >
                {showAddDrink ? 'Cancelar' : 'Registrar Bebida'}
              </button>
            )}
          </div>
          
          {showAddDrink && (
            <div className="mb-6">
              <DrinkForm groupId={currentEvent.group._id} eventId={eventId} />
            </div>
          )}
          
          <DrinkList groupId={currentEvent.group._id} eventId={eventId} />
        </div>
        
        {/* Participantes */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-yellow-500 mb-4">Participantes</h2>
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-700">
                  <th className="py-3 px-4 text-left text-yellow-500">Membro</th>
                  <th className="py-3 px-4 text-center text-yellow-500">Status</th>
                  <th className="py-3 px-4 text-right text-yellow-500">Confirmado em</th>
                </tr>
              </thead>
              <tbody>
                {currentEvent.attendees.map((attendee, index) => (
                  <tr key={index} className="border-t border-gray-700">
                    <td className="py-3 px-4 text-white flex items-center">
                      {attendee.user.profilePicture && (
                        <img 
                          src={attendee.user.profilePicture} 
                          alt={attendee.user.name} 
                          className="w-8 h-8 rounded-full mr-2 object-cover"
                        />
                      )}
                      <span>{attendee.user.name}</span>
                    </td>
                    <td className="py-3 px-4 text-white text-center">
                      <span className={`px-2 py-1 rounded text-xs ${
                        attendee.status === 'sim' ? 'bg-green-600' : 
                        attendee.status === 'talvez' ? 'bg-yellow-600' : 'bg-red-600'
                      }`}>
                        {attendee.status === 'sim' ? 'Sim' : 
                         attendee.status === 'talvez' ? 'Talvez' : 'Não'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-white text-right">
                      {new Date(attendee.confirmedAt).toLocaleDateString('pt-BR')}
                    </td>
                  </tr>
                ))}
                {currentEvent.attendees.length === 0 && (
                  <tr>
                    <td colSpan="3" className="py-4 text-center text-gray-500">Nenhum participante confirmado</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default EventDetail;
