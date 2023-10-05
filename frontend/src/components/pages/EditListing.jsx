import React, { useEffect, useState } from "react";
import { useContext } from "react";
import UserContext from "../store/user-context";
import ErrorContext from "../error/ErrorContext";
import { useNavigate, useParams } from "react-router-dom";
import NewOrEditListingForm from "../my-listing-management/NewOrEditListingForm";
import makeRequest from "../../utils/helper";

const EditListingPage = () => {
  let { id } = useParams();
  const [listingSingle, setListingSingle] = useState({});

  const userCtx = useContext(UserContext);
  const errorCtx = useContext(ErrorContext);

  let navigate = useNavigate();

  async function editListingHandler(editListData) {
    await makeRequest(
      "/listings/" + id,
      "PUT",
      errorCtx,
      () => navigate("/listing/my"),
      editListData,
      userCtx.user.token
    );
  }

  async function getListingSingleDetail(listingId) {
    const data = await makeRequest(
      "/listings/" + listingId,
      "GET",
      errorCtx,
      () => {}
    );
    const listing = data.listing;
    listing.id = listingId;
    setListingSingle(listing);
  }

  useEffect(() => {
    getListingSingleDetail(id);
  }, []);

  if (!listingSingle) {
    return (
      <section>
        <h1>Edit your List here</h1>
      </section>
    );
  } else {
    return (
      <section>
        <h1>Edit your List here</h1>
        <NewOrEditListingForm
          submitAction={editListingHandler}
          edit={true}
          listingSingle={listingSingle}
        />
      </section>
    );
  }
};

export default EditListingPage;
