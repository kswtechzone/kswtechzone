'use client';

import * as React from 'react';
import type { AuthUser, AuthProviderProps, AuthState, AuthAction } from '../types';

const AuthContext = React.createContext<{
  user: AuthUser | null;
  isLoading: boolean;
  error: Error | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getAccessToken: () => Promise<string | undefined>;
} | null>(null);

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { ...state, isLoading: false, user: action.payload, error: null };
    case 'LOGIN_ERROR':
      return { ...state, isLoading: false, error: action.payload };
    case 'LOGOUT':
      return { ...state, user: null, isLoading: false, error: null };
    case 'SET_USER':
      return { ...state, user: action.payload, isLoading: false };
    default:
      return state;
  }
}

function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = React.useReducer(authReducer, {
    user: null,
    isLoading: true,
    error: null,
  });

  React.useEffect(() => {
    async function initAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const user = await res.json();
          dispatch({ type: 'SET_USER', payload: user });
        } else {
          dispatch({ type: 'SET_USER', payload: null });
        }
      } catch {
        dispatch({ type: 'SET_USER', payload: null });
      }
    }
    initAuth();
  }, []);

  const login = async () => {
    dispatch({ type: 'LOGIN_START' });
    try {
      window.location.href = '/auth/login';
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR', payload: error as Error });
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      dispatch({ type: 'LOGOUT' });
      window.location.href = '/';
    } catch {
      dispatch({ type: 'LOGOUT' });
    }
  };

  const getAccessToken = async (): Promise<string | undefined> => {
    try {
      const res = await fetch('/api/auth/token');
      if (res.ok) {
        const data = await res.json();
        return data.accessToken;
      }
    } catch {
      return undefined;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isLoading: state.isLoading,
        error: state.error,
        login,
        logout,
        getAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, AuthContext };
