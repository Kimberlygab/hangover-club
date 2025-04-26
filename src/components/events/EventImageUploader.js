"use client";

import { useState, useEffect } from 'react';
import ImageUploader from '../common/ImageUploader';

const EventImageUploader = ({ onImageUploaded }) => {
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');

  // Quando a imagem for carregada com sucesso
  const handleUploadComplete = (url) => {
    setImageUrl(url);
    if (onImageUploaded) {
      onImageUploaded(url);
    }
  };

  return (
    <div>
      <label className="block text-yellow-500 mb-2">
        Imagem do Evento (opcional)
      </label>
      
      <ImageUploader onUploadComplete={handleUploadComplete} />
      
      {imageUrl && (
        <div className="mt-2">
          <p className="text-green-500 text-sm mb-1">✓ Imagem carregada com sucesso!</p>
        </div>
      )}
      
      <p className="text-gray-400 text-sm mt-2">
        Adicione uma imagem para o seu evento. Isso ajudará os participantes a identificá-lo.
      </p>
    </div>
  );
};

export default EventImageUploader;
