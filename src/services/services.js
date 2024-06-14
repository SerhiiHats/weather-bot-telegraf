const axios = require("axios");
const constants = require("node:constants");
require('dotenv').config();

const URL_IPINFO_IO = `https://ipinfo.io/?token=${process.env.IP_TOKEN}`;

const currentWeatherOfString = async () => {
  const currentLocation = await getLocationFromIp(URL_IPINFO_IO);
  if (currentLocation) {
    const arrayOfCoordinates = currentLocation.loc.split(',')
    const lat = arrayOfCoordinates[0];
    const lon = arrayOfCoordinates[1];
    if (lat && lon) {
      const strOfWeather = await getCurrentWeather(lat, lon);
      return strOfWeather;

    } else {
      return "";
    }
  }

  return "";
}

async function getLocationFromIp(url) {
  const currentLocation = await axios.get(url)
    .then(res => {
      return res.data;
    })
    .catch(err => console.log("Error: ", err.message));
  return currentLocation;
}

async function getCitiesFromGeocoder(userCity) {
  const URL = `https://api.openweathermap.org/geo/1.0/direct?q=${userCity}&limit=5&appid=${process.env.API_KEY_WEATHER}`;
  const response = await axios.get(URL);
 return response.data;

}

async function getCurrentWeather(lat, lon) {
  if (lat && lon) {
    const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.API_KEY_WEATHER}`;
    const response = await axios.get(URL)
      .then(res => res.data);

    // console.log(response);
    return `App ☔ the Weather: \n${response.name.toUpperCase()}:
now 🌡 ${(response.main.temp - 273.15).toFixed(2)} ℃, ${response.weather[0].description}
feels like ${(response.main.feels_like - 273.15).toFixed(2)} ℃\nwind 🌬 ${response.wind.speed} m/cek.\nsunrise: **-**\nsunset: **-**`;

  } else {
    return `Sorry we can't get your location, please send your location`;
  }
}

module.exports = {
  currentWeatherOfString,
  getCurrentWeather,
  getCitiesFromGeocoder,
}