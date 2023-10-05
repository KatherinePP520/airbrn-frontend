import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import PropTypes from "prop-types";

function ListingSingleBookModal(props) {
  const navigate = useNavigate();

  return (
    <>
      <Modal centered size="lg" show={props.show} onHide={props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Congratulations!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Your booking has been successfully submitted to the landlord</p>
        </Modal.Body>
        <Modal.Footer>
          <Button id = "checkBookBtn" variant="primary" onClick={() => navigate("/booking")}>
            Check
          </Button>
          <Button variant="outline-danger" onClick={props.handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

ListingSingleBookModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
};

export default ListingSingleBookModal;
