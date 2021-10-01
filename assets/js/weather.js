"use strict";
//All my constants:
const today = new Date();
const fiveDay = document.querySelector("#fiveDayBody");
const currentWeather = document.querySelector("#currentWeather");
const weatherHeader = document.querySelector("#weatherHeader");
const currentWeatherCard = document.querySelector("#currentWeatherCard");

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
    console.log(data, apiResponse);

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

    // Empty Current Weather element for new data to be entered:
    currentWeather.textContent = "";
    fiveDay.textContent = "";

    // Update <h2> element to show city, date and icon
    weatherHeader.innerHTML = city + " (" + date + ") " + weatherIconLink;

    // Return a fetch request to the OpenWeather using longitude and latitude:
    return fetch(
      "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        latitude +
        "&lon=" +
        longitude +
        "&exclude=alerts,minutely,hourly&units=imperial&appid=ecaa6040fe70f7ecaf9efcea97dfda07"
    )
      .then(function (response) {
        return response.json();
      })
      .then(function (response) {
        console.log(response);

        //Create the 4 pieces of informaiton to display under main forecast:
        let displayWeather = response;
        displayWeather = {
          temperature: response.current.temp.toFixed(1),
          humidity: response.current.humidity,
          wind: response.current.wind_speed.toFixed(1),
          uvIndex: response.current.uvi.toFixed(1),
        };
        console.log(displayWeather);

        const markUpData = ` 
            <p><b>Temperature: </b>${displayWeather.temperature}°F</b></p>
            <p><b>Humidity: </b>${displayWeather.humidity}%</b></p>
            <p><b>Wind Speed: </b>${displayWeather.wind} MPH</b></p>
            <p><b>UV Index: </b>${displayWeather.uvIndex}</b></p>`;
        //Keep CL to make sure it's all working.
        console.log(markUpData);
        currentWeather.insertAdjacentHTML("afterbegin", markUpData);

        // Get extended forecast data
        var fiveDayforecast = response.daily;
        console.log(fiveDayforecast);
      });
  } catch (err) {
    //Error catching for the API request:
    alert(err);
  }
};

//Kick it off
fetchWeatherApi();
