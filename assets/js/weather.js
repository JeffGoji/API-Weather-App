"use strict";
//All my constants:
const today = new Date();
//City search constants:
const citySearch = document.querySelector("#citySearch");
const searchForm = document.querySelector("#searchForm");
const searchBtn = document.querySelector("#searchBtn");
//History button and main weather displays
const allHistoryButtons = document.querySelector("#allHistoryButtons");
const currentWeather = document.querySelector("#currentWeather");
const weatherHeader = document.querySelector("#weatherHeader");
// Five day forecast
const allFiveDayBlocks = document.querySelector("#allFiveDayBlocks");
const locationCity = document.querySelector("#locationCity");
const fiveDayCard = document.querySelector("#fiveDayCard");
//For displaying current Weather.
const currentWeather__Temp = document.querySelector("#currentWeather__Temp");
const currentWeather__Wind = document.querySelector("#currentWeather__Wind");
const currentWeather__Humidity = document.querySelector(
  "#currentWeather__Humidity"
);
const currentWeather__UVIndex = document.querySelector(
  "#currentWeather__UVIndex"
);

//My empty array for the if else below.
var searchHistory = [];

var formSubmitHandler = function (event) {
  //alert("formSubmitHandler turned on");

  event.preventDefault();

  // get city name value from input element
  var cityname = searchForm.value.trim().toLowerCase();

  //alert("cityname = " + cityname);

  // Set city name in local storage and generate history buttons
  if (Boolean(cityname) === true) {
    fetchWeatherApi(cityname);

    searchForm.value = "";
  } else {
    alert("Please enter your city name.");
  }
};

var createHistoryButton = function (cityname) {
  //alert("searchHistory=" + searchHistory);

  let citynameTitleCase = titleCaseWithSpaces(cityname);

  var buttonHTML = `
<div class="historyButtonBlock">
    <button onclick="fetchWeatherApi('${cityname}');" class="historyButton btn btn-secondary text-white gap-2 col-7 mx-auto mb-3">${citynameTitleCase}</button>
</div>
`;
  allHistoryButtons.insertAdjacentHTML("beforeend", buttonHTML);
};

// Fetch request for weather API:
var fetchWeatherApi = async function (cityname) {
  //API componnents:
  var api = "https://api.openweathermap.org/data/2.5/weather?q=";
  var units = "&units=imperial";
  var apiKey = "&appid=f97301447cbd41068af8623a398ba1fb";

  //Create variable for API data
  var apiData = api + cityname + units + apiKey;

  try {
    let response = await fetch(apiData);
    //json response
    let data = await response.json();

    //alert("data = " + JSON.stringify(data, null, 2));

    if (!response.ok) throw new Error(`${data.message} (${response.status})`);

    unhideWeatherInfo();

    if (searchHistory === [0]) {
      alert("Please enter a city");
    } else if (searchHistory.indexOf(cityname) === -1) {
      searchHistory.push(cityname);
      localStorage.setItem("weatherSearch", JSON.stringify(searchHistory));
      createHistoryButton(cityname);
    }

    //Logged the response and data coming back for testing and trouble shooting pruposes.
    //console.log(data, cityname);

    console.log("fetchWeatherApi data=" + JSON.stringify(data, null, 2));

    // Create variables to hold the latitude and longitude of requested city above
    let latitude = data.coord.lat;
    let longitude = data.coord.lon;

    console.log("latitude = " + latitude);
    console.log("longitude = " + longitude);

    // Create variables for City name, current date and icon information for use in current Weather heading
    let city = data.name;
    let date =
      today.getMonth() + 1 + "/" + today.getDate() + "/" + today.getFullYear();

    let weathIcon = data.weather[0].icon;
    let weathDes = data.weather[0].description;

    let weathIconLink =
      "<img src='http://openweathermap.org/img/wn/" +
      weathIcon +
      "@2x.png' alt='" +
      weathDes +
      "' title='" +
      weathDes +
      "'  />";

    let weathTempMax = data.main.temp;
    let weathWind = data.wind.speed;
    let weathHumidity = data.main.humidity;

    // Empty Current Weather element for new data to be entered:
    //currentWeather.textContent = "";

    // Update <h2> element to show city, date and icon
    weatherHeader.innerHTML = city + " (" + date + ") " + weathIconLink;

    currentWeather__Temp.textContent = weathTempMax;
    currentWeather__Wind.textContent = weathWind;
    currentWeather__Humidity.textContent = weathHumidity;

    displayFiveDayWeather(latitude, longitude);
  } catch (err) {
    //Error catching for the API request:
    alert(err);
  }
};

