import React, { useState, useContext } from "react";
import { addDays } from "date-fns";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import UserContext from "../store/user-context";
import ErrorContext from "../error/ErrorContext";
import { DateRangePicker } from "react-date-range";
import { toDate } from "../../utils/helper";
import { enAU } from "date-fns/locale";
import makeRequest from "../../utils/helper";
import classes from "./MyListingGoLiveModal.module.css";
import PropTypes from "prop-types";

import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

function MyListingGoLiveModal(props) {
  const userCtx = useContext(UserContext);
  const errorCtx = useContext(ErrorContext);

  const [selectionCount, setSelectionCount] = useState(1);
  const [dateSelections, setDateSelections] = useState({
    selection1: {
      startDate: addDays(new Date(), 0),
      endDate: addDays(new Date(), 0),
      key: "selection1",
    },
  });

  function addMoreSelection() {
    dateSelections["selection" + (selectionCount + 1)] = {
      startDate: addDays(new Date(), 0),
      endDate: addDays(new Date(), 0),
      key: "selection" + (selectionCount + 1),
    };
    setDateSelections(dateSelections);
    setSelectionCount(selectionCount + 1);
  }

  function removeSelection() {
    const selectionKey = "selection" + selectionCount;
    delete dateSelections[selectionKey];
    setDateSelections(dateSelections);
    setSelectionCount(selectionCount - 1);
  }

  function getSelections() {
    const res = [];
    for (let s in dateSelections) {
      res.push(dateSelections[s]);
    }
    return res;
  }

  // availabilities is a list of jason, we also need to have a comparator
  function mergeTimeComparator(availability1, availability2) {
    const availability1StartDate = new Date(availability1.startDate);
    const availability2StartDate = new Date(availability2.startDate);
    if (availability1StartDate < availability2StartDate) {
      return -1;
    }
    if (availability1StartDate > availability2StartDate) {
      return 1;
    }
    const availability1EndDate = new Date(availability1.endDate);
    const availability2EndDate = new Date(availability2.endDate);
    if (availability1EndDate < availability2EndDate) {
      return -1;
    }
    if (availability1EndDate > availability2EndDate) {
      return 1;
    }
    return 0;
  }
  function mergeTime(availabilities) {
    availabilities = availabilities.sort(mergeTimeComparator);
    let res = [];
    let sub = availabilities[0];
    let current;
    for (let i = 1; i < availabilities.length; i++) {
      current = availabilities[i];
      if (
        current.startDate >= sub.startDate &&
        current.startDate <= sub.endDate &&
        current.endDate >= sub.endDate
      ) {
        sub.endDate = current.endDate;
      } else if (current.startDate > sub.endDate) {
        let copy = {
          startDate: sub.startDate,
          endDate: sub.endDate,
        };
        res.push(copy);
        sub = current;
      }
    }
    res.push(sub);
    return res;
  }
  async function goLiveHandler() {
    let availabilities = [];
    for (let s in dateSelections) {
      availabilities.push({
        startDate: toDate(dateSelections[s].startDate),
        endDate: toDate(dateSelections[s].endDate),
      });
    }
    availabilities = mergeTime(availabilities);

    const body = {
      availability: availabilities,
    };
    await makeRequest(
      "/listings/publish/" + props.singleListing.id,
      "PUT",
      errorCtx,
      () => {
        props.setNeedUpdate(true);
        props.goLiveHandleClose();
      },
      body,
      userCtx.user.token
    );
  }

  return (
    <>
      <Modal
        centered
        size="lg"
        show={props.show}
        onHide={props.goLiveHandleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>choose the availability date</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={classes.contentSection}>
            <div className={classes.btnSection}>
              <Button variant="primary" onClick={addMoreSelection}>
                Add more
              </Button>
              <Button variant="danger" onClick={removeSelection}>
                Less
              </Button>
            </div>
            <DateRangePicker
              locale={enAU}
              onChange={(item) =>
                setDateSelections({ ...dateSelections, ...item })
              }
              ranges={getSelections()}
              staticRanges={[]}
              inputRanges={[]}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={props.goLiveHandleClose}>
            Close
          </Button>
          <Button id = "publishBtn" variant="primary" onClick={goLiveHandler}>
            Publish
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

MyListingGoLiveModal.propTypes = {
  singleListing: PropTypes.object,
  show: PropTypes.bool,
  goLiveHandleClose: PropTypes.func,
  setNeedUpdate: PropTypes.func,
};

export default MyListingGoLiveModal;
