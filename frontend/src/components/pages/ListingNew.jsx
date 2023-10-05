import React, { useContext } from "react";
import UserContext from "../store/user-context";
import ErrorContext from "../error/ErrorContext";
import { useNavigate } from "react-router-dom";
import NewOrEditListingForm from "../my-listing-management/NewOrEditListingForm";
import makeRequest from "../../utils/helper";
import classes from "./ListingNew.module.css"
import Button from "react-bootstrap/Button";
import { useState } from "react";

const ListingNewPage = () => {
  const [loadedListingData, setLoadedListingData]  = useState(null);
  const [key, setKey]  = useState(new Date().toISOString());
  const userCtx = useContext(UserContext);
  const errorCtx = useContext(ErrorContext);

  let navigate = useNavigate();

  function uploadFile (event) {
    const file = event.target.files[0];
    if (file.type != "application/json") {
      errorCtx.setHasError(true);
      errorCtx.setErrorMessage("Please only upload JSON files");
    }
    const reader = new FileReader();
    const dataUrlPromise = new Promise((resolve, reject) => {
        reader.onerror = reject;
        reader.onload = () => resolve(reader.result);
    });
    reader.readAsText(file);
    dataUrlPromise.then(data => {
      // Simply parse the data to the form.
      // The input validatino will be performed when try to submit.
      data = JSON.parse(data);
      // amenities filed need to get set, otherwise the option will be hidden in the form.
      if (!data.metadata) {
        data.metadata= {};
        data.metadata.amenities = [];
      } else if (!data.metadata.amenities) {
        data.metadata.amenities = [];
      }
      setLoadedListingData(data);
      setKey(new Date().toISOString());
    });

  }

  async function addNewListingHandler(newListData) {
    await makeRequest(
      "/listings/new",
      "POST",
      errorCtx,
      () => navigate("/listing/my"),
      newListData,
      userCtx.user.token
    );
  }
  return (
    <section>
      <div className={classes.titleSection}>
        <h1 className={classes.title}>Add New List here</h1>
        <Button variant="outline-primary" onClick = {() => document.getElementById("fileUpload").click()}>Load from file</Button>
        <input id="fileUpload" type = "file" style={{display: "none"}} onChange={uploadFile}/>
      </div>
      <NewOrEditListingForm
        key={key}
        submitAction={addNewListingHandler}
        isNewListing={loadedListingData == null}
        listingSingle = {loadedListingData}
      />
    </section>
  );
};
export default ListingNewPage;
