import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SingleListing from "./SingleListing";
import * as React from "react";

import * as router from "react-router";

const imageSrc =
  "http://t0.gstatic.com/licensed-image?q=tbn:ANd9GcRqMbXvdztEAKJMI7MtP0RuM6rYlOQ1TmLL8vBIGj_PLM0hgE_4ua7_Tw9rtFaBQSAEPXcZEyuYrniOmuA";

const id = 1234;

const city = "Sydney";

const title = "Escape in Luxury overlooking the Pacific Ocean";

const price = "500";

const listingData = {
  id: id,
  title: title,
  owner: "kp@gmail.com",
  address: {
    street: "Defries street",
    city: city,
    state: "New South Wales",
    postcode: "3000",
    country: "Australia",
  },
  price: price,
  thumbnail: imageSrc,
  metadata: {
    propertyType: "hotel",
    numOfBeds: "1",
    numOfBedrooms: "2",
    numOfBathrooms: "1",
    amenities: ["garden", "kitchen", "mountain", "parking"],
  },
  reviews: [],
  availability: [{ startDate: "2022-11-02", endDate: "2022-11-23" }],
  published: true,
  postedOn: "2022-11-07T07:34:08.498Z",
  averageRating: 3,
  totalReviews: 10,
};

const navigate = jest.fn();

beforeEach(() => {
  jest.spyOn(router, "useNavigate").mockImplementation(() => navigate);
});

describe("Single Listing", () => {
  it("render single listing with no date filter", () => {
    render(<SingleListing singleListing={listingData} />);
    expect(screen.getByRole("img", { name: "thumbnail" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "$" + price })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: city })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "3 Stars" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "(10)" })).toBeInTheDocument();

    userEvent.click(screen.getByAltText("thumbnail"));
    expect(navigate).toHaveBeenCalledWith("/listing/" + id);
  });

  it("render single listing with date filter", () => {
    const startDate = "2022-11-12";
    const endDate = "2022-11-24";
    render(
      <SingleListing
        singleListing={listingData}
        startDate={startDate}
        endDate={endDate}
      />
    );

    expect(screen.getByRole("img", { name: "thumbnail" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: title })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "$" + price })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: city })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "3 Stars" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "(10)" })).toBeInTheDocument();

    userEvent.click(screen.getByAltText("thumbnail"));
    expect(navigate).toHaveBeenCalledWith(
      "/listing/" + id + "?start_date=" + startDate + "&end_date=" + endDate
    );
  });
});
