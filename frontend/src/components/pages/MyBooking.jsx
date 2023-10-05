import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../store/user-context";
import ErrorContext from "../error/ErrorContext";
import FormCard from "../ui/FormCard";
import Button from "react-bootstrap/Button";
import makeRequest from "../../utils/helper";
import AllBookingList from "../booking-management/AllBookingList";

const MyBookingPage = () => {
  const [listings, setListings] = useState(null);
  const [myBookings, setMyBookings] = useState([]);

  const userCtx = useContext(UserContext);
  const errorCtx = useContext(ErrorContext);

  async function getListings(relatedListingIds) {
    await makeRequest("/listings", "GET", errorCtx, async (data) => {
      const relatedListing = data.listings.filter((listing) =>
        relatedListingIds.includes(Number(listing.id))
      );
      const listingDict = {};
      for (let listing of relatedListing) {
        listingDict[Number(listing.id)] = listing;
      }
      setListings(listingDict);
    });
  }

  async function getMyBookings() {
    await makeRequest(
      "/bookings",
      "GET",
      errorCtx,
      async (data) => {
        const bookings = data.bookings.filter(
          (booking) => booking.owner == userCtx.user.email
        );
        const relatedListingIds = bookings.map((booking) =>
          Number(booking.listingId)
        );
        await getListings(relatedListingIds);

        setMyBookings(bookings);
      },
      null,
      userCtx.user.token
    );
  }

  useEffect(() => {
    getMyBookings();
  }, []);

  return (
    <section>
      <h1>All My Bookings</h1>
      <AllBookingList myBookings={myBookings} listings={listings} />
    </section>
  );
};
export default MyBookingPage;
