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

//Variables
var today = dayjs()

// Define Functions
function lookUp() {
    var requestOptions = {
        method: 'GET',
        redirect: 'follow'
    };

    var cityName = document.getElementById('citySearch').value;
    var newUrl = 'https://api.openweathermap.org/data/2.5/forecast?q=' + cityName + '&appid=b678393f509aecf946ac94ef01ec609e';

    fetch(newUrl, requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result);
            console.log("City Name:", result.city.name);
            // Get the .currentStatus element
            var currentStatusElement = document.querySelector(".currentStatus");

            // Create an h1 element
            var h1Element = document.createElement("h1");

            // Format today in the desired format
            var formattedToday = dayjs().format('dddd, MMM DD YYYY');

            // Set the content of the h1 element to the city name and formatted today
            h1Element.textContent = result.city.name + ' (' + formattedToday + ')';


            // Append the h1 element to the .currentStatus element
            currentStatusElement.appendChild(h1Element);
        })
        .catch(error => console.log('error', error));


}

// Special Functions (like eventListeners)

// // Business Logic (start the application)
document.querySelector('.btn').addEventListener('click', lookUp)