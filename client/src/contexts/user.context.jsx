import { useState, createContext, useContext } from "react";

// Context create
export const UserContext = createContext();

// Provider component
export const UserContextProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState("");

  return (
    <UserContext.Provider value={{ userInfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for using context
export const useUserContext = () => useContext(UserContext);
