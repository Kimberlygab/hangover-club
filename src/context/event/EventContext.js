"use client";

import { createContext, useReducer } from 'react';
import axios from 'axios';

// Criar o contexto de eventos
export const EventContext = createContext();

// Estado inicial
const initialState = {
  events: [],
  groupEvents: [],
  currentEvent: null,
  loading: true,
  error: null
};

// Reducer para gerenciar o estado de eventos
const eventReducer = (state, action) => {
  switch (action.type) {
    case 'GET_GROUP_EVENTS':
      return {
        ...state,
        groupEvents: action.payload,
        loading: false
      };
    case 'GET_EVENT':
      return {
        ...state,
        currentEvent: action.payload,
        loading: false
      };
    case 'CREATE_EVENT':
      return {
        ...state,
        groupEvents: [action.payload, ...state.groupEvents],
        loading: false
      };
    case 'UPDATE_EVENT':
      return {
        ...state,
        groupEvents: state.groupEvents.map(event => 
          event._id === action.payload._id ? action.payload : event
        ),
        currentEvent: action.payload,
        loading: false
      };
    case 'UPDATE_ATTENDANCE':
      return {
        ...state,
        currentEvent: {
          ...state.currentEvent,
          attendees: action.payload
        },
        loading: false
      };
    case 'ADD_COMMENT':
      return {
        ...state,
        currentEvent: {
          ...state.currentEvent,
          comments: action.payload
        },
        loading: false
      };
    case 'EVENT_ERROR':
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

// Provedor de eventos
export const EventProvider = ({ children }) => {
  const [state, dispatch] = useReducer(eventReducer, initialState);

  // Obter eventos de um grupo
  const getGroupEvents = async (groupId) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axios.get(`/api/events/group/${groupId}`);
      dispatch({ type: 'GET_GROUP_EVENTS', payload: res.data });
    } catch (err) {
      dispatch({ 
        type: 'EVENT_ERROR', 
        payload: err.response?.data?.msg || 'Erro ao carregar eventos do grupo' 
      });
    }
  };

  // Obter um evento específico
  const getEvent = async (id) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axios.get(`/api/events/${id}`);
      dispatch({ type: 'GET_EVENT', payload: res.data });
    } catch (err) {
      dispatch({ 
        type: 'EVENT_ERROR', 
        payload: err.response?.data?.msg || 'Erro ao carregar evento' 
      });
    }
  };

  // Criar um novo evento
  const createEvent = async (formData) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axios.post('/api/events', formData);
      dispatch({ type: 'CREATE_EVENT', payload: res.data });
      return res.data;
    } catch (err) {
      dispatch({ 
        type: 'EVENT_ERROR', 
        payload: err.response?.data?.msg || 'Erro ao criar evento' 
      });
      return null;
    }
  };

  // Atualizar um evento
  const updateEvent = async (id, formData) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axios.put(`/api/events/${id}`, formData);
      dispatch({ type: 'UPDATE_EVENT', payload: res.data });
    } catch (err) {
      dispatch({ 
        type: 'EVENT_ERROR', 
        payload: err.response?.data?.msg || 'Erro ao atualizar evento' 
      });
    }
  };

  // Atualizar status de presença em um evento
  const updateAttendance = async (eventId, status) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axios.post(`/api/events/${eventId}/attend`, { status });
      dispatch({ type: 'UPDATE_ATTENDANCE', payload: res.data });
    } catch (err) {
      dispatch({ 
        type: 'EVENT_ERROR', 
        payload: err.response?.data?.msg || 'Erro ao atualizar presença' 
      });
    }
  };

  // Adicionar comentário a um evento
  const addComment = async (eventId, text) => {
    try {
      dispatch({ type: 'SET_LOADING' });
      const res = await axios.post(`/api/events/${eventId}/comment`, { text });
      dispatch({ type: 'ADD_COMMENT', payload: res.data });
    } catch (err) {
      dispatch({ 
        type: 'EVENT_ERROR', 
        payload: err.response?.data?.msg || 'Erro ao adicionar comentário' 
      });
    }
  };

  // Limpar erros
  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <EventContext.Provider
      value={{
        events: state.events,
        groupEvents: state.groupEvents,
        currentEvent: state.currentEvent,
        loading: state.loading,
        error: state.error,
        getGroupEvents,
        getEvent,
        createEvent,
        updateEvent,
        updateAttendance,
        addComment,
        clearError
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export default EventContext;
