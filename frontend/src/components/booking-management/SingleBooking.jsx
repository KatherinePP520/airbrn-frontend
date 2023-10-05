import React, { useEffect } from "react";
import { useState, useContext } from "react";
import UserContext from "../store/user-context";
import ErrorContext from "../error/ErrorContext";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import classes from "./SingleBooking.module.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useNavigate } from "react-router-dom";
import makeRequest from "../../utils/helper";
import ListingCard from "../ui/ListingCard";
import PropTypes from "prop-types";
import { Rating } from "@mui/material";

function SingleBooking(props) {
  const userCtx = useContext(UserContext);
  const errorCtx = useContext(ErrorContext);

  let navigate = useNavigate();

  async function deleteBooking() {
    await makeRequest(
      "/bookings/" + props.singleBooking.id,
      "DELETE",
      errorCtx,
      () => {
        navigate("/listing/" + props.listing.id);
      },
      null,
      userCtx.user.token
    );
  }

  function getStatusClass() {
    if (props.singleBooking.status == "accepted") {
      return classes.accepted;
    }
    if (props.singleBooking.status == "pending") {
      return classes.pending;
    }
    if (props.singleBooking.status == "declined") {
      return classes.declined;
    }
    return null;
  }

  if (props.singleBooking && props.listing) {
    // this is child, the title address etc will be passed as props from parent
    return (
      <ListingCard>
        <div className={classes.content}>
          <h3>{props.listing.title}</h3>
          <h5>
            Check-in: {props.singleBooking.dateRange.startDate} Check-out:{" "}
            {props.singleBooking.dateRange.endDate}
          </h5>
          <h5>Price: ${props.singleBooking.totalPrice}</h5>
          <h5 className={getStatusClass()}>
            Status: {props.singleBooking.status}
          </h5>
          <div className={classes.btnSection}>
            <Button
              variant="outline-primary"
              className={classes.cancelBtn}
              onClick={() => navigate("/listing/" + props.listing.id)}
            >
              Visit Listing Page
            </Button>
            <Button
              variant="outline-danger"
              className={classes.cancelBtn}
              onClick={deleteBooking}
            >
              Cancel
            </Button>
          </div>
        </div>
      </ListingCard>
    );
  } else {
    return <p>Loading</p>;
  }
}

SingleBooking.propTypes = {
  singleBooking: PropTypes.object,
  setNeedUpdate: PropTypes.func,
};

export default SingleBooking;
