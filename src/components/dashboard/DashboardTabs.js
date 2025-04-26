"use client";

import { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import Dashboard from './Dashboard';
import RankingList from './RankingList';
import GroupStats from './GroupStats';

const DashboardTabs = ({ groupId }) => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div>
      {/* Tabs */}
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
            activeTab === 'ranking'
              ? 'text-yellow-500 border-b-2 border-yellow-500'
              : 'text-gray-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('ranking')}
        >
          Ranking
        </button>
        <button
          className={`py-3 px-6 font-medium ${
            activeTab === 'stats'
              ? 'text-yellow-500 border-b-2 border-yellow-500'
              : 'text-gray-400 hover:text-white'
          }`}
          onClick={() => setActiveTab('stats')}
        >
          Estatísticas
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'dashboard' && <Dashboard groupId={groupId} />}
      {activeTab === 'ranking' && <RankingList groupId={groupId} />}
      {activeTab === 'stats' && <GroupStats groupId={groupId} />}
    </div>
  );
};

export default DashboardTabs;
