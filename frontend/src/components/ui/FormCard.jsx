import React from "react";
import classes from "./FormCard.module.css";
import PropTypes from "prop-types";

function FormCard(props) {
  return <div className={classes.card}>{props.children}</div>;
}

FormCard.propTypes = {
  children: PropTypes.element,
};

export default FormCard;
