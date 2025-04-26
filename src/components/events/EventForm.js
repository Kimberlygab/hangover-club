"use client";

import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import EventContext from '@/context/event/EventContext';
import GroupContext from '@/context/group/GroupContext';
import AuthContext from '@/context/auth/AuthContext';

const EventForm = ({ groupId }) => {
  const { createEvent } = useContext(EventContext);
  const { currentGroup } = useContext(GroupContext);
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    eventImage: '',
    groupId: groupId
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { name, description, location, startDate, startTime, endDate, endTime } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = e => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Verificar se é uma imagem
      if (!file.type.startsWith('image/')) {
        setError('Por favor, selecione uma imagem válida');
        return;
      }
      
      // Verificar tamanho (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('A imagem deve ter no máximo 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = e => {
        setImagePreview(e.target.result);
        setFormData({ ...formData, eventImage: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async e => {
    e.preventDefault();
    
    if (!name || !location || !startDate || !startTime || !endDate || !endTime) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }

    // Verificar se a data de término é posterior à data de início
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);
    
    if (endDateTime <= startDateTime) {
      setError('A data/hora de término deve ser posterior à data/hora de início');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const eventData = {
        ...formData,
        startDate: startDateTime.toISOString(),
        endDate: endDateTime.toISOString()
      };

      // Remover campos desnecessários
      delete eventData.startTime;
      delete eventData.endTime;

      const result = await createEvent(eventData);
      
      if (result) {
        // Redirecionar para a página do grupo
        router.push(`/groups/${groupId}`);
      } else {
        setError('Erro ao criar evento');
      }
    } catch (err) {
      setError('Erro ao criar evento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-yellow-500 mb-6">Criar Novo Evento</h2>
      
      {error && (
        <div className="bg-red-900 text-white p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label className="block text-yellow-500 mb-2" htmlFor="name">
            Nome do Evento *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={onChange}
            className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3 focus:outline-none focus:border-yellow-500"
            placeholder="Ex: Happy Hour de Sexta"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-yellow-500 mb-2" htmlFor="description">
            Descrição
          </label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={onChange}
            className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3 focus:outline-none focus:border-yellow-500"
            placeholder="Detalhes sobre o evento..."
            rows="3"
          ></textarea>
        </div>
        
        <div className="mb-4">
          <label className="block text-yellow-500 mb-2" htmlFor="location">
            Local *
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={location}
            onChange={onChange}
            className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3 focus:outline-none focus:border-yellow-500"
            placeholder="Ex: Bar do Zé"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-yellow-500 mb-2" htmlFor="startDate">
              Data de Início *
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={startDate}
              onChange={onChange}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3 focus:outline-none focus:border-yellow-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-yellow-500 mb-2" htmlFor="startTime">
              Hora de Início *
            </label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={startTime}
              onChange={onChange}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3 focus:outline-none focus:border-yellow-500"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-yellow-500 mb-2" htmlFor="endDate">
              Data de Término *
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={endDate}
              onChange={onChange}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3 focus:outline-none focus:border-yellow-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-yellow-500 mb-2" htmlFor="endTime">
              Hora de Término *
            </label>
            <input
              type="time"
              id="endTime"
              name="endTime"
              value={endTime}
              onChange={onChange}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3 focus:outline-none focus:border-yellow-500"
              required
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-yellow-500 mb-2" htmlFor="eventImage">
            Imagem do Evento
          </label>
          <input
            type="file"
            id="eventImage"
            name="eventImage"
            onChange={handleImageChange}
            className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3 focus:outline-none focus:border-yellow-500"
            accept="image/*"
          />
          
          {imagePreview && (
            <div className="mt-3">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="h-40 object-contain rounded"
              />
            </div>
          )}
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            {loading ? 'Criando...' : 'Criar Evento'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
