"use client";

import { createContext, useReducer } from 'react';
import axios from 'axios';

// Criar o contexto de grupos
export const GroupContext = createContext();

// Estado inicial
const initialState = {
  groups: [],
  currentGroup: null,
  loading: true,
  error: null
};

// Reducer para gerenciar o estado de grupos
const groupReducer = (state, action) => {
  switch (action.type) {
    case 'GET_GROUPS':
      return {
        ...state,
        groups: action.payload,
        loading: false
      };
    case 'GET_GROUP':
      return {
        ...state,
        currentGroup: action.payload,
        loading: false
      };
    case 'CREATE_GROUP':
      return {
        ...state,
        groups: [action.payload, ...state.groups],
        loading: false
      };
    case 'UPDATE_GROUP':
      return {
        ...state,
        groups: state.groups.map(group => 
          group._id === action.payload._id ? action.payload : group
        ),
        currentGroup: action.payload,
        loading: false
      };
    case 'ADD_MEMBER':
      return {
        ...state,
        currentGroup: {
          ...state.currentGroup,
          members: action.payload
        },
        loading: false
      };
    case 'REMOVE_MEMBER':
      return {
        ...state,
        currentGroup: {
          ...state.currentGroup,
          members: state.currentGroup.members.filter(
            member => member.user._id !== action.payload
          )
        },
        loading: false
      };
    case 'GROUP_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: true
      };
    default:
      return state;
  }
};

// Provedor de grupos
export const GroupProvider = ({ children }) => {
  const [state, dispatch] = useReducer(groupReducer, initialState);

  // Obter todos os grupos do usuário
  const getGroups = async () => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axios.get('/api/groups');
      dispatch({ type: 'GET_GROUPS', payload: res.data });
    } catch (err) {
      dispatch({ 
        type: 'GROUP_ERROR', 
        payload: err.response?.data?.msg || 'Erro ao carregar grupos' 
      });
    }
  };

  // Obter um grupo específico
  const getGroup = async (id) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axios.get(`/api/groups/${id}`);
      dispatch({ type: 'GET_GROUP', payload: res.data });
    } catch (err) {
      dispatch({ 
        type: 'GROUP_ERROR', 
        payload: err.response?.data?.msg || 'Erro ao carregar grupo' 
      });
    }
  };

  // Criar um novo grupo
  const createGroup = async (formData) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axios.post('/api/groups', formData);
      dispatch({ type: 'CREATE_GROUP', payload: res.data });
      return res.data;
    } catch (err) {
      dispatch({ 
        type: 'GROUP_ERROR', 
        payload: err.response?.data?.msg || 'Erro ao criar grupo' 
      });
      return null;
    }
  };

  // Atualizar um grupo
  const updateGroup = async (id, formData) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axios.put(`/api/groups/${id}`, formData);
      dispatch({ type: 'UPDATE_GROUP', payload: res.data });
    } catch (err) {
      dispatch({ 
        type: 'GROUP_ERROR', 
        payload: err.response?.data?.msg || 'Erro ao atualizar grupo' 
      });
    }
  };

  // Adicionar membro ao grupo
  const addMember = async (groupId, userId) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axios.post(`/api/groups/${groupId}/members`, { userId });
      dispatch({ type: 'ADD_MEMBER', payload: res.data.members });
    } catch (err) {
      dispatch({ 
        type: 'GROUP_ERROR', 
        payload: err.response?.data?.msg || 'Erro ao adicionar membro' 
      });
    }
  };

  // Remover membro do grupo
  const removeMember = async (groupId, userId) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      await axios.delete(`/api/groups/${groupId}/members/${userId}`);
      dispatch({ type: 'REMOVE_MEMBER', payload: userId });
    } catch (err) {
      dispatch({ 
        type: 'GROUP_ERROR', 
        payload: err.response?.data?.msg || 'Erro ao remover membro' 
      });
    }
  };

  // Limpar erros
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <GroupContext.Provider
      value={{
        groups: state.groups,
        currentGroup: state.currentGroup,
        loading: state.loading,
        error: state.error,
        getGroups,
        getGroup,
        createGroup,
        updateGroup,
        addMember,
        removeMember,
        clearError
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};

export default GroupContext;
