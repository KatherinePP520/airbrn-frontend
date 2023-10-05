import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import UserContext from "../store/user-context";
import ErrorContext from "../error/ErrorContext";
import SingleBookingDisplay from "../my-booking-management/SingleBookingDisplay";
import makeRequest from "../../utils/helper";
import { getListingDetail } from "../../utils/helper";

function MySingleListingBookingPage() {
  let { id } = useParams();
  const userCtx = useContext(UserContext);
  const [allMyBookings, setAllMyBookings] = useState([]);
  const [totalDaysBookedOfYear, setTotalDaysBookedOfYear] = useState(0);
  const [totalProfitOfYear, setTotalProfitOfYear] = useState(0);
  const [listingDetail, setListingDetail] = useState({});

  const errorCtx = useContext(ErrorContext);

  useEffect(() => {
    getListingDetail(id).then((listing) => setListingDetail(listing));
    getAllBookingDetails();
  }, []);

  async function getAllBookingDetails() {
    await makeRequest(
      "/bookings",
      "GET",
      errorCtx,
      (data) => {
        const bookings = data.bookings;

        const filteredBookings = bookings.filter(
          (booking) => booking.listingId == id
        );
        setAllMyBookings(filteredBookings);
      },
      null,
      userCtx.user.token
    );
  }

  const thisYearStart = new Date(new Date().getFullYear() + "-01-01");
  const thisYearEnd = new Date(new Date().getFullYear() + "-12-31");

  useEffect(() => {
    let tempTotalDays = 0;
    let tempTotalProfits = 0;
    for (let booking of allMyBookings) {
      if (booking.status == "accepted") {
        const dateStart = new Date(booking.dateRange.startDate);
        const dateEnd = new Date(booking.dateRange.endDate);
        if (dateStart >= thisYearStart && dateEnd <= thisYearEnd) {
          const dateDiff = (dateEnd - dateStart) / (3600 * 24 * 1000);
          tempTotalDays += dateDiff;
          tempTotalProfits += booking.totalPrice;
        }
      }
    }
    if (tempTotalDays != 0) {
      setTotalDaysBookedOfYear(tempTotalDays);
      setTotalProfitOfYear(tempTotalProfits);
    }
  }, [allMyBookings]);

  return (
    <>
      <h3>My Listing Booking Management</h3>
      {listingDetail && listingDetail.postedOn && (
        <p>
          Posted{" "}
          {Math.floor(
            (new Date() - new Date(listingDetail.postedOn)) / (24 * 3600 * 1000)
          )}{" "}
          days ago.
        </p>
      )}
      <p>total days been booked of this year:{totalDaysBookedOfYear}</p>
      <p>total profits been booked of this year:{totalProfitOfYear}</p>

      {allMyBookings.map((mySingleBooking) => (
        <SingleBookingDisplay
          key={mySingleBooking.id}
          singleBooking={mySingleBooking}
          totalDaysBookedOfYear={totalDaysBookedOfYear}
        />
      ))}
    </>
  );
}

export default MySingleListingBookingPage;
