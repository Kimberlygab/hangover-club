"use client";

import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import DrinkContext from '@/context/drink/DrinkContext';
import GroupContext from '@/context/group/GroupContext';
import AuthContext from '@/context/auth/AuthContext';
import DrinkImageUploader from './DrinkImageUploader';

const DrinkForm = ({ groupId, eventId = null }) => {
  const { addDrink } = useContext(DrinkContext);
  const { currentGroup } = useContext(GroupContext);
  const { user } = useContext(AuthContext);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    type: 'Cerveja',
    brand: '',
    amount: '',
    location: '',
    photo: '',
    groupId: groupId
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { name, type, brand, amount, location, photo } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageUploaded = (imageUrl) => {
    setFormData({ ...formData, photo: imageUrl });
  };

  const onSubmit = async e => {
    e.preventDefault();
    
    if (!name || !brand || !amount || !photo) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    if (!photo) {
      setError('A foto da bebida é obrigatória');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const drinkData = {
        ...formData,
        amount: parseInt(amount),
        eventId: eventId
      };

      const result = await addDrink(drinkData);
      
      if (result) {
        // Redirecionar para a página do grupo
        router.push(`/groups/${groupId}`);
      } else {
        setError('Erro ao registrar bebida');
      }
    } catch (err) {
      setError('Erro ao registrar bebida');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-yellow-500 mb-6">Registrar Bebida</h2>
      
      {error && (
        <div className="bg-red-900 text-white p-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={onSubmit}>
        <div className="mb-4">
          <label className="block text-yellow-500 mb-2" htmlFor="name">
            Nome da Bebida
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={onChange}
            className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3 focus:outline-none focus:border-yellow-500"
            placeholder="Ex: Heineken Long Neck"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-yellow-500 mb-2" htmlFor="type">
            Tipo de Bebida
          </label>
          <select
            id="type"
            name="type"
            value={type}
            onChange={onChange}
            className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3 focus:outline-none focus:border-yellow-500"
            required
          >
            <option value="Cerveja">Cerveja</option>
            <option value="Vinho">Vinho</option>
            <option value="Destilado">Destilado</option>
            <option value="Coquetel">Coquetel</option>
            <option value="Shot">Shot</option>
            <option value="Outro">Outro</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block text-yellow-500 mb-2" htmlFor="brand">
            Marca
          </label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={brand}
            onChange={onChange}
            className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3 focus:outline-none focus:border-yellow-500"
            placeholder="Ex: Heineken"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-yellow-500 mb-2" htmlFor="amount">
            Quantidade (ml)
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={amount}
            onChange={onChange}
            className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3 focus:outline-none focus:border-yellow-500"
            placeholder="Ex: 350"
            min="1"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-yellow-500 mb-2" htmlFor="location">
            Local (opcional)
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={location}
            onChange={onChange}
            className="w-full bg-gray-800 text-white border border-gray-700 rounded py-2 px-3 focus:outline-none focus:border-yellow-500"
            placeholder="Ex: Bar do Zé"
          />
        </div>
        
        <div className="mb-6">
          <DrinkImageUploader onImageUploaded={handleImageUploaded} />
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Registrar Bebida'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DrinkForm;
