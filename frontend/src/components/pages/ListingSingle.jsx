import React, { useState, useEffect, useContext } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import classes from "./ListingSingle.module.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { DateRange } from "react-date-range";
import { toDate } from "../../utils/helper";
import { enAU } from "date-fns/locale";
import UserContext from "../store/user-context";
import ErrorContext from "../error/ErrorContext";
import ListingSingleBookModal from "./ListingsSingleBookModal";
import makeRequest from "../../utils/helper";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ListingImageCarouselModal from "./ListingImageCarouselModal";
import useWindowDims from "../window/WindowDimension";
import amenityElements from "../icons/AmenityConstant";
import BookButton from "../ui/BookButton";
import { Rating } from "@mui/material";
import Button from "react-bootstrap/Button";
import ListingSingleReview from "./ListingSingleReview";
import Form from "react-bootstrap/Form";

const ListingSinglePage = () => {
  let { id } = useParams();
  const userCtx = useContext(UserContext);
  const errorCtx = useContext(ErrorContext);
  const [listingSingle, setListingSingle] = useState({});
  const [dateSelection, setDateSelection] = useState([
    {
      startDate: null,
      endDate: new Date(""),
      key: "bookSelection",
    },
  ]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [images, setImages] = useState([]);
  const [imageIndex, setImageIndex] = useState(0);

  const [showImageSlider, setShowImageSlider] = useState(false);
  const { width, height } = useWindowDims();

  const [amenities, setAmenities] = useState([]);

  const [searchParams] = useSearchParams();
  const [canAddReview, setCanAddReview] = useState(false);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [bookingId, setBookingId] = useState("");

  const navigate = useNavigate();

  function handleShow() {
    setModalIsOpen(true);
  }

  function handleClose() {
    setModalIsOpen(false);
  }

  function handleShowSlider(index) {
    setImageIndex(index);
    setShowImageSlider(true);
  }

  function handleCloseSlider() {
    setShowImageSlider(false);
  }

  let dateDiff = 0;
  if (dateSelection[0].endDate && dateSelection[0].endDate) {
    dateDiff = Math.floor(
      (dateSelection[0].endDate - dateSelection[0].startDate) /
        (24 * 3600 * 1000)
    );
  }

  useEffect(() => {
    getListingSingleDetail(id);
    const startDate = searchParams.get("start_date");
    const endDate = searchParams.get("end_date");
    if (startDate && endDate) {
      setDateSelection([
        {
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          key: "bookSelection",
        },
      ]);
    }
  }, []);

  useEffect(() => {
    if (userCtx.user && userCtx.user.token) {
      getAllBookingDetailsHandler();
    }
  }, []);

  async function getAllBookingDetailsHandler() {
    await makeRequest(
      "/bookings/",
      "GET",
      errorCtx,
      (data) => {
        let bookings = data.bookings;
        for (let booking of bookings) {
          if (
            booking.listingId == id &&
            booking.owner == userCtx.user.email &&
            booking.status == "accepted"
          ) {
            setCanAddReview(true);

            setBookingId(booking.id);
            break;
          }
        }
      },
      null,
      userCtx.user.token
    );
  }

  async function submitReviewHandler() {
    if (review.length == 0) {
      errorCtx.setHasError(true);
      errorCtx.setErrorMessage("You can't send a empty review!");
      return;
    }
    if (rating == 0) {
      errorCtx.setHasError(true);
      errorCtx.setErrorMessage("Please choose a rating!");
      return;
    }
    const body = {
      review: { review: review, rating: rating },
    };
    await makeRequest(
      "/listings/" + id + "/review/" + bookingId,
      "PUT",
      errorCtx,
      () => {
        getListingSingleDetail(id);
        setRating(0);
        setReview("");
      },
      body,
      userCtx.user.token
    );
  }

  async function submitBookHandler() {
    const dateRange = {
      startDate: toDate(dateSelection[0].startDate),
      endDate: toDate(dateSelection[0].endDate),
    };

    const totalPrice = dateDiff * listingSingle.price;

    const body = {
      dateRange: dateRange,
      totalPrice: totalPrice,
    };
    await makeRequest(
      "/bookings/new/" + id,
      "POST",
      errorCtx,
      () => setModalIsOpen(true),
      body,
      userCtx.user.token
    );
  }

  function calculateAverageRating(listing) {
    if (!listing.reviews || listing.reviews.length == 0) {
      listing.averageRating = 0;
      listing.totalReviews = 0;
      return;
    }
    let totalReview = 0;
    let count = 0;
    if (listing.reviews.length == 0) {
      listing.totalReviews = null;
      listing.averageRating = null;
    }
    for (let review of listing.reviews) {
      totalReview += Number(review.rating);
      count += 1;
    }
    const averageRating = Math.floor(totalReview / count);
    listing.averageRating = averageRating;
    listing.totalReviews = count;
  }

  async function getListingSingleDetail(listingId) {
    await makeRequest("/listings/" + listingId, "GET", errorCtx, (data) => {
      const listing = data.listing;
      listing.id = listingId;
      calculateAverageRating(listing);
      handleImageGallery(listing);
      const availableAmenities = amenityElements.filter((ele) =>
        listing.metadata.amenities.includes(ele.name)
      );
      setAmenities(availableAmenities);
      setListingSingle(listing);
    });
  }

  function handleImageGallery(listing) {
    // Construct image section, only less than 5 pictures, only show the thumbnail,
    // otherwise, show the first 4 pictures.
    const displayImages = [];
    let thumbnailCol = 2;
    if (
      !listing.metadata.images ||
      listing.metadata.images.length < 4 ||
      width < 800
    ) {
      thumbnailCol = 4;
    }
    const thumbDisplay = {
      id: "image-1",
      index: 0,
      img: listing.thumbnail,
      title: "thumbnail",
      rows: 2,
      cols: thumbnailCol,
    };
    displayImages.push(thumbDisplay);

    if (
      listing.metadata.images &&
      listing.metadata.images.length >= 4 &&
      width >= 800
    ) {
      for (let i = 0; i < 4; i++) {
        displayImages.push({
          id: "image-" + (i + 2),
          index: i + 1,
          img: listing.metadata.images[i],
          title: "image-" + (i + 2),
          rows: 1,
          cols: 1,
        });
      }
    }

    setImages(displayImages);
  }

  useEffect(() => {
    if (listingSingle.metadata) {
      handleImageGallery(listingSingle);
    }
  }, [width, height, listingSingle]);

  function isDayDisabled(date) {
    let shouldEnable = false;
    for (let av of listingSingle.availability) {
      if (date >= new Date(av.startDate) && date <= new Date(av.endDate)) {
        shouldEnable = true;
      }
    }
    return !shouldEnable;
  }

  if (!listingSingle.metadata) {
    return <p>page is loading</p>;
  }

  let addressString = `${listingSingle.address.street}, ${listingSingle.address.city}, ${listingSingle.address.state}(${listingSingle.address.postcode}), ${listingSingle.address.country}`;

  let rowHeight = height > 1250 ? 250 : height / 5;
  let galleryHeight = rowHeight * 2 + 10;

  return (
    <>
      <div>
        <h3 className={classes.title}>{listingSingle.title}</h3>
        <Rating
          name="read-only"
          value={listingSingle.averageRating}
          className={classes.rating}
          readOnly
        />{" "}
        <p className={classes.reviewCount}>({listingSingle.totalReviews})</p>
        <p>{addressString}</p>
      </div>
      <ImageList
        sx={{ width: "100%", height: galleryHeight }}
        variant="quilted"
        cols={4}
        rowHeight={rowHeight}
      >
        {images.map((item) => (
          <ImageListItem
            key={item.id}
            cols={item.cols || 1}
            rows={item.rows || 1}
          >
            <img
              src={item.img}
              alt={item.title}
              loading="lazy"
              className={classes.image}
              onClick={() => handleShowSlider(item.index)}
            />
          </ImageListItem>
        ))}
      </ImageList>
      <Row>
        <Col xl={8} lg={7} md={6} sm={12}>
          <Card className={classes.card}>
            <h4>Where you will sleep</h4>
            <p>property type: {listingSingle.metadata.propertyType}</p>
            <p>number of beds: {listingSingle.metadata.numOfBathrooms}</p>
            <p>number of bedrooms: {listingSingle.metadata.numOfBedrooms}</p>
            <p>number of bathrooms: {listingSingle.metadata.numOfBathrooms}</p>
          </Card>
          <Card className={classes.card}>
            <h4>Available Amenities</h4>
            {amenities.map((a) => (
              <div key={a.name}>
                {a.element}
                <p className={classes.amenityString}>{a.display}</p>
              </div>
            ))}
          </Card>
        </Col>
        <Col xl={4} lg={5} md={6} sm={12}>
          <h4> Price per night ${listingSingle.price}</h4>
          {dateSelection[0].startDate &&
            dateSelection[0].endDate &&
            toDate(dateSelection[0].startDate) !=
              toDate(dateSelection[0].endDate) && (
              <>
                <h4>Total Price ${listingSingle.price * dateDiff}</h4>
                <p>Check-in: {toDate(dateSelection[0].startDate)}</p>
                <p>Check-out: {toDate(dateSelection[0].endDate)}</p>
              </>
            )}
          <DateRange
            locale={enAU}
            editableDateInputs={true}
            onChange={(item) => setDateSelection([item.bookSelection])}
            moveRangeOnFirstSelection={false}
            ranges={dateSelection}
            disabledDay={isDayDisabled}
          />
          <BookButton
            isLoggedIn={userCtx.user != null && userCtx.user.token != null}
            login={() => navigate("/login")}
            submitBookHandler={submitBookHandler}
          />
        </Col>
        <ListingSingleBookModal
          show={modalIsOpen}
          handleClose={handleClose}
          handleShow={handleShow}
        />
        <ListingImageCarouselModal
          show={showImageSlider}
          handleClose={handleCloseSlider}
          images={images}
          imageIndex={imageIndex}
        />
      </Row>
      <div className={classes.reviewSection}>
        {canAddReview && (
          <div>
            <h4>you can add review here</h4>
            <Rating
              name="simple-controlled"
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue);
              }}
            />
            <div>
              <Form.Control
                as="textarea"
                value={review}
                onChange={(event) => setReview(event.target.value)}
                aria-label="With textarea"
                className={classes.reviewInput}
              />
              <Button
                onClick={submitReviewHandler}
                className={classes.sendReviewBtn}
              >
                submit
              </Button>
            </div>
          </div>
        )}
        <h3 className={classes.reviewTitle}>All Reviews</h3>
        <Rating
          name="read-only"
          value={listingSingle.averageRating}
          className={classes.rating}
          readOnly
        />{" "}
        <p className={classes.reviewCount}>({listingSingle.totalReviews})</p>
        {[...listingSingle.reviews].reverse().map((review, index) => (
          <ListingSingleReview
            key={"review-" + index}
            review={review.review}
            rating={review.rating}
          />
        ))}
      </div>
    </>
  );
};

export default ListingSinglePage;
