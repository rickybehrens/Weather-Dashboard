// Variables
var today = dayjs();

// Function to look up weather data
function lookUp() {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    var cityName = document.getElementById('citySearch').value;
    var currentUrl = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&appid=b678393f509aecf946ac94ef01ec609e';

    fetch(currentUrl, requestOptions)
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
            // Get the .currentStatus element
            var currentStatusElement = document.querySelector(".currentStatus");

            // Create an h1 element
            var h1Element = document.createElement("h1");

            // Format today in the desired format
            var formattedToday = today.format('dddd, MMM DD YYYY');

            // Set the content of the h1 element to the city name and formatted today
            h1Element.textContent = result.name + ' (' + formattedToday + ')';

            // Clear the .currentStatus element before adding the new content
            currentStatusElement.textContent = "";

            // Append the h1 element to the .currentStatus element
            currentStatusElement.appendChild(h1Element);

            // Create and add paragraphs for the additional information
            var infoDiv = document.createElement("div");

            // Temperature comes originally in degrees Kelvin. Turned it into a number so it could be converted to °F, then rounded to 1 decimal
            var tempHigh = parseFloat(result.main.temp_max);
            var convertedTempHigh = (tempHigh - 273.15) * 9 / 5 + 32;
            var roundedTempHigh = convertedTempHigh.toFixed(1);

            var tempLow = parseFloat(result.main.temp_min);
            var convertedTempLow = (tempLow - 273.15) * 9 / 5 + 32;
            var roundedTempLow = convertedTempLow.toFixed(1);

            var temperaturePara = document.createElement("p");
            temperaturePara.textContent = "Temperature (Hi/Lo): " + roundedTempHigh + "° F" + " / " + roundedTempLow + "° F";
            infoDiv.appendChild(temperaturePara);

            var windDirection = parseFloat(result.wind.deg);
            if (11.25 <= windDirection && windDirection < 33.75) {
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
                windDirection = ' N';
            }

            // Wind speed comes originally in m/s. Turned it into a number so it could be converted to MPH, then rounded to 1 decimal
            var windSpeed = parseFloat(result.wind.speed);
            var convertedWindSpeed = windSpeed * 2.237;
            var roundedWindSpeed = convertedWindSpeed.toFixed(1);
            var windPara = document.createElement("p");
            windPara.textContent = "Wind Speed: " + roundedWindSpeed + " MPH" + windDirection;
            infoDiv.appendChild(windPara);

            var humidity = result.main.humidity;
            var humidityPara = document.createElement("p");
            humidityPara.textContent = "Humidity: " + humidity + " %";
            infoDiv.appendChild(humidityPara);

            // Append the infoDiv to the .currentStatus element
            currentStatusElement.appendChild(infoDiv);

            // Store the city name in localStorage
            storeCity(cityName);
            handleFiveDayStatus(result.name); // Call the new function to display the five-day forecast
        })
        .catch(error => {
            console.log('error', error);
            // If the city is not found, display message
            var currentStatusElement = document.querySelector(".currentStatus");
            currentStatusElement.textContent = "We are so sorry!!! City not found";
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
function handleFiveDayStatus(cityName) {

    var tempHighArrays = [];
    var tempLowArrays = [];
    var windSpeedArrays = [];
    var humidityArrays = [];

    var requestOptionsForecast = {
        method: 'GET',
        redirect: 'follow'
    };

    var forecastUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&appid=b678393f509aecf946ac94ef01ec609e';

    fetch(forecastUrl, requestOptionsForecast)
        .then(response => {
            if (!response.ok) {
                throw new Error("Error fetching forecast data");
            }
            return response.json();
        })
        .then(result => {
            for (let i = 0; i < result.list.length; i++) {
                const element = result.list[i];

                var originalString = element.dt_txt;
                // Split the string by the '-' and ' ' characters
                var parts = originalString.split(/-|\s/);

                // Rearrange the parts to the desired format (this only took about a day to figure out...)
                var newString = `${parts[1]}/${parts[2]}/${parts[0]}`;

                // Calculate the day of the month for the current date
                var dayOfMonth = parseInt(parts[2]);
                var tomorrowDay = parseFloat(dayjs().format('DD')) + 1;
                var tomorrow = `${parts[1]}/` + tomorrowDay + `/${parts[0]}`;

                // Check if newString is equal to today's date
                if (dayOfMonth < tomorrowDay) {
                    continue; // Skip this iteration
                }

                // Store the temperature value in the corresponding chunk array
                var chunkIndex = Math.floor(i / 8); // Calculate the index of the chunk array
                if (!tempHighArrays[chunkIndex]) {
                    tempHighArrays[chunkIndex] = []; // Initialize the chunk array if it doesn't exist
                }
                tempHighArrays[chunkIndex].push(element.main.temp_max);

                // Store the temperature value in the corresponding chunk array
                var chunkIndex = Math.floor(i / 8); // Calculate the index of the chunk array
                if (!tempLowArrays[chunkIndex]) {
                    tempLowArrays[chunkIndex] = []; // Initialize the chunk array if it doesn't exist
                }
                tempLowArrays[chunkIndex].push(element.main.temp_min);

                // Store the wind speed value in the corresponding chunk array
                var chunkIndex = Math.floor(i / 8); // Calculate the index of the chunk array
                if (!windSpeedArrays[chunkIndex]) {
                    windSpeedArrays[chunkIndex] = []; // Initialize the chunk array if it doesn't exist
                }
                windSpeedArrays[chunkIndex].push(element.wind.speed);

                // Store the humidity value in the corresponding chunk array
                var chunkIndex = Math.floor(i / 8); // Calculate the index of the chunk array
                if (!humidityArrays[chunkIndex]) {
                    humidityArrays[chunkIndex] = []; // Initialize the chunk array if it doesn't exist
                }
                humidityArrays[chunkIndex].push(element.main.humidity);
            }

            // Sort each chunk in the tempHighArrays array in descending order
            tempHighArrays.forEach(chunk => {
                chunk.sort((a, b) => b - a);
            });
            // Keep only the highest value in each chunk and remove the other elements
            tempHighArrays.forEach(chunk => {
                if (chunk.length > 1) {
                    chunk.splice(1); // Remove elements after the first one (keep only the highest value)
                }
            });

            // Sort each chunk in the tempHighArrays array in descending order
            tempLowArrays.forEach(chunk => {
                chunk.sort((a, b) => a - b);
            });
            // Keep only the highest value in each chunk and remove the other elements
            tempLowArrays.forEach(chunk => {
                if (chunk.length > 1) {
                    chunk.splice(1); // Remove elements after the first one (keep only the highest value)
                }
            });

            // Sort each chunk in the windSpeedArrays array in descending order
            windSpeedArrays.forEach(chunk => {
                chunk.sort((a, b) => b - a);
            });
            // Keep only the highest value in each chunk and remove the other elements
            windSpeedArrays.forEach(chunk => {
                if (chunk.length > 1) {
                    chunk.splice(1); // Remove elements after the first one (keep only the highest value)
                }
            });

            // Sort each chunk in the humiditydArrays array in descending order
            humidityArrays.forEach(chunk => {
                chunk.sort((a, b) => b - a);
            });
            // Keep only the highest value in each chunk and remove the other elements
            humidityArrays.forEach(chunk => {
                if (chunk.length > 1) {
                    chunk.splice(1); // Remove elements after the first one (keep only the highest value)
                }
            });

            var day1 = [today.add(1, 'day').format('MM/DD/YYYY'), "Temp (Hi): " + ((tempHighArrays[0][0] - 273.15) * 9 / 5 + 32).toFixed(0) + "° F", 'Temp (Lo): ' + ((tempLowArrays[0][0] - 273.15) * 9 / 5 + 32).toFixed(0) + "° F", 'Wind: ' + (windSpeedArrays[0][0] * 2.237).toFixed(0) + " MPH", 'Humidity: ' + humidityArrays[0][0] + "%"];

            var day2 = [today.add(2, 'day').format('MM/DD/YYYY'), "Temp (Hi/Lo): " + ((tempHighArrays[1][0] - 273.15) * 9 / 5 + 32).toFixed(0) + "° F", 'Temp (Lo): ' + ((tempLowArrays[1][0] - 273.15) * 9 / 5 + 32).toFixed(0) + "° F", 'Wind: ' + (windSpeedArrays[1][0] * 2.237).toFixed(0) + " MPH", 'Humidity: ' + humidityArrays[1][0] + "%"];

            var day3 = [today.add(3, 'day').format('MM/DD/YYYY'), "Temp (Hi): " + ((tempHighArrays[2][0] - 273.15) * 9 / 5 + 32).toFixed(0) + "° F", 'Temp (Lo): ' + ((tempLowArrays[2][0] - 273.15) * 9 / 5 + 32).toFixed(0) + "° F", 'Wind: ' + (windSpeedArrays[2][0] * 2.237).toFixed(0) + " MPH", 'Humidity: ' + humidityArrays[2][0] + "%"];

            var day4 = [today.add(4, 'day').format('MM/DD/YYYY'), "Temp (Hi): " + ((tempHighArrays[3][0] - 273.15) * 9 / 5 + 32).toFixed(0) + "° F", 'Temp (Lo): ' + ((tempLowArrays[3][0] - 273.15) * 9 / 5 + 32).toFixed(0) + "° F", 'Wind: ' + (windSpeedArrays[3][0] * 2.237).toFixed(0) + " MPH", 'Humidity: ' + humidityArrays[3][0] + "%"];

            var day5 = [today.add(5, 'day').format('MM/DD/YYYY'), "Temp (Hi): " + ((tempHighArrays[4][0] - 273.15) * 9 / 5 + 32).toFixed(0) + "° F", 'Temp (Lo): ' + ((tempLowArrays[4][0] - 273.15) * 9 / 5 + 32).toFixed(0) + "° F", 'Wind: ' + (windSpeedArrays[4][0] * 2.237).toFixed(0) + " MPH", 'Humidity: ' + humidityArrays[4][0] + "%"];

            // Create 5 elements and set their content
            var days = [day1, day2, day3, day4, day5];
            var forecastContainer = document.querySelector(".forecastContainer");
            var dayElements = forecastContainer.querySelectorAll(".day1, .day2, .day3, .day4, .day5");
            dayElements.forEach((dayElement, index) => {
                dayElement.innerHTML = ""; // Clear the current content of the dayElement

                var dayData = days[index];
                dayData.forEach(data => {
                    var dataElement = document.createElement("div");
                    dataElement.textContent = data;
                    dayElement.appendChild(dataElement);

                    // Add a line break after each data item except the last one
                    if (dayData.indexOf(data) !== dayData.length - 1) {
                        dayElement.appendChild(document.createElement("br"));
                    }
                });
            });
        })
        .catch(error => {
            console.log('error', error);
            // If there's an error fetching forecast data, display an error message
            var fiveDayStatusElement = document.querySelector(".fiveDayStatusContainer");
            fiveDayStatusElement.textContent = "Error fetching forecast data";
        });
}

// Function to display the stored cities in the .history element
function displayHistory(cities) {
    var historyElement = document.querySelector(".history");
    historyElement.textContent = ""; // Clear the current content of .history

    // Slice the cities array to get only the last 8 cities
    var last8Cities = cities.slice(-8);

    // Create and append a new button element for each city in the last8Cities array
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

// Wait for the DOM content to be loaded before running the JavaScript
document.addEventListener("DOMContentLoaded", function () {

    // Define DOM elements
    var citySearchInput = document.getElementById('citySearch');
    var currentStatusElement = document.querySelector(".currentStatus");
    var historyElement = document.querySelector(".history");
    var fiveDayStatusElement = document.querySelector(".fiveDayStatusContainer");

    document.querySelector('.btn').addEventListener('click', lookUp);

    document.getElementById('citySearch').addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            lookUp();
        }
    });

    var storedCities = JSON.parse(localStorage.getItem("cities")) || [];
    displayHistory(storedCities);
});

