"use client";

import { useState, useEffect, useContext } from 'react';
import GroupContext from '@/context/group/GroupContext';
import DrinkContext from '@/context/drink/DrinkContext';
import EventContext from '@/context/event/EventContext';

const GroupStats = ({ groupId }) => {
  const { currentGroup, getGroup } = useContext(GroupContext);
  const { getGroupDrinks, groupDrinks } = useContext(DrinkContext);
  const { getGroupEvents, groupEvents } = useContext(EventContext);
  
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDrinks: 0,
    totalLiters: 0,
    totalPoints: 0,
    totalPartyHours: 0,
    totalEvents: 0,
    upcomingEvents: 0
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await getGroup(groupId);
      await getGroupDrinks(groupId);
      await getGroupEvents(groupId);
      setLoading(false);
    };
    
    loadData();
  }, [groupId]);

  useEffect(() => {
    if (currentGroup) {
      const now = new Date();
      const upcoming = groupEvents.filter(event => new Date(event.startDate) > now).length;
      
      setStats({
        totalDrinks: currentGroup.totalDrinks || 0,
        totalLiters: currentGroup.totalLiters || 0,
        totalPoints: currentGroup.totalPoints || 0,
        totalPartyHours: currentGroup.totalPartyHours || 0,
        totalEvents: groupEvents.length,
        upcomingEvents: upcoming
      });
    }
  }, [currentGroup, groupEvents]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-yellow-500 mb-6">Estatísticas do Grupo</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <p className="text-yellow-500 text-3xl font-bold">{stats.totalEvents}</p>
          <p className="text-gray-400">Eventos</p>
        </div>
        <div className="bg-gray-800 p-4 rounded-lg text-center">
          <p className="text-yellow-500 text-3xl font-bold">{stats.upcomingEvents}</p>
          <p className="text-gray-400">Eventos Futuros</p>
        </div>
      </div>
      
      {/* Estatísticas por membro */}
      <div className="mt-8">
        <h3 className="text-xl font-bold text-yellow-500 mb-4">Média por Membro</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <p className="text-yellow-500 text-2xl font-bold">
              {currentGroup.members && currentGroup.members.length > 0 
                ? (stats.totalDrinks / currentGroup.members.length).toFixed(1) 
                : '0'}
            </p>
            <p className="text-gray-400 text-sm">Bebidas por Membro</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <p className="text-yellow-500 text-2xl font-bold">
              {currentGroup.members && currentGroup.members.length > 0 
                ? (stats.totalLiters / currentGroup.members.length).toFixed(1) 
                : '0'}
            </p>
            <p className="text-gray-400 text-sm">Litros por Membro</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <p className="text-yellow-500 text-2xl font-bold">
              {currentGroup.members && currentGroup.members.length > 0 
                ? (stats.totalPoints / currentGroup.members.length).toFixed(0) 
                : '0'}
            </p>
            <p className="text-gray-400 text-sm">Pontos por Membro</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <p className="text-yellow-500 text-2xl font-bold">
              {currentGroup.members && currentGroup.members.length > 0 
                ? (stats.totalPartyHours / currentGroup.members.length).toFixed(1) 
                : '0'}
            </p>
            <p className="text-gray-400 text-sm">Horas por Membro</p>
          </div>
        </div>
      </div>
      
      {/* Estatísticas por evento */}
      {stats.totalEvents > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-bold text-yellow-500 mb-4">Média por Evento</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <p className="text-yellow-500 text-2xl font-bold">
                {(stats.totalDrinks / stats.totalEvents).toFixed(1)}
              </p>
              <p className="text-gray-400 text-sm">Bebidas por Evento</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <p className="text-yellow-500 text-2xl font-bold">
                {(stats.totalLiters / stats.totalEvents).toFixed(1)}
              </p>
              <p className="text-gray-400 text-sm">Litros por Evento</p>
            </div>
            <div className="bg-gray-800 p-4 rounded-lg text-center">
              <p className="text-yellow-500 text-2xl font-bold">
                {(stats.totalPartyHours / stats.totalEvents).toFixed(1)}
              </p>
              <p className="text-gray-400 text-sm">Horas por Evento</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupStats;
