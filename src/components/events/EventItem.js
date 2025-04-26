"use client";

import { useState, useEffect, useContext } from 'react';
import EventContext from '@/context/event/EventContext';
import AuthContext from '@/context/auth/AuthContext';
import Link from 'next/link';

const EventItem = ({ event, groupView = false }) => {
  const { updateAttendance, addComment } = useContext(EventContext);
  const { user } = useContext(AuthContext);
  
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [userStatus, setUserStatus] = useState('talvez');

  useEffect(() => {
    if (user && event.attendees) {
      const userAttendance = event.attendees.find(
        attendee => attendee.user._id === user._id
      );
      if (userAttendance) {
        setUserStatus(userAttendance.status);
      }
    }
  }, [event, user]);

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

  const handleAttendanceChange = async (status) => {
    setLoading(true);
    await updateAttendance(event._id, status);
    setUserStatus(status);
    setLoading(false);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!comment.trim()) return;
    
    setLoading(true);
    await addComment(event._id, comment);
    setComment('');
    setLoading(false);
  };

  // Calcular se o evento é passado, atual ou futuro
  const now = new Date();
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);
  const eventStatus = now < startDate ? 'future' : (now > endDate ? 'past' : 'current');

  // Calcular duração do evento em horas
  const durationHours = (endDate - startDate) / (1000 * 60 * 60);

  return (
    <div className={`bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-6 border-l-4 ${
      eventStatus === 'future' ? 'border-blue-500' : 
      eventStatus === 'current' ? 'border-green-500' : 'border-gray-500'
    }`}>
      <div className="flex flex-col md:flex-row">
        {/* Imagem do evento */}
        <div className="md:w-1/3">
          {event.eventImage ? (
            <img 
              src={event.eventImage} 
              alt={event.name} 
              className="w-full h-48 md:h-full object-cover"
            />
          ) : (
            <div className="w-full h-48 md:h-full bg-gray-700 flex items-center justify-center">
              <span className="text-gray-500 text-lg">Sem imagem</span>
            </div>
          )}
        </div>
        
        {/* Detalhes do evento */}
        <div className="p-4 md:w-2/3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-yellow-500">{event.name}</h3>
              <p className="text-gray-400 text-sm mb-2">
                {event.location}
              </p>
            </div>
            <div className={`text-white font-bold rounded-full px-3 py-1 text-xs ${
              eventStatus === 'future' ? 'bg-blue-600' : 
              eventStatus === 'current' ? 'bg-green-600' : 'bg-gray-600'
            }`}>
              {eventStatus === 'future' ? 'Futuro' : 
               eventStatus === 'current' ? 'Acontecendo' : 'Passado'}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div>
              <p className="text-gray-400 text-sm">Início:</p>
              <p className="text-white">{formatDate(event.startDate)}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Término:</p>
              <p className="text-white">{formatDate(event.endDate)}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Duração:</p>
              <p className="text-white">{durationHours.toFixed(1)} horas</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Criador:</p>
              <p className="text-white">{event.creator?.name || 'Usuário'}</p>
            </div>
          </div>
          
          {event.description && (
            <div className="mb-4">
              <p className="text-gray-400 text-sm">Descrição:</p>
              <p className="text-white text-sm">{event.description}</p>
            </div>
          )}
          
          {/* Estatísticas do evento */}
          {event.totalDrinks > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-4 bg-gray-900 p-2 rounded">
              <div className="text-center">
                <p className="text-yellow-500 font-bold">{event.totalDrinks}</p>
                <p className="text-gray-400 text-xs">Bebidas</p>
              </div>
              <div className="text-center">
                <p className="text-yellow-500 font-bold">{event.totalLiters?.toFixed(1) || 0}</p>
                <p className="text-gray-400 text-xs">Litros</p>
              </div>
              <div className="text-center">
                <p className="text-yellow-500 font-bold">{event.totalPoints || 0}</p>
                <p className="text-gray-400 text-xs">Pontos</p>
              </div>
            </div>
          )}
          
          {/* Botões de presença */}
          {eventStatus !== 'past' && (
            <div className="flex space-x-2 mb-4">
              <button
                onClick={() => handleAttendanceChange('sim')}
                disabled={loading}
                className={`flex-1 py-2 px-4 rounded ${
                  userStatus === 'sim' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Sim
              </button>
              <button
                onClick={() => handleAttendanceChange('talvez')}
                disabled={loading}
                className={`flex-1 py-2 px-4 rounded ${
                  userStatus === 'talvez' 
                    ? 'bg-yellow-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Talvez
              </button>
              <button
                onClick={() => handleAttendanceChange('não')}
                disabled={loading}
                className={`flex-1 py-2 px-4 rounded ${
                  userStatus === 'não' 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                Não
              </button>
            </div>
          )}
          
          {/* Lista de participantes */}
          <div className="mb-4">
            <p className="text-gray-400 text-sm mb-2">
              Participantes ({event.attendees?.filter(a => a.status === 'sim').length || 0}):
            </p>
            <div className="flex flex-wrap gap-2">
              {event.attendees?.filter(a => a.status === 'sim').map((attendee, index) => (
                <div key={index} className="bg-gray-900 px-2 py-1 rounded text-xs text-white">
                  {attendee.user.name}
                </div>
              ))}
              {event.attendees?.filter(a => a.status === 'sim').length === 0 && (
                <p className="text-gray-500 text-xs">Ninguém confirmou presença ainda</p>
              )}
            </div>
          </div>
          
          {/* Link para bebidas do evento */}
          <div className="mb-4">
            <Link href={`/events/${event._id}/drinks`} className="text-yellow-500 hover:underline">
              Ver bebidas deste evento
            </Link>
          </div>
          
          {/* Seção de comentários */}
          <div className="mt-4 border-t border-gray-700 pt-3">
            <button 
              onClick={() => setShowComments(!showComments)}
              className="text-yellow-500 hover:text-yellow-400 flex items-center"
            >
              <span className="mr-1">
                {showComments ? 'Ocultar comentários' : `Ver comentários (${event.comments?.length || 0})`}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {showComments ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                )}
              </svg>
            </button>
            
            {showComments && (
              <div className="mt-3">
                {event.comments && event.comments.length > 0 ? (
                  <div className="space-y-3 mb-4">
                    {event.comments.map((comment, index) => (
                      <div key={index} className="bg-gray-900 p-3 rounded">
                        <div className="flex items-center mb-1">
                          <span className="font-semibold text-yellow-500">{comment.user?.name || 'Usuário'}</span>
                          <span className="text-gray-500 text-xs ml-2">{formatDate(comment.date)}</span>
                        </div>
                        <p className="text-white text-sm">{comment.text}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm my-2">Nenhum comentário ainda.</p>
                )}
                
                {/* Formulário de comentário */}
                <form onSubmit={handleCommentSubmit} className="mt-3 flex">
                  <input
                    type="text"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="flex-grow bg-gray-900 text-white border border-gray-700 rounded-l py-2 px-3 focus:outline-none focus:border-yellow-500"
                    placeholder="Adicionar comentário..."
                  />
                  <button
                    type="submit"
                    disabled={loading || !comment.trim()}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 rounded-r focus:outline-none disabled:opacity-50"
                  >
                    {loading ? '...' : 'Enviar'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventItem;
