import { setPermission } from "@/store/locationSlice";
import { Dispatch } from "@reduxjs/toolkit";

export const checkLocationPermission = async (dispatch: Dispatch) => {
  if (!navigator.permissions) return "unknown";

  const result = await navigator.permissions.query({
    name: "geolocation",
  });

  dispatch(setPermission(result.state as "granted" | "denied" | "prompt"));

  return result.state;
};