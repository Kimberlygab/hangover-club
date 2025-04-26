"use client";

import { useState, useEffect, useContext } from 'react';
import DrinkContext from '@/context/drink/DrinkContext';
import AuthContext from '@/context/auth/AuthContext';
import Link from 'next/link';

const DrinkItem = ({ drink, groupView = false }) => {
  const { addComment } = useContext(DrinkContext);
  const { user } = useContext(AuthContext);
  
  const [showComments, setShowComments] = useState(false);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!comment.trim()) return;
    
    setLoading(true);
    await addComment(drink._id, comment);
    setComment('');
    setLoading(false);
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden mb-6">
      <div className="flex flex-col md:flex-row">
        {/* Imagem da bebida */}
        <div className="md:w-1/3">
          <img 
            src={drink.photo} 
            alt={drink.name} 
            className="w-full h-48 md:h-full object-cover"
          />
        </div>
        
        {/* Detalhes da bebida */}
        <div className="p-4 md:w-2/3">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-yellow-500">{drink.name}</h3>
              <p className="text-gray-400 text-sm mb-2">
                {formatDate(drink.date)}
                {drink.location && ` • ${drink.location}`}
              </p>
            </div>
            <div className="bg-yellow-600 text-white font-bold rounded-full h-10 w-10 flex items-center justify-center">
              {drink.points}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div>
              <p className="text-gray-400 text-sm">Tipo:</p>
              <p className="text-white">{drink.type}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Marca:</p>
              <p className="text-white">{drink.brand}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Quantidade:</p>
              <p className="text-white">{drink.amount} ml</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Usuário:</p>
              <p className="text-white">{drink.user?.name || 'Usuário'}</p>
            </div>
          </div>
          
          {drink.event && (
            <div className="mb-4">
              <p className="text-gray-400 text-sm">Evento:</p>
              <Link href={`/events/${drink.event._id}`} className="text-yellow-500 hover:underline">
                {drink.event.name}
              </Link>
            </div>
          )}
          
          {/* Seção de comentários */}
          <div className="mt-4 border-t border-gray-700 pt-3">
            <button 
              onClick={() => setShowComments(!showComments)}
              className="text-yellow-500 hover:text-yellow-400 flex items-center"
            >
              <span className="mr-1">
                {showComments ? 'Ocultar comentários' : `Ver comentários (${drink.comments?.length || 0})`}
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
                {drink.comments && drink.comments.length > 0 ? (
                  <div className="space-y-3 mb-4">
                    {drink.comments.map((comment, index) => (
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

export default DrinkItem;
