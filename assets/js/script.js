// Variables
var today = dayjs();

// Wait for the DOM content to be loaded before running the JavaScript
document.addEventListener("DOMContentLoaded", function () {

    // Define Functions
    function lookUp() {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };

        var cityName = document.getElementById('citySearch').value;
        var newUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&appid=b678393f509aecf946ac94ef01ec609e';

        fetch(newUrl, requestOptions)
            .then(response => {
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error("City not found");
                    } else {
                        throw new Error("Error fetching data");
                    }
                }
                return response.json();
            })
            .then(result => {
                console.log(result);
                // Get the .currentStatus element
                var currentStatusElement = document.querySelector(".currentStatus");

                // Create an h1 element
                var h1Element = document.createElement("h1");

                // Format today in the desired format
                var formattedToday = today.format('dddd, MMM DD YYYY');

                // Set the content of the h1 element to the city name and formatted today
                h1Element.textContent = result.city.name + ' (' + formattedToday + ')';

                // Clear the .currentStatus element before adding the new content
                currentStatusElement.textContent = "";

                // Append the h1 element to the .currentStatus element
                currentStatusElement.appendChild(h1Element);

                // Create and add paragraphs for the additional information
                var infoDiv = document.createElement("div");

                // Temperature comes originally in degrees Kelvin. Turned it into a number so it could be converted to °F, then rounded to 1 decimal
                var tempHigh = parseFloat(result.list[0].main.temp_max);
                var convertedTempHigh = (tempHigh - 273.15) * 9 / 5 + 32;
                var roundedTempHigh = convertedTempHigh.toFixed(1);

                var tempLow = parseFloat(result.list[0].main.temp_min);
                var convertedTempLow = (tempLow - 273.15) * 9 / 5 + 32;
                var roundedTempLow = convertedTempLow.toFixed(1);

                var temperaturePara = document.createElement("p");
                temperaturePara.textContent = "Temperature (Hi/Lo): " + roundedTempHigh + "° F" + " / " + roundedTempLow + "° F";
                infoDiv.appendChild(temperaturePara);

                var windDirection = parseFloat(result.list[0].wind.deg)
                if (11.25 <= windDirection && windDirection < 33.75){
                    windDirection = ' NNE';
                } else if (33.75 <= windDirection && windDirection < 56.25) {
                    windDirection = ' NE';
                } else if (56.25 <= windDirection && windDirection < 78.75) {
                    windDirection = ' ENE';
                } else if (78.75 <= windDirection && windDirection < 101.25) {
                    windDirection = ' E';
                } else if (101.25 <= windDirection && windDirection < 123.75) {
                    windDirection = ' ESE';
                } else if (123.75 <= windDirection && windDirection < 146.25) {
                    windDirection = ' SE';
                } else if (146.25 <= windDirection && windDirection < 168.75) {
                    windDirection = ' SSE';
                } else if (168.75 <= windDirection && windDirection < 191.25) {
                    windDirection = ' S';
                } else if (191.25 <= windDirection && windDirection < 213.75) {
                    windDirection = ' SSW';
                } else if (213.75 <= windDirection && windDirection < 236.25) {
                    windDirection = ' SW';
                } else if (236.25 <= windDirection && windDirection < 258.75) {
                    windDirection = ' WSW';
                } else if (258.75 <= windDirection && windDirection < 281.25) {
                    windDirection = ' W';
                } else if (281.25 <= windDirection && windDirection < 303.75) {
                    windDirection = ' WNW';
                } else if (303.75 <= windDirection && windDirection < 326.25) {
                    windDirection = ' NW';
                } else if (326.25 <= windDirection && windDirection < 348.75) {
                    windDirection = ' NNW';
                } else {
                    windDirection = ' N'
                }
                
                // Wind speed comes originally in m/s. Turned it into a number so it could be converted to MPH, then rounded to 1 decimal
                var windSpeed = parseFloat(result.list[0].wind.speed);
                var convertedWindSpeed = windSpeed * 2.237
                var roundedWindSpeed = convertedWindSpeed.toFixed(1)
                var windPara = document.createElement("p");
                windPara.textContent = "Wind Speed: " + roundedWindSpeed + " MPH" + windDirection;
                infoDiv.appendChild(windPara);

                var humidity = result.list[0].main.humidity;
                var humidityPara = document.createElement("p");
                humidityPara.textContent = "Humidity: " + humidity + " %";
                infoDiv.appendChild(humidityPara);

                // Append the infoDiv to the .currentStatus element
                currentStatusElement.appendChild(infoDiv);

                // Store the city name in localStorage
                storeCity(cityName);
                handleFiveDayStatus(result); // Call the new function to display the five-day forecast
            })
            .catch(error => {
                console.log('error', error);
                // If the city is not found, display message
                var currentStatusElement = document.querySelector(".currentStatus");
                currentStatusElement.textContent = "<h1>We are so sorry!!! City not found</h1>";
            });
    }

    // Function to store city name in localStorage
    function storeCity(cityName) {
        // Check if the city is not found before storing it locally
        if (cityName === "") {
            return;
        }

        // Get the existing cities from localStorage or initialize an empty array
        var cities = JSON.parse(localStorage.getItem("cities")) || [];

        // Check if the cityName already exists in the cities array
        var index = cities.indexOf(cityName);
        if (index !== -1) {
            // If cityName exists, remove the older entry
            cities.splice(index, 1);
        }

        // Add the new city to the cities array
        cities.push(cityName);

        // Ensure that the cities array only stores the last 8 cities
        if (cities.length > 8) {
            cities.shift(); // Remove the oldest city from the beginning of the array
        }

        // Store the updated cities array in localStorage
        localStorage.setItem("cities", JSON.stringify(cities));

        // Display the stored cities in the .history element
        displayHistory(cities);
    }

    // Function to display the five-day forecast
    function handleFiveDayStatus(result) {
        var fiveDayStatusElement = document.querySelector(".fiveDayStatus");
        fiveDayStatusElement.textContent = ""; // Clear the current content of .fiveDayStatus

        var h3Element = document.createElement("h3");
        h3Element.textContent = "Five-day Forecast";
        fiveDayStatusElement.appendChild(h3Element);

        for (let i = 1; i <= 5; i++) {
            var dayDiv = document.createElement("div");
            dayDiv.className = "box";

            var tempMax = parseFloat(result.list[i].main.temp_max);
            var convertedTempMax = (tempMax - 273.15) * 9 / 5 + 32;
            var roundedTempMax = convertedTempMax.toFixed(1);

            var tempMin = parseFloat(result.list[i].main.temp_min);
            var convertedTempMin = (tempMin - 273.15) * 9 / 5 + 32;
            var roundedTempMin = convertedTempMin.toFixed(1);

            var windSpeed = parseFloat(result.list[i].wind.speed);
            var convertedWindSpeed = windSpeed * 2.237;
            var roundedWindSpeed = convertedWindSpeed.toFixed(1);

            var windDirection = parseFloat(result.list[i].wind.deg);
            var windDirectionText = getWindDirectionText(windDirection);

            var humidity = result.list[i].main.humidity;

            var tempPara = document.createElement("p");
            tempPara.textContent = "Temperature (Hi/Lo): " + roundedTempMax + "° F" + " / " + roundedTempMin + "° F";

            var windPara = document.createElement("p");
            windPara.textContent = "Wind Speed: " + roundedWindSpeed + " MPH" + windDirectionText;

            var humidityPara = document.createElement("p");
            humidityPara.textContent = "Humidity: " + humidity + " %";

            dayDiv.appendChild(tempPara);
            dayDiv.appendChild(windPara);
            dayDiv.appendChild(humidityPara);

            fiveDayStatusElement.appendChild(dayDiv);
        }
    }

    // Function to get the wind direction in text based on the wind degree
    function getWindDirectionText(degrees) {
        // ... (your existing wind direction code, omitted for brevity)
    }

    // Function to display the stored cities in the .history element
    function displayHistory(cities) {
        var historyElement = document.querySelector(".history");
        historyElement.textContent = ""; // Clear the current content of .history

        // Slice the cities array to get only the last 8 cities
        var last8Cities = cities.slice(-8);

        // Create and append a new h3 element for each city in the last8Cities array
        last8Cities.reverse().forEach((city) => { // Reverse the array to show latest search on top
            var buttonElement = document.createElement("button");
            buttonElement.textContent = city;
            historyElement.appendChild(buttonElement);

            // Add a click event listener to the button
            buttonElement.addEventListener("click", function () {
                // Set the value of the citySearch input to the city name
                document.getElementById("citySearch").value = city;
                // Trigger the lookup function to search for the city
                lookUp();
            });
        });
    }

    // Special Functions (like eventListeners)

    // Business Logic (start the application)
    document.querySelector('.btn').addEventListener('click', lookUp);

    // Handle the Enter key press on the input field to trigger the search
    document.getElementById('citySearch').addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            lookUp();
        }
    });

    // Load the stored cities and display them in the .history element on page load
    var storedCities = JSON.parse(localStorage.getItem("cities")) || [];
    displayHistory(storedCities);
});

// // Business Logic (start the application)


// PSEUDO CODE

// Website has an "input" field to search for the city where we would like to know the weather
// Once the city's name is entered in the "input field" and the search button is clicked, the name of the city will be displayed with today's date and a symbol of wether it's sunny, cloudy, windy, rainny or snowy
// The name of the city is located by coordinates (lattitude and longitude).
// Open Weather Map offered a list of cities to download. I would imagine to enter all these cities in a "auto-fill" field
// Below, in smaller font, you will get the current temperature (in F)
// Below, you get the current wind (in MPH)
// Below, you get the current Humidity (in %)
// Below this box, you find the "5-Day Forecast:" with the dates on top and the same parameters as the box above (I would like to display the "high" and "low" temperatures for the day)
// Below the "Search" fiel, you will find the last 10 cities the user searched for. If these buttons are clicked, the weather forecast will change back to any of these cities.
