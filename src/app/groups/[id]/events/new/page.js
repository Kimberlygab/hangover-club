"use client";

"use client";

import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import EventContext from '@/context/event/EventContext';
import GroupContext from '@/context/group/GroupContext';
import AuthContext from '@/context/auth/AuthContext';
import Navbar from '@/components/layout/Navbar';
import EventForm from '@/components/events/EventForm';

const NewEvent = ({ params }) => {
  const { id: groupId } = params;
  const { currentGroup, getGroup } = useContext(GroupContext);
  const { isAuthenticated } = useContext(AuthContext);
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      if (isAuthenticated) {
        setLoading(true);
        await getGroup(groupId);
        setLoading(false);
      } else {
        router.push('/login');
      }
    };
    
    loadData();
  }, [isAuthenticated, groupId]);
  
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
        <div className="mb-6">
          <Link href={`/groups/${groupId}`} className="text-yellow-500 hover:underline flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Voltar para {currentGroup.name}
          </Link>
        </div>
        
        <h1 className="text-2xl font-bold text-yellow-500 mb-6">Criar Novo Evento</h1>
        
        <EventForm groupId={groupId} />
      </div>
    </>
  );
};

export default NewEvent;
