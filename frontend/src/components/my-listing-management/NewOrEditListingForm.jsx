import React, { useEffect, useContext } from "react";
import FormCard from "../ui/FormCard";
import Button from "react-bootstrap/Button";
import ImageUploading from "react-images-uploading";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import classes from "./NewOrEditListingForm.module.css";
import PropTypes from "prop-types";
import ErrorContext from "../error/ErrorContext";
import amenityElements from "../icons/AmenityConstant";

function NewOrEditListingForm(props) {
  const [title, setTitle] = React.useState("");
  const [street, setStreet] = React.useState("");
  const [city, setCity] = React.useState("");
  const [state, setState] = React.useState("");
  const [postcode, setPostcode] = React.useState("");
  const [country, setCountry] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [propertyType, setPropertyType] = React.useState("house");
  const [numOfBeds, setNumOfBeds] = React.useState("");
  const [numOfBedrooms, setNumOfBedrooms] = React.useState("");
  const [numOfBathrooms, setNumOfBathrooms] = React.useState("");
  const [amenities, setAmenities] = React.useState(null);
  const [images, setImages] = React.useState([]);
  const maxNumber = 69;

  const errorCtx = useContext(ErrorContext);

  function toggleAmenity(name) {
    for (let i = 0; i < amenities.length; i++) {
      // already added amenities, remove it.
      if (amenities[i] == name) {
        amenities.splice(i, 1);
        setAmenities(amenities);
        return;
      }
    }
    amenities.push(name);
    setAmenities(amenities);
  }

  const onChange = (imageList) => {
    setImages(imageList);
  };

  function submitHandler() {
    if (!title) {
      errorCtx.setHasError(true);
      errorCtx.setErrorMessage("A listing needs an non empty Title!");
      return;
    }
    if (!street || !city || !postcode || !state || !country) {
      errorCtx.setHasError(true);
      errorCtx.setErrorMessage("Please enter a valid address!");
      return;
    }
    if (!price || price <= 0) {
      errorCtx.setHasError(true);
      errorCtx.setErrorMessage("Please enter a valid price!");
      return;
    }
    if (!numOfBeds || numOfBeds <= 0) {
      errorCtx.setHasError(true);
      errorCtx.setErrorMessage("Please enter a valid number of beds!");
      return;
    }
    if (!numOfBedrooms || numOfBedrooms <= 0) {
      errorCtx.setHasError(true);
      errorCtx.setErrorMessage("Please enter a valid number of bedrooms!");
      return;
    }
    if (!numOfBathrooms || numOfBathrooms <= 0) {
      errorCtx.setHasError(true);
      errorCtx.setErrorMessage("Please enter a valid number of bathrooms!");
      return;
    }
    if (!images || images.length == 0) {
      errorCtx.setHasError(true);
      errorCtx.setErrorMessage("Please provide at least one photo!");
      return;
    }
    const newThumbnail = images[0].dataURL;
    // The first image will be saved a thumbnail.
    images.splice(0, 1);
    const editedListData = {
      title: title,
      address: {
        street: street,
        city: city,
        state: state,
        postcode: postcode,
        country: country,
      },
      price: Number(price),
      thumbnail: newThumbnail,
      metadata: {
        propertyType: propertyType,
        numOfBeds: Number(numOfBeds),
        numOfBedrooms: Number(numOfBedrooms),
        numOfBathrooms: Number(numOfBathrooms),
        images: images.map((img) => img.dataURL),
        amenities: amenities,
      },
    };
    props.submitAction(editedListData);
  }

  useEffect(() => {
    if (props.listingSingle && props.listingSingle.metadata) {
      setTitle(props.listingSingle.title);
      setStreet(props.listingSingle.address.street);
      setCity(props.listingSingle.address.city);
      setState(props.listingSingle.address.state);
      setPostcode(props.listingSingle.address.postcode);
      setCountry(props.listingSingle.address.country);
      setPrice(props.listingSingle.price);
      setNumOfBeds(props.listingSingle.metadata.numOfBeds);
      setNumOfBedrooms(props.listingSingle.metadata.numOfBedrooms);
      setNumOfBathrooms(props.listingSingle.metadata.numOfBathrooms);
      setPropertyType(props.listingSingle.metadata.propertyType);
      setAmenities(props.listingSingle.metadata.amenities);
      const currentImage = [
        {
          dataURL: props.listingSingle.thumbnail,
        },
      ];
      if (props.listingSingle.metadata.images) {
        currentImage.push.apply(
          currentImage,
          props.listingSingle.metadata.images.map((i) => {
            return { dataURL: i };
          })
        );
      }
      setImages(currentImage);
    } else if (props.isNewListing) {
      setAmenities([]);
    }
  }, [props.listingSingle, props.isNewListing]);

  return (
    <FormCard>
      <div>
        <div className="mb-3">
          <label htmlFor="newListingTitle" className="form-label">
            Title
          </label>
          <input
            type="text"
            className="form-control"
            id="newListingTitle"
            aria-describedby="emailHelp"
            value={title || ""}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="newListingStreet" className="form-label">
            Street
          </label>
          <input
            type="text"
            className="form-control"
            id="newListingStreet"
            value={street || ""}
            onChange={(event) => setStreet(event.target.value)}
          />
          <Row>
            <Col>
              <label htmlFor="newListingCity" className="form-label">
                City
              </label>
              <input
                type="text"
                className="form-control"
                id="newListingCity"
                value={city || ""}
                onChange={(event) => setCity(event.target.value)}
              />
            </Col>
            <Col>
              <label htmlFor="newListingState" className="form-label">
                State
              </label>
              <input
                type="text"
                className="form-control"
                id="newListingState"
                value={state || ""}
                onChange={(event) => setState(event.target.value)}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <label htmlFor="newListingPostcode" className="form-label">
                Post Code
              </label>
              <input
                type="number"
                className="form-control"
                id="newListingPostcode"
                value={postcode || ""}
                onChange={(event) => setPostcode(event.target.value)}
              />
            </Col>
            <Col>
              <label htmlFor="newListingCountry" className="form-label">
                Country
              </label>
              <input
                type="text"
                className="form-control"
                id="newListingCountry"
                value={country || ""}
                onChange={(event) => setCountry(event.target.value)}
              />
            </Col>
          </Row>
        </div>
        <div className="mb-3">
          <Row>
            <Col>
              <label htmlFor="newListingPrice" className="form-label">
                Price
              </label>
              <input
                type="number"
                className="form-control"
                id="newListingPrice"
                value={price || 0}
                onChange={(event) => setPrice(event.target.value)}
              />
            </Col>
            <Col>
              <label htmlFor="newListingType" className="form-label">
                Property Type
              </label>
              <select
                id="newListingType"
                className="form-select"
                aria-label="Default select example"
                value={propertyType || "house"}
                onChange={(event) => setPropertyType(event.target.value)}
              >
                <option value="house">House</option>
                <option value="apartment">Apartment</option>
                <option value="hotel">Hotel</option>
              </select>
            </Col>
          </Row>
        </div>
        <div className="mb-3">
          <Row>
            <Col>
              <label htmlFor="newListingNumOfBedRooms" className="form-label">
                Number Of Bedrooms
              </label>
              <input
                type="number"
                className="form-control"
                id="newListingNumOfBedRooms"
                value={numOfBedrooms || ""}
                onChange={(event) => setNumOfBedrooms(event.target.value)}
              />
            </Col>
            <Col>
              <label htmlFor="newListingNumOfBathrooms" className="form-label">
                Number Of Bathrooms
              </label>
              <input
                type="number"
                className="form-control"
                id="newListingNumOfBathrooms"
                value={numOfBathrooms || ""}
                onChange={(event) => setNumOfBathrooms(event.target.value)}
              />
            </Col>
          </Row>
        </div>
        <div className="mb-3">
          <Row>
            <Col>
              <label htmlFor="newListingNumOfBeds" className="form-label">
                Number Of Beds
              </label>
              <input
                type="number"
                className="form-control"
                id="newListingNumOfBeds"
                value={numOfBeds || ""}
                onChange={(event) => setNumOfBeds(event.target.value)}
              />
            </Col>
            <Col></Col>
          </Row>
        </div>
        <div className="mb-3">
          <label className="form-label">Amenities (Check all applied)</label>
          {amenities &&
            amenityElements.map((am) => (
              <div className={classes.amenity} key={am.name}>
                <input
                  type="checkbox"
                  id={am.name + "-check"}
                  defaultChecked={amenities.includes(am.name)}
                  onChange={() => toggleAmenity(am.name)}
                />
                <label htmlFor={am.name + "-check"} className="form-label">
                  {am.element} {am.display}
                </label>
              </div>
            ))}
        </div>
        <div className="mb-3">
          <label className="form-label">
            Property Images (First image will be the thumbnail)
          </label>
          <ImageUploading
            id = "imageUpload"
            multiple
            value={images}
            onChange={onChange}
            maxNumber={maxNumber}
          >
            {({
              imageList,
              onImageUpload,
              onImageRemoveAll,
              onImageUpdate,
              onImageRemove,
            }) => (
              // write your building UI
              <div className="upload__image-wrapper">
                <Button
                  id = "imageUploadBtn"
                  variant="outline-primary"
                  className="m-2"
                  onClick={onImageUpload}
                >
                  Update image
                </Button>

                <Button
                  variant="outline-danger"
                  className="m-2"
                  onClick={onImageRemoveAll}
                >
                  Remove all images
                </Button>
                <div>
                  {imageList.map((image, index) => (
                    <div key={index} className={classes.ImageItem}>
                      <img
                        src={image.dataURL}
                        alt=""
                        className={classes.uploadImage}
                      />
                      <div className="image-item__btn-wrapper">
                        <Button
                          id = {"update-image-" + index}
                          size="sm"
                          variant="outline-primary"
                          onClick={() => onImageUpdate(index)}
                        >
                          Update
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => onImageRemove(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </ImageUploading>
        </div>
        <hr />
        <Button id = "submitListingBtn" variant="primary" onClick={submitHandler}>
          Submit
        </Button>
      </div>
    </FormCard>
  );
}

NewOrEditListingForm.propTypes = {
  listingSingle: PropTypes.object,
  isNewListing: PropTypes.bool,
  submitHandler: PropTypes.func,
  submitAction: PropTypes.func,
};

export default NewOrEditListingForm;
