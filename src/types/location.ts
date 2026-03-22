export interface LocationState {
    latitude: number | null;
    longitude: number | null;
    city: string | null;
    state: string | null;
    country: string | null;
    address: string | null;
    permission: "granted" | "denied" | "prompt" | "unknown";
    tracking: boolean;
}

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export interface AddressPayload {
  city: string;
  state: string;
  country: string;
  address: string;
}