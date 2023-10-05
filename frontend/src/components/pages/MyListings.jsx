import React from "react";
import AllMyListings from "../my-listing-management/AllMyListings";
import { useState, useEffect } from "react";
import { useContext } from "react";
import UserContext from "../store/user-context";
import ErrorContext from "../error/ErrorContext";
import { useNavigate } from "react-router-dom";
import makeRequest, { getListingDetail } from "../../utils/helper";
import Button from "react-bootstrap/Button";

function MyListingsPage() {
  const [myListings, setMyListings] = useState([]);
  const [needUpdate, setNeedUpdate] = useState(true);
  const [, setError] = useState();
  const userCtx = useContext(UserContext);
  const errorCtx = useContext(ErrorContext);

  let navigate = useNavigate();
  function navigateToNewListing() {
    navigate("/listing/new");
  }

  function updateMyListing(id, newSingleListing) {
    let currentListings = myListings;
    for (let i = 0; i < currentListings.length; i++) {
      if (currentListings[i].id == id) {
        currentListings[i] = newSingleListing;
        break;
      }
    }

    setMyListings(currentListings);
  }

  const fetchListings = async () => {
    await makeRequest("/listings", "GET", errorCtx, async (data) => {
      const myListingIds = data.listings
        .filter((singleList) => singleList.owner == userCtx.user.email)
        .map((singleList) => singleList.id);

      const myDetailedListings = await Promise.all(
        myListingIds.map((id) => getListingDetail(id, setError))
      );
      calculateAverageRating(myDetailedListings)
      setMyListings(myDetailedListings.filter((listing) => listing));
    });
  };


  function calculateAverageRating( allPublishedListings){
    for(let listing of allPublishedListings ){
      let totalReview=0
      let count=0
      if(listing.reviews.length==0){
        listing.totalReviews=null;
        listing.averageRating=null;
      }
      for(let review of listing.reviews){
        totalReview+=Number(review.rating); 
        count+=1   
      }
      const averageRating=Math.floor(totalReview/count);
      listing.averageRating=averageRating;
      listing.totalReviews=count;
    }
  }
  
  useEffect(() => {
    if (needUpdate) {
      fetchListings();
      setNeedUpdate(false);
    }
  }, [needUpdate]);

  return (
    <section>
      <h1>All My Listings</h1>
      <Button id="newListingBtn" variant="outline-primary" onClick={navigateToNewListing}>
        create new listing
      </Button>
      <AllMyListings
        myListings={myListings}
        updateMyListing={updateMyListing}
        setNeedUpdate={setNeedUpdate}
      />
    </section>
  );
}
export default MyListingsPage;
