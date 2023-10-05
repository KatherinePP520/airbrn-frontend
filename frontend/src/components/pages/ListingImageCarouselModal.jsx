import React, { useEffect, useState } from "react";
import Carousel from "react-bootstrap/Carousel";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import PropTypes from "prop-types";

function ListingImageCarouselModal(props) {
  const [index, setIndex] = useState(0);

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  useEffect(() => {
    setIndex(props.imageIndex);
  }, [props.imageIndex]);

  return (
    <Modal show={props.show} onHide={props.handleClose} centered size="xl">
      <Modal.Header closeButton>
        <Modal.Title>Modal heading</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Carousel activeIndex={index} onSelect={handleSelect}>
          {props.images &&
            props.images.map((img) => (
              <Carousel.Item key={"slider" + img.id}>
                <img
                  className="d-block w-100"
                  src={img.img}
                  alt="First slide"
                />
              </Carousel.Item>
            ))}
        </Carousel>
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
  );
}

ListingImageCarouselModal.propTypes = {
  singleListing: PropTypes.object,
  show: PropTypes.bool,
  images: PropTypes.array,
  imageIndex: PropTypes.number,
  handleClose: PropTypes.func,
};

export default ListingImageCarouselModal;
