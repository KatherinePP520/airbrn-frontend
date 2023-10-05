import React from "react";
import AllListingsList from "../listing-management/AllListingsList";
import { useState, useEffect } from "react";
import { useContext } from "react";
import Button from "react-bootstrap/Button";
import UserContext from "../store/user-context";
import ErrorContext from "../error/ErrorContext";
import ListingAllFilterModal from "./ListingAllFilterModal";
import { toDate } from "../../utils/helper";
import makeRequest, { getListingDetail } from "../../utils/helper";
import classes from "./ListingAll.module.css";
import Dropdown from "react-bootstrap/Dropdown";

function ListingAllPage() {
  const [publicListings, setPublicListings] = useState([]);
  const [searchKeyWord, setSearchKeyWord] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [filterMinBedrooms, setFilterMinBedrooms] = useState(0);
  const [filterMaxBedrooms, setFilterMaxBedrooms] = useState(9999999);
  const [filterMinPrice, setFilterMinPrice] = useState(0);
  const [filterMaxPrice, setFilterMaxPrice] = useState(9999999999999);
  const [customerBookings, setCustomerBookings] = useState([]);
  const [sortType, setSortType] = useState("Alphabetic");

  const userCtx = useContext(UserContext);
  const errorCtx = useContext(ErrorContext);

  const [dateSelections, setDateSelections] = useState({
    filterSelection: {
      startDate: null,
      endDate: new Date(""),
      key: "filterSelection",
    },
  });

  const [filterDate, setFilterDate] = useState(false);

  function clearFilter() {
    setFilterDate(false);
    setFilterMinBedrooms(0);
    setFilterMaxBedrooms(9999999);
    setFilterMinPrice(0);
    setFilterMaxPrice(9999999999999);
    const dateSection = {
      filterSelection: {
        startDate: null,
        endDate: new Date(""),
        key: "filterSelection",
      },
    };
    setDateSelections(dateSection);
  }

  function handleDateSelection(selection) {
    setDateSelections(selection);
    setFilterDate(true);
  }
  function sortRatingLowToHighComparable(listingA, listingB) {
    if (listingA.averageRating >= listingB.averageRating) {
      return 1;
    } else {
      return -1;
    }
  }
  function sortRatingHighToLowComparable(listingA, listingB) {
    if (listingA.averageRating <= listingB.averageRating) {
      return 1;
    } else {
      return -1;
    }
  }

  function sortRatingLowToHigh() {
    setSortType("Rating low to high");
    publicListings.sort(sortRatingLowToHighComparable);
    let newPublicListings = [...publicListings];
    setPublicListings(newPublicListings);
  }

  function sortRatingHighToLow() {
    setSortType("Rating high to low");
    publicListings.sort(sortRatingHighToLowComparable);
    let newPublicListings = [...publicListings];
    setPublicListings(newPublicListings);
  }

  function sortAlphabetic() {
    setSortType("Alphabetic");
    publicListings.sort(customerBookingAndAlphaSort);
    let newPublicListings = [...publicListings];
    setPublicListings(newPublicListings);
  }

  function advancedFilterModal(listings) {
    let filteredList = listings.filter(
      (listing) =>
        Number(filterMinBedrooms) <= Number(listing.metadata.numOfBeds) &&
        (!filterMaxBedrooms ||
          Number(filterMaxBedrooms) >= Number(listing.metadata.numOfBeds)) &&
        Number(filterMinPrice) <= Number(listing.price) &&
        (!filterMaxPrice || Number(filterMaxPrice) >= Number(listing.price))
    );
    if (
      dateSelections.filterSelection.startDate &&
      dateSelections.filterSelection.endDate
    ) {
      const startDate = toDate(dateSelections.filterSelection.startDate);
      const endDate = toDate(dateSelections.filterSelection.endDate);
      filteredList = filteredList.filter(
        (listing) =>
          !filterDate || filterDateWithin(listing, startDate, endDate)
      );
    }
    return filteredList;
  }
  // here we already pre-process in go live modal make sure it from small-big,and interval correctly
  function filterDateWithin(listing, startDate, endDate) {
    for (let i = 0; i < listing.availability.length; i++) {
      let currentStartDate = listing.availability[i].startDate;
      let currentEndDate = listing.availability[i].endDate;
      if (currentStartDate <= startDate && currentEndDate >= endDate) {
        return true;
      }
    }
    return false;
  }

  function handleShow() {
    setModalIsOpen(true);
  }

  function handleClose() {
    setModalIsOpen(false);
  }

  function matchSubstring(listing) {
    return (
      listing.title.toLowerCase().includes(searchKeyWord.toLowerCase()) ||
      listing.address.city.toLowerCase().includes(searchKeyWord.toLowerCase())
    );
  }

  function customerBookingAndAlphaSort(a, b) {
    const aBooked = customerBooked(a);
    const bBooked = customerBooked(b);
    if (aBooked && !bBooked) {
      return -1;
    }
    if (!aBooked && bBooked) {
      return 1;
    }
    const titleA = a.title.toLowerCase();
    const titleB = b.title.toLowerCase();
    if (titleA < titleB) {
      return -1;
    }
    if (titleA > titleB) {
      return 1;
    }
    return 0;
  }
  function customerBooked(singleListing) {
    for (let booking of customerBookings) {
      if (booking.listingId == singleListing.id) {
        if (booking.status == "pending" || booking.status == "accepted") {
          return true;
        }
      }
    }
    return false;
  }

  async function getAllBookingDetails() {
    await makeRequest(
      "/bookings/",
      "GET",
      errorCtx,
      (data) => {
        const bookings = data.bookings;
        const filteredBookings = bookings.filter(
          (booking) => booking.owner == userCtx.user.email
        );
        setCustomerBookings(filteredBookings);
      },
      null,
      userCtx.user.token
    );
  }

  const fetchListings = async () => {
    await makeRequest("/listings/", "GET", errorCtx, async (data) => {
      const allListingsDetail = await Promise.all(
        data.listings.map((listing) => getListingDetail(listing.id, errorCtx))
      );

      const allPublishedListings = allListingsDetail
        .filter((listing) => listing)
        .filter((listing) => listing.published);
      calculateAverageRating(allPublishedListings);
      setPublicListings(allPublishedListings);

      if (userCtx.user.token) {
        getAllBookingDetails();
      }
    });
  };

  function markListingAsBooked() {
    const listingWithBookingStatus = [...publicListings];
    for (let l of listingWithBookingStatus) {
      if (customerBooked(l)) {
        l.booked = true;
      } else {
        l.booked = false;
      }
    }
    setPublicListings(listingWithBookingStatus);
  }

  useEffect(() => {
    sortAlphabetic();
    markListingAsBooked();
  }, [customerBookings]);

  useEffect(() => {
    fetchListings();
  }, []);

  function calculateAverageRating(allPublishedListings) {
    for (let listing of allPublishedListings) {
      let totalReview = 0;
      let count = 0;
      for (let review of listing.reviews) {
        totalReview += Number(review.rating);
        count += 1;
      }
      if (count == 0) {
        listing.averageRating = 0;
      } else {
        listing.averageRating = Math.floor(totalReview / count);
      }
      listing.totalReviews = count;
    }
  }

  return (
    <section>
      <h1>All Listings</h1>
      <div className={classes.filterSection}>
        <div>
          <Dropdown className={classes.sortBtn}>
            <Dropdown.Toggle variant="primary-light" id="dropdown-basic">
              {sortType}
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item onClick={sortRatingLowToHigh}>
                Rating low to high
              </Dropdown.Item>
              <Dropdown.Item onClick={sortRatingHighToLow}>
                Rating high to low
              </Dropdown.Item>
              <Dropdown.Item onClick={sortAlphabetic}>Alphabetic</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <input
            type="text"
            placeholder="search here"
            className={classes.searchBox}
            value={searchKeyWord}
            onChange={(event) => setSearchKeyWord(event.target.value)}
          ></input>
        </div>
        <div>
          <div>
            <Button variant="outline-secondary" onClick={handleShow}>
              filter
            </Button>
            <Button variant="outline-danger" onClick={clearFilter}>
              clear filter
            </Button>
          </div>
          <ListingAllFilterModal
            show={modalIsOpen}
            handleClose={handleClose}
            handleShow={handleShow}
            setFilterMinBedrooms={setFilterMinBedrooms}
            setFilterMaxBedrooms={setFilterMaxBedrooms}
            setFilterMinPrice={setFilterMinPrice}
            setFilterMaxPrice={setFilterMaxPrice}
            dateSelections={dateSelections}
            setDateSelections={handleDateSelection}
          />
        </div>
      </div>

      <AllListingsList
        startDate={
          dateSelections.filterSelection.startDate
            ? toDate(dateSelections.filterSelection.startDate)
            : ""
        }
        endDate={
          dateSelections.filterSelection.endDate
            ? toDate(dateSelections.filterSelection.endDate)
            : ""
        }
        listings={advancedFilterModal(publicListings.filter(matchSubstring))}
      />
    </section>
  );
}
export default ListingAllPage;
