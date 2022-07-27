import { createContext, ReactNode } from "react";

type SignInCredentials = {
  email: string;
  password: string;
};
type AuthContextData = {
  signIn(credentials: SignInCredentials): Promise<void>;
  isAuthenticated: boolean;
};
type AuthProviderprops = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderprops) {
  const isAuthenticated = false;
  const signIn = async ({
    email,
    password,
  }: SignInCredentials): Promise<void> => {
    console.log({email, password});
  };
  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}
