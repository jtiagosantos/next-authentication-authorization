import { createContext, ReactNode } from 'react';
import { api } from '../services/axios/api';

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  signIn: (credenbtials: SignInCredentials) => Promise<void>;
  isAuthenticated: boolean;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const isAuthenticated = false;

  const signIn = async ({ email, password }: SignInCredentials) => {
    try {
      await api.post('sessions', {
        email,
        password,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
