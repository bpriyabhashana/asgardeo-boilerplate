import React, { useContext, useEffect } from "react";
import { Context } from "../store/ApimTokenStore";

const ChildComponent = () => {
  const [apimTokenObj, setApimTokenObj] = useContext(Context);
  useEffect(async () => {}, []);
  return <div>Home page content</div>;
};

export default ChildComponent;
