import { createContext, useState } from 'react';
import usePersistent from './usePersistent'

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [token, setToken] = usePersistent('token',JSON.stringify(""));

  return <UserContext.Provider value={{ token, setToken }}>{children}</UserContext.Provider>;
}
