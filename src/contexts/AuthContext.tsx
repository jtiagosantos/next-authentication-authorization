import { createContext, ReactNode } from 'react';

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
    console.log({ email, password });
  };

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};
