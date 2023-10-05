import React, { useEffect } from "react";
import { useState } from "react";
import MySingleListing from "./MySingleListing";
import PropTypes from "prop-types";

function AllMyListings(props) {
  const [myListings, setMyListings] = useState(props.myListings);

  useEffect(() => {
    setMyListings(props.myListings);
  }, [props.myListings]);

  return (
    <>
      {myListings.length == 0 && (<p>No Listing yet!</p>)}
      {myListings.length > 0 && myListings.map((singleListing, index) => (
        <MySingleListing
          key={singleListing.id}
          index = {index}
          singleListing={singleListing}
          updateMyListing={props.updateMyListing}
          setNeedUpdate={props.setNeedUpdate}
        />
      ))}
    </>
  );
}

AllMyListings.propTypes = {
  myListings: PropTypes.array,
  updateMyListing: PropTypes.func,
  setNeedUpdate: PropTypes.func,
};

export default AllMyListings;
