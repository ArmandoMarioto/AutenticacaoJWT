import { createContext, ReactNode, useState } from "react";
import Router from "../node_modules/next/router";
import { api } from "../service/api";
import {setCookie} from 'nookies';

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

export function AuthProvider({ children }: AuthProviderprops) {
  const [user, setUser] = useState<User>();
  const isAuthenticated = !!user;
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
