import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import UserContext from "../store/user-context";
import ErrorContext from "../error/ErrorContext";
import makeRequest from "../../utils/helper";

import classes from "./MainNavigation.module.css";

function MainNavigation() {
  const userCtx = useContext(UserContext);
  const errorCtx = useContext(ErrorContext);

  const nagvigate = useNavigate();

  const logout = async () => {
    await makeRequest(
      "/user/auth/logout",
      "POST",
      errorCtx,
      () => { 
        userCtx.setUser({}); 
        nagvigate("/");
      },
      null,
      userCtx.user.token
    );
  };

  return (
    <header className={classes.header}>
      <div className={classes.logo}>
        <Link to="/">Airbrb</Link>
      </div>
      <nav>
        <ul>
          {(!userCtx.user || !userCtx.user.token) && (
            <>
              <li>
                <Link id = "loginBtn" to="/login">Login</Link>
              </li>
              <li>
                <Link id = "registerBtn" to="/register">Register</Link>
              </li>
            </>
          )}
          {userCtx.user && userCtx.user.token && (
            <>
              <li>
                <Link id = "myBookBtn" to="/booking">my Bookings</Link>
              </li>
              <li>
                <Link id = "myListingBtn" to="/listing/my">my Listing</Link>
              </li>
              <li id = "logoutBtn" onClick={logout}>
                <Link>Log out</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
