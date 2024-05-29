import React, { createContext } from "react";
import { useReducer } from "react";
let isAuthToken = JSON.parse(localStorage.getItem("apiToken"));

const AuthContext = createContext({
  isLogin: isAuthToken ? true : false,
  authLogin: () => {},
  authLogout: () => {},
});
const initialValue = {
  isLogin: isAuthToken ? true : false,
};

const authReducer = (state, action) => {
  if (action.type === "LOGIN") {
    return { ...state, isLogin: true };
  }
  if (action.type === "LOGOUT") {
    return { ...state, isLogin: false };
  }
  return state;
};

export const AuthContextProvider = ({ children }) => {
  const [auth, DispatchAuthReducer] = useReducer(authReducer, initialValue);

  const authLogin = () => {
    DispatchAuthReducer({ type: "LOGIN" });
  };

  const authLogout = () => {
    DispatchAuthReducer({ type: "LOGOUT" });
  };

  const authContext = {
    isLogin: auth.isLogin,
    authLogin,
    authLogout,
  };
  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;
