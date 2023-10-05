import React, { useEffect } from "react";
import { useState, useContext } from "react";
import UserContext from "../store/user-context";
import ErrorContext from "../error/ErrorContext";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import classes from "./MySingleListing.module.css";
import MyListingGoLiveModal from "./MyListingGoLiveModal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useNavigate } from "react-router-dom";
import makeRequest from "../../utils/helper";
import ListingCard from "../ui/ListingCard";
import PropTypes from "prop-types";
import { Rating } from "@mui/material";

function MySingleListing(props) {
  const [goLiveModalIsOpen, setGoLiveModalIsOpen] = useState(false);
  const [myListing, setMyListing] = useState(null);

  const userCtx = useContext(UserContext);
  const errorCtx = useContext(ErrorContext);

  let navigate = useNavigate();

  function openMySingleListingBooking() {
    navigate("/host/" + props.singleListing.id);
  }
  useEffect(() => {
    setMyListing(props.singleListing);
  }, [props.singleListing]);

  useEffect(() => {
    setMyListing(props.singleListing);
  }, []);

  function goLiveHandleShow() {
    setGoLiveModalIsOpen(true);
  }
  function goLiveHandleClose() {
    setGoLiveModalIsOpen(false);
  }

  async function unPublishHandle() {
    await makeRequest(
      "/listings/unpublish/" + myListing.id,
      "PUT",
      errorCtx,
      () => {
        props.setNeedUpdate(true);
      },
      null,
      userCtx.user.token
    );
  }

  async function deleteListing() {
    await makeRequest(
      "/listings/" + myListing.id,
      "DELETE",
      errorCtx,
      () => {
        props.setNeedUpdate(true);
      },
      null,
      userCtx.user.token
    );
  }

  if (myListing) {
    // this is child, the title address etc will be passed as props from parent
    return (
      <ListingCard>
        <div className={classes.singleCard}>
          <Row>
            <Col md={6} lg={5}>
              <div className={classes.imageSection}>
                <Card.Img
                  src={props.singleListing.thumbnail}
                  className={classes.image}
                />
              </div>
            </Col>
            <Col md={6} lg={7}>
              <Card.Body className={classes.contentSection}>
                <h5 className={classes.title}>{props.singleListing.title}</h5>{" "}
                <Rating
                  name="read-only"
                  value={props.singleListing.averageRating}
                  className={classes.rating}
                  readOnly
                />{" "}
                <p className={classes.reviewCount}>
                  ({props.singleListing.totalReviews})
                </p>
                <p>${myListing.price} per night</p>
                <p>{props.singleListing.metadata.propertyType}</p>
                <p>
                  {props.singleListing.metadata.numOfBeds} Bed(s){" "}
                  {props.singleListing.metadata.numOfBedrooms} Bedrooms(s){" "}
                  {props.singleListing.metadata.numOfBathrooms} Bathrooms(s)
                </p>
                <Button
                  variant="outline-primary"
                  onClick={openMySingleListingBooking}
                >
                  manage booking
                </Button>
                {!props.singleListing.published && (
                  <Button id={"golive-" + props.index} variant="outline-success" onClick={goLiveHandleShow}>
                    go live
                  </Button>
                )}
                {props.singleListing.published && (
                  <Button id={"unpublish-" + props.index} variant="outline-secondary" onClick={unPublishHandle}>
                    un-publish
                  </Button>
                )}
                <div className={classes.btnSection}>
                  <Button
                    id={"edit-listing-" + props.index}
                    variant="outline-warning"
                    onClick={() => {
                      navigate("/listing/edit/" + props.singleListing.id);
                    }}
                  >
                    edit
                  </Button>
                  <Button variant="outline-danger" onClick={deleteListing}>
                    Delete
                  </Button>
                </div>
                <MyListingGoLiveModal
                  singleListing={props.singleListing}
                  show={goLiveModalIsOpen}
                  goLiveHandleClose={goLiveHandleClose}
                  goLiveHandleShow={goLiveHandleShow}
                  updateMyListing={props.updateMyListing}
                  setNeedUpdate={props.setNeedUpdate}
                />
              </Card.Body>
            </Col>
          </Row>
        </div>
      </ListingCard>
    );
  } else {
    return <p>Loading</p>;
  }
}

MySingleListing.propTypes = {
  singleListing: PropTypes.object,
  index: PropTypes.number,
  updateMyListing: PropTypes.func,
  setNeedUpdate: PropTypes.func,
};

export default MySingleListing;
