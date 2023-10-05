import "./App.css";
import React from "react";
import { Route, Routes } from "react-router-dom";
import LoginPage from "./components/pages/Login";
import RegisterPage from "./components/pages/Register";
import ListingNewPage from "./components/pages/ListingNew";
import ListingAllPage from "./components/pages/ListingAll";
import MyListingPage from "./components/pages/MyListings";
import ListingSinglePage from "./components/pages/ListingSingle";
import EditListingPage from "./components/pages/EditListing";
import MySingleListingBookingPage from "./components/pages/MySingleListingBooking";
import MyBookingPage from "./components/pages/MyBooking";
import Layout from "./components/layout/Layout";
function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<ListingAllPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/listing/new" element={<ListingNewPage />} />
        <Route path="/listing/edit/:id" element={<EditListingPage />} />
        <Route path="/listing/my" element={<MyListingPage />} />
        <Route path="/listing/:id" element={<ListingSinglePage />} />
        <Route path="/host/:id" element={<MySingleListingBookingPage />} />
        <Route path="/booking" element={<MyBookingPage />} />
      </Routes>
    </Layout>
  );
}

export default App;
