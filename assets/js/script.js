//Variables
var today = dayjs()

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
                var formattedToday = dayjs().format('dddd, MMM DD YYYY');

                // Set the content of the h1 element to the city name and formatted today
                h1Element.textContent = result.city.name + ' (' + formattedToday + ')';

                // Clear the .currentStatus element before adding the new content
                currentStatusElement.innerHTML = "";

                // Append the h1 element to the .currentStatus element
                currentStatusElement.appendChild(h1Element);

                // Store the city name in localStorage
                storeCity(cityName);
            })
            .catch(error => {
                console.log('error', error);
                // If the city is not found, display message
                var currentStatusElement = document.querySelector(".currentStatus");
                currentStatusElement.innerHTML = "<h1>We are so sorry!!! City not found</h1>";
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

    // Function to display the stored cities in the .history element
    function displayHistory(cities) {
        var historyElement = document.querySelector(".history");
        historyElement.innerHTML = ""; // Clear the current content of .history

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

    // // Business Logic (start the application)
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
