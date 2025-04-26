import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';

const usePagination = (initialPage = 1, initialLimit = 10) => {
  const router = useRouter();
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    currentPage: initialPage,
    limit: initialLimit,
    hasMore: false,
    hasPrev: false
  });
  
  // Atualizar URL quando a página mudar
  useEffect(() => {
    if (!router.isReady) return;
    
    const query = { ...router.query, page, limit };
    router.push(
      {
        pathname: router.pathname,
        query
      },
      undefined,
      { shallow: true }
    );
  }, [page, limit, router.isReady]);
  
  // Função para buscar dados com paginação
  const fetchData = useCallback(async (url, params = {}) => {
    try {
      setLoading(true);
      
      // Construir query string com todos os parâmetros
      const queryParams = new URLSearchParams({
        page,
        limit,
        ...params
      });
      
      const response = await fetch(`${url}?${queryParams}`);
      const result = await response.json();
      
      if (response.ok) {
        setData(result.data);
        setPagination(result.pagination);
      } else {
        console.error('Erro ao buscar dados:', result);
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);
  
  // Função para mudar de página
  const changePage = (newPage) => {
    setPage(newPage);
  };
  
  // Função para mudar o limite por página
  const changeLimit = (newLimit) => {
    setLimit(newLimit);
    setPage(1); // Voltar para a primeira página ao mudar o limite
  };
  
  return {
    page,
    limit,
    loading,
    data,
    pagination,
    changePage,
    changeLimit,
    fetchData
  };
};

export default usePagination;
