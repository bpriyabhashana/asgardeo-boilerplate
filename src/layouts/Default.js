import React from "react";

const Default = (props) => {
  const { children, isLoading, hasErrors } = props;
  return (
    <div>
      {isLoading ? (
        <div className="content">Loading ...</div>
      ) : hasErrors ? (
        <div className="content">An error occured while authenticating ...</div>
      ) : (
        children
      )}
    </div>
  );
};

export default Default;
