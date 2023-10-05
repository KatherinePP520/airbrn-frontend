import React, { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

const UserContext = createContext({
  user: {},
  setUser: () => {},
});

export function UserContextProvider(props) {
  const [user, setUser] = useState(null);

  const context = {
    user: user,
    setUser: setUser,
  };

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (loggedInUser) {
      setUser(loggedInUser);
    } else {
      setUser({});
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  if (user) {
    return (
      <UserContext.Provider value={context}>
        {props.children}
      </UserContext.Provider>
    );
  } else {
    return <p>Loading</p>;
  }
}

UserContextProvider.propTypes = {
  children: PropTypes.element,
};

export default UserContext;
