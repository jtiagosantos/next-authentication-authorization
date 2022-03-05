import { createContext, useEffect, useState } from 'react';
import Router from 'next/router';
import { setCookie, parseCookies, destroyCookie } from 'nookies';
import { signInUserService } from '../services/user/sign-in';
import { getLoggedUserDataService } from '../services/user/get-logged-user-data';
import { SmartAxiosDefaults } from '../services/axios/api';
import { api } from '../services/axios/apiClient';

export interface User {
  email: string;
  permissions: Array<string>;
  roles: Array<string>;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  signIn: (credenbtials: SignInCredentials) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
  user: User;
}

let authChannel: BroadcastChannel;

export function signOut() {
  destroyCookie(undefined, 'nextauth.token');
  destroyCookie(undefined, 'nextauth.refreshToken');

  authChannel.postMessage('signOut');

  Router.push('/');
}

export const AuthContext = createContext({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User>();
  const isAuthenticated = !!user;

  useEffect(() => {
    authChannel = new BroadcastChannel('auth');

    authChannel.onmessage = (message) => {
      switch (message.data) {
        case 'signOut':
          signOut();
          break;
        default:
          break;
      }
    };
  });

  useEffect(() => {
    (async () => {
      const { 'nextauth.token': token } = parseCookies();

      if (token) {
        try {
          const userLogged = await getLoggedUserDataService();

          setUser({
            email: userLogged.email,
            permissions: userLogged.permissions,
            roles: userLogged.roles,
          });
        } catch {
          signOut();
        }
      }
    })();
  }, []);

  const signIn = async ({ email, password }: SignInCredentials) => {
    const data = await signInUserService({ email, password });

    const { token, refreshToken } = data;

    const THIRTY_DAYS = 60 * 60 * 24 * 30;

    setCookie(undefined, 'nextauth.token', token, {
      maxAge: THIRTY_DAYS,
      path: '/', // disponível globalmente
    });
    setCookie(undefined, 'nextauth.refreshToken', refreshToken, {
      maxAge: THIRTY_DAYS,
      path: '/',
    });

    setUser({
      email,
      permissions: data.permissions,
      roles: data.roles,
    });

    const apiDefaults = api.defaults as SmartAxiosDefaults;

    apiDefaults.headers['Authorization'] = `Bearer ${token}`;

    Router.push('/dashboard');
  };

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated, user, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
