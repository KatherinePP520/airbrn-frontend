import React from "react";

import AirConditionIcon from "../icons/AirConditionIcon";
import GardenViewIcon from "../icons/GardenViewIcon";
import KitchenIcon from "../icons/KitchenIcon";
import MountainViewIcon from "../icons/MountainViewIcon";
import ParkingIcon from "../icons/ParkingIcon";
import PetAllowIcon from "../icons/PetAllowIcon";
import PoolIcon from "../icons/PoolIcon";
import SeaViewIcon from "../icons/SeaViewIcon";
import TvIcon from "../icons/TvIcon";
import WashingMachineIcon from "../icons/WashingMachineIcon";
import WiFiIcon from "../icons/WiFiIcon";

const amenityElements = [
  {
    name: "aircon",
    element: <AirConditionIcon />,
    display: "Air Conditioner",
  },
  { name: "garden", element: <GardenViewIcon />, display: "Garden View" },
  { name: "kitchen", element: <KitchenIcon />, display: "Kitchen" },
  {
    name: "mountain",
    element: <MountainViewIcon />,
    display: "Mountain View",
  },
  { name: "parking", element: <ParkingIcon />, display: "Parking" },
  { name: "pet", element: <PetAllowIcon />, display: "Pet Allowed" },
  { name: "pool", element: <PoolIcon />, display: "Pool" },
  { name: "sea", element: <SeaViewIcon />, display: "Sea View" },
  { name: "tv", element: <TvIcon />, display: "TV" },
  {
    name: "washing",
    element: <WashingMachineIcon />,
    display: "Washing Machine",
  },
  { name: "wifi", element: <WiFiIcon />, display: "Wi-Fi" },
];

export default amenityElements;
