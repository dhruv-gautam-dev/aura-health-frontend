export const getAddressFromCoords = async (lat: number, lng: number) => {
  try {
    const res = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${import.meta.env.VITE_GEOCODE_API_KEY}&language=en&countrycode=in&no_annotations=1`
    );

    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      console.log("No address found");
      return null;
    }

    const components = data.results[0].components;

    return {
      city: components.city || components.town || components.village || components.county || "",
      state: components.state || "",
      country: components.country || "",
      address: data.results[0].formatted || "",
    };
  } catch (error) {
    console.log("Geocode error", error);
    return null;
  }
};