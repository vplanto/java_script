// Get references to the DOM elements
const getWeatherBtn = document.getElementById("getWeatherBtn");
const weatherDisplay = document.getElementById("weatherDisplay");

// Event listener for the button click
getWeatherBtn.addEventListener("click", () => {
  const city = document.getElementById("city").value.trim();
  if (city) {
    getWeather(city);
  } else {
    alert("Please enter a city name");
  }
});

// Asynchronous function to fetch weather data from OpenWeatherMap
async function getWeather(city) {
  // Replace YOUR_API_KEY with your actual API key from OpenWeatherMap.
  // The &units=metric parameter ensures temperatures are in Celsius.
  const apiKey = "YOUR_API_KEY";
  const endpoint = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      // If the response is not ok, throw an error to be caught in the catch block.
      throw new Error("City not found or an error occurred");
    }
    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    weatherDisplay.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
  }
}

// Function to update the DOM with the weather data
function displayWeather(data) {
  const { name, sys, main, weather } = data;
  const weatherHTML = `
    <h2>Weather in ${name}, ${sys.country}</h2>
    <p><strong>Temperature:</strong> ${main.temp}°C</p>
    <p><strong>Humidity:</strong> ${main.humidity}%</p>
    <p><strong>Condition:</strong> ${weather[0].description}</p>
  `;
  weatherDisplay.innerHTML = weatherHTML;
}