import React from "react";
import SingleListing from "./SingleListing";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PropTypes from "prop-types";

// here we need filter to make alp order
function AllListingsList(props) {
  return (
    <>
      {props.listings.length == 0 && (<p>No Listing yet!</p>)}
      {props.listings.length > 0 &&
        (<Row>
          {props.listings.map((singleListing, index) => (
            <Col
              key={index + "-" + singleListing.id}
              xs={12}
              sm={6}
              lg={4}
              xl={3}
              xxl={2}
            >
              <SingleListing
                index={index}
                singleListing={singleListing}
                startDate={props.startDate}
                endDate={props.endDate}
              />
            </Col>
          ))}
        </Row>
        )}
    </>
  );
}

AllListingsList.propTypes = {
  listings: PropTypes.array,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
};

export default AllListingsList;
