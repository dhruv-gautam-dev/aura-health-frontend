import { Dispatch } from "@reduxjs/toolkit";
import { LocationCoords } from "../types/location";
import { setAddress, setLocation, setTracking } from "@/store/locationSlice";
import { getAddressFromCoords } from "./geocodeService";

let watchId: number | null = null;
let lastSentTime = 0;

export const startTracking = (
  dispatch: Dispatch,
  sendLocationToServer: (location: LocationCoords) => void
) => {
  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  watchId = navigator.geolocation.watchPosition(
    async (position) => {
      const location: LocationCoords = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      const address = await getAddressFromCoords(
      location.latitude,
      location.longitude
    );
    if (address) {
      dispatch(setAddress(address));
    }

      dispatch(setLocation(location));

      const now = Date.now();
      if (now - lastSentTime > 10000) {
        sendLocationToServer(location);
        lastSentTime = now;
      }
    },
    (error) => {
      console.log("Location error:", error);
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 5000,
    }
  );

  dispatch(setTracking(true));
};

export const stopTracking = (dispatch: Dispatch) => {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    dispatch(setTracking(false));
  }
};