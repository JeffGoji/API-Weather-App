"use strict";
//All my constants:
const today = new Date();
const fiveDay = document.querySelector("#fiveDayBody");
const currentWeather = document.querySelector("#currentWeather");
const weatherHeader = document.querySelector("#weatherHeader");
const currentWeatherCard = document.querySelector("#currentWeather");

//Create variable for API data
var apiData =
  "https://api.openweathermap.org/data/2.5/weather?q=houston&units=imperial&appid=f97301447cbd41068af8623a398ba1fb";

// Fetch request for weather API:
var fetchWeatherApi = async function (apiResponse) {
  try {
    let response = await fetch(apiData);
    //json response
    let data = await response.json();

    if (!response.ok) throw new Error(`${data.message} (${response.status})`);
    //Logged the response and data coming back for testing and trouble shooting pruposes.
    console.log(data);

    // Create variables to hold the latitude and longitude of requested city above
    var latitude = data.coord.lat;
    var longitude = data.coord.lon;
    console.log(latitude, longitude);

    // Create variables for City name, current date and icon information for use in current Weather heading
    var city = data.name;
    var date =
      today.getMonth() + 1 + "/" + today.getDate() + "/" + today.getFullYear();
    var weatherIcon = data.weather[0].icon;
    var weatherDescription = data.weather[0].description;
    var weatherIconLink =
      "<img src='http://openweathermap.org/img/wn/" +
      weatherIcon +
      "@2x.png' alt='" +
      weatherDescription +
      "' title='" +
      weatherDescription +
      "'  />";

    // Empty Current Weather element for new data
    currentWeather.textContent = "";
    fiveDay.textContent = "";

    // Update <h2> element to show city, date and icon
    weatherHeader.innerHTML = city + " (" + date + ") " + weatherIconLink;

    //Error catching for the API request:
  } catch (err) {
    alert(err);
  }
};

//Kick it off
fetchWeatherApi();
