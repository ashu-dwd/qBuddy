import React, { useState } from "react";
import UserInfo from "./components/UserInfo";
import { useUserContext } from "./contexts/user.context";
import ChatInterface from "./components/ChatInterface";
import CardsPage from "./components/CardPage";
import { getLocalData, removeLocalData } from "./utils/localstorage";

const App = () => {
  //const [userInfo, setUserInfo] = useState([]);
  let isUserLoggedIn;
  const { userInfo } = useUserContext();
  removeLocalData("userData");
  if (userInfo.length === 0) {
    isUserLoggedIn = false;
    console.log("user not logged in");
  } else {
    isUserLoggedIn = true;
    console.log("user logged in");
  }
  return <div>{isUserLoggedIn ? <CardsPage /> : <UserInfo />}</div>;
};

export default App;