var displayFiveDayWeather = async function (latitude, longitude) {
  //Create the 4 pieces of informaiton to display under main forecast:
  //alert("displayWeather is working!");

  // Return a fetch request to the OpenWeather using longitude and latitude:
  let apiURL =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    latitude +
    "&lon=" +
    longitude +
    "&exclude=alerts,minutely,hourly&units=imperial&appid=ecaa6040fe70f7ecaf9efcea97dfda07";

  let response = await fetch(apiURL);
  //json response
  let data = await response.json();
  //console.log("data=" + JSON.stringify(data, null, 2));

  // Get extended forecast data
  var fiveDayForecastArr = data.daily;
  //console.log("fiveDayForecast=" + JSON.stringify(fiveDayForecastArr, null, 2));

  // clear out old blocks if needed
  allFiveDayBlocks.textContent = "";

  // Create day cards for extended forecast and populate cards with information:
  for (let i = 1; i < fiveDayForecastArr.length - 2; i++) {
    let date = new Date(fiveDayForecastArr[i].dt * 1000);

    let dateStr =
      date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();

    //console.log("fiveDayForecastArr[i].dt=" + fiveDayForecastArr[i].dt);
    //console.log("date.toUTCString()=" + date.toUTCString());
    //console.log("dateStr = " + dateStr);

    let weathDes = fiveDayForecastArr[i].weather[0].description;
    //console.log("weathDes = " + weathDes);

    let weathIcon = fiveDayForecastArr[i].weather[0].icon;
    //console.log("weathIcon = " + weathIcon);

    let weathIconLink =
      "<img src='http://openweathermap.org/img/wn/" +
      weathIcon +
      "@2x.png' alt='" +
      weathDes +
      "' title='" +
      weathDes +
      "'  />";

    let temp = fiveDayForecastArr[i].temp.max;
    //console.log("tempMax = " + tempMax);

    let windMPH = fiveDayForecastArr[i].wind_speed;
    //console.log("windMPH = " + windMPH);

    let humidity = fiveDayForecastArr[i].humidity;
    //console.log("humidity = " + humidity);

    let cardDayHTML = `
<div class="fiveDayBlock col">
    <div class="fiveDayBlock__Date">${dateStr}</div>
    <div>${weathIconLink}</div>
    <div>Temp: ${temp} &deg;F</div>
    <div>Wind: ${windMPH} MPH</div>
    <div>Humidity: ${humidity}%</div>
</div>
`;
    currentWeather__UVIndex.textContent = fiveDayForecastArr[0].uvi;

    allFiveDayBlocks.insertAdjacentHTML("beforeend", cardDayHTML);
  }
};

// Load any past city weather searches
var loadHistory = function () {
  searchHistory = JSON.parse(localStorage.getItem("weatherSearch"));

  //alert("searchHistory = " + JSON.stringify(searchHistory, null, 2));

  if (Array.isArray(searchHistory)) {
    for (let i = 0; i < searchHistory.length; i++) {
      createHistoryButton(searchHistory[i]);
    }
  }
};

// Search weather using search history buttons
var buttonClickHandler = function (event) {
  var cityname = event.target.getAttribute("cityHistory");
  if (cityname) {
    getWeatherInfo(cityname);
  }
};

//code to unhide main display and 5 cards.
var unhideWeatherInfo = function () {
  fiveDayCard.classList.remove("hidden");
  locationCity.classList.remove("hidden");
};

searchBtn.addEventListener("click", formSubmitHandler, false);

//Load history function to kick everything off.
loadHistory();

// Library Functions.

function titleCase(string) {
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
}

function titleCaseWithSpaces(strIn) {
  let strInArr = strIn.split(" ");

  let strOut = "";
  for (let i = 0; i < strInArr.length; i++) {
    strOut += titleCase(strInArr[i]) + " ";
  }

  return strOut.trim();
}
