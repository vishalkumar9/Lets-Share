const axios = require("axios");
const HttpError = require("../models/http-error");
const API_KEY = "pk.1f8730c25aa6294939645b6e36e9c332";

async function getCoordsForAddress(address) {
  const response = await axios.get(
    `https://us1.locationiq.com/v1/search.php?key=${API_KEY}&q=${encodeURIComponent(
      address
    )}&format=json`
  );

  console.log(response);

  const data = response.data[0];

  //   console.log(data);

  if (!data || data.status === "ZERO_RESULTS") {
    const error = new HttpError(
      "Could not find location for the specified address.",
      422
    );
    throw error;
  }

  return data;
}

module.exports = getCoordsForAddress;
