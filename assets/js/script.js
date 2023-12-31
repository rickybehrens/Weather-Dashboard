// Variables
var today = dayjs();

// Function to look up weather data

// Function to be executed when the page loads
window.onload = function () {
    // Get the message container element
    var messageContainer = document.querySelector(".message-container");

    // Calculate the width of the message container
    var messageContainerWidth = messageContainer.offsetWidth;

    // Set the negative value of translateX for keyframes animation
    var translateXValue = `calc(-${messageContainerWidth}px - 100px)`;

    // Update the animation with the calculated translateX value
    var styleSheet = document.styleSheets[0];
    var keyframesRule = styleSheet.cssRules[styleSheet.cssRules.length - 1];
    keyframesRule.deleteRule("100%");
    keyframesRule.appendRule(`100% { transform: translateX(${translateXValue}); }`);
};

function lookUp() {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };


    // Add an event listener to the search button to handle the city search
    var searchButton = document.querySelector(".btn");
    searchButton.addEventListener("click", function () {
        var cityInputField = document.getElementById("citySearch");
        var cityName = cityInputField.value.trim(); // Trim any leading/trailing spaces from the input
        var formattedCityName = capitalizeCity(cityName); // Format the city name
        var cityName = cityInputField.value.trim(); // Trim any leading/trailing spaces from the input
        var formattedCityName = capitalizeCity(cityName); // Format the city name
        lookUp();
    });

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

            if (result.weather[0].main === 'Clear') {
                currentStatusElement.style = "color: white";
                currentStatusElement.style.backgroundImage = "url('./assets/images/Sunny.jpeg')";
            } else if (result.weather[0].main === 'Clouds') {
                currentStatusElement.style = "color: white";
                currentStatusElement.style.backgroundImage = "url('./assets/images/Cloudy.jpeg')";
            } else if (result.weather[0].main === 'Rain') {
                currentStatusElement.style = "color: white";
                currentStatusElement.style.backgroundImage = "url('./assets/images/Rainy.jpeg')";
            } else if (result.weather[0].main === 'Snow') {
                currentStatusElement.style = "color: white";
                currentStatusElement.style.backgroundImage = "url('./assets/images/Snowy.jpeg')";
            } else if (result.weather[0].main === 'Wind') {
                currentStatusElement.style.backgroundImage = "url('./assets/images/Windy.jpeg')";
            } else currentStatusElement.style.backgroundImage = "url('./assets/images/Smoky.jpeg')";


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

// Define the function to capitalize the city name
function capitalizeCity(city) {
    var words = city.split(" ");
    var capitalizedWords = words.map(function (word) {
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    });
    return capitalizedWords.join(" ");
}

// Function to store city name in localStorage
function storeCity(cityName) {
    // Check if the city is not found before storing it locally
    if (cityName === "") {
        return;
    }

    // Capitalize the cityName
    var formattedCityName = capitalizeCity(cityName);

    // Get the existing cities from localStorage or initialize an empty array
    var cities = JSON.parse(localStorage.getItem("cities")) || [];

    // Check if the formattedCityName already exists in the cities array
    var index = cities.indexOf(formattedCityName);
    if (index !== -1) {
        // If formattedCityName exists, remove the older entry
        cities.splice(index, 1);
    }

    // Add the new city to the cities array
    cities.push(formattedCityName);

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
    var emojiArray = [];

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
            var emoji = [];

            for (let i = 0; i < result.list.length; i++) {
                var element = result.list[i];

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

                var hourString = element.dt_txt;
                var hour = hourString.charAt(11) + hourString.charAt(12)
                if (hour === '15') {
                    var weather = element.weather[0].main;
                    var emoji;

                    switch (weather) {
                        case 'Clouds':
                            emoji = '🌥';
                            break;
                        case 'Rain':
                            emoji = '🌧';
                            break;
                        case 'Clear':
                            emoji = '😎';
                            break;
                        case 'Snow':
                            emoji = '⛄️';
                            break;
                        case 'Fog':
                            emoji = '😶‍🌫️';
                            break;
                        case 'Wind':
                            emoji = '💨';
                            break;
                        case 'Smoke':
                            emoji = '🔥💨';
                            break;
                        default:
                            emoji = undefined; // Default value if none of the cases match
                    }

                    // Store the emoji in the emojiArray for the corresponding day
                    var dayIndex = Math.floor(i / 8);
                    if (!emojiArray[dayIndex]) {
                        emojiArray[dayIndex] = []; // Initialize the array for the day if it doesn't exist
                    }
                    emojiArray[dayIndex].push(emoji);
                }

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

            // Create the day arrays and set their content with emojis
            var days = [];
            for (let i = 0; i < 5; i++) {
                var day = today.add(i + 1, 'day').format('MM/DD/YYYY');
                var emojis = emojiArray[i] || []; // Get the emojis for the day or an empty array if not available
                var tempHigh = (tempHighArrays[i]?.[0] - 273.15) * 9 / 5 + 32;
                var tempLow = (tempLowArrays[i]?.[0] - 273.15) * 9 / 5 + 32;
                var windSpeed = windSpeedArrays[i]?.[0] * 2.237;
                var humidity = humidityArrays[i]?.[0];

                // Create the dayX array for each day
                var dayX = [day, ...emojis, "Temp (Hi): " + tempHigh.toFixed(0) + "° F", "Temp (Lo): " + tempLow.toFixed(0) + "° F", "Wind: " + windSpeed.toFixed(0) + " MPH", "Humidity: " + humidity + "%"];
                days.push(dayX);
            }

            var forecastContainer = document.querySelector(".boxes");
            forecastContainer.innerHTML = ""; // Clear the current content of the "boxes" element

            var dayElements = ["day1", "day2", "day3", "day4", "day5"];
            dayElements.forEach((dayElementClass, index) => {
                var dayElement = document.createElement("div");
                dayElement.className = dayElementClass;
                dayElement.style.backgroundColor = "#4a4a4a"; // Set the background color
                dayElement.style.color = "white"; // Set the text color

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

                forecastContainer.appendChild(dayElement);
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

    document.querySelector('.btn').addEventListener('click', lookUp);

    document.getElementById('citySearch').addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            lookUp();
        }
    });

    var storedCities = JSON.parse(localStorage.getItem("cities")) || [];
    displayHistory(storedCities);
});

