var my_city = document.querySelector("#search-form");
var searchMyCity = document.querySelector("#find-city");
var mycity_Input = document.querySelector("#mycity");
var weatherContainer = document.querySelector("#current-weather-container");
var forecastTitle = document.querySelector("#forecast");
var forecastContainer = document.querySelector("#fiveday-container");
var pastSearchBtn = document.querySelector("#past-search-buttons");

var cities = []; Storage

var myHandler = function (e) {
    e.preventDefault();
    var my_city = mycity_Input.value.trim();
    if (my_city) {
        myWeather(my_city);
        my5Day(my_city);
        cities.unshift({my_city });
        mycity_Input.value = "";
    } else {
        alert("Enter a correct city name");
    }
    mySearch();
    pastSearch(my_city);
}

var mySearch = function () {
    localStorage.setItem("cities", JSON.stringify(cities));
};

var myWeather = function (my_city) {
    var apiKey = "4abf5c65bc83402b40a459af902473c9"
    var apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${my_city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
        .then(function (response) {
            response.json().then(function (data) {
                showWeather(data, my_city);
            });
        });
};

var showWeather = function (weather, searchCity) {

    weatherContainer.textContent = "";
    searchMyCity.textContent = searchCity;


    var currentDate = document.createElement("span")
    currentDate.textContent = " (" + moment(weather.dt.value).format("MMM D, YYYY") + ") ";
    searchMyCity.appendChild(currentDate);


    var weatherIcon = document.createElement("img")
    weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
    searchMyCity.appendChild(weatherIcon);


    var temperature = document.createElement("span");
    temperature.textContent = "Temperature: " + weather.main.temp + " °F";
    temperature.classList = "list-group-item"


    var humidityEl = document.createElement("span");
    humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
    humidityEl.classList = "list-group-item"


    var windSpeedEl = document.createElement("span");
    windSpeedEl.textContent = "Wind Speed: " + weather.wind.speed + " MPH";
    windSpeedEl.classList = "list-group-item"

    weatherContainer.appendChild(temperature);

    weatherContainer.appendChild(humidityEl);

    weatherContainer.appendChild(windSpeedEl);

    var lat = weather.coord.lat;
    var lon = weather.coord.lon;
    myIndex(lat, lon)
}

var myIndex = function (lat, lon) {
    var apiKey = "4abf5c65bc83402b40a459af902473c9"
    var apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`
    fetch(apiURL)
        .then(function (response) {
            response.json().then(function (data) {
                displaymyIndex(data)

            });
        });
}

var displaymyIndex = function (index) {
    var uvIndexEl = document.createElement("div");
    uvIndexEl.textContent = "UV Index: "
    uvIndexEl.classList = "list-group-item"

    uvIndexValue = document.createElement("span")
    uvIndexValue.textContent = index.value

    if (index.value <= 2) {
        uvIndexValue.classList = "favorable"
    } else if (index.value > 2 && index.value <= 8) {
        uvIndexValue.classList = "moderate "
    }
    else if (index.value > 8) {
        uvIndexValue.classList = "severe"
    };

    uvIndexEl.appendChild(uvIndexValue);

    weatherContainer.appendChild(uvIndexEl);
}

var my5Day = function (my_city) {
    var apiKey = "4abf5c65bc83402b40a459af902473c9"
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${my_city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
        .then(function (response) {
            response.json().then(function (data) {
                showDay5(data);
            });
        });
};

var showDay5 = function (weather) {
    forecastContainer.textContent = ""
    forecastTitle.textContent = "Upcoming Weather";

    var forecast = weather.list;
    for (var i = 5; i < forecast.length; i = i + 8) {
        var dailyForecast = forecast[i];

        var forecastEl = document.createElement("div");
        forecastEl.classList = "card bg-secondary text-light m-2";

        var forecastDate = document.createElement("h6")
        forecastDate.textContent = moment.unix(dailyForecast.dt).format("MMM D, YYYY");
        forecastDate.classList = "card-header text-center"
        forecastEl.appendChild(forecastDate);

        var weatherIcon = document.createElement("img")
        weatherIcon.classList = "card-body text-center";
        weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);

        forecastEl.appendChild(weatherIcon);

        var forecastTempEl = document.createElement("span");
        forecastTempEl.classList = "card-body text-center";
        forecastTempEl.textContent = dailyForecast.main.temp + " °F";

        forecastEl.appendChild(forecastTempEl);

        var forecastHumEl = document.createElement("span");
        forecastHumEl.classList = "card-body text-center";
        forecastHumEl.textContent = dailyForecast.main.humidity + "  %";

        forecastEl.appendChild(forecastHumEl);

        forecastContainer.appendChild(forecastEl);
    }
}

var pastSearch = function (pastSearch) {

    pastSearchEl = document.createElement("button");
    pastSearchEl.textContent = pastSearch;
    pastSearchEl.classList = "d-flex w-100 btn-light border p-2";
    pastSearchEl.setAttribute("data-city", pastSearch)
    pastSearchEl.setAttribute("type", "submit");

    pastSearchBtn.prepend(pastSearchEl);
}

var pastSearchHandler = function (event) {
    var my_city = event.target.getAttribute("data-city")
    if (my_city) {
        myWeather(my_city);
        get5Day(my_city);
    }
}
my_city.addEventListener("submit", myHandler);
pastSearchBtn.addEventListener("click", pastSearchHandler);