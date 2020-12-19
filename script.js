// search button click funtion
var newCity =[];
$("#search-button").on("click", function () {
    event.preventDefault();
    $("#dashboard").empty()
    var city = $("#city-input").val();
  console.log(city);
  localStorage.setItem("city",city);
  newCity.push(localStorage.getItem("city"));
  function appendCities() {
    $("#history").empty();
    for (i=0;i<newCity.length;i++){
      var cityBtn = $("<button>");
      cityBtn.addClass("searchedCity");
      cityBtn.attr("cityName", newCity[i]);
      cityBtn.text(newCity[i]);
      $("#history").append(cityBtn);
    }
  }
  getWeatherInfo();

  appendCities();
  $(".searchedCity").on("click", function() {
    city = $(this).attr("cityName");
    $("#dashboard").empty();
    getWeatherInfo();
  })




//API 
// 
function getWeatherInfo(){
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q="+city +"&APPID=287fc15ee994aa3bde52c4eebc5fa76a";
// ajax
    $.ajax({
      url: queryURL,
      method: "GET"
    }).then(function(response) {
   console.log(response);
   var cityName = response.name;
   var date = dayjs.unix(response.dt).format('M/D/YYYY');
   var temperature = response.main.temp;
   var humidity = response.main.humidity;
   var windSpeed = response.wind.speed;
   var weatherIconURL = "http://openweathermap.org/img/wn/" + response.weather[0].icon+".png";

   console.log(cityName,date,temperature,humidity,windSpeed)
   $("#dashboard").append($("<h3>").text(cityName + " (" + date + ")"));
   $("#dashboard").append($("<img>").addClass("icon").attr("src",weatherIconURL));
   $("#dashboard").append($("<p>").text("Temperature: " + temperature));
   $("#dashboard").append($("<p>").text("Humidity: " + humidity));
   $("#dashboard").append($("<p>").text("Wind Speed: " + windSpeed));
   var lat = response.coord.lat;
   console.log(lat);
   var lon = response.coord.lon;
   console.log(lon);
   var queryURLUV = "http://api.openweathermap.org/data/2.5/uvi/forecast?lat=" + lat +"&lon=" +lon +"&cnt=1&appid=287fc15ee994aa3bde52c4eebc5fa76a";
   $.ajax({
    url: queryURLUV,
    method: "GET"
  }).then(function(response){
   var uvIndex = response[0].value;
   console.log(uvIndex);
   var uvIndexP = $("<p>");
   uvIndexP.append($("<span>").text("UV Index: "));
   uvIndexP.append($("<span>").addClass("uvIndex").text(uvIndex));
   $("#dashboard").append($(uvIndexP));
   if(uvIndex <2) {
     $(".uvIndex").css("background-color","green");
   } else if(uvIndex > 3 && uvIndex < 7 ) {
    $(".uvIndex").css("background-color","yellow");
   } else {
    $("#.uvIndex").css("background-color","red");
   }
  });





});

}

});