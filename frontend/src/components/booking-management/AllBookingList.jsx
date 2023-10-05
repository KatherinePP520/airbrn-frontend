import React, { useEffect } from "react";
import { useState } from "react";
import PropTypes from "prop-types";
import SingleBooking from "./SingleBooking";

function AllBookingList(props) {
  const [myBookings, setMyBookings] = useState(props.myBookings);
  const [listings, setListings] = useState(null);

  useEffect(() => {
    setMyBookings(props.myBookings);
  }, [props.myBookings]);

  useEffect(() => {
    setListings(props.listings);
  }, [props.listings]);

  if (listings) {
    return (
      <>
        {myBookings.length == 0 && (
          <p>No Booking yet!</p>
        )}
        {myBookings.length > 0 && myBookings.map((singleBooking) => (
          <SingleBooking
            key={singleBooking.id}
            singleBooking={singleBooking}
            listing={listings[singleBooking.listingId]}
            setNeedUpdate={props.setNeedUpdate}
          />
        ))}
      </>
    );
  } else {
    return <p>Loading...</p>;
  }
}

AllBookingList.propTypes = {
  myBookings: PropTypes.array,
  listings: PropTypes.object,
  setNeedUpdate: PropTypes.func,
};

export default AllBookingList;
