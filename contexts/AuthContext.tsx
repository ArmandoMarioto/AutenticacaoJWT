import { createContext, ReactNode, useEffect, useState } from "react";
import Router from "../node_modules/next/router";
import { api } from "../service/api";
import {setCookie, parseCookies, destroyCookie} from 'nookies';

type SignInCredentials = {
  email: string;
  password: string;
};
type AuthContextData = {
  signIn(credentials: SignInCredentials): Promise<void>;
  isAuthenticated: boolean;
  user: User;
};
type AuthProviderprops = {
  children: ReactNode;
};

type User = {
  email: string;
  permissions: string[];
  roles: string[];
};

export const AuthContext = createContext({} as AuthContextData);

export function signOut() {
  destroyCookie(undefined, 'nextauth.token');
  destroyCookie(undefined, 'nextauth.refreshToken');
  Router.push('/');
}

export function AuthProvider({ children }: AuthProviderprops) {
  const [user, setUser] = useState<User>();
  const isAuthenticated = !!user;
  useEffect(() => {
    const { 'nextauth.token': token } = parseCookies();

    if (token) {
      api.get('/me').then(response => {
        const {email, permissions, roles} = response.data;
        setUser({email, permissions, roles});
      }).catch( error => {
        signOut();
      })
    }
  }, [])
  const signIn = async ({
    email,
    password,
  }: SignInCredentials): Promise<void> => {
    try {
      const response = await api.post("sessions", {
        email,
        password,
      });

      const { token, refreshToken, permissions, roles } = response.data;
      setCookie(undefined, 'nextauth.token', token, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      })
      setCookie(undefined, 'nextauth.refreshToken', refreshToken, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      })
      setUser({ 
        email,
        permissions,
        roles,
      })

      api.defaults.headers['Authorization'] = `Bearer ${token}`;
      Router.push("/dashboard");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
}
