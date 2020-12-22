// create array for searched cities and save into local storage
var newCity;
var lastSearch;
if (JSON.parse(localStorage.getItem("city")) === null) {
  newCity = [];
} else {
  newCity = JSON.parse(localStorage.getItem("city"));
};
if (localStorage.getItem("lastSearch") === null) {
  lastSearch = "";
} else {
  lastSearch = localStorage.getItem("lastSearch");
}
// search button click event 
$("#search-button").on("click", function () {
  event.preventDefault();
  $("#dashboard").empty()
  $("#forecast").empty();
  var city = $("#city-input").val();
  lastSearch = city;
  localStorage.setItem("lastSearch", lastSearch);
  if (!newCity.includes(city)) {
    newCity.push(city);
    console.log(city);
    localStorage.setItem("city", JSON.stringify(newCity));
    appendCities();
  }
  getWeatherInfo(city);
});

//append cities function
function appendCities() {
  $("#history").empty();
  for (i = 0; i < newCity.length; i++) {
    var citySearched = $("<li>").addClass("list-group-item");
    citySearched.addClass("searchedCity");
    citySearched.attr("cityName", newCity[i]);
    citySearched.text(newCity[i]);
    console.log(citySearched);
    $("#history").append(citySearched);
  }
}
// run appendCities function
appendCities()

//searched history click function
$(document).on("click", ".searchedCity", function () {
  city = $(this).attr("cityName");
  lastSearch = city;
  localStorage.setItem("lastSearch", lastSearch);
  $("#dashboard").empty();
  $("#forecast").empty();
  getWeatherInfo(city);
});

//get weather info from Open Weather API and append the info to the dashboard
function getWeatherInfo(city) {
  var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&APPID=287fc15ee994aa3bde52c4eebc5fa76a";
  // ajax
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function (response) {
    console.log(response);
    var cityName = response.name;
    var date = dayjs.unix(response.dt).format('M/D/YYYY');
    var temperature = response.main.temp;
    var humidity = response.main.humidity;
    var windSpeed = response.wind.speed;
    var weatherIconURL = "http://openweathermap.org/img/wn/" + response.weather[0].icon + ".png";
    // append weather info into the dashboard div
    console.log(cityName, date, temperature, humidity, windSpeed)
    var dashboardHeader = $("<h2>").text(cityName + " (" + date + ")");
    $("#dashboard").append(dashboardHeader);
    dashboardHeader.append($("<img>").addClass("icon").attr("src", weatherIconURL));
    $("#dashboard").append($("<p>").text("Temperature: " + temperature + " ℉"));
    $("#dashboard").append($("<p>").text("Humidity: " + humidity + "%"));
    $("#dashboard").append($("<p>").text("Wind Speed: " + windSpeed + " MPH"));
    var lat = response.coord.lat;
    console.log(lat);
    var lon = response.coord.lon;
    console.log(lon);
    //get uv index
    var queryURLUV = "https://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat + "&lon=" + lon + "&cnt=1&appid=287fc15ee994aa3bde52c4eebc5fa76a";
    $.ajax({
      url: queryURLUV,
      method: "GET"
    }).then(function (response) {
      var uvIndex = response[0].value;
      console.log(uvIndex);
      var uvIndexP = $("<p>");
      uvIndexP.append($("<span>").text("UV Index: "));
      uvIndexP.append($("<span>").addClass("uvIndex").text(uvIndex));
      $("#dashboard").append($(uvIndexP));
      // uvindex set different color for favorable, moderate, or severe
      if (uvIndex < 2.5) {
        $(".uvIndex").css("background-color", "green");
      } else if (uvIndex > 2.5 && uvIndex < 7) {
        $(".uvIndex").css("background-color", "yellow");
        $(".uvIndex").css("color", "black");
      } else {
        $("#.uvIndex").css("background-color", "red");
      }
    });
    // get 5-day forcast and append to the dashboard
    var queryURLForcast = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=287fc15ee994aa3bde52c4eebc5fa76a";
    $.ajax({
      url: queryURLForcast,
      method: "GET"
    }).then(function (response) {
      console.log(response);
      $("#forecast").append($("<h2>").text("5-Day Forecast"));
      for (j = 1; j < 6; j++) {
        console.log(response.daily[j]);
        var weatherCard = $("<div>").addClass("card weather-card");
        var weatherCardBody = $("<div>").addClass("card-body");
        var cardTitle = $("<h5>").addClass("card-title");
        var cardImg = $("<img>").addClass("weather-icon");
        var cardTemp = $("<p>").addClass("card-text");
        var cardHumid = $("<p>").addClass("card-text");
        var forecastDate = response.daily[j].dt;
        forecastDate = dayjs.unix(forecastDate).format('M/D/YYYY');
        console.log(forecastDate);
        var forecastIconUrl = "http://openweathermap.org/img/wn/" + response.daily[j].weather[0].icon + ".png";
        weatherCard.append(weatherCardBody);
        weatherCardBody.append(cardTitle.text(forecastDate));
        weatherCardBody.append(cardImg.attr("src", forecastIconUrl));
        weatherCardBody.append(cardTemp.text("Temp: " + response.daily[j].temp.day + " ℉"));
        weatherCardBody.append(cardHumid.text("Humidity: " + response.daily[j].humidity + "%"));
        $("#forecast").append(weatherCard);
      };
    });



  });

}

// when refresh page, dashboard will show the info for the last searched city
if (lastSearch.length > 0) {
  city = lastSearch;
  getWeatherInfo(city);
}