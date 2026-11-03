
// Get HTML elements
const searchForm = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");
const message = document.getElementById("message");
const weatherResult = document.getElementById("weather-result");

const cityName = document.getElementById("city-name");
const temperature = document.getElementById("temperature");
const weatherDescription = document.getElementById("weather-description");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("wind-speed");

const searchButton = document.getElementById("search-btn");

// Convert weather codes into descriptions
function getWeatherDescription(code) {
    const weatherCodes = {
        0: "Clear Sky ☀️",
        1: "Mainly Clear 🌤️",
        2: "Partly Cloudy ⛅",
        3: "Overcast ☁️",
        45: "Foggy 🌫️",
        48: "Rime Fog 🌫️",
        51: "Light Drizzle 🌦️",
        53: "Moderate Drizzle 🌦️",
        55: "Dense Drizzle 🌧️",
        61: "Light Rain 🌧️",
        63: "Moderate Rain 🌧️",
        65: "Heavy Rain 🌧️",
        71: "Light Snow ❄️",
        73: "Moderate Snow ❄️",
        75: "Heavy Snow ❄️",
        80: "Rain Showers 🌧️",
        81: "Moderate Rain Showers 🌧️",
        82: "Heavy Rain Showers ⛈️",
        95: "Thunderstorm ⛈️",
        96: "Thunderstorm with Hail ⛈️",
        99: "Heavy Thunderstorm ⛈️"
    };

    return weatherCodes[code] || "Weather information unavailable";
}

// Fetch weather data for a city
async function getWeather(city) {
    try {
        message.textContent = "Loading weather data...";
        weatherResult.hidden = true;
        searchButton.disabled = true;

        // Step 1: Find city coordinates
        const geoUrl =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const geoResponse = await fetch(geoUrl);

        if (!geoResponse.ok) {
            throw new Error("Unable to connect to the location service.");
        }

        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found. Please enter a valid city name.");
        }

        const location = geoData.results[0];

        // Step 2: Get current weather using coordinates
        const weatherUrl =
            `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`;

        const weatherResponse = await fetch(weatherUrl);

        if (!weatherResponse.ok) {
            throw new Error("Unable to fetch weather data. Please try again.");
        }

        const weatherData = await weatherResponse.json();

        if (!weatherData.current) {
            throw new Error("Weather information is unavailable.");
        }

        // Step 3: Display weather details
        const current = weatherData.current;

        cityName.textContent = `${location.name}, ${location.country}`;
        temperature.textContent = Math.round(current.temperature_2m);
        humidity.textContent = `${current.relative_humidity_2m}%`;
        windSpeed.textContent = `${current.wind_speed_10m} km/h`;
        weatherDescription.textContent =
            getWeatherDescription(current.weather_code);

        weatherResult.hidden = false;
        message.textContent = "";

    } catch (error) {
        message.textContent = error.message;
        weatherResult.hidden = true;

    } finally {
        searchButton.disabled = false;
    }
}

// Handle city search
searchForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const city = cityInput.value.trim();

    if (city === "") {
        message.textContent = "Please enter a city name.";
        return;
    }

    getWeather(city);
});
