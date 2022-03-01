import { createContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { setCookie, parseCookies } from 'nookies';
import { signInUserService } from '../services/user/sign-in';
import { api } from '../services/axios/api';
import { getLoggedUserDataService } from '../services/user/get-logged-user-data';

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
  isAuthenticated: boolean;
  user: User;
}

export const AuthContext = createContext({} as AuthContextData);

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User>();
  const isAuthenticated = !!user;

  useEffect(() => {
    (async () => {
      const { 'nextauth.token': token } = parseCookies();

      if (token) {
        const userLogged = await getLoggedUserDataService();

        setUser({
          email: userLogged.email,
          permissions: userLogged.permissions,
          roles: userLogged.roles,
        });
      }
    })();
  }, []);

  const router = useRouter();

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

    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    router.push('/dashboard');
  };

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
};
