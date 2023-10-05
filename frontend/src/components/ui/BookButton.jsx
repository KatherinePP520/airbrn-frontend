import React from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import classes from "./BookButton.module.css";

function BookButton(props) {
  return (
    <Button
      id = "bookBtn"
      variant="outline-primary"
      className={classes.bookBtn}
      onClick={props.isLoggedIn ? props.submitBookHandler : props.login}
    >
      {props.isLoggedIn ? "Book" : "Log in to Book"}
    </Button>
  );
}

BookButton.propTypes = {
  isLoggedIn: PropTypes.bool,
  login: PropTypes.func,
  submitBookHandler: PropTypes.func,
};

export default BookButton;
