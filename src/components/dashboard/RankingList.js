"use client";

import { useState, useEffect, useContext } from 'react';
import GroupContext from '@/context/group/GroupContext';
import DrinkContext from '@/context/drink/DrinkContext';

const RankingList = ({ groupId }) => {
  const { currentGroup, getGroup } = useContext(GroupContext);
  const { getGroupDrinks, groupDrinks } = useContext(DrinkContext);
  
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState([]);
  const [sortBy, setSortBy] = useState('points');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await getGroup(groupId);
      await getGroupDrinks(groupId);
      setLoading(false);
    };
    
    loadData();
  }, [groupId]);

  useEffect(() => {
    if (currentGroup && currentGroup.members) {
      // Criar cópia dos membros para ordenação
      const membersList = [...currentGroup.members].map(member => ({
        ...member,
        user: {
          ...member.user,
          totalDrinks: member.user.totalDrinks || 0,
          totalLiters: member.user.totalLiters || 0,
          totalPoints: member.user.totalPoints || 0,
          totalPartyHours: member.user.totalPartyHours || 0
        }
      }));
      
      // Ordenar membros
      membersList.sort((a, b) => {
        if (sortOrder === 'desc') {
          return b.user[sortBy] - a.user[sortBy];
        } else {
          return a.user[sortBy] - b.user[sortBy];
        }
      });
      
      setMembers(membersList);
    }
  }, [currentGroup, sortBy, sortOrder]);

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
    <div className="bg-gray-900 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-yellow-500 mb-6">Ranking de Bebedores</h2>
      
      <div className="mb-4 flex justify-end">
        <div className="inline-flex rounded-md shadow-sm">
          <button
            onClick={() => handleSortChange('points')}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              sortBy === 'points' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Pontos {sortBy === 'points' && (sortOrder === 'desc' ? '↓' : '↑')}
          </button>
          <button
            onClick={() => handleSortChange('totalDrinks')}
            className={`px-4 py-2 text-sm font-medium ${
              sortBy === 'totalDrinks' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Bebidas {sortBy === 'totalDrinks' && (sortOrder === 'desc' ? '↓' : '↑')}
          </button>
          <button
            onClick={() => handleSortChange('totalLiters')}
            className={`px-4 py-2 text-sm font-medium ${
              sortBy === 'totalLiters' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Litros {sortBy === 'totalLiters' && (sortOrder === 'desc' ? '↓' : '↑')}
          </button>
          <button
            onClick={() => handleSortChange('totalPartyHours')}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              sortBy === 'totalPartyHours' 
                ? 'bg-yellow-600 text-white' 
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Horas {sortBy === 'totalPartyHours' && (sortOrder === 'desc' ? '↓' : '↑')}
          </button>
        </div>
      </div>
      
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-700">
              <th className="py-3 px-4 text-left text-yellow-500">#</th>
              <th className="py-3 px-4 text-left text-yellow-500">Membro</th>
              <th className="py-3 px-4 text-right text-yellow-500">Pontos</th>
              <th className="py-3 px-4 text-right text-yellow-500">Bebidas</th>
              <th className="py-3 px-4 text-right text-yellow-500">Litros</th>
              <th className="py-3 px-4 text-right text-yellow-500">Horas de Festa</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => (
              <tr key={index} className={`border-t border-gray-700 ${index < 3 ? 'bg-gray-700 bg-opacity-50' : ''}`}>
                <td className="py-3 px-4 text-white">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1}
                </td>
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
                <td className="py-3 px-4 text-white text-right font-bold">
                  {member.user.totalPoints}
                </td>
                <td className="py-3 px-4 text-white text-right">
                  {member.user.totalDrinks}
                </td>
                <td className="py-3 px-4 text-white text-right">
                  {member.user.totalLiters.toFixed(1)}
                </td>
                <td className="py-3 px-4 text-white text-right">
                  {member.user.totalPartyHours.toFixed(1)}
                </td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr>
                <td colSpan="6" className="py-4 text-center text-gray-500">Nenhum dado disponível</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 bg-gray-800 p-4 rounded-lg">
        <h3 className="text-lg font-bold text-yellow-500 mb-2">Sistema de Pontuação</h3>
        <ul className="text-gray-300 text-sm space-y-1">
          <li>• Cerveja: 1 ponto por 100ml</li>
          <li>• Vinho: 2 pontos por 100ml</li>
          <li>• Destilado: 4 pontos por 100ml</li>
          <li>• Coquetel: 2.5 pontos por 100ml</li>
          <li>• Shot: 10 pontos por 100ml</li>
        </ul>
      </div>
    </div>
  );
};

export default RankingList;
