"use client";

import { useState, useEffect, useContext } from 'react';
import GroupContext from '@/context/group/GroupContext';
import DrinkContext from '@/context/drink/DrinkContext';
import AuthContext from '@/context/auth/AuthContext';

const Dashboard = ({ groupId }) => {
  const { currentGroup, getGroup } = useContext(GroupContext);
  const { getGroupDrinks, groupDrinks } = useContext(DrinkContext);
  const { user } = useContext(AuthContext);
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDrinks: 0,
    totalLiters: 0,
    totalPoints: 0,
    totalPartyHours: 0
  });
  const [userRanking, setUserRanking] = useState([]);
  const [drinkTypeStats, setDrinkTypeStats] = useState([]);
  const [timeStats, setTimeStats] = useState([]);

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
    if (currentGroup) {
      setStats({
        totalDrinks: currentGroup.totalDrinks || 0,
        totalLiters: currentGroup.totalLiters || 0,
        totalPoints: currentGroup.totalPoints || 0,
        totalPartyHours: currentGroup.totalPartyHours || 0
      });
      
      // Calcular ranking de usuários
      if (currentGroup.members && currentGroup.members.length > 0) {
        const members = [...currentGroup.members];
        
        // Ordenar por pontos (poderia ser alterado para ordenar por litros ou bebidas)
        members.sort((a, b) => {
          const userAPoints = a.user.totalPoints || 0;
          const userBPoints = b.user.totalPoints || 0;
          return userBPoints - userAPoints;
        });
        
        setUserRanking(members.slice(0, 10)); // Top 10
      }
    }
  }, [currentGroup]);

  useEffect(() => {
    if (groupDrinks && groupDrinks.length > 0) {
      // Estatísticas por tipo de bebida
      const typeStats = {};
      groupDrinks.forEach(drink => {
        if (!typeStats[drink.type]) {
          typeStats[drink.type] = {
            count: 0,
            liters: 0,
            points: 0
          };
        }
        
        typeStats[drink.type].count += 1;
        typeStats[drink.type].liters += drink.amount / 1000;
        typeStats[drink.type].points += drink.points;
      });
      
      const formattedTypeStats = Object.keys(typeStats).map(type => ({
        type,
        ...typeStats[type]
      }));
      
      // Ordenar por quantidade
      formattedTypeStats.sort((a, b) => b.count - a.count);
      
      setDrinkTypeStats(formattedTypeStats);
      
      // Estatísticas por período do dia
      const timeStats = {
        morning: { count: 0, liters: 0, points: 0 }, // 6-12h
        afternoon: { count: 0, liters: 0, points: 0 }, // 12-18h
        evening: { count: 0, liters: 0, points: 0 }, // 18-24h
        night: { count: 0, liters: 0, points: 0 } // 0-6h
      };
      
      groupDrinks.forEach(drink => {
        const hour = new Date(drink.date).getHours();
        let period;
        
        if (hour >= 6 && hour < 12) {
          period = 'morning';
        } else if (hour >= 12 && hour < 18) {
          period = 'afternoon';
        } else if (hour >= 18 && hour < 24) {
          period = 'evening';
        } else {
          period = 'night';
        }
        
        timeStats[period].count += 1;
        timeStats[period].liters += drink.amount / 1000;
        timeStats[period].points += drink.points;
      });
      
      setTimeStats([
        { period: 'Manhã (6-12h)', ...timeStats.morning },
        { period: 'Tarde (12-18h)', ...timeStats.afternoon },
        { period: 'Noite (18-24h)', ...timeStats.evening },
        { period: 'Madrugada (0-6h)', ...timeStats.night }
      ]);
    }
  }, [groupDrinks]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-yellow-500 mb-6">Dashboard do Grupo</h2>
      
      {/* Estatísticas gerais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <p className="text-yellow-500 text-3xl font-bold">{stats.totalDrinks}</p>
          <p className="text-gray-400">Bebidas</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <p className="text-yellow-500 text-3xl font-bold">{stats.totalLiters.toFixed(1)}</p>
          <p className="text-gray-400">Litros</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <p className="text-yellow-500 text-3xl font-bold">{stats.totalPoints}</p>
          <p className="text-gray-400">Pontos</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <p className="text-yellow-500 text-3xl font-bold">{stats.totalPartyHours.toFixed(1)}</p>
          <p className="text-gray-400">Horas de Festa</p>
        </div>
      </div>
      
      {/* Ranking de usuários */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-yellow-500 mb-4">Ranking de Membros</h3>
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-700">
                <th className="py-2 px-4 text-left text-yellow-500">#</th>
                <th className="py-2 px-4 text-left text-yellow-500">Membro</th>
                <th className="py-2 px-4 text-right text-yellow-500">Bebidas</th>
                <th className="py-2 px-4 text-right text-yellow-500">Litros</th>
                <th className="py-2 px-4 text-right text-yellow-500">Pontos</th>
              </tr>
            </thead>
            <tbody>
              {userRanking.map((member, index) => (
                <tr key={index} className={`border-t border-gray-700 ${member.user._id === user._id ? 'bg-gray-700' : ''}`}>
                  <td className="py-3 px-4 text-white">{index + 1}</td>
                  <td className="py-3 px-4 text-white">{member.user.name}</td>
                  <td className="py-3 px-4 text-white text-right">{member.user.totalDrinks || 0}</td>
                  <td className="py-3 px-4 text-white text-right">{(member.user.totalLiters || 0).toFixed(1)}</td>
                  <td className="py-3 px-4 text-white text-right">{member.user.totalPoints || 0}</td>
                </tr>
              ))}
              {userRanking.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-4 text-center text-gray-500">Nenhum dado disponível</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Estatísticas por tipo de bebida */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-yellow-500 mb-4">Estatísticas por Tipo de Bebida</h3>
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-700">
                <th className="py-2 px-4 text-left text-yellow-500">Tipo</th>
                <th className="py-2 px-4 text-right text-yellow-500">Quantidade</th>
                <th className="py-2 px-4 text-right text-yellow-500">Litros</th>
                <th className="py-2 px-4 text-right text-yellow-500">Pontos</th>
              </tr>
            </thead>
            <tbody>
              {drinkTypeStats.map((stat, index) => (
                <tr key={index} className="border-t border-gray-700">
                  <td className="py-3 px-4 text-white">{stat.type}</td>
                  <td className="py-3 px-4 text-white text-right">{stat.count}</td>
                  <td className="py-3 px-4 text-white text-right">{stat.liters.toFixed(1)}</td>
                  <td className="py-3 px-4 text-white text-right">{stat.points}</td>
                </tr>
              ))}
              {drinkTypeStats.length === 0 && (
                <tr>
                  <td colSpan="4" className="py-4 text-center text-gray-500">Nenhum dado disponível</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Estatísticas por período do dia */}
      <div>
        <h3 className="text-xl font-bold text-yellow-500 mb-4">Estatísticas por Período do Dia</h3>
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-700">
                <th className="py-2 px-4 text-left text-yellow-500">Período</th>
                <th className="py-2 px-4 text-right text-yellow-500">Bebidas</th>
                <th className="py-2 px-4 text-right text-yellow-500">Litros</th>
                <th className="py-2 px-4 text-right text-yellow-500">Pontos</th>
              </tr>
            </thead>
            <tbody>
              {timeStats.map((stat, index) => (
                <tr key={index} className="border-t border-gray-700">
                  <td className="py-3 px-4 text-white">{stat.period}</td>
                  <td className="py-3 px-4 text-white text-right">{stat.count}</td>
                  <td className="py-3 px-4 text-white text-right">{stat.liters.toFixed(1)}</td>
                  <td className="py-3 px-4 text-white text-right">{stat.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
