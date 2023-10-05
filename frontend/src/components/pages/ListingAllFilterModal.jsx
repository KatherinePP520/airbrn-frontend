import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { DateRange } from "react-date-range";
import { enAU } from "date-fns/locale";
import PropTypes from "prop-types";

function ListingAllFilterModal(props) {
  return (
    <>
      <Modal centered size="lg" show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Filters</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label htmlFor="filterListingTitle" className="form-label">
              Min Bedrooms
            </label>
            <input
              type="number"
              className="form-control"
              id="filterListingTitle"
              onChange={(event) =>
                props.setFilterMinBedrooms(event.target.value)
              }
            />
          </div>
          <div className="mb-3">
            <label htmlFor="filterListingTitle" className="form-label">
              Max Bedrooms
            </label>
            <input
              type="number"
              className="form-control"
              id="filterListingTitle"
              onChange={(event) =>
                props.setFilterMaxBedrooms(event.target.value)
              }
            />
          </div>
          <div className="mb-3">
            <label htmlFor="filterListingTitle" className="form-label">
              Min Price
            </label>
            <input
              type="text"
              className="form-control"
              id="filterListingTitle"
              onChange={(event) => props.setFilterMinPrice(event.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="filterListingTitle" className="form-label">
              Max Price
            </label>
            <input
              type="text"
              className="form-control"
              id="filterListingTitle"
              onChange={(event) => props.setFilterMaxPrice(event.target.value)}
            />
          </div>
          <DateRange
            locale={enAU}
            editableDateInputs={true}
            onChange={(item) =>
              props.setDateSelections({ ...props.dateSelections, ...item })
            }
            moveRangeOnFirstSelection={false}
            ranges={[props.dateSelections.filterSelection]}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={props.handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

ListingAllFilterModal.propTypes = {
  singleListing: PropTypes.object,
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  setFilterMinBedrooms: PropTypes.func,
  setFilterMaxBedrooms: PropTypes.func,
  setFilterMinPrice: PropTypes.func,
  setFilterMaxPrice: PropTypes.func,
  setDateSelections: PropTypes.func,
  dateSelections: PropTypes.object,
};

export default ListingAllFilterModal;
