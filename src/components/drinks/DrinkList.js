"use client";

"use client";

import { useState, useEffect, useContext } from 'react';
import DrinkContext from '@/context/drink/DrinkContext';
import DrinkItem from './DrinkItem';

const DrinkList = ({ groupId, eventId = null }) => {
  const { groupDrinks, eventDrinks, getGroupDrinks, getEventDrinks, loading } = useContext(DrinkContext);
  const [drinks, setDrinks] = useState([]);
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    if (eventId) {
      getEventDrinks(eventId);
    } else if (groupId) {
      getGroupDrinks(groupId);
    }
  }, [groupId, eventId]);

  useEffect(() => {
    // Determinar qual lista de bebidas usar
    const drinkList = eventId ? eventDrinks : groupDrinks;
    
    // Ordenar bebidas
    const sortedDrinks = [...drinkList].sort((a, b) => {
      if (sortBy === 'date') {
        return sortOrder === 'desc' 
          ? new Date(b.date) - new Date(a.date)
          : new Date(a.date) - new Date(b.date);
      } else if (sortBy === 'points') {
        return sortOrder === 'desc' 
          ? b.points - a.points
          : a.points - b.points;
      } else if (sortBy === 'amount') {
        return sortOrder === 'desc' 
          ? b.amount - a.amount
          : a.amount - b.amount;
      }
      return 0;
    });
    
    setDrinks(sortedDrinks);
  }, [groupDrinks, eventDrinks, sortBy, sortOrder, eventId]);

  const handleSortChange = (field) => {
    if (sortBy === field) {
      // Inverter a ordem se o mesmo campo for clicado novamente
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      // Novo campo, começar com ordem descendente
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div>
      {drinks.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-6 text-center">
          <p className="text-gray-400">Nenhuma bebida registrada ainda.</p>
        </div>
      ) : (
        <>
          <div className="flex justify-end mb-4">
            <div className="inline-flex rounded-md shadow-sm">
              <button
                onClick={() => handleSortChange('date')}
                className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                  sortBy === 'date' 
                    ? 'bg-yellow-600 text-white' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Data {sortBy === 'date' && (sortOrder === 'desc' ? '↓' : '↑')}
              </button>
              <button
                onClick={() => handleSortChange('points')}
                className={`px-4 py-2 text-sm font-medium ${
                  sortBy === 'points' 
                    ? 'bg-yellow-600 text-white' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Pontos {sortBy === 'points' && (sortOrder === 'desc' ? '↓' : '↑')}
              </button>
              <button
                onClick={() => handleSortChange('amount')}
                className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                  sortBy === 'amount' 
                    ? 'bg-yellow-600 text-white' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                }`}
              >
                Quantidade {sortBy === 'amount' && (sortOrder === 'desc' ? '↓' : '↑')}
              </button>
            </div>
          </div>
          
          <div>
            {drinks.map(drink => (
              <DrinkItem key={drink._id} drink={drink} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DrinkList;
