import React, { createContext, useContext, useReducer, useMemo, useEffect } from 'react';
import { getSession, setSession, clearSession, getCollection } from '../data/db';

import type { Role, User } from '../data/types';

interface AuthState {
  user: User | null;
  session: { userId: number; role: Role } | null;
}

type AuthAction =
  | { type: 'LOGIN'; user: User }
  | { type: 'LOGOUT' }
  | { type: 'SWITCH_ROLE'; role: Role };

const AuthContext = createContext<{ state: AuthState; action: (a: AuthAction) => void }>({
  state: { user: null, session: null },
  action: () => {},
});

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN': {
      const u = action.user;
      setSession({ userId: u.id, role: u.role });
      return { user: u, session: { userId: u.id, role: u.role } };
    }
    case 'LOGOUT':
      clearSession();
      return { user: null, session: null };
    case 'SWITCH_ROLE': {
      const user = state.user!;
      setSession({ userId: user.id, role: action.role });
      return { ...state, session: { userId: user.id, role: action.role } };
    }
    default:
      return state;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, { user: null, session: null });

  // Hydrate from localStorage on init
  useEffect(() => {
    const session = getSession();
    if (session && session.userId) {
      const users = getCollection<User>('users');
      const user = users.find(u => u.id === session.userId) || null;
      dispatch({ type: 'LOGIN', user: user || { id: session.userId, name: '', email: '', password: '', role: session.role } });
    }
  }, []);

  const value = useMemo(() => ({ state, action: dispatch }), [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

export function login(email: string, password: string): User | null {
  const users = getCollection<User>('users');
  const found = users.find(u => u.email === email && u.password === password);
  return found || null;
}

// These functions take dispatch from the caller to avoid hook rules
export function switchRole(session: { userId: number; role: Role } | null, role: Role, dispatch: (a: AuthAction) => void): boolean {
  if (!session || !session.userId) return false;
  setSession({ userId: session.userId, role });
  dispatch({ type: 'SWITCH_ROLE', role });
  return true;
}

export function logout(dispatch: (a: AuthAction) => void) {
  dispatch({ type: 'LOGOUT' });
}
