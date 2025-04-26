"use client";

import { useState, useEffect, useContext } from 'react';
import EventContext from '@/context/event/EventContext';
import EventItem from './EventItem';
import Link from 'next/link';

const EventList = ({ groupId }) => {
  const { groupEvents, getGroupEvents, loading } = useContext(EventContext);
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getGroupEvents(groupId);
  }, [groupId]);

  useEffect(() => {
    // Filtrar eventos
    const now = new Date();
    
    let filteredEvents = [...groupEvents];
    
    if (filter === 'upcoming') {
      filteredEvents = filteredEvents.filter(event => new Date(event.startDate) > now);
    } else if (filter === 'current') {
      filteredEvents = filteredEvents.filter(event => 
        new Date(event.startDate) <= now && new Date(event.endDate) >= now
      );
    } else if (filter === 'past') {
      filteredEvents = filteredEvents.filter(event => new Date(event.endDate) < now);
    }
    
    // Ordenar eventos
    filteredEvents.sort((a, b) => {
      if (filter === 'past') {
        // Eventos passados: mais recentes primeiro
        return new Date(b.endDate) - new Date(a.endDate);
      } else {
        // Eventos futuros e atuais: mais próximos primeiro
        return new Date(a.startDate) - new Date(b.startDate);
      }
    });
    
    setEvents(filteredEvents);
  }, [groupEvents, filter]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="inline-flex rounded-md shadow-sm">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              filter === 'all' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilter('upcoming')}
            className={`px-4 py-2 text-sm font-medium ${
              filter === 'upcoming' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Futuros
          </button>
          <button
            onClick={() => setFilter('current')}
            className={`px-4 py-2 text-sm font-medium ${
              filter === 'current' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Acontecendo
          </button>
          <button
            onClick={() => setFilter('past')}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              filter === 'past' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Passados
          </button>
        </div>
        
        <Link 
          href={`/groups/${groupId}/events/new`}
          className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
        >
          Novo Evento
        </Link>
      </div>
      
      {events.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <p className="text-gray-400">Nenhum evento encontrado.</p>
        </div>
      ) : (
        <div>
          {events.map(event => (
            <EventItem key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;
