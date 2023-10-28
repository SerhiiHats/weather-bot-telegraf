const axios = require("axios");
// const {backButtonMenu} = require("../utils/buttons");
require('dotenv').config();

const URL_IPINFO_IO = `https://ipinfo.io/?token=${process.env.IP_TOKEN}`;

const currentWeatherOfString = async () => {
  const currentLocation = await getLocationFromIp(URL_IPINFO_IO);
  if (currentLocation) {
    console.log(currentLocation)
    const arrayOfCoordinates = currentLocation.loc.split(',')
    const lat = arrayOfCoordinates[0];
    const lon = arrayOfCoordinates[1];
    console.log(`We got a response that:\nyour city: ${currentLocation.city} \nand your coordinates:\nlatitude: ${lat}\nlongitude: ${lon}`);
    if (lat && lon) {
      const strOfWeather = await getCurrentWeather(lat, lon);
      return strOfWeather;

    } else {
      console.log("Sorry we can't get your location 🤷, please send your location");
      return "";
    }
  }

  return "";
}

async function getLocationFromIp(url) {
  const currentLocation = await axios.get(url)
    .then(res => {
      console.log(`we got a response that: \nyour city: ${res.data.city} \nand your coordinates : ${res.data.loc}`);
      return res.data;
    })
    .catch(err => console.log("Error: ", err.message));
  return currentLocation;
}

async function getCurrentWeather(lat, lon) {
  if (lat && lon) {
    const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.API_KEY_WEATHER}`;
    const response = await axios.get(URL)
      .then(res => res.data);

    console.log(response);
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
}