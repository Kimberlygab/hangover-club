"use client";

"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';

const CachedImage = ({ src, alt, width, height, className, priority = false }) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Função para verificar se a imagem está em cache
  const checkCachedImage = async (src) => {
    try {
      // Verificar se o Cache API está disponível
      if ('caches' in window) {
        const cache = await caches.open('hangover-images');
        const cachedResponse = await cache.match(src);
        
        if (cachedResponse && cachedResponse.ok) {
          // Imagem encontrada em cache
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Erro ao verificar cache:', error);
      return false;
    }
  };

  // Função para pré-carregar e cachear a imagem
  const preloadImage = async (src) => {
    try {
      setLoading(true);
      
      // Verificar se já está em cache
      const isCached = await checkCachedImage(src);
      
      if (!isCached) {
        // Se não estiver em cache, fazer o fetch e cachear
        if ('caches' in window) {
          const cache = await caches.open('hangover-images');
          await cache.add(src);
        }
      }
      
      setImageSrc(src);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao pré-carregar imagem:', error);
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (src) {
      preloadImage(src);
    }
  }, [src]);

  // Placeholder para imagens em carregamento ou com erro
  if (loading) {
    return (
      <div className={`bg-gray-200 animate-pulse ${className}`} style={{ width, height }} />
    );
  }

  if (error) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`} style={{ width, height }}>
        <span className="text-gray-500">Imagem indisponível</span>
      </div>
    );
  }

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      loading={priority ? 'eager' : 'lazy'}
    />
  );
};

export default CachedImage;
