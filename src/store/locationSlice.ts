import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LocationCoords,LocationState,AddressPayload } from "../types/location";

const initialState: LocationState = {
  latitude: null,
  longitude: null,
  city: null,
  state: null,
  country: null,
  address: null,
  permission: "unknown",
  tracking: false,
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setLocation: (state, action: PayloadAction<LocationCoords>) => {
      state.latitude = action.payload.latitude;
      state.longitude = action.payload.longitude;
    },
     setAddress: (state, action: PayloadAction<AddressPayload>) => {
      state.city = action.payload.city;
      state.state = action.payload.state;
      state.country = action.payload.country;
      state.address = action.payload.address;
    },
    setPermission: (
      state,
      action: PayloadAction<"granted" | "denied" | "prompt">
    ) => {
      state.permission = action.payload;
    },
    setTracking: (state, action: PayloadAction<boolean>) => {
      state.tracking = action.payload;
    },
  },
});

export const { setLocation, setPermission, setTracking, setAddress } = locationSlice.actions;
export default locationSlice.reducer;