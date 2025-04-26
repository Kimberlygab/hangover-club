"use client";

"use client";

import React, { createContext, useContext, useState } from 'react';
import { uploadImage, deleteImage } from '../utils/firebase';

// Criar contexto de armazenamento
const StorageContext = createContext();

// Hook personalizado para usar o contexto de armazenamento
export const useStorage = () => useContext(StorageContext);

// Provedor de armazenamento
export const StorageProvider = ({ children }) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  // Função para fazer upload de imagem
  const upload = async (file, userId) => {
    if (!file) return { success: false, error: 'Nenhum arquivo fornecido' };
    
    setError(null);
    setUploading(true);
    setProgress(0);
    
    try {
      // Criar caminho para a imagem
      const timestamp = Date.now();
      const path = `images/${userId}/${timestamp}-${file.name}`;
      
      // Simular progresso de upload
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 300);
      
      // Fazer upload da imagem
      const result = await uploadImage(file, path);
      
      // Limpar intervalo e definir progresso como 100%
      clearInterval(progressInterval);
      setProgress(100);
      
      if (!result.success) {
        setError(result.error);
        setUploading(false);
        return result;
      }
      
      // Aguardar um pouco para mostrar 100% antes de finalizar
      setTimeout(() => {
        setUploading(false);
        setProgress(0);
      }, 500);
      
      return result;
    } catch (err) {
      setError(err.message);
      setUploading(false);
      return { success: false, error: err.message };
    }
  };

  // Função para excluir imagem
  const remove = async (path) => {
    if (!path) return { success: false, error: 'Caminho não fornecido' };
    
    setError(null);
    
    try {
      const result = await deleteImage(path);
      
      if (!result.success) {
        setError(result.error);
        return result;
      }
      
      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // Valor do contexto
  const value = {
    uploading,
    progress,
    error,
    upload,
    remove
  };

  return (
    <StorageContext.Provider value={value}>
      {children}
    </StorageContext.Provider>
  );
};

export default StorageContext;
