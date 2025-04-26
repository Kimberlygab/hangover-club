"use client";

import { createContext, useReducer } from 'react';
import axios from 'axios';

// Criar o contexto de bebidas
export const DrinkContext = createContext();

// Estado inicial
const initialState = {
  drinks: [],
  groupDrinks: [],
  eventDrinks: [],
  loading: true,
  error: null
};

// Reducer para gerenciar o estado de bebidas
const drinkReducer = (state, action) => {
  switch (action.type) {
    case 'GET_USER_DRINKS':
      return {
        ...state,
        drinks: action.payload,
        loading: false
      };
    case 'GET_GROUP_DRINKS':
      return {
        ...state,
        groupDrinks: action.payload,
        loading: false
      };
    case 'GET_EVENT_DRINKS':
      return {
        ...state,
        eventDrinks: action.payload,
        loading: false
      };
    case 'ADD_DRINK':
      return {
        ...state,
        drinks: [action.payload, ...state.drinks],
        groupDrinks: [action.payload, ...state.groupDrinks],
        loading: false
      };
    case 'ADD_COMMENT':
      return {
        ...state,
        drinks: state.drinks.map(drink => 
          drink._id === action.payload.drinkId 
            ? { ...drink, comments: action.payload.comments } 
            : drink
        ),
        groupDrinks: state.groupDrinks.map(drink => 
          drink._id === action.payload.drinkId 
            ? { ...drink, comments: action.payload.comments } 
            : drink
        ),
        loading: false
      };
    case 'DRINK_ERROR':
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

// Provedor de bebidas
export const DrinkProvider = ({ children }) => {
  const [state, dispatch] = useReducer(drinkReducer, initialState);

  // Obter bebidas do usuário
  const getUserDrinks = async () => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axios.get('/api/drinks/user');
      dispatch({ type: 'GET_USER_DRINKS', payload: res.data });
    } catch (err) {
      dispatch({ 
        type: 'DRINK_ERROR', 
        payload: err.response?.data?.msg || 'Erro ao carregar bebidas' 
      });
    }
  };

  // Obter bebidas de um grupo
  const getGroupDrinks = async (groupId) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axios.get(`/api/drinks/group/${groupId}`);
      dispatch({ type: 'GET_GROUP_DRINKS', payload: res.data });
    } catch (err) {
      dispatch({ 
        type: 'DRINK_ERROR', 
        payload: err.response?.data?.msg || 'Erro ao carregar bebidas do grupo' 
      });
    }
  };

  // Obter bebidas de um evento
  const getEventDrinks = async (eventId) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axios.get(`/api/drinks/event/${eventId}`);
      dispatch({ type: 'GET_EVENT_DRINKS', payload: res.data });
    } catch (err) {
      dispatch({ 
        type: 'DRINK_ERROR', 
        payload: err.response?.data?.msg || 'Erro ao carregar bebidas do evento' 
      });
    }
  };

  // Adicionar uma nova bebida
  const addDrink = async (formData) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axios.post('/api/drinks', formData);
      dispatch({ type: 'ADD_DRINK', payload: res.data });
      return res.data;
    } catch (err) {
      dispatch({ 
        type: 'DRINK_ERROR', 
        payload: err.response?.data?.msg || 'Erro ao adicionar bebida' 
      });
      return null;
    }
  };

  // Adicionar comentário a uma bebida
  const addComment = async (drinkId, text) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axios.post(`/api/drinks/${drinkId}/comment`, { text });
      dispatch({ 
        type: 'ADD_COMMENT', 
        payload: { drinkId, comments: res.data } 
      });
    } catch (err) {
      dispatch({ 
        type: 'DRINK_ERROR', 
        payload: err.response?.data?.msg || 'Erro ao adicionar comentário' 
      });
    }
  };

  // Limpar erros
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <DrinkContext.Provider
      value={{
        drinks: state.drinks,
        groupDrinks: state.groupDrinks,
        eventDrinks: state.eventDrinks,
        loading: state.loading,
        error: state.error,
        getUserDrinks,
        getGroupDrinks,
        getEventDrinks,
        addDrink,
        addComment,
        clearError
      }}
    >
      {children}
    </DrinkContext.Provider>
  );
};

export default DrinkContext;
