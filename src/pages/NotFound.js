import React from "react";
import { useHistory } from "react-router-dom";

const NotFound = () => {
  const history = useHistory();
  return (
    <div>
      <h3>404: Page not found</h3>
      <button
        className="btn primary"
        onClick={() => {
          history.push("/");
        }}
      >
        Go back to home
      </button>
    </div>
  );
};

export default NotFound;
