import React, { useContext, useEffect } from "react";
import { Context } from "../store/ApimTokenStore";
import { useAuthContext } from "@asgardeo/auth-react";

const ChildComponent = () => {
  // get APIM token
  const [apimTokenObj, setApimTokenObj] = useContext(Context);
  // get ID token
  const [idToken, setIdToken] = useContext(Context);
  const {
    state,
    signIn,
    signOut,
    getBasicUserInfo,
    getIDToken,
    getDecodedIDToken,
  } = useAuthContext();

  useEffect(async () => {
    setIdToken(await getIDToken());
  }, []);
  return <div>Home page content</div>;
};

export default ChildComponent;
