import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import PropTypes from "prop-types";
import classes from "./SingleBookingDisplay.module.css";
import { useContext } from "react";
import UserContext from "../store/user-context";
import ErrorContext from "../error/ErrorContext";
import makeRequest from "../../utils/helper";
import ListingCard from "../ui/ListingCard";

function SingleBookingDisplay(props) {
  const [bookingStatus, setBookingStatus] = useState(
    props.singleBooking.status
  );

  const userCtx = useContext(UserContext);
  const errorCtx = useContext(ErrorContext);

  function acceptBooking() {
    makeRequest(
      "/bookings/accept/" + props.singleBooking.id,
      "PUT",
      errorCtx,
      () => {
        setBookingStatus("accepted");
      },
      null,
      userCtx.user.token
    );
  }

  async function declineBooking() {
    makeRequest(
      "/bookings/decline/" + props.singleBooking.id,
      "PUT",
      errorCtx,
      () => {
        setBookingStatus("declined");
      },
      null,
      userCtx.user.token
    );
  }

  return (
    <ListingCard>
      <div className={classes.mainSection}>
        <div>
          <h5>
            email:
            <span className={classes.value}>{props.singleBooking.owner}</span>
          </h5>
        </div>
        <div>
          <h5>date range:</h5>
          <p>startDate: {props.singleBooking.dateRange.startDate}</p>
          <p>endDate: {props.singleBooking.dateRange.endDate}</p>
          <p>Total Price: ${props.singleBooking.totalPrice}</p>
          <p>Booking Status: {bookingStatus}</p>
        </div>
        {bookingStatus == "pending" && (
          <div>
            <Button
              variant="outline-success"
              className={classes.bookingBtn}
              onClick={acceptBooking}
            >
              Accept
            </Button>
            <Button
              variant="outline-danger"
              className={classes.bookingBtn}
              onClick={declineBooking}
            >
              Decline
            </Button>
          </div>
        )}
      </div>
    </ListingCard>
  );
}

SingleBookingDisplay.propTypes = {
  singleBooking: PropTypes.object,
};

export default SingleBookingDisplay;
