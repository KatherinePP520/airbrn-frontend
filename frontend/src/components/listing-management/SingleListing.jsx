import React from "react";
import ListingCard from "../ui/ListingCard";
import classes from "./SingleListing.module.css";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Rating } from "@mui/material";
import Badge from "react-bootstrap/Badge";

function SingleListing(props) {
  let navigate = useNavigate();

  function openSingleList() {
    if (props.startDate && props.endDate) {
      navigate(
        "/listing/" +
          props.singleListing.id +
          "?start_date=" +
          props.startDate +
          "&end_date=" +
          props.endDate
      );
    } else {
      navigate("/listing/" + props.singleListing.id);
    }
  }

  // this is child, the title address etc will be passed as props from parent
  return (
    <ListingCard openSingleList={openSingleList} role="singleListing">
      <div id = {"listing-" + props.index} className={classes.item}>
        <div className={classes.image}>
          <img src={props.singleListing.thumbnail} alt="thumbnail" />
        </div>
        <div className={classes.content}>
          <h3>{props.singleListing.title}</h3>
          <h3>${props.singleListing.price}</h3>
          <h3>{props.singleListing.address.city}</h3>
          <Rating
            name="read-only"
            value={props.singleListing.averageRating}
            readOnly
            alt="rating"
          />
          <h5 className={classes.reviewCount}>
            {"(" + props.singleListing.totalReviews + ")"}
          </h5>
          {props.singleListing.booked && <Badge className = {classes.bookedBadge}>Booked</Badge>}
        </div>
      </div>
    </ListingCard>
  );
}

SingleListing.propTypes = {
  singleListing: PropTypes.object,
  index: PropTypes.number,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
};

export default SingleListing;
