import React from 'react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  hasMore, 
  hasPrev, 
  onPageChange,
  className = ''
}) => {
  // Gerar array de páginas a serem exibidas
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    // Caso simples: menos páginas que o máximo visível
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }
    
    // Caso complexo: muitas páginas, mostrar apenas algumas
    // Sempre mostrar primeira, última e algumas ao redor da atual
    
    // Adicionar primeira página
    pages.push(1);
    
    // Calcular páginas do meio
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);
    
    // Ajustar se estiver no início
    if (currentPage <= 2) {
      endPage = Math.min(totalPages - 1, 4);
    }
    
    // Ajustar se estiver no fim
    if (currentPage >= totalPages - 1) {
      startPage = Math.max(2, totalPages - 3);
    }
    
    // Adicionar elipses no início se necessário
    if (startPage > 2) {
      pages.push('...');
    }
    
    // Adicionar páginas do meio
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // Adicionar elipses no fim se necessário
    if (endPage < totalPages - 1) {
      pages.push('...');
    }
    
    // Adicionar última página se houver mais de uma página
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  // Se não houver páginas, não mostrar nada
  if (totalPages <= 1) {
    return null;
  }
  
  return (
    <div className={`flex items-center justify-center my-6 ${className}`}>
      {/* Botão Anterior */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrev}
        className={`px-3 py-1 rounded-l-md ${
          hasPrev 
            ? 'bg-purple-600 hover:bg-purple-700 text-white' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        Anterior
      </button>
      
      {/* Números das Páginas */}
      {getPageNumbers().map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span className="px-3 py-1 bg-gray-200 text-gray-700">
              {page}
            </span>
          ) : (
            <button
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 ${
                currentPage === page
                  ? 'bg-purple-700 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}
      
      {/* Botão Próximo */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasMore}
        className={`px-3 py-1 rounded-r-md ${
          hasMore 
            ? 'bg-purple-600 hover:bg-purple-700 text-white' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        Próximo
      </button>
    </div>
  );
};

export default Pagination;
