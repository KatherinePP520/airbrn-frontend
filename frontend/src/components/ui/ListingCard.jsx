import React from "react";
import classes from "./ListingCard.module.css";
import PropTypes from "prop-types";

function ListingCard(props) {
  return (
    <div className={classes.card} onClick={props.openSingleList}>
      {props.children}
    </div>
  );
}

ListingCard.propTypes = {
  children: PropTypes.element,
  openSingleList: PropTypes.func,
};

export default ListingCard;
