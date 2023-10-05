import React from "react";
import { Rating } from "@mui/material";
import PropTypes from "prop-types";

function ListingSingleReview(props) {
  return (
    <>
      <Rating name="read-only" value={props.rating} readOnly />
      <p>{props.review}</p>
    </>
  );
}

ListingSingleReview.propTypes = {
  review: PropTypes.string,
  rating: PropTypes.number,
};

export default ListingSingleReview;
