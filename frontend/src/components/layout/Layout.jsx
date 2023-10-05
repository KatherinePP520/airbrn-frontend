import React from "react";
import MainNavigation from "./MainNavigation";
import classes from "./Layout.module.css";
import PropTypes from "prop-types";

function Layout(props) {
  return (
    <div>
      <MainNavigation />
      <main className={classes.main}>{props.children}</main>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.element,
};

export default Layout;
