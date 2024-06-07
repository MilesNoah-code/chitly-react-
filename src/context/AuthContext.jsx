import PropTypes from 'prop-types';
import React, { useMemo, useReducer, createContext } from "react";

const isAuthToken = JSON.parse(localStorage.getItem("apiToken"));

const AuthContext = createContext({
  isLogin: isAuthToken,
  authLogin: () => {},
  authLogout: () => {},
});
const initialValue = {
  isLogin: isAuthToken,
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

  const authContext = useMemo(() => ({
    isLogin: auth.isLogin,
    authLogin,
    authLogout,
  }), [auth.isLogin]);

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
};

export default AuthContext;

AuthContextProvider.propTypes = {
  children: PropTypes.any,
};