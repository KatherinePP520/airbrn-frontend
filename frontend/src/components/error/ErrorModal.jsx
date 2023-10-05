import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import PropTypes from "prop-types";

function ErrorModal(props) {
  return (
    <>
      <Modal centered show={props.show} onHide={props.handleClose}>
        <Modal.Header>
          <Modal.Title>Error!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>{props.errorMessage}</h5>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

ErrorModal.propTypes = {
  show: PropTypes.bool,
  handleClose: PropTypes.func,
  errorMessage: PropTypes.string,
};

export default ErrorModal;
