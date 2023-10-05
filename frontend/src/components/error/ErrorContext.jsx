import React, { createContext, useState } from "react";
import ErrorModal from "./ErrorModal";
import PropTypes from "prop-types";

const ErrorContext = createContext({
  setHasError: () => {},
  setErrorMessage: () => {},
});

export function ErrorContextProvider(props) {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const context = {
    setHasError: setHasError,
    setErrorMessage: setErrorMessage,
  };

  function handleClose() {
    setHasError(false);
    setErrorMessage("");
  }

  return (
    <ErrorContext.Provider value={context}>
      {props.children}
      <ErrorModal
        show={hasError}
        handleClose={handleClose}
        errorMessage={errorMessage}
      />
    </ErrorContext.Provider>
  );
}

ErrorContextProvider.propTypes = {
  children: PropTypes.element,
};

export default ErrorContext;
