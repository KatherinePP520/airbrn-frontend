import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { UserContextProvider } from "./components/store/user-context";
import { ErrorContextProvider } from "./components/error/ErrorContext";
import "./index.css";
import App from "./App";
// import ErrorBoundary from "./components/error/ErrorBoundary";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <ErrorContextProvider>
      <UserContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </UserContextProvider>
    </ErrorContextProvider>
  </React.StrictMode>
);
