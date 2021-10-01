"use strict";

var apiData =
  "https://api.openweathermap.org/data/2.5/weather?q=" +
  cityName +
  "&units=imperial&appid=f97301447cbd41068af8623a398ba1fb";

var GetWeatherInfo = async function (name) {
  try {
    fetch(apiData)
      .then(function (cityResponse) {
        return cityResponse.json();
      })
      .then(function (response) {
        // Create variables to hold the latitude and longitude of requested city
        console.log(name);
        console.log(response);
        var latitude = cityResponse.coord.lat;
        var longitude = cityResponse.coord.lon;

        // Create variables for City name, current date and icon information for use in current Weather heading
        var city = cityResponse.name;
        var date =
          today.getMonth() +
          1 +
          "/" +
          today.getDate() +
          "/" +
          today.getFullYear();
        var weatherIcon = cityResponse.weather[0].icon;
        var weatherDescription = cityResponse.weather[0].description;
        var weatherIconLink =
          "<img src='http://openweathermap.org/img/wn/" +
          weatherIcon +
          "@2x.png' alt='" +
          weatherDescription +
          "' title='" +
          weatherDescription +
          "'  />";

        // Empty Current Weather element for new data
        currentWeatherEl.textContent = "";
        fiveDayEl.textContent = "";

        // Update <h2> element to show city, date and icon
        weatherStatusEl.innerHTML = city + " (" + date + ") " + weatherIconLink;

        // Remove class name 'hidden' to show current weather card
        currentWeatherCardEl.classList.remove("hidden");
        fiveDayCardEl.classList.remove("hidden");
      });
  } catch (err) {
    alert(err);
    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
  }
};
