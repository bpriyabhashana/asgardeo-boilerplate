import React, { useState, useEffect } from "react";

export const Context = React.createContext();

const Store = ({ children }) => {
  const [apimTokenObj, setApimTokenObj] = useState(null);

  return (
    <Context.Provider value={[apimTokenObj, setApimTokenObj]}>
      {children}
    </Context.Provider>
  );
};

export default Store;
