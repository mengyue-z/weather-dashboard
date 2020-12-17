// search button click funtion
$("#search-button").on("click", function () {
    event.preventDefault();
    var city = $("#city-input").val();
  console.log(city);








//API 
// var queryURL = "api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=287fc15ee994aa3bde52c4eebc5fa76a"
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=287fc15ee994aa3bde52c4eebc5fa76a"
// ajax
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
   console.log(response);
   var cityName = response.name;
   var date = response.dt;
   var temperature = response.main.temp;
   var humidity = response.main.humidity;
   var windSpeed = response.wind.speed;
   console.log(cityName,date,temperature,humidity,windSpeed)
   $("#dashboard").append($("<h3>").text(cityName));
   $("#dashboard").append($("<p>").text("Temperature: " + temperature));
   $("#dashboard").append($("<p>").text("Humidity:" + humidity));
   $("#dashboard").append($("<p>").text("Wind Speed:" + windSpeed));
    })
//


});