// Exemplo de implementação de lazy loading para componentes pesados
// Arquivo: frontend/src/utils/lazyComponents.js

import dynamic from 'next/dynamic';

// Dashboard com lazy loading
export const LazyDashboard = dynamic(
  () => import('../components/dashboard/Dashboard'),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 rounded-lg p-4 h-96 w-full">
        <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
        <div className="h-32 bg-gray-300 rounded mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      </div>
    ),
    ssr: true,
  }
);

// Formulário de bebidas com lazy loading
export const LazyDrinkForm = dynamic(
  () => import('../components/drinks/DrinkForm'),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 rounded-lg p-4 h-64 w-full">
        <div className="h-8 bg-gray-300 rounded w-1/2 mb-4"></div>
        <div className="h-10 bg-gray-300 rounded mb-3"></div>
        <div className="h-10 bg-gray-300 rounded mb-3"></div>
        <div className="h-10 bg-gray-300 rounded mb-3"></div>
        <div className="h-10 bg-gray-300 rounded"></div>
      </div>
    ),
    ssr: false, // Formulários geralmente não precisam de SSR
  }
);

// Formulário de eventos com lazy loading
export const LazyEventForm = dynamic(
  () => import('../components/events/EventForm'),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 rounded-lg p-4 h-64 w-full">
        <div className="h-8 bg-gray-300 rounded w-1/2 mb-4"></div>
        <div className="h-10 bg-gray-300 rounded mb-3"></div>
        <div className="h-10 bg-gray-300 rounded mb-3"></div>
        <div className="h-10 bg-gray-300 rounded mb-3"></div>
        <div className="h-10 bg-gray-300 rounded"></div>
      </div>
    ),
    ssr: false,
  }
);

// Mapa de localização com lazy loading
export const LazyLocationMap = dynamic(
  () => import('../components/common/LocationMap'),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 rounded-lg p-4 h-48 w-full">
        <div className="h-full bg-gray-300 rounded"></div>
      </div>
    ),
    ssr: false, // Mapas geralmente dependem de APIs do navegador
  }
);

// Estatísticas detalhadas com lazy loading
export const LazyDetailedStats = dynamic(
  () => import('../components/stats/DetailedStats'),
  {
    loading: () => (
      <div className="animate-pulse bg-gray-200 rounded-lg p-4 h-80 w-full">
        <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
        <div className="h-40 bg-gray-300 rounded mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-2/3 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </div>
    ),
    ssr: true,
  }
);
